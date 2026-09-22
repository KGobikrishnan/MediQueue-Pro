package com.mediqueue.pro.controller;

import com.mediqueue.pro.dto.PrescriptionDtos.CreatePrescriptionRequest;
import com.mediqueue.pro.dto.PrescriptionDtos.PrescriptionResponseDto;
import com.mediqueue.pro.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping
    public ResponseEntity<PrescriptionResponseDto> createPrescription(@RequestBody CreatePrescriptionRequest request) {
        return ResponseEntity.ok(prescriptionService.createPrescription(request));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponseDto>> getPatientPrescriptions(@PathVariable String patientId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsForPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionResponseDto>> getDoctorPrescriptions(@PathVariable String doctorId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsForDoctor(doctorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionResponseDto> getPrescriptionById(@PathVariable String id) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionById(id));
    }
}
