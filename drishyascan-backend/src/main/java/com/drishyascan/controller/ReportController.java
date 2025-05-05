package com.drishyascan.controller;

import com.drishyascan.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Controller for handling report generation requests.
 */
@RestController
@RequestMapping("/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "API endpoints for generating accessibility scan reports")
public class ReportController {

    private final ReportService reportService;

    /**
     * Generate a summary report for a specific scan result.
     *
     * @param scanResultId The ID of the scan result
     * @return The summary report
     */
    @GetMapping("/scan/{scanResultId}/summary")
    @Operation(
        summary = "Get scan summary report",
        description = "Generates a summary report for a specific scan result",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Report generated successfully",
                content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(responseCode = "404", description = "Scan result not found")
        }
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'DEVELOPER', 'CONTENT_MANAGER')")
    public ResponseEntity<Map<String, Object>> getScanSummaryReport(
            @Parameter(description = "ID of the scan result") @PathVariable Long scanResultId) {
        return ResponseEntity.ok(reportService.generateScanSummaryReport(scanResultId));
    }

    /**
     * Generate a trend report showing compliance scores over time for a URL.
     *
     * @param url The URL to analyze
     * @param limit Maximum number of results to include
     * @return List of compliance scores with dates
     */
    @GetMapping("/trend")
    @Operation(
        summary = "Get compliance trend report",
        description = "Generates a trend report showing compliance scores over time for a URL",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Report generated successfully",
                content = @Content(mediaType = "application/json")
            )
        }
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'DEVELOPER', 'CONTENT_MANAGER')")
    public ResponseEntity<List<Map<String, Object>>> getComplianceTrendReport(
            @Parameter(description = "URL to analyze") @RequestParam String url,
            @Parameter(description = "Maximum number of results to include") @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(reportService.generateComplianceTrendReport(url, limit));
    }

    /**
     * Generate a detailed issue report for a scan result.
     *
     * @param scanResultId The ID of the scan result
     * @return The detailed issue report
     */
    @GetMapping("/scan/{scanResultId}/issues")
    @Operation(
        summary = "Get detailed issue report",
        description = "Generates a detailed report of all issues found in a scan",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Report generated successfully",
                content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(responseCode = "404", description = "Scan result not found")
        }
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'DEVELOPER', 'CONTENT_MANAGER')")
    public ResponseEntity<Map<String, Object>> getDetailedIssueReport(
            @Parameter(description = "ID of the scan result") @PathVariable Long scanResultId) {
        return ResponseEntity.ok(reportService.generateDetailedIssueReport(scanResultId));
    }

    /**
     * Generate a comparison report between two scan results.
     *
     * @param scanResultId1 First scan result ID
     * @param scanResultId2 Second scan result ID
     * @return The comparison report
     */
    @GetMapping("/compare")
    @Operation(
        summary = "Get comparison report",
        description = "Generates a report comparing two scan results",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Report generated successfully",
                content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(responseCode = "404", description = "One or both scan results not found")
        }
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'DEVELOPER', 'CONTENT_MANAGER')")
    public ResponseEntity<Map<String, Object>> getComparisonReport(
            @Parameter(description = "ID of the first scan result") @RequestParam Long scanResultId1,
            @Parameter(description = "ID of the second scan result") @RequestParam Long scanResultId2) {
        return ResponseEntity.ok(reportService.generateComparisonReport(scanResultId1, scanResultId2));
    }

    /**
     * Generate a dashboard report with summary statistics.
     *
     * @param startDate Start date for the report period
     * @param endDate End date for the report period
     * @return The dashboard report
     */
    @GetMapping("/dashboard")
    @Operation(
        summary = "Get dashboard report",
        description = "Generates a dashboard report with summary statistics for a given period",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Report generated successfully",
                content = @Content(mediaType = "application/json")
            )
        }
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'DEVELOPER', 'CONTENT_MANAGER')")
    public ResponseEntity<Map<String, Object>> getDashboardReport(
            @Parameter(description = "Start date of the report period") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date of the report period") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(reportService.generateDashboardReport(startDate, endDate));
    }
} 