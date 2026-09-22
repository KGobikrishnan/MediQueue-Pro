package com.mediqueue.pro.repository;

import com.mediqueue.pro.entity.Vitals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VitalsRepository extends JpaRepository<Vitals, String> {
    List<Vitals> findByPatientIdOrderByRecordedAtDesc(String patientId);
    Optional<Vitals> findFirstByPatientIdOrderByRecordedAtDesc(String patientId);
}
