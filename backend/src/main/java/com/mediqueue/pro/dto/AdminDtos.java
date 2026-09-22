package com.mediqueue.pro.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminDtos {

    public static class AnalyticsSummaryDto {
        private long totalPatientsToday;
        private long totalWaiting;
        private long totalCompleted;
        private long activeDoctors;
        private double avgWaitTimeMins;
        private double avgConsultTimeMins;
        private List<DepartmentLoadDto> departmentLoads;
        private List<HourlyFootfallDto> hourlyFootfall;

        public AnalyticsSummaryDto() {}
        public AnalyticsSummaryDto(long totalPatientsToday, long totalWaiting, long totalCompleted, long activeDoctors, double avgWaitTimeMins, double avgConsultTimeMins, List<DepartmentLoadDto> departmentLoads, List<HourlyFootfallDto> hourlyFootfall) {
            this.totalPatientsToday = totalPatientsToday;
            this.totalWaiting = totalWaiting;
            this.totalCompleted = totalCompleted;
            this.activeDoctors = activeDoctors;
            this.avgWaitTimeMins = avgWaitTimeMins;
            this.avgConsultTimeMins = avgConsultTimeMins;
            this.departmentLoads = departmentLoads;
            this.hourlyFootfall = hourlyFootfall;
        }

        public static AnalyticsSummaryDtoBuilder builder() { return new AnalyticsSummaryDtoBuilder(); }
        public static class AnalyticsSummaryDtoBuilder {
            private long totalPatientsToday;
            private long totalWaiting;
            private long totalCompleted;
            private long activeDoctors;
            private double avgWaitTimeMins;
            private double avgConsultTimeMins;
            private List<DepartmentLoadDto> departmentLoads;
            private List<HourlyFootfallDto> hourlyFootfall;

            public AnalyticsSummaryDtoBuilder totalPatientsToday(long totalPatientsToday) { this.totalPatientsToday = totalPatientsToday; return this; }
            public AnalyticsSummaryDtoBuilder totalWaiting(long totalWaiting) { this.totalWaiting = totalWaiting; return this; }
            public AnalyticsSummaryDtoBuilder totalCompleted(long totalCompleted) { this.totalCompleted = totalCompleted; return this; }
            public AnalyticsSummaryDtoBuilder activeDoctors(long activeDoctors) { this.activeDoctors = activeDoctors; return this; }
            public AnalyticsSummaryDtoBuilder avgWaitTimeMins(double avgWaitTimeMins) { this.avgWaitTimeMins = avgWaitTimeMins; return this; }
            public AnalyticsSummaryDtoBuilder avgConsultTimeMins(double avgConsultTimeMins) { this.avgConsultTimeMins = avgConsultTimeMins; return this; }
            public AnalyticsSummaryDtoBuilder departmentLoads(List<DepartmentLoadDto> departmentLoads) { this.departmentLoads = departmentLoads; return this; }
            public AnalyticsSummaryDtoBuilder hourlyFootfall(List<HourlyFootfallDto> hourlyFootfall) { this.hourlyFootfall = hourlyFootfall; return this; }

            public AnalyticsSummaryDto build() {
                return new AnalyticsSummaryDto(totalPatientsToday, totalWaiting, totalCompleted, activeDoctors, avgWaitTimeMins, avgConsultTimeMins, departmentLoads, hourlyFootfall);
            }
        }

        public long getTotalPatientsToday() { return totalPatientsToday; }
        public void setTotalPatientsToday(long totalPatientsToday) { this.totalPatientsToday = totalPatientsToday; }
        public long getTotalWaiting() { return totalWaiting; }
        public void setTotalWaiting(long totalWaiting) { this.totalWaiting = totalWaiting; }
        public long getTotalCompleted() { return totalCompleted; }
        public void setTotalCompleted(long totalCompleted) { this.totalCompleted = totalCompleted; }
        public long getActiveDoctors() { return activeDoctors; }
        public void setActiveDoctors(long activeDoctors) { this.activeDoctors = activeDoctors; }
        public double getAvgWaitTimeMins() { return avgWaitTimeMins; }
        public void setAvgWaitTimeMins(double avgWaitTimeMins) { this.avgWaitTimeMins = avgWaitTimeMins; }
        public double getAvgConsultTimeMins() { return avgConsultTimeMins; }
        public void setAvgConsultTimeMins(double avgConsultTimeMins) { this.avgConsultTimeMins = avgConsultTimeMins; }
        public List<DepartmentLoadDto> getDepartmentLoads() { return departmentLoads; }
        public void setDepartmentLoads(List<DepartmentLoadDto> departmentLoads) { this.departmentLoads = departmentLoads; }
        public List<HourlyFootfallDto> getHourlyFootfall() { return hourlyFootfall; }
        public void setHourlyFootfall(List<HourlyFootfallDto> hourlyFootfall) { this.hourlyFootfall = hourlyFootfall; }
    }

    public static class DepartmentLoadDto {
        private String departmentName;
        private long tokenCount;
        private String color;

        public DepartmentLoadDto() {}
        public DepartmentLoadDto(String departmentName, long tokenCount, String color) {
            this.departmentName = departmentName;
            this.tokenCount = tokenCount;
            this.color = color;
        }

        public static DepartmentLoadDtoBuilder builder() { return new DepartmentLoadDtoBuilder(); }
        public static class DepartmentLoadDtoBuilder {
            private String departmentName;
            private long tokenCount;
            private String color;
            public DepartmentLoadDtoBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
            public DepartmentLoadDtoBuilder tokenCount(long tokenCount) { this.tokenCount = tokenCount; return this; }
            public DepartmentLoadDtoBuilder color(String color) { this.color = color; return this; }
            public DepartmentLoadDto build() { return new DepartmentLoadDto(departmentName, tokenCount, color); }
        }

        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
        public long getTokenCount() { return tokenCount; }
        public void setTokenCount(long tokenCount) { this.tokenCount = tokenCount; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    public static class HourlyFootfallDto {
        private String hour;
        private int count;

        public HourlyFootfallDto() {}
        public HourlyFootfallDto(String hour, int count) {
            this.hour = hour;
            this.count = count;
        }

        public String getHour() { return hour; }
        public void setHour(String hour) { this.hour = hour; }
        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }
    }

    public static class DoctorManagementRequest {
        private String id;
        private String name;
        private String email;
        private String password;
        private String phone;
        private String title;
        private String departmentId;
        private String qualification;
        private Integer experienceYears;
        private String roomNo;
        private BigDecimal consultationFee;
        private String avatar;

        public DoctorManagementRequest() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDepartmentId() { return departmentId; }
        public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
        public String getQualification() { return qualification; }
        public void setQualification(String qualification) { this.qualification = qualification; }
        public Integer getExperienceYears() { return experienceYears; }
        public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
        public String getRoomNo() { return roomNo; }
        public void setRoomNo(String roomNo) { this.roomNo = roomNo; }
        public BigDecimal getConsultationFee() { return consultationFee; }
        public void setConsultationFee(BigDecimal consultationFee) { this.consultationFee = consultationFee; }
        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }
    }

    public static class DoctorManagementResponse {
        private String id;
        private String userId;
        private String name;
        private String email;
        private String phone;
        private String title;
        private String departmentId;
        private String departmentName;
        private String qualification;
        private Integer experienceYears;
        private String roomNo;
        private BigDecimal consultationFee;
        private String status;
        private String avatar;

        public DoctorManagementResponse() {}
        public DoctorManagementResponse(String id, String userId, String name, String email, String phone, String title, String departmentId, String departmentName, String qualification, Integer experienceYears, String roomNo, BigDecimal consultationFee, String status, String avatar) {
            this.id = id;
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.title = title;
            this.departmentId = departmentId;
            this.departmentName = departmentName;
            this.qualification = qualification;
            this.experienceYears = experienceYears;
            this.roomNo = roomNo;
            this.consultationFee = consultationFee;
            this.status = status;
            this.avatar = avatar;
        }

        public static DoctorManagementResponseBuilder builder() { return new DoctorManagementResponseBuilder(); }
        public static class DoctorManagementResponseBuilder {
            private String id;
            private String userId;
            private String name;
            private String email;
            private String phone;
            private String title;
            private String departmentId;
            private String departmentName;
            private String qualification;
            private Integer experienceYears;
            private String roomNo;
            private BigDecimal consultationFee;
            private String status;
            private String avatar;

            public DoctorManagementResponseBuilder id(String id) { this.id = id; return this; }
            public DoctorManagementResponseBuilder userId(String userId) { this.userId = userId; return this; }
            public DoctorManagementResponseBuilder name(String name) { this.name = name; return this; }
            public DoctorManagementResponseBuilder email(String email) { this.email = email; return this; }
            public DoctorManagementResponseBuilder phone(String phone) { this.phone = phone; return this; }
            public DoctorManagementResponseBuilder title(String title) { this.title = title; return this; }
            public DoctorManagementResponseBuilder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
            public DoctorManagementResponseBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
            public DoctorManagementResponseBuilder qualification(String qualification) { this.qualification = qualification; return this; }
            public DoctorManagementResponseBuilder experienceYears(Integer experienceYears) { this.experienceYears = experienceYears; return this; }
            public DoctorManagementResponseBuilder roomNo(String roomNo) { this.roomNo = roomNo; return this; }
            public DoctorManagementResponseBuilder consultationFee(BigDecimal consultationFee) { this.consultationFee = consultationFee; return this; }
            public DoctorManagementResponseBuilder status(String status) { this.status = status; return this; }
            public DoctorManagementResponseBuilder avatar(String avatar) { this.avatar = avatar; return this; }

            public DoctorManagementResponse build() {
                return new DoctorManagementResponse(id, userId, name, email, phone, title, departmentId, departmentName, qualification, experienceYears, roomNo, consultationFee, status, avatar);
            }
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDepartmentId() { return departmentId; }
        public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
        public String getQualification() { return qualification; }
        public void setQualification(String qualification) { this.qualification = qualification; }
        public Integer getExperienceYears() { return experienceYears; }
        public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
        public String getRoomNo() { return roomNo; }
        public void setRoomNo(String roomNo) { this.roomNo = roomNo; }
        public BigDecimal getConsultationFee() { return consultationFee; }
        public void setConsultationFee(BigDecimal consultationFee) { this.consultationFee = consultationFee; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }
    }
}
