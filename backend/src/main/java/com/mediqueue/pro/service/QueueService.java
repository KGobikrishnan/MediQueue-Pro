package com.mediqueue.pro.service;

import com.mediqueue.pro.dto.QueueDtos.*;
import com.mediqueue.pro.entity.*;
import com.mediqueue.pro.enums.TokenStatus;
import com.mediqueue.pro.enums.TriagePriority;
import com.mediqueue.pro.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QueueService {

    private static final Logger log = LoggerFactory.getLogger(QueueService.class);

    private final TokenRepository tokenRepository;
    private final PatientRepository patientRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final VitalsRepository vitalsRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public QueueService(TokenRepository tokenRepository, PatientRepository patientRepository, DepartmentRepository departmentRepository, DoctorRepository doctorRepository, VitalsRepository vitalsRepository, SimpMessagingTemplate messagingTemplate) {
        this.tokenRepository = tokenRepository;
        this.patientRepository = patientRepository;
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
        this.vitalsRepository = vitalsRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public TokenResponseDto registerWalkIn(TokenRegistrationRequest request) {
        Patient patient;
        if (request.getPatientId() != null && !request.getPatientId().isBlank()) {
            patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found: " + request.getPatientId()));
        } else if (request.getPhone() != null && patientRepository.findByPhone(request.getPhone()).isPresent()) {
            patient = patientRepository.findByPhone(request.getPhone()).get();
        } else {
            String mrn = "MQP-" + LocalDate.now().getYear() + "-" + (1000 + new Random().nextInt(9000));
            patient = Patient.builder()
                    .id("pat-" + UUID.randomUUID().toString().substring(0, 8))
                    .mrn(mrn)
                    .fullName(request.getFullName())
                    .phone(request.getPhone())
                    .email(request.getEmail())
                    .age(request.getAge() != null ? request.getAge() : 30)
                    .gender(request.getGender() != null ? request.getGender() : "Other")
                    .bloodGroup(request.getBloodGroup())
                    .address(request.getAddress())
                    .allergies(request.getAllergies())
                    .medicalHistory(request.getMedicalHistory())
                    .build();
            patient = patientRepository.save(patient);
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found: " + request.getDepartmentId()));

        Doctor doctor;
        if (request.getDoctorId() != null && !request.getDoctorId().isBlank()) {
            doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found: " + request.getDoctorId()));
        } else {
            List<Doctor> deptDocs = doctorRepository.findByDepartmentId(department.getId());
            if (deptDocs.isEmpty()) throw new RuntimeException("No doctor available in department");
            doctor = deptDocs.get(0);
        }

        TriagePriority priority = TriagePriority.STANDARD;
        if (request.getTriagePriority() != null) {
            try {
                priority = TriagePriority.valueOf(request.getTriagePriority().toUpperCase());
            } catch (Exception ignored) {}
        }

        Vitals vitals = null;
        if (request.getSystolicBp() != null || request.getHeartRate() != null || request.getSpo2() != null) {
            vitals = Vitals.builder()
                    .id("vit-" + UUID.randomUUID().toString().substring(0, 8))
                    .patient(patient)
                    .systolicBp(request.getSystolicBp())
                    .diastolicBp(request.getDiastolicBp())
                    .heartRate(request.getHeartRate())
                    .respiratoryRate(request.getRespiratoryRate())
                    .temperature(request.getTemperature())
                    .spo2(request.getSpo2())
                    .weightKg(request.getWeightKg())
                    .heightCm(request.getHeightCm())
                    .bloodGlucose(request.getBloodGlucose())
                    .triagePriority(priority)
                    .build();
            vitals = vitalsRepository.save(vitals);
        }

        LocalDate today = LocalDate.now();
        int existingCount = tokenRepository.countByDepartmentAndDate(department.getId(), today);
        int sequenceNum = existingCount + 1;
        String tokenNumber = department.getCode() + "-" + (100 + sequenceNum);

        Token token = Token.builder()
                .id("tok-" + UUID.randomUUID().toString().substring(0, 8))
                .tokenNumber(tokenNumber)
                .sequenceNum(sequenceNum)
                .department(department)
                .doctor(doctor)
                .patient(patient)
                .vitals(vitals)
                .status(TokenStatus.WAITING)
                .triagePriority(priority)
                .queueDate(today)
                .estimatedWaitMins(priority == TriagePriority.EMERGENCY ? 0 : Math.max(5, sequenceNum * 12))
                .build();

        token = tokenRepository.save(token);

        TokenResponseDto response = mapToTokenResponseDto(token);
        broadcastQueueUpdate();

        return response;
    }

    @Transactional
    public TokenResponseDto updateTokenStatus(String tokenId, TokenStatus newStatus) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new RuntimeException("Token not found: " + tokenId));

        token.setStatus(newStatus);
        if (newStatus == TokenStatus.CALLED) {
            token.setCalledAt(LocalDateTime.now());
            messagingTemplate.convertAndSend("/topic/token-called", mapToTokenResponseDto(token));
        } else if (newStatus == TokenStatus.IN_CONSULTATION) {
            token.setConsultationStartAt(LocalDateTime.now());
        } else if (newStatus == TokenStatus.COMPLETED) {
            token.setConsultationEndAt(LocalDateTime.now());
        }

        token = tokenRepository.save(token);
        TokenResponseDto response = mapToTokenResponseDto(token);

        broadcastQueueUpdate();
        return response;
    }

    public List<TokenResponseDto> getLiveQueueForDoctor(String doctorId) {
        return tokenRepository.findByDoctorIdAndQueueDateOrderBySequenceNumAsc(doctorId, LocalDate.now())
                .stream()
                .map(this::mapToTokenResponseDto)
                .collect(Collectors.toList());
    }

    public List<TokenResponseDto> getLiveQueueForDepartment(String departmentId) {
        return tokenRepository.findByDepartmentIdAndQueueDateOrderBySequenceNumAsc(departmentId, LocalDate.now())
                .stream()
                .map(this::mapToTokenResponseDto)
                .collect(Collectors.toList());
    }

    public List<QueueDisplaySummary> getDisplaySummaries() {
        List<Department> departments = departmentRepository.findByIsActiveTrue();
        LocalDate today = LocalDate.now();
        List<QueueDisplaySummary> summaries = new ArrayList<>();

        for (Department dept : departments) {
            List<Token> deptTokens = tokenRepository.findByDepartmentIdAndQueueDateOrderBySequenceNumAsc(dept.getId(), today);
            
            String currentToken = "-";
            String nextToken = "-";
            String doctorName = "Duty Consultant";
            String roomNo = dept.getFloor();

            Optional<Token> activeToken = deptTokens.stream()
                    .filter(t -> t.getStatus() == TokenStatus.IN_CONSULTATION || t.getStatus() == TokenStatus.CALLED)
                    .findFirst();

            if (activeToken.isPresent()) {
                currentToken = activeToken.get().getTokenNumber();
                doctorName = activeToken.get().getDoctor().getUser().getName();
                roomNo = activeToken.get().getDoctor().getRoomNo();
            }

            Optional<Token> waitingToken = deptTokens.stream()
                    .filter(t -> t.getStatus() == TokenStatus.WAITING)
                    .findFirst();

            if (waitingToken.isPresent()) {
                nextToken = waitingToken.get().getTokenNumber();
            }

            long waitingCount = deptTokens.stream()
                    .filter(t -> t.getStatus() == TokenStatus.WAITING)
                    .count();

            summaries.add(QueueDisplaySummary.builder()
                    .departmentId(dept.getId())
                    .departmentName(dept.getName())
                    .color(dept.getColor())
                    .icon(dept.getIcon())
                    .currentToken(currentToken)
                    .nextToken(nextToken)
                    .doctorName(doctorName)
                    .roomNo(roomNo)
                    .waitingCount((int) waitingCount)
                    .tokens(deptTokens.stream().map(this::mapToTokenResponseDto).collect(Collectors.toList()))
                    .build());
        }

        return summaries;
    }

    public void broadcastQueueUpdate() {
        try {
            List<QueueDisplaySummary> displayData = getDisplaySummaries();
            messagingTemplate.convertAndSend("/topic/queue-updates", displayData);
        } catch (Exception e) {
            log.error("Failed to broadcast queue updates via STOMP: {}", e.getMessage());
        }
    }

    public TokenResponseDto mapToTokenResponseDto(Token token) {
        VitalsDto vitalsDto = null;
        if (token.getVitals() != null) {
            Vitals v = token.getVitals();
            vitalsDto = VitalsDto.builder()
                    .id(v.getId())
                    .systolicBp(v.getSystolicBp())
                    .diastolicBp(v.getDiastolicBp())
                    .heartRate(v.getHeartRate())
                    .respiratoryRate(v.getRespiratoryRate())
                    .temperature(v.getTemperature())
                    .spo2(v.getSpo2())
                    .weightKg(v.getWeightKg())
                    .heightCm(v.getHeightCm())
                    .bmi(v.getBmi())
                    .bloodGlucose(v.getBloodGlucose())
                    .triagePriority(v.getTriagePriority().name())
                    .build();
        }

        return TokenResponseDto.builder()
                .id(token.getId())
                .tokenNumber(token.getTokenNumber())
                .sequenceNum(token.getSequenceNum())
                .departmentId(token.getDepartment().getId())
                .departmentName(token.getDepartment().getName())
                .doctorId(token.getDoctor().getId())
                .doctorName(token.getDoctor().getUser().getName())
                .roomNo(token.getDoctor().getRoomNo())
                .patientId(token.getPatient().getId())
                .patientMrn(token.getPatient().getMrn())
                .patientName(token.getPatient().getFullName())
                .patientPhone(token.getPatient().getPhone())
                .patientAge(token.getPatient().getAge())
                .patientGender(token.getPatient().getGender())
                .status(token.getStatus().name())
                .triagePriority(token.getTriagePriority().name())
                .estimatedWaitMins(token.getEstimatedWaitMins())
                .calledAt(token.getCalledAt())
                .consultationStartAt(token.getConsultationStartAt())
                .consultationEndAt(token.getConsultationEndAt())
                .createdAt(token.getCreatedAt())
                .vitals(vitalsDto)
                .build();
    }
}
