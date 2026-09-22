package com.mediqueue.pro.controller;

import com.mediqueue.pro.dto.AdminDtos.AnalyticsSummaryDto;
import com.mediqueue.pro.dto.AdminDtos.DoctorManagementRequest;
import com.mediqueue.pro.dto.AdminDtos.DoctorManagementResponse;
import com.mediqueue.pro.entity.Department;
import com.mediqueue.pro.entity.Patient;
import com.mediqueue.pro.repository.DepartmentRepository;
import com.mediqueue.pro.service.AdminService;
import com.mediqueue.pro.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;
    private final PatientService patientService;
    private final DepartmentRepository departmentRepository;

    public AdminController(AdminService adminService, PatientService patientService, DepartmentRepository departmentRepository) {
        this.adminService = adminService;
        this.patientService = patientService;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsSummaryDto> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalyticsSummary());
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorManagementResponse>> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @PostMapping("/doctors")
    public ResponseEntity<DoctorManagementResponse> createDoctor(@RequestBody DoctorManagementRequest request) {
        return ResponseEntity.ok(adminService.createDoctor(request));
    }

    @PutMapping("/doctors/{doctorId}")
    public ResponseEntity<DoctorManagementResponse> updateDoctor(
            @PathVariable String doctorId,
            @RequestBody DoctorManagementRequest request) {
        return ResponseEntity.ok(adminService.updateDoctor(doctorId, request));
    }

    @DeleteMapping("/doctors/{doctorId}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String doctorId) {
        adminService.deleteDoctor(doctorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(patientService.searchPatients(search));
    }

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<Patient> getPatientById(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getPatientById(patientId));
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }
}
