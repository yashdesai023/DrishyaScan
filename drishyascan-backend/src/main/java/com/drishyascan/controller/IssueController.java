package com.drishyascan.controller;

import com.drishyascan.dto.IssueDTO;
import com.drishyascan.model.enums.IssueType;
import com.drishyascan.model.enums.Severity;
import com.drishyascan.service.IssueDetectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for managing accessibility issues.
 */
@RestController
@RequestMapping("/v1/issues")
@RequiredArgsConstructor
@Tag(name = "Issues", description = "API for managing accessibility issues")
public class IssueController {

    private final IssueDetectionService issueDetectionService;

    /**
     * Get all issues for a specific scan result.
     *
     * @param scanResultId The ID of the scan result
     * @return List of issues as DTOs
     */
    @GetMapping("/scan/{scanResultId}")
    @Operation(
        summary = "Get all issues for a scan result",
        description = "Retrieves all accessibility issues detected for a specific website scan",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "List of issues retrieved successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = IssueDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Scan result not found")
        }
    )
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<IssueDTO>> getIssuesForScanResult(
            @Parameter(description = "ID of the scan result") @PathVariable Long scanResultId) {
        return ResponseEntity.ok(issueDetectionService.getIssuesForScanResult(scanResultId));
    }

    /**
     * Get issues by severity for a specific scan result.
     *
     * @param scanResultId The ID of the scan result
     * @param severity The severity level to filter by
     * @return List of issues as DTOs
     */
    @GetMapping("/scan/{scanResultId}/severity/{severity}")
    @Operation(
        summary = "Get issues by severity",
        description = "Retrieves accessibility issues filtered by severity for a specific scan result",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "List of issues retrieved successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = IssueDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Scan result not found")
        }
    )
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<IssueDTO>> getIssuesBySeverity(
            @Parameter(description = "ID of the scan result") @PathVariable Long scanResultId,
            @Parameter(description = "Severity level (LOW, MEDIUM, HIGH)") @PathVariable Severity severity) {
        return ResponseEntity.ok(issueDetectionService.getIssuesBySeverity(scanResultId, severity));
    }

    /**
     * Get issues by type for a specific scan result.
     *
     * @param scanResultId The ID of the scan result
     * @param type The issue type to filter by
     * @return List of issues as DTOs
     */
    @GetMapping("/scan/{scanResultId}/type/{type}")
    @Operation(
        summary = "Get issues by type",
        description = "Retrieves accessibility issues filtered by issue type for a specific scan result",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "List of issues retrieved successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = IssueDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Scan result not found")
        }
    )
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<IssueDTO>> getIssuesByType(
            @Parameter(description = "ID of the scan result") @PathVariable Long scanResultId,
            @Parameter(description = "Issue type (e.g., CONTRAST, ALT_TEXT)") @PathVariable IssueType type) {
        return ResponseEntity.ok(issueDetectionService.getIssuesByType(scanResultId, type));
    }

    /**
     * Get counts of issues by severity for a scan result.
     *
     * @param scanResultId The ID of the scan result
     * @return Map of severity to count
     */
    @GetMapping("/scan/{scanResultId}/counts/severity")
    @Operation(
        summary = "Get issue counts by severity",
        description = "Retrieves the count of accessibility issues grouped by severity level",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Issue counts retrieved successfully",
                content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(responseCode = "404", description = "Scan result not found")
        }
    )
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<Severity, Long>> getIssueSeverityCounts(
            @Parameter(description = "ID of the scan result") @PathVariable Long scanResultId) {
        return ResponseEntity.ok(issueDetectionService.getIssueSeverityCounts(scanResultId));
    }

    /**
     * Get counts of issues by type for a scan result.
     *
     * @param scanResultId The ID of the scan result
     * @return Map of issue type to count
     */
    @GetMapping("/scan/{scanResultId}/counts/type")
    @Operation(
        summary = "Get issue counts by type",
        description = "Retrieves the count of accessibility issues grouped by issue type",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Issue counts retrieved successfully",
                content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(responseCode = "404", description = "Scan result not found")
        }
    )
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<IssueType, Long>> getIssueTypeCounts(
            @Parameter(description = "ID of the scan result") @PathVariable Long scanResultId) {
        return ResponseEntity.ok(issueDetectionService.getIssueTypeCounts(scanResultId));
    }
}