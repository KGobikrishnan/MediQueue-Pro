package com.mediqueue.pro.service;

import com.mediqueue.pro.dto.PrescriptionDtos.*;
import com.mediqueue.pro.entity.*;
import com.mediqueue.pro.enums.TokenStatus;
import com.mediqueue.pro.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final TokenRepository tokenRepository;
    private final QueueService queueService;

    public PrescriptionService(PrescriptionRepository prescriptionRepository, PatientRepository patientRepository, DoctorRepository doctorRepository, DepartmentRepository departmentRepository, TokenRepository tokenRepository, QueueService queueService) {
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.tokenRepository = tokenRepository;
        this.queueService = queueService;
    }

    @Transactional
    public PrescriptionResponseDto createPrescription(CreatePrescriptionRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found: " + request.getPatientId()));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + request.getDoctorId()));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found: " + request.getDepartmentId()));

        Token token = null;
        if (request.getTokenId() != null && !request.getTokenId().isBlank()) {
            token = tokenRepository.findById(request.getTokenId()).orElse(null);
            if (token != null) {
                token.setStatus(TokenStatus.COMPLETED);
                tokenRepository.save(token);
                queueService.broadcastQueueUpdate();
            }
        }

        String rxNo = "RX-" + LocalDate.now().getYear() + "-" + String.format("%04d", 1000 + new Random().nextInt(9000));

        Prescription prescription = Prescription.builder()
                .id("rx-" + UUID.randomUUID().toString().substring(0, 8))
                .prescriptionNo(rxNo)
                .token(token)
                .patient(patient)
                .doctor(doctor)
                .department(department)
                .diagnosis(request.getDiagnosis())
                .clinicalNotes(request.getClinicalNotes())
                .followUpDate(request.getFollowUpDate())
                .advice(request.getAdvice())
                .medicines(new ArrayList<>())
                .build();

        if (request.getMedicines() != null) {
            for (MedicineItemDto item : request.getMedicines()) {
                PrescriptionMedicine med = PrescriptionMedicine.builder()
                        .id("rxm-" + UUID.randomUUID().toString().substring(0, 8))
                        .prescription(prescription)
                        .medicineName(item.getMedicineName())
                        .dosage(item.getDosage())
                        .frequency(item.getFrequency())
                        .durationDays(item.getDurationDays() != null ? item.getDurationDays() : 5)
                        .instructions(item.getInstructions())
                        .build();
                prescription.getMedicines().add(med);
            }
        }

        prescription = prescriptionRepository.save(prescription);
        return mapToResponseDto(prescription);
    }

    public List<PrescriptionResponseDto> getPrescriptionsForPatient(String patientId) {
        return prescriptionRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<PrescriptionResponseDto> getPrescriptionsForDoctor(String doctorId) {
        return prescriptionRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public PrescriptionResponseDto getPrescriptionById(String id) {
        Prescription rx = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + id));
        return mapToResponseDto(rx);
    }

    private PrescriptionResponseDto mapToResponseDto(Prescription p) {
        List<MedicineItemDto> meds = p.getMedicines() != null ? p.getMedicines().stream()
                .map(m -> MedicineItemDto.builder()
                        .medicineName(m.getMedicineName())
                        .dosage(m.getDosage())
                        .frequency(m.getFrequency())
                        .durationDays(m.getDurationDays())
                        .instructions(m.getInstructions())
                        .build())
                .collect(Collectors.toList()) : new ArrayList<>();

        return PrescriptionResponseDto.builder()
                .id(p.getId())
                .prescriptionNo(p.getPrescriptionNo())
                .tokenId(p.getToken() != null ? p.getToken().getId() : null)
                .patientId(p.getPatient().getId())
                .patientName(p.getPatient().getFullName())
                .patientMrn(p.getPatient().getMrn())
                .patientAge(p.getPatient().getAge())
                .patientGender(p.getPatient().getGender())
                .doctorId(p.getDoctor().getId())
                .doctorName(p.getDoctor().getUser().getName())
                .doctorQualification(p.getDoctor().getQualification())
                .departmentId(p.getDepartment().getId())
                .departmentName(p.getDepartment().getName())
                .diagnosis(p.getDiagnosis())
                .clinicalNotes(p.getClinicalNotes())
                .followUpDate(p.getFollowUpDate())
                .advice(p.getAdvice())
                .createdAt(p.getCreatedAt())
                .medicines(meds)
                .build();
    }
}
