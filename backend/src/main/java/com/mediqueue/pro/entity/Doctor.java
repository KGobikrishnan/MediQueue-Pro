package com.mediqueue.pro.entity;

import com.mediqueue.pro.enums.DoctorStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @Column(length = 64)
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false)
    private String qualification;

    @Column(name = "experience_years")
    private Integer experienceYears = 1;

    @Column(name = "room_no", nullable = false, length = 50)
    private String roomNo;

    @Column(name = "consultation_fee")
    private BigDecimal consultationFee = BigDecimal.valueOf(500.00);

    @Column(name = "avg_consult_time_mins")
    private Integer avgConsultTimeMins = 12;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private DoctorStatus status = DoctorStatus.AVAILABLE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Doctor() {}

    public Doctor(String id, User user, Department department, String qualification, Integer experienceYears, String roomNo, BigDecimal consultationFee, Integer avgConsultTimeMins, DoctorStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.department = department;
        this.qualification = qualification;
        this.experienceYears = experienceYears != null ? experienceYears : 1;
        this.roomNo = roomNo;
        this.consultationFee = consultationFee != null ? consultationFee : BigDecimal.valueOf(500.00);
        this.avgConsultTimeMins = avgConsultTimeMins != null ? avgConsultTimeMins : 12;
        this.status = status != null ? status : DoctorStatus.AVAILABLE;
        this.createdAt = createdAt;
    }

    public static DoctorBuilder builder() {
        return new DoctorBuilder();
    }

    public static class DoctorBuilder {
        private String id;
        private User user;
        private Department department;
        private String qualification;
        private Integer experienceYears = 1;
        private String roomNo;
        private BigDecimal consultationFee = BigDecimal.valueOf(500.00);
        private Integer avgConsultTimeMins = 12;
        private DoctorStatus status = DoctorStatus.AVAILABLE;
        private LocalDateTime createdAt;

        public DoctorBuilder id(String id) { this.id = id; return this; }
        public DoctorBuilder user(User user) { this.user = user; return this; }
        public DoctorBuilder department(Department department) { this.department = department; return this; }
        public DoctorBuilder qualification(String qualification) { this.qualification = qualification; return this; }
        public DoctorBuilder experienceYears(Integer experienceYears) { this.experienceYears = experienceYears; return this; }
        public DoctorBuilder roomNo(String roomNo) { this.roomNo = roomNo; return this; }
        public DoctorBuilder consultationFee(BigDecimal consultationFee) { this.consultationFee = consultationFee; return this; }
        public DoctorBuilder avgConsultTimeMins(Integer avgConsultTimeMins) { this.avgConsultTimeMins = avgConsultTimeMins; return this; }
        public DoctorBuilder status(DoctorStatus status) { this.status = status; return this; }
        public DoctorBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Doctor build() {
            return new Doctor(id, user, department, qualification, experienceYears, roomNo, consultationFee, avgConsultTimeMins, status, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public String getRoomNo() { return roomNo; }
    public void setRoomNo(String roomNo) { this.roomNo = roomNo; }
    public BigDecimal getConsultationFee() { return consultationFee; }
    public void setConsultationFee(BigDecimal consultationFee) { this.consultationFee = consultationFee; }
    public Integer getAvgConsultTimeMins() { return avgConsultTimeMins; }
    public void setAvgConsultTimeMins(Integer avgConsultTimeMins) { this.avgConsultTimeMins = avgConsultTimeMins; }
    public DoctorStatus getStatus() { return status; }
    public void setStatus(DoctorStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
