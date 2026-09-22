package com.mediqueue.pro.entity;

import com.mediqueue.pro.enums.TokenStatus;
import com.mediqueue.pro.enums.TriagePriority;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tokens")
public class Token {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "token_number", nullable = false, length = 30)
    private String tokenNumber;

    @Column(name = "sequence_num", nullable = false)
    private Integer sequenceNum;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vitals_id")
    private Vitals vitals;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private TokenStatus status = TokenStatus.WAITING;

    @Enumerated(EnumType.STRING)
    @Column(name = "triage_priority", length = 20)
    private TriagePriority triagePriority = TriagePriority.STANDARD;

    @Column(name = "queue_date")
    private LocalDate queueDate = LocalDate.now();

    @Column(name = "estimated_wait_mins")
    private Integer estimatedWaitMins = 15;

    @Column(name = "called_at")
    private LocalDateTime calledAt;

    @Column(name = "consultation_start_at")
    private LocalDateTime consultationStartAt;

    @Column(name = "consultation_end_at")
    private LocalDateTime consultationEndAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Token() {}

    public Token(String id, String tokenNumber, Integer sequenceNum, Department department, Doctor doctor, Patient patient, Vitals vitals, TokenStatus status, TriagePriority triagePriority, LocalDate queueDate, Integer estimatedWaitMins, LocalDateTime calledAt, LocalDateTime consultationStartAt, LocalDateTime consultationEndAt, LocalDateTime createdAt) {
        this.id = id;
        this.tokenNumber = tokenNumber;
        this.sequenceNum = sequenceNum;
        this.department = department;
        this.doctor = doctor;
        this.patient = patient;
        this.vitals = vitals;
        this.status = status != null ? status : TokenStatus.WAITING;
        this.triagePriority = triagePriority != null ? triagePriority : TriagePriority.STANDARD;
        this.queueDate = queueDate != null ? queueDate : LocalDate.now();
        this.estimatedWaitMins = estimatedWaitMins != null ? estimatedWaitMins : 15;
        this.calledAt = calledAt;
        this.consultationStartAt = consultationStartAt;
        this.consultationEndAt = consultationEndAt;
        this.createdAt = createdAt;
    }

    public static TokenBuilder builder() {
        return new TokenBuilder();
    }

    public static class TokenBuilder {
        private String id;
        private String tokenNumber;
        private Integer sequenceNum;
        private Department department;
        private Doctor doctor;
        private Patient patient;
        private Vitals vitals;
        private TokenStatus status = TokenStatus.WAITING;
        private TriagePriority triagePriority = TriagePriority.STANDARD;
        private LocalDate queueDate = LocalDate.now();
        private Integer estimatedWaitMins = 15;
        private LocalDateTime calledAt;
        private LocalDateTime consultationStartAt;
        private LocalDateTime consultationEndAt;
        private LocalDateTime createdAt;

        public TokenBuilder id(String id) { this.id = id; return this; }
        public TokenBuilder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
        public TokenBuilder sequenceNum(Integer sequenceNum) { this.sequenceNum = sequenceNum; return this; }
        public TokenBuilder department(Department department) { this.department = department; return this; }
        public TokenBuilder doctor(Doctor doctor) { this.doctor = doctor; return this; }
        public TokenBuilder patient(Patient patient) { this.patient = patient; return this; }
        public TokenBuilder vitals(Vitals vitals) { this.vitals = vitals; return this; }
        public TokenBuilder status(TokenStatus status) { this.status = status; return this; }
        public TokenBuilder triagePriority(TriagePriority triagePriority) { this.triagePriority = triagePriority; return this; }
        public TokenBuilder queueDate(LocalDate queueDate) { this.queueDate = queueDate; return this; }
        public TokenBuilder estimatedWaitMins(Integer estimatedWaitMins) { this.estimatedWaitMins = estimatedWaitMins; return this; }
        public TokenBuilder calledAt(LocalDateTime calledAt) { this.calledAt = calledAt; return this; }
        public TokenBuilder consultationStartAt(LocalDateTime consultationStartAt) { this.consultationStartAt = consultationStartAt; return this; }
        public TokenBuilder consultationEndAt(LocalDateTime consultationEndAt) { this.consultationEndAt = consultationEndAt; return this; }
        public TokenBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Token build() {
            return new Token(id, tokenNumber, sequenceNum, department, doctor, patient, vitals, status, triagePriority, queueDate, estimatedWaitMins, calledAt, consultationStartAt, consultationEndAt, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }
    public Integer getSequenceNum() { return sequenceNum; }
    public void setSequenceNum(Integer sequenceNum) { this.sequenceNum = sequenceNum; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public Vitals getVitals() { return vitals; }
    public void setVitals(Vitals vitals) { this.vitals = vitals; }
    public TokenStatus getStatus() { return status; }
    public void setStatus(TokenStatus status) { this.status = status; }
    public TriagePriority getTriagePriority() { return triagePriority; }
    public void setTriagePriority(TriagePriority triagePriority) { this.triagePriority = triagePriority; }
    public LocalDate getQueueDate() { return queueDate; }
    public void setQueueDate(LocalDate queueDate) { this.queueDate = queueDate; }
    public Integer getEstimatedWaitMins() { return estimatedWaitMins; }
    public void setEstimatedWaitMins(Integer estimatedWaitMins) { this.estimatedWaitMins = estimatedWaitMins; }
    public LocalDateTime getCalledAt() { return calledAt; }
    public void setCalledAt(LocalDateTime calledAt) { this.calledAt = calledAt; }
    public LocalDateTime getConsultationStartAt() { return consultationStartAt; }
    public void setConsultationStartAt(LocalDateTime consultationStartAt) { this.consultationStartAt = consultationStartAt; }
    public LocalDateTime getConsultationEndAt() { return consultationEndAt; }
    public void setConsultationEndAt(LocalDateTime consultationEndAt) { this.consultationEndAt = consultationEndAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
