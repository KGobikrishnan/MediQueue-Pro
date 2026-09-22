package com.mediqueue.pro.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class QueueDtos {

    public static class TokenRegistrationRequest {
        private String patientId;
        private String mrn;
        private String fullName;
        private String phone;
        private String email;
        private Integer age;
        private String gender;
        private String bloodGroup;
        private String address;
        private String allergies;
        private String medicalHistory;
        private String departmentId;
        private String doctorId;
        private String triagePriority;
        private Integer systolicBp;
        private Integer diastolicBp;
        private Integer heartRate;
        private Integer respiratoryRate;
        private BigDecimal temperature;
        private Integer spo2;
        private BigDecimal weightKg;
        private BigDecimal heightCm;
        private Integer bloodGlucose;

        public TokenRegistrationRequest() {}

        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }
        public String getMrn() { return mrn; }
        public void setMrn(String mrn) { this.mrn = mrn; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public Integer getAge() { return age; }
        public void setAge(Integer age) { this.age = age; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public String getBloodGroup() { return bloodGroup; }
        public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getAllergies() { return allergies; }
        public void setAllergies(String allergies) { this.allergies = allergies; }
        public String getMedicalHistory() { return medicalHistory; }
        public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
        public String getDepartmentId() { return departmentId; }
        public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
        public String getDoctorId() { return doctorId; }
        public void setDoctorId(String doctorId) { this.doctorId = doctorId; }
        public String getTriagePriority() { return triagePriority; }
        public void setTriagePriority(String triagePriority) { this.triagePriority = triagePriority; }
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
        public Integer getBloodGlucose() { return bloodGlucose; }
        public void setBloodGlucose(Integer bloodGlucose) { this.bloodGlucose = bloodGlucose; }
    }

    public static class TokenResponseDto {
        private String id;
        private String tokenNumber;
        private Integer sequenceNum;
        private String departmentId;
        private String departmentName;
        private String doctorId;
        private String doctorName;
        private String roomNo;
        private String patientId;
        private String patientMrn;
        private String patientName;
        private String patientPhone;
        private Integer patientAge;
        private String patientGender;
        private String status;
        private String triagePriority;
        private Integer estimatedWaitMins;
        private LocalDateTime calledAt;
        private LocalDateTime consultationStartAt;
        private LocalDateTime consultationEndAt;
        private LocalDateTime createdAt;
        private VitalsDto vitals;

        public TokenResponseDto() {}

        public TokenResponseDto(String id, String tokenNumber, Integer sequenceNum, String departmentId, String departmentName, String doctorId, String doctorName, String roomNo, String patientId, String patientMrn, String patientName, String patientPhone, Integer patientAge, String patientGender, String status, String triagePriority, Integer estimatedWaitMins, LocalDateTime calledAt, LocalDateTime consultationStartAt, LocalDateTime consultationEndAt, LocalDateTime createdAt, VitalsDto vitals) {
            this.id = id;
            this.tokenNumber = tokenNumber;
            this.sequenceNum = sequenceNum;
            this.departmentId = departmentId;
            this.departmentName = departmentName;
            this.doctorId = doctorId;
            this.doctorName = doctorName;
            this.roomNo = roomNo;
            this.patientId = patientId;
            this.patientMrn = patientMrn;
            this.patientName = patientName;
            this.patientPhone = patientPhone;
            this.patientAge = patientAge;
            this.patientGender = patientGender;
            this.status = status;
            this.triagePriority = triagePriority;
            this.estimatedWaitMins = estimatedWaitMins;
            this.calledAt = calledAt;
            this.consultationStartAt = consultationStartAt;
            this.consultationEndAt = consultationEndAt;
            this.createdAt = createdAt;
            this.vitals = vitals;
        }

        public static TokenResponseDtoBuilder builder() { return new TokenResponseDtoBuilder(); }
        public static class TokenResponseDtoBuilder {
            private String id;
            private String tokenNumber;
            private Integer sequenceNum;
            private String departmentId;
            private String departmentName;
            private String doctorId;
            private String doctorName;
            private String roomNo;
            private String patientId;
            private String patientMrn;
            private String patientName;
            private String patientPhone;
            private Integer patientAge;
            private String patientGender;
            private String status;
            private String triagePriority;
            private Integer estimatedWaitMins;
            private LocalDateTime calledAt;
            private LocalDateTime consultationStartAt;
            private LocalDateTime consultationEndAt;
            private LocalDateTime createdAt;
            private VitalsDto vitals;

            public TokenResponseDtoBuilder id(String id) { this.id = id; return this; }
            public TokenResponseDtoBuilder tokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; return this; }
            public TokenResponseDtoBuilder sequenceNum(Integer sequenceNum) { this.sequenceNum = sequenceNum; return this; }
            public TokenResponseDtoBuilder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
            public TokenResponseDtoBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
            public TokenResponseDtoBuilder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
            public TokenResponseDtoBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
            public TokenResponseDtoBuilder roomNo(String roomNo) { this.roomNo = roomNo; return this; }
            public TokenResponseDtoBuilder patientId(String patientId) { this.patientId = patientId; return this; }
            public TokenResponseDtoBuilder patientMrn(String patientMrn) { this.patientMrn = patientMrn; return this; }
            public TokenResponseDtoBuilder patientName(String patientName) { this.patientName = patientName; return this; }
            public TokenResponseDtoBuilder patientPhone(String patientPhone) { this.patientPhone = patientPhone; return this; }
            public TokenResponseDtoBuilder patientAge(Integer patientAge) { this.patientAge = patientAge; return this; }
            public TokenResponseDtoBuilder patientGender(String patientGender) { this.patientGender = patientGender; return this; }
            public TokenResponseDtoBuilder status(String status) { this.status = status; return this; }
            public TokenResponseDtoBuilder triagePriority(String triagePriority) { this.triagePriority = triagePriority; return this; }
            public TokenResponseDtoBuilder estimatedWaitMins(Integer estimatedWaitMins) { this.estimatedWaitMins = estimatedWaitMins; return this; }
            public TokenResponseDtoBuilder calledAt(LocalDateTime calledAt) { this.calledAt = calledAt; return this; }
            public TokenResponseDtoBuilder consultationStartAt(LocalDateTime consultationStartAt) { this.consultationStartAt = consultationStartAt; return this; }
            public TokenResponseDtoBuilder consultationEndAt(LocalDateTime consultationEndAt) { this.consultationEndAt = consultationEndAt; return this; }
            public TokenResponseDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
            public TokenResponseDtoBuilder vitals(VitalsDto vitals) { this.vitals = vitals; return this; }

            public TokenResponseDto build() {
                return new TokenResponseDto(id, tokenNumber, sequenceNum, departmentId, departmentName, doctorId, doctorName, roomNo, patientId, patientMrn, patientName, patientPhone, patientAge, patientGender, status, triagePriority, estimatedWaitMins, calledAt, consultationStartAt, consultationEndAt, createdAt, vitals);
            }
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTokenNumber() { return tokenNumber; }
        public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }
        public Integer getSequenceNum() { return sequenceNum; }
        public void setSequenceNum(Integer sequenceNum) { this.sequenceNum = sequenceNum; }
        public String getDepartmentId() { return departmentId; }
        public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
        public String getDoctorId() { return doctorId; }
        public void setDoctorId(String doctorId) { this.doctorId = doctorId; }
        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
        public String getRoomNo() { return roomNo; }
        public void setRoomNo(String roomNo) { this.roomNo = roomNo; }
        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }
        public String getPatientMrn() { return patientMrn; }
        public void setPatientMrn(String patientMrn) { this.patientMrn = patientMrn; }
        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }
        public String getPatientPhone() { return patientPhone; }
        public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }
        public Integer getPatientAge() { return patientAge; }
        public void setPatientAge(Integer patientAge) { this.patientAge = patientAge; }
        public String getPatientGender() { return patientGender; }
        public void setPatientGender(String patientGender) { this.patientGender = patientGender; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getTriagePriority() { return triagePriority; }
        public void setTriagePriority(String triagePriority) { this.triagePriority = triagePriority; }
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
        public VitalsDto getVitals() { return vitals; }
        public void setVitals(VitalsDto vitals) { this.vitals = vitals; }
    }

    public static class VitalsDto {
        private String id;
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
        private String triagePriority;

        public VitalsDto() {}

        public VitalsDto(String id, Integer systolicBp, Integer diastolicBp, Integer heartRate, Integer respiratoryRate, BigDecimal temperature, Integer spo2, BigDecimal weightKg, BigDecimal heightCm, BigDecimal bmi, Integer bloodGlucose, String triagePriority) {
            this.id = id;
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
            this.triagePriority = triagePriority;
        }

        public static VitalsDtoBuilder builder() { return new VitalsDtoBuilder(); }
        public static class VitalsDtoBuilder {
            private String id;
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
            private String triagePriority;

            public VitalsDtoBuilder id(String id) { this.id = id; return this; }
            public VitalsDtoBuilder systolicBp(Integer systolicBp) { this.systolicBp = systolicBp; return this; }
            public VitalsDtoBuilder diastolicBp(Integer diastolicBp) { this.diastolicBp = diastolicBp; return this; }
            public VitalsDtoBuilder heartRate(Integer heartRate) { this.heartRate = heartRate; return this; }
            public VitalsDtoBuilder respiratoryRate(Integer respiratoryRate) { this.respiratoryRate = respiratoryRate; return this; }
            public VitalsDtoBuilder temperature(BigDecimal temperature) { this.temperature = temperature; return this; }
            public VitalsDtoBuilder spo2(Integer spo2) { this.spo2 = spo2; return this; }
            public VitalsDtoBuilder weightKg(BigDecimal weightKg) { this.weightKg = weightKg; return this; }
            public VitalsDtoBuilder heightCm(BigDecimal heightCm) { this.heightCm = heightCm; return this; }
            public VitalsDtoBuilder bmi(BigDecimal bmi) { this.bmi = bmi; return this; }
            public VitalsDtoBuilder bloodGlucose(Integer bloodGlucose) { this.bloodGlucose = bloodGlucose; return this; }
            public VitalsDtoBuilder triagePriority(String triagePriority) { this.triagePriority = triagePriority; return this; }

            public VitalsDto build() {
                return new VitalsDto(id, systolicBp, diastolicBp, heartRate, respiratoryRate, temperature, spo2, weightKg, heightCm, bmi, bloodGlucose, triagePriority);
            }
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
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
        public String getTriagePriority() { return triagePriority; }
        public void setTriagePriority(String triagePriority) { this.triagePriority = triagePriority; }
    }

    public static class QueueDisplaySummary {
        private String departmentId;
        private String departmentName;
        private String color;
        private String icon;
        private String currentToken;
        private String nextToken;
        private String doctorName;
        private String roomNo;
        private Integer waitingCount;
        private List<TokenResponseDto> tokens;

        public QueueDisplaySummary() {}

        public QueueDisplaySummary(String departmentId, String departmentName, String color, String icon, String currentToken, String nextToken, String doctorName, String roomNo, Integer waitingCount, List<TokenResponseDto> tokens) {
            this.departmentId = departmentId;
            this.departmentName = departmentName;
            this.color = color;
            this.icon = icon;
            this.currentToken = currentToken;
            this.nextToken = nextToken;
            this.doctorName = doctorName;
            this.roomNo = roomNo;
            this.waitingCount = waitingCount;
            this.tokens = tokens;
        }

        public static QueueDisplaySummaryBuilder builder() { return new QueueDisplaySummaryBuilder(); }
        public static class QueueDisplaySummaryBuilder {
            private String departmentId;
            private String departmentName;
            private String color;
            private String icon;
            private String currentToken;
            private String nextToken;
            private String doctorName;
            private String roomNo;
            private Integer waitingCount;
            private List<TokenResponseDto> tokens;

            public QueueDisplaySummaryBuilder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
            public QueueDisplaySummaryBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
            public QueueDisplaySummaryBuilder color(String color) { this.color = color; return this; }
            public QueueDisplaySummaryBuilder icon(String icon) { this.icon = icon; return this; }
            public QueueDisplaySummaryBuilder currentToken(String currentToken) { this.currentToken = currentToken; return this; }
            public QueueDisplaySummaryBuilder nextToken(String nextToken) { this.nextToken = nextToken; return this; }
            public QueueDisplaySummaryBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
            public QueueDisplaySummaryBuilder roomNo(String roomNo) { this.roomNo = roomNo; return this; }
            public QueueDisplaySummaryBuilder waitingCount(Integer waitingCount) { this.waitingCount = waitingCount; return this; }
            public QueueDisplaySummaryBuilder tokens(List<TokenResponseDto> tokens) { this.tokens = tokens; return this; }

            public QueueDisplaySummary build() {
                return new QueueDisplaySummary(departmentId, departmentName, color, icon, currentToken, nextToken, doctorName, roomNo, waitingCount, tokens);
            }
        }

        public String getDepartmentId() { return departmentId; }
        public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
        public String getCurrentToken() { return currentToken; }
        public void setCurrentToken(String currentToken) { this.currentToken = currentToken; }
        public String getNextToken() { return nextToken; }
        public void setNextToken(String nextToken) { this.nextToken = nextToken; }
        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
        public String getRoomNo() { return roomNo; }
        public void setRoomNo(String roomNo) { this.roomNo = roomNo; }
        public Integer getWaitingCount() { return waitingCount; }
        public void setWaitingCount(Integer waitingCount) { this.waitingCount = waitingCount; }
        public List<TokenResponseDto> getTokens() { return tokens; }
        public void setTokens(List<TokenResponseDto> tokens) { this.tokens = tokens; }
    }

    public static class TokenStatusUpdateRequest {
        private String status;
        public TokenStatusUpdateRequest() {}
        public TokenStatusUpdateRequest(String status) { this.status = status; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
