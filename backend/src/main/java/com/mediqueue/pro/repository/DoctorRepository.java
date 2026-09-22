package com.mediqueue.pro.repository;

import com.mediqueue.pro.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {
    Optional<Doctor> findByUserId(String userId);
    List<Doctor> findByDepartmentId(String departmentId);
}
