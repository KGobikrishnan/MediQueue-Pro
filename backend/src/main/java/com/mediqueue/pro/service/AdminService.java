package com.mediqueue.pro.service;

import com.mediqueue.pro.dto.AdminDtos.*;
import com.mediqueue.pro.entity.*;
import com.mediqueue.pro.enums.DoctorStatus;
import com.mediqueue.pro.enums.Role;
import com.mediqueue.pro.enums.TokenStatus;
import com.mediqueue.pro.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final PatientRepository patientRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository, DoctorRepository doctorRepository, DepartmentRepository departmentRepository, PatientRepository patientRepository, TokenRepository tokenRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.patientRepository = patientRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AnalyticsSummaryDto getAnalyticsSummary() {
        LocalDate today = LocalDate.now();
        List<Token> todayTokens = tokenRepository.findByQueueDate(today);

        long totalPatients = todayTokens.size();
        long waitingCount = todayTokens.stream().filter(t -> t.getStatus() == TokenStatus.WAITING || t.getStatus() == TokenStatus.CALLED).count();
        long completedCount = todayTokens.stream().filter(t -> t.getStatus() == TokenStatus.COMPLETED).count();
        long activeDoctors = doctorRepository.count();

        List<Department> departments = departmentRepository.findByIsActiveTrue();
        List<DepartmentLoadDto> deptLoads = departments.stream().map(d -> {
            long count = todayTokens.stream().filter(t -> t.getDepartment().getId().equals(d.getId())).count();
            return DepartmentLoadDto.builder()
                    .departmentName(d.getName())
                    .tokenCount(count)
                    .color(d.getColor())
                    .build();
        }).collect(Collectors.toList());

        List<HourlyFootfallDto> hourly = List.of(
                new HourlyFootfallDto("08:00 AM", 4),
                new HourlyFootfallDto("09:00 AM", 12),
                new HourlyFootfallDto("10:00 AM", 19),
                new HourlyFootfallDto("11:00 AM", 15),
                new HourlyFootfallDto("12:00 PM", 9),
                new HourlyFootfallDto("01:00 PM", 6),
                new HourlyFootfallDto("02:00 PM", 14),
                new HourlyFootfallDto("03:00 PM", 18),
                new HourlyFootfallDto("04:00 PM", 8)
        );

        return AnalyticsSummaryDto.builder()
                .totalPatientsToday(totalPatients)
                .totalWaiting(waitingCount)
                .totalCompleted(completedCount)
                .activeDoctors(activeDoctors)
                .avgWaitTimeMins(14.2)
                .avgConsultTimeMins(11.8)
                .departmentLoads(deptLoads)
                .hourlyFootfall(hourly)
                .build();
    }

    public List<DoctorManagementResponse> getAllDoctors() {
        return doctorRepository.findAll().stream().map(doc -> DoctorManagementResponse.builder()
                .id(doc.getId())
                .userId(doc.getUser().getId())
                .name(doc.getUser().getName())
                .email(doc.getUser().getEmail())
                .phone(doc.getUser().getPhone())
                .title(doc.getUser().getTitle())
                .departmentId(doc.getDepartment().getId())
                .departmentName(doc.getDepartment().getName())
                .qualification(doc.getQualification())
                .experienceYears(doc.getExperienceYears())
                .roomNo(doc.getRoomNo())
                .consultationFee(doc.getConsultationFee())
                .status(doc.getStatus().name())
                .avatar(doc.getUser().getAvatar())
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public DoctorManagementResponse createDoctor(DoctorManagementRequest req) {
        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found: " + req.getDepartmentId()));

        String userId = "usr-doc-" + UUID.randomUUID().toString().substring(0, 8);
        String encPassword = passwordEncoder.encode(req.getPassword() != null ? req.getPassword() : "password123");

        User user = User.builder()
                .id(userId)
                .name(req.getName())
                .email(req.getEmail())
                .password(encPassword)
                .role(Role.DOCTOR)
                .phone(req.getPhone())
                .title(req.getTitle() != null ? req.getTitle() : "Consultant " + dept.getName())
                .pin("1234")
                .avatar(req.getAvatar() != null ? req.getAvatar() : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200")
                .build();
        user = userRepository.save(user);

        Doctor doc = Doctor.builder()
                .id("doc-" + UUID.randomUUID().toString().substring(0, 8))
                .user(user)
                .department(dept)
                .qualification(req.getQualification() != null ? req.getQualification() : "MBBS, MD")
                .experienceYears(req.getExperienceYears() != null ? req.getExperienceYears() : 5)
                .roomNo(req.getRoomNo() != null ? req.getRoomNo() : "Room 101")
                .consultationFee(req.getConsultationFee() != null ? req.getConsultationFee() : BigDecimal.valueOf(500.00))
                .status(DoctorStatus.AVAILABLE)
                .build();
        doc = doctorRepository.save(doc);

        return DoctorManagementResponse.builder()
                .id(doc.getId())
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .title(user.getTitle())
                .departmentId(dept.getId())
                .departmentName(dept.getName())
                .qualification(doc.getQualification())
                .experienceYears(doc.getExperienceYears())
                .roomNo(doc.getRoomNo())
                .consultationFee(doc.getConsultationFee())
                .status(doc.getStatus().name())
                .avatar(user.getAvatar())
                .build();
    }

    @Transactional
    public DoctorManagementResponse updateDoctor(String doctorId, DoctorManagementRequest req) {
        Doctor doc = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + doctorId));

        if (req.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(req.getDepartmentId()).orElse(doc.getDepartment());
            doc.setDepartment(dept);
        }
        if (req.getQualification() != null) doc.setQualification(req.getQualification());
        if (req.getExperienceYears() != null) doc.setExperienceYears(req.getExperienceYears());
        if (req.getRoomNo() != null) doc.setRoomNo(req.getRoomNo());
        if (req.getConsultationFee() != null) doc.setConsultationFee(req.getConsultationFee());

        User user = doc.getUser();
        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getTitle() != null) user.setTitle(req.getTitle());
        if (req.getAvatar() != null) user.setAvatar(req.getAvatar());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        userRepository.save(user);
        doc = doctorRepository.save(doc);

        return DoctorManagementResponse.builder()
                .id(doc.getId())
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .title(user.getTitle())
                .departmentId(doc.getDepartment().getId())
                .departmentName(doc.getDepartment().getName())
                .qualification(doc.getQualification())
                .experienceYears(doc.getExperienceYears())
                .roomNo(doc.getRoomNo())
                .consultationFee(doc.getConsultationFee())
                .status(doc.getStatus().name())
                .avatar(user.getAvatar())
                .build();
    }

    @Transactional
    public void deleteDoctor(String doctorId) {
        Doctor doc = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + doctorId));
        User user = doc.getUser();
        doctorRepository.delete(doc);
        if (user != null) {
            userRepository.delete(user);
        }
    }
}
