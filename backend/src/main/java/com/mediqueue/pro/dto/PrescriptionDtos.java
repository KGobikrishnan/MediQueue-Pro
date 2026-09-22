package com.mediqueue.pro.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PrescriptionDtos {

    public static class CreatePrescriptionRequest {
        private String tokenId;
        private String patientId;
        private String doctorId;
        private String departmentId;
        private String diagnosis;
        private String clinicalNotes;
        private LocalDate followUpDate;
        private String advice;
        private List<MedicineItemDto> medicines;

        public CreatePrescriptionRequest() {}

        public String getTokenId() { return tokenId; }
        public void setTokenId(String tokenId) { this.tokenId = tokenId; }
        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }
        public String getDoctorId() { return doctorId; }
        public void setDoctorId(String doctorId) { this.doctorId = doctorId; }
        public String getDepartmentId() { return departmentId; }
        public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
        public String getDiagnosis() { return diagnosis; }
        public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
        public String getClinicalNotes() { return clinicalNotes; }
        public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }
        public LocalDate getFollowUpDate() { return followUpDate; }
        public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
        public String getAdvice() { return advice; }
        public void setAdvice(String advice) { this.advice = advice; }
        public List<MedicineItemDto> getMedicines() { return medicines; }
        public void setMedicines(List<MedicineItemDto> medicines) { this.medicines = medicines; }
    }

    public static class MedicineItemDto {
        private String medicineName;
        private String dosage;
        private String frequency;
        private Integer durationDays;
        private String instructions;

        public MedicineItemDto() {}
        public MedicineItemDto(String medicineName, String dosage, String frequency, Integer durationDays, String instructions) {
            this.medicineName = medicineName;
            this.dosage = dosage;
            this.frequency = frequency;
            this.durationDays = durationDays;
            this.instructions = instructions;
        }

        public static MedicineItemDtoBuilder builder() { return new MedicineItemDtoBuilder(); }
        public static class MedicineItemDtoBuilder {
            private String medicineName;
            private String dosage;
            private String frequency;
            private Integer durationDays;
            private String instructions;

            public MedicineItemDtoBuilder medicineName(String medicineName) { this.medicineName = medicineName; return this; }
            public MedicineItemDtoBuilder dosage(String dosage) { this.dosage = dosage; return this; }
            public MedicineItemDtoBuilder frequency(String frequency) { this.frequency = frequency; return this; }
            public MedicineItemDtoBuilder durationDays(Integer durationDays) { this.durationDays = durationDays; return this; }
            public MedicineItemDtoBuilder instructions(String instructions) { this.instructions = instructions; return this; }

            public MedicineItemDto build() {
                return new MedicineItemDto(medicineName, dosage, frequency, durationDays, instructions);
            }
        }

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

    public static class PrescriptionResponseDto {
        private String id;
        private String prescriptionNo;
        private String tokenId;
        private String patientId;
        private String patientName;
        private String patientMrn;
        private Integer patientAge;
        private String patientGender;
        private String doctorId;
        private String doctorName;
        private String doctorQualification;
        private String departmentId;
        private String departmentName;
        private String diagnosis;
        private String clinicalNotes;
        private LocalDate followUpDate;
        private String advice;
        private LocalDateTime createdAt;
        private List<MedicineItemDto> medicines;

        public PrescriptionResponseDto() {}
        public PrescriptionResponseDto(String id, String prescriptionNo, String tokenId, String patientId, String patientName, String patientMrn, Integer patientAge, String patientGender, String doctorId, String doctorName, String doctorQualification, String departmentId, String departmentName, String diagnosis, String clinicalNotes, LocalDate followUpDate, String advice, LocalDateTime createdAt, List<MedicineItemDto> medicines) {
            this.id = id;
            this.prescriptionNo = prescriptionNo;
            this.tokenId = tokenId;
            this.patientId = patientId;
            this.patientName = patientName;
            this.patientMrn = patientMrn;
            this.patientAge = patientAge;
            this.patientGender = patientGender;
            this.doctorId = doctorId;
            this.doctorName = doctorName;
            this.doctorQualification = doctorQualification;
            this.departmentId = departmentId;
            this.departmentName = departmentName;
            this.diagnosis = diagnosis;
            this.clinicalNotes = clinicalNotes;
            this.followUpDate = followUpDate;
            this.advice = advice;
            this.createdAt = createdAt;
            this.medicines = medicines;
        }

        public static PrescriptionResponseDtoBuilder builder() { return new PrescriptionResponseDtoBuilder(); }
        public static class PrescriptionResponseDtoBuilder {
            private String id;
            private String prescriptionNo;
            private String tokenId;
            private String patientId;
            private String patientName;
            private String patientMrn;
            private Integer patientAge;
            private String patientGender;
            private String doctorId;
            private String doctorName;
            private String doctorQualification;
            private String departmentId;
            private String departmentName;
            private String diagnosis;
            private String clinicalNotes;
            private LocalDate followUpDate;
            private String advice;
            private LocalDateTime createdAt;
            private List<MedicineItemDto> medicines;

            public PrescriptionResponseDtoBuilder id(String id) { this.id = id; return this; }
            public PrescriptionResponseDtoBuilder prescriptionNo(String prescriptionNo) { this.prescriptionNo = prescriptionNo; return this; }
            public PrescriptionResponseDtoBuilder tokenId(String tokenId) { this.tokenId = tokenId; return this; }
            public PrescriptionResponseDtoBuilder patientId(String patientId) { this.patientId = patientId; return this; }
            public PrescriptionResponseDtoBuilder patientName(String patientName) { this.patientName = patientName; return this; }
            public PrescriptionResponseDtoBuilder patientMrn(String patientMrn) { this.patientMrn = patientMrn; return this; }
            public PrescriptionResponseDtoBuilder patientAge(Integer patientAge) { this.patientAge = patientAge; return this; }
            public PrescriptionResponseDtoBuilder patientGender(String patientGender) { this.patientGender = patientGender; return this; }
            public PrescriptionResponseDtoBuilder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
            public PrescriptionResponseDtoBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
            public PrescriptionResponseDtoBuilder doctorQualification(String doctorQualification) { this.doctorQualification = doctorQualification; return this; }
            public PrescriptionResponseDtoBuilder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
            public PrescriptionResponseDtoBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
            public PrescriptionResponseDtoBuilder diagnosis(String diagnosis) { this.diagnosis = diagnosis; return this; }
            public PrescriptionResponseDtoBuilder clinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; return this; }
            public PrescriptionResponseDtoBuilder followUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; return this; }
            public PrescriptionResponseDtoBuilder advice(String advice) { this.advice = advice; return this; }
            public PrescriptionResponseDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
            public PrescriptionResponseDtoBuilder medicines(List<MedicineItemDto> medicines) { this.medicines = medicines; return this; }

            public PrescriptionResponseDto build() {
                return new PrescriptionResponseDto(id, prescriptionNo, tokenId, patientId, patientName, patientMrn, patientAge, patientGender, doctorId, doctorName, doctorQualification, departmentId, departmentName, diagnosis, clinicalNotes, followUpDate, advice, createdAt, medicines);
            }
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getPrescriptionNo() { return prescriptionNo; }
        public void setPrescriptionNo(String prescriptionNo) { this.prescriptionNo = prescriptionNo; }
        public String getTokenId() { return tokenId; }
        public void setTokenId(String tokenId) { this.tokenId = tokenId; }
        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }
        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }
        public String getPatientMrn() { return patientMrn; }
        public void setPatientMrn(String patientMrn) { this.patientMrn = patientMrn; }
        public Integer getPatientAge() { return patientAge; }
        public void setPatientAge(Integer patientAge) { this.patientAge = patientAge; }
        public String getPatientGender() { return patientGender; }
        public void setPatientGender(String patientGender) { this.patientGender = patientGender; }
        public String getDoctorId() { return doctorId; }
        public void setDoctorId(String doctorId) { this.doctorId = doctorId; }
        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
        public String getDoctorQualification() { return doctorQualification; }
        public void setDoctorQualification(String doctorQualification) { this.doctorQualification = doctorQualification; }
        public String getDepartmentId() { return departmentId; }
        public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
        public String getDiagnosis() { return diagnosis; }
        public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
        public String getClinicalNotes() { return clinicalNotes; }
        public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }
        public LocalDate getFollowUpDate() { return followUpDate; }
        public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
        public String getAdvice() { return advice; }
        public void setAdvice(String advice) { this.advice = advice; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public List<MedicineItemDto> getMedicines() { return medicines; }
        public void setMedicines(List<MedicineItemDto> medicines) { this.medicines = medicines; }
    }
}
