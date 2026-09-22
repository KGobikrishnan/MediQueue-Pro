package com.mediqueue.pro.service;

import com.mediqueue.pro.entity.Patient;
import com.mediqueue.pro.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public List<Patient> searchPatients(String query) {
        if (query == null || query.isBlank()) {
            return patientRepository.findAll();
        }
        return patientRepository.searchPatients(query.trim());
    }

    public Patient getPatientById(String id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + id));
    }

    public Patient createPatient(Patient patient) {
        if (patient.getId() == null || patient.getId().isBlank()) {
            patient.setId("pat-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (patient.getMrn() == null || patient.getMrn().isBlank()) {
            patient.setMrn("MQP-" + LocalDate.now().getYear() + "-" + (1000 + new Random().nextInt(9000)));
        }
        return patientRepository.save(patient);
    }
}
