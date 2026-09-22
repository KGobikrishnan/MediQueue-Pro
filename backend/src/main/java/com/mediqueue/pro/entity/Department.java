package com.mediqueue.pro.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String floor;

    @Column(nullable = false, length = 50)
    private String wing;

    @Column(length = 30)
    private String color;

    @Column(length = 50)
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Department() {}

    public Department(String id, String code, String name, String floor, String wing, String color, String icon, String description, Boolean isActive, LocalDateTime createdAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.floor = floor;
        this.wing = wing;
        this.color = color;
        this.icon = icon;
        this.description = description;
        this.isActive = isActive != null ? isActive : true;
        this.createdAt = createdAt;
    }

    public static DepartmentBuilder builder() {
        return new DepartmentBuilder();
    }

    public static class DepartmentBuilder {
        private String id;
        private String code;
        private String name;
        private String floor;
        private String wing;
        private String color;
        private String icon;
        private String description;
        private Boolean isActive = true;
        private LocalDateTime createdAt;

        public DepartmentBuilder id(String id) { this.id = id; return this; }
        public DepartmentBuilder code(String code) { this.code = code; return this; }
        public DepartmentBuilder name(String name) { this.name = name; return this; }
        public DepartmentBuilder floor(String floor) { this.floor = floor; return this; }
        public DepartmentBuilder wing(String wing) { this.wing = wing; return this; }
        public DepartmentBuilder color(String color) { this.color = color; return this; }
        public DepartmentBuilder icon(String icon) { this.icon = icon; return this; }
        public DepartmentBuilder description(String description) { this.description = description; return this; }
        public DepartmentBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public DepartmentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Department build() {
            return new Department(id, code, name, floor, wing, color, icon, description, isActive, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }
    public String getWing() { return wing; }
    public void setWing(String wing) { this.wing = wing; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
