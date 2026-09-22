package com.mediqueue.pro.repository;

import com.mediqueue.pro.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, String> {
    List<Prescription> findByPatientIdOrderByCreatedAtDesc(String patientId);
    List<Prescription> findByDoctorIdOrderByCreatedAtDesc(String doctorId);
    Optional<Prescription> findByTokenId(String tokenId);
    Optional<Prescription> findByPrescriptionNo(String prescriptionNo);
}
