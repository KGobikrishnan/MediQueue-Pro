package com.mediqueue.pro.dto;

import java.util.List;

public class AuthDtos {

    public static class LoginRequest {
        private String email;
        private String password;
        private String pin;

        public LoginRequest() {}
        public LoginRequest(String email, String password, String pin) {
            this.email = email;
            this.password = password;
            this.pin = pin;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPin() { return pin; }
        public void setPin(String pin) { this.pin = pin; }
    }

    public static class AuthResponse {
        private String token;
        private String tokenType;
        private UserProfileDto user;

        public AuthResponse() {}
        public AuthResponse(String token, String tokenType, UserProfileDto user) {
            this.token = token;
            this.tokenType = tokenType;
            this.user = user;
        }

        public static AuthResponseBuilder builder() { return new AuthResponseBuilder(); }
        public static class AuthResponseBuilder {
            private String token;
            private String tokenType;
            private UserProfileDto user;
            public AuthResponseBuilder token(String token) { this.token = token; return this; }
            public AuthResponseBuilder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
            public AuthResponseBuilder user(UserProfileDto user) { this.user = user; return this; }
            public AuthResponse build() { return new AuthResponse(token, tokenType, user); }
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getTokenType() { return tokenType; }
        public void setTokenType(String tokenType) { this.tokenType = tokenType; }
        public UserProfileDto getUser() { return user; }
        public void setUser(UserProfileDto user) { this.user = user; }
    }

    public static class UserProfileDto {
        private String id;
        private String name;
        private String email;
        private String role;
        private String phone;
        private String title;
        private String pin;
        private String avatar;
        private String departmentId;
        private String departmentName;
        private String roomNo;
        private String activeToken;

        public UserProfileDto() {}
        public UserProfileDto(String id, String name, String email, String role, String phone, String title, String pin, String avatar, String departmentId, String departmentName, String roomNo, String activeToken) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.phone = phone;
            this.title = title;
            this.pin = pin;
            this.avatar = avatar;
            this.departmentId = departmentId;
            this.departmentName = departmentName;
            this.roomNo = roomNo;
            this.activeToken = activeToken;
        }

        public static UserProfileDtoBuilder builder() { return new UserProfileDtoBuilder(); }
        public static class UserProfileDtoBuilder {
            private String id;
            private String name;
            private String email;
            private String role;
            private String phone;
            private String title;
            private String pin;
            private String avatar;
            private String departmentId;
            private String departmentName;
            private String roomNo;
            private String activeToken;

            public UserProfileDtoBuilder id(String id) { this.id = id; return this; }
            public UserProfileDtoBuilder name(String name) { this.name = name; return this; }
            public UserProfileDtoBuilder email(String email) { this.email = email; return this; }
            public UserProfileDtoBuilder role(String role) { this.role = role; return this; }
            public UserProfileDtoBuilder phone(String phone) { this.phone = phone; return this; }
            public UserProfileDtoBuilder title(String title) { this.title = title; return this; }
            public UserProfileDtoBuilder pin(String pin) { this.pin = pin; return this; }
            public UserProfileDtoBuilder avatar(String avatar) { this.avatar = avatar; return this; }
            public UserProfileDtoBuilder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
            public UserProfileDtoBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
            public UserProfileDtoBuilder roomNo(String roomNo) { this.roomNo = roomNo; return this; }
            public UserProfileDtoBuilder activeToken(String activeToken) { this.activeToken = activeToken; return this; }

            public UserProfileDto build() {
                return new UserProfileDto(id, name, email, role, phone, title, pin, avatar, departmentId, departmentName, roomNo, activeToken);
            }
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getPin() { return pin; }
        public void setPin(String pin) { this.pin = pin; }
        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }
        public String getDepartmentId() { return departmentId; }
        public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
        public String getRoomNo() { return roomNo; }
        public void setRoomNo(String roomNo) { this.roomNo = roomNo; }
        public String getActiveToken() { return activeToken; }
        public void setActiveToken(String activeToken) { this.activeToken = activeToken; }
    }
}
