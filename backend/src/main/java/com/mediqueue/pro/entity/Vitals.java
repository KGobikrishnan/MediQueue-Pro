package com.mediqueue.pro.entity;

import com.mediqueue.pro.enums.TriagePriority;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vitals")
public class Vitals {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "systolic_bp")
    private Integer systolicBp;

    @Column(name = "diastolic_bp")
    private Integer diastolicBp;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "respiratory_rate")
    private Integer respiratoryRate;

    @Column(precision = 4, scale = 1)
    private BigDecimal temperature;

    private Integer spo2;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "height_cm", precision = 5, scale = 2)
    private BigDecimal heightCm;

    @Column(precision = 4, scale = 1)
    private BigDecimal bmi;

    @Column(name = "blood_glucose")
    private Integer bloodGlucose;

    @Enumerated(EnumType.STRING)
    @Column(name = "triage_priority", length = 20)
    private TriagePriority triagePriority = TriagePriority.STANDARD;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by")
    private User recordedBy;

    @CreationTimestamp
    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime recordedAt;

    public Vitals() {}

    public Vitals(String id, Patient patient, Integer systolicBp, Integer diastolicBp, Integer heartRate, Integer respiratoryRate, BigDecimal temperature, Integer spo2, BigDecimal weightKg, BigDecimal heightCm, BigDecimal bmi, Integer bloodGlucose, TriagePriority triagePriority, User recordedBy, LocalDateTime recordedAt) {
        this.id = id;
        this.patient = patient;
        this.systolicBp = systolicBp;
        this.diastolicBp = diastolicBp;
        this.heartRate = heartRate;
        this.respiratoryRate = respiratoryRate;
        this.temperature = temperature;
        this.spo2 = spo2;
        this.weightKg = weightKg;
        this.heightCm = heightCm;
        this.bmi = bmi;
        this.bloodGlucose = bloodGlucose;
        this.triagePriority = triagePriority != null ? triagePriority : TriagePriority.STANDARD;
        this.recordedBy = recordedBy;
        this.recordedAt = recordedAt;
    }

    public static VitalsBuilder builder() {
        return new VitalsBuilder();
    }

    public static class VitalsBuilder {
        private String id;
        private Patient patient;
        private Integer systolicBp;
        private Integer diastolicBp;
        private Integer heartRate;
        private Integer respiratoryRate;
        private BigDecimal temperature;
        private Integer spo2;
        private BigDecimal weightKg;
        private BigDecimal heightCm;
        private BigDecimal bmi;
        private Integer bloodGlucose;
        private TriagePriority triagePriority = TriagePriority.STANDARD;
        private User recordedBy;
        private LocalDateTime recordedAt;

        public VitalsBuilder id(String id) { this.id = id; return this; }
        public VitalsBuilder patient(Patient patient) { this.patient = patient; return this; }
        public VitalsBuilder systolicBp(Integer systolicBp) { this.systolicBp = systolicBp; return this; }
        public VitalsBuilder diastolicBp(Integer diastolicBp) { this.diastolicBp = diastolicBp; return this; }
        public VitalsBuilder heartRate(Integer heartRate) { this.heartRate = heartRate; return this; }
        public VitalsBuilder respiratoryRate(Integer respiratoryRate) { this.respiratoryRate = respiratoryRate; return this; }
        public VitalsBuilder temperature(BigDecimal temperature) { this.temperature = temperature; return this; }
        public VitalsBuilder spo2(Integer spo2) { this.spo2 = spo2; return this; }
        public VitalsBuilder weightKg(BigDecimal weightKg) { this.weightKg = weightKg; return this; }
        public VitalsBuilder heightCm(BigDecimal heightCm) { this.heightCm = heightCm; return this; }
        public VitalsBuilder bmi(BigDecimal bmi) { this.bmi = bmi; return this; }
        public VitalsBuilder bloodGlucose(Integer bloodGlucose) { this.bloodGlucose = bloodGlucose; return this; }
        public VitalsBuilder triagePriority(TriagePriority triagePriority) { this.triagePriority = triagePriority; return this; }
        public VitalsBuilder recordedBy(User recordedBy) { this.recordedBy = recordedBy; return this; }
        public VitalsBuilder recordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; return this; }

        public Vitals build() {
            return new Vitals(id, patient, systolicBp, diastolicBp, heartRate, respiratoryRate, temperature, spo2, weightKg, heightCm, bmi, bloodGlucose, triagePriority, recordedBy, recordedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public Integer getSystolicBp() { return systolicBp; }
    public void setSystolicBp(Integer systolicBp) { this.systolicBp = systolicBp; }
    public Integer getDiastolicBp() { return diastolicBp; }
    public void setDiastolicBp(Integer diastolicBp) { this.diastolicBp = diastolicBp; }
    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }
    public Integer getRespiratoryRate() { return respiratoryRate; }
    public void setRespiratoryRate(Integer respiratoryRate) { this.respiratoryRate = respiratoryRate; }
    public BigDecimal getTemperature() { return temperature; }
    public void setTemperature(BigDecimal temperature) { this.temperature = temperature; }
    public Integer getSpo2() { return spo2; }
    public void setSpo2(Integer spo2) { this.spo2 = spo2; }
    public BigDecimal getWeightKg() { return weightKg; }
    public void setWeightKg(BigDecimal weightKg) { this.weightKg = weightKg; }
    public BigDecimal getHeightCm() { return heightCm; }
    public void setHeightCm(BigDecimal heightCm) { this.heightCm = heightCm; }
    public BigDecimal getBmi() { return bmi; }
    public void setBmi(BigDecimal bmi) { this.bmi = bmi; }
    public Integer getBloodGlucose() { return bloodGlucose; }
    public void setBloodGlucose(Integer bloodGlucose) { this.bloodGlucose = bloodGlucose; }
    public TriagePriority getTriagePriority() { return triagePriority; }
    public void setTriagePriority(TriagePriority triagePriority) { this.triagePriority = triagePriority; }
    public User getRecordedBy() { return recordedBy; }
    public void setRecordedBy(User recordedBy) { this.recordedBy = recordedBy; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
