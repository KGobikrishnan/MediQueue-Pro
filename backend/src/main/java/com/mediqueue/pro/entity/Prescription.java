package com.mediqueue.pro.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "prescription_no", nullable = false, unique = true, length = 50)
    private String prescriptionNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "token_id")
    private Token token;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "clinical_notes", columnDefinition = "TEXT")
    private String clinicalNotes;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(columnDefinition = "TEXT")
    private String advice;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<PrescriptionMedicine> medicines = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Prescription() {}

    public Prescription(String id, String prescriptionNo, Token token, Patient patient, Doctor doctor, Department department, String diagnosis, String clinicalNotes, LocalDate followUpDate, String advice, List<PrescriptionMedicine> medicines, LocalDateTime createdAt) {
        this.id = id;
        this.prescriptionNo = prescriptionNo;
        this.token = token;
        this.patient = patient;
        this.doctor = doctor;
        this.department = department;
        this.diagnosis = diagnosis;
        this.clinicalNotes = clinicalNotes;
        this.followUpDate = followUpDate;
        this.advice = advice;
        this.medicines = medicines != null ? medicines : new ArrayList<>();
        this.createdAt = createdAt;
    }

    public static PrescriptionBuilder builder() {
        return new PrescriptionBuilder();
    }

    public static class PrescriptionBuilder {
        private String id;
        private String prescriptionNo;
        private Token token;
        private Patient patient;
        private Doctor doctor;
        private Department department;
        private String diagnosis;
        private String clinicalNotes;
        private LocalDate followUpDate;
        private String advice;
        private List<PrescriptionMedicine> medicines = new ArrayList<>();
        private LocalDateTime createdAt;

        public PrescriptionBuilder id(String id) { this.id = id; return this; }
        public PrescriptionBuilder prescriptionNo(String prescriptionNo) { this.prescriptionNo = prescriptionNo; return this; }
        public PrescriptionBuilder token(Token token) { this.token = token; return this; }
        public PrescriptionBuilder patient(Patient patient) { this.patient = patient; return this; }
        public PrescriptionBuilder doctor(Doctor doctor) { this.doctor = doctor; return this; }
        public PrescriptionBuilder department(Department department) { this.department = department; return this; }
        public PrescriptionBuilder diagnosis(String diagnosis) { this.diagnosis = diagnosis; return this; }
        public PrescriptionBuilder clinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; return this; }
        public PrescriptionBuilder followUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; return this; }
        public PrescriptionBuilder advice(String advice) { this.advice = advice; return this; }
        public PrescriptionBuilder medicines(List<PrescriptionMedicine> medicines) { this.medicines = medicines != null ? medicines : new ArrayList<>(); return this; }
        public PrescriptionBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Prescription build() {
            return new Prescription(id, prescriptionNo, token, patient, doctor, department, diagnosis, clinicalNotes, followUpDate, advice, medicines, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPrescriptionNo() { return prescriptionNo; }
    public void setPrescriptionNo(String prescriptionNo) { this.prescriptionNo = prescriptionNo; }
    public Token getToken() { return token; }
    public void setToken(Token token) { this.token = token; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }
    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
    public String getAdvice() { return advice; }
    public void setAdvice(String advice) { this.advice = advice; }
    public List<PrescriptionMedicine> getMedicines() { return medicines; }
    public void setMedicines(List<PrescriptionMedicine> medicines) { this.medicines = medicines; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
