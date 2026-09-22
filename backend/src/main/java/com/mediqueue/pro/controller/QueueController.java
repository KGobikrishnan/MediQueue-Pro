package com.mediqueue.pro.controller;

import com.mediqueue.pro.dto.QueueDtos.*;
import com.mediqueue.pro.enums.TokenStatus;
import com.mediqueue.pro.service.QueueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/queue")
@CrossOrigin(origins = "*")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    @PostMapping("/tokens")
    public ResponseEntity<TokenResponseDto> registerToken(@RequestBody TokenRegistrationRequest request) {
        return ResponseEntity.ok(queueService.registerWalkIn(request));
    }

    @PatchMapping("/tokens/{tokenId}/status")
    public ResponseEntity<TokenResponseDto> updateTokenStatus(
            @PathVariable String tokenId,
            @RequestBody TokenStatusUpdateRequest request) {
        TokenStatus status = TokenStatus.valueOf(request.getStatus().toUpperCase());
        return ResponseEntity.ok(queueService.updateTokenStatus(tokenId, status));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<TokenResponseDto>> getDoctorQueue(@PathVariable String doctorId) {
        return ResponseEntity.ok(queueService.getLiveQueueForDoctor(doctorId));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<TokenResponseDto>> getDepartmentQueue(@PathVariable String departmentId) {
        return ResponseEntity.ok(queueService.getLiveQueueForDepartment(departmentId));
    }

    @GetMapping("/display")
    public ResponseEntity<List<QueueDisplaySummary>> getDisplaySummaries() {
        return ResponseEntity.ok(queueService.getDisplaySummaries());
    }

    @GetMapping("/live")
    public ResponseEntity<List<QueueDisplaySummary>> getLiveDisplay() {
        return ResponseEntity.ok(queueService.getDisplaySummaries());
    }
}
