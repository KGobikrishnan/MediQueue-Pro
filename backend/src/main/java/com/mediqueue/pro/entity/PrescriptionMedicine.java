package com.mediqueue.pro.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "prescription_medicines")
public class PrescriptionMedicine {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    @JsonBackReference
    private Prescription prescription;

    @Column(name = "medicine_name", nullable = false, length = 150)
    private String medicineName;

    @Column(nullable = false, length = 100)
    private String dosage;

    @Column(nullable = false, length = 50)
    private String frequency;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(length = 150)
    private String instructions;

    public PrescriptionMedicine() {}

    public PrescriptionMedicine(String id, Prescription prescription, String medicineName, String dosage, String frequency, Integer durationDays, String instructions) {
        this.id = id;
        this.prescription = prescription;
        this.medicineName = medicineName;
        this.dosage = dosage;
        this.frequency = frequency;
        this.durationDays = durationDays;
        this.instructions = instructions;
    }

    public static PrescriptionMedicineBuilder builder() {
        return new PrescriptionMedicineBuilder();
    }

    public static class PrescriptionMedicineBuilder {
        private String id;
        private Prescription prescription;
        private String medicineName;
        private String dosage;
        private String frequency;
        private Integer durationDays;
        private String instructions;

        public PrescriptionMedicineBuilder id(String id) { this.id = id; return this; }
        public PrescriptionMedicineBuilder prescription(Prescription prescription) { this.prescription = prescription; return this; }
        public PrescriptionMedicineBuilder medicineName(String medicineName) { this.medicineName = medicineName; return this; }
        public PrescriptionMedicineBuilder dosage(String dosage) { this.dosage = dosage; return this; }
        public PrescriptionMedicineBuilder frequency(String frequency) { this.frequency = frequency; return this; }
        public PrescriptionMedicineBuilder durationDays(Integer durationDays) { this.durationDays = durationDays; return this; }
        public PrescriptionMedicineBuilder instructions(String instructions) { this.instructions = instructions; return this; }

        public PrescriptionMedicine build() {
            return new PrescriptionMedicine(id, prescription, medicineName, dosage, frequency, durationDays, instructions);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Prescription getPrescription() { return prescription; }
    public void setPrescription(Prescription prescription) { this.prescription = prescription; }
    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
}
