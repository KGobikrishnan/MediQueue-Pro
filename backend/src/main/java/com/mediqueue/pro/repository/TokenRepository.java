package com.mediqueue.pro.repository;

import com.mediqueue.pro.entity.Token;
import com.mediqueue.pro.enums.TokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, String> {
    List<Token> findByQueueDate(LocalDate queueDate);
    List<Token> findByDoctorIdAndQueueDateOrderBySequenceNumAsc(String doctorId, LocalDate queueDate);
    List<Token> findByDepartmentIdAndQueueDateOrderBySequenceNumAsc(String departmentId, LocalDate queueDate);
    List<Token> findByPatientIdOrderByCreatedAtDesc(String patientId);
    Optional<Token> findFirstByPatientIdAndStatusInOrderByCreatedAtDesc(String patientId, List<TokenStatus> statuses);

    @Query("SELECT COUNT(t) FROM Token t WHERE t.department.id = :deptId AND t.queueDate = :date")
    int countByDepartmentAndDate(@Param("deptId") String deptId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM Token t WHERE t.doctor.id = :doctorId AND t.queueDate = :date")
    int countByDoctorAndDate(@Param("doctorId") String doctorId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM Token t WHERE t.status = :status AND t.queueDate = :date")
    long countByStatusAndQueueDate(@Param("status") TokenStatus status, @Param("date") LocalDate date);
}
