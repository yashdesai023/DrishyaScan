package com.drishyascan.service;

import com.drishyascan.model.WebsiteScanResult;
import com.drishyascan.model.enums.ScanStatus;
import com.drishyascan.model.enums.Severity;
import com.drishyascan.repository.WebsiteScanResultRepository;
import com.drishyascan.service.IssueDetectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for generating various types of reports for accessibility scans.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final WebsiteScanResultRepository scanResultRepository;
    private final IssueDetectionService issueDetectionService;

    /**
     * Generate a summary report for a specific scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @return Map containing the report data
     */
    @Transactional(readOnly = true)
    public Map<String, Object> generateScanSummaryReport(Long scanResultId) {
        log.info("Generating summary report for scan result ID: {}", scanResultId);
        
        WebsiteScanResult scanResult = scanResultRepository.findById(scanResultId)
                .orElseThrow(() -> new RuntimeException("Scan result not found: " + scanResultId));
        
        Map<String, Object> report = new HashMap<>();
        
        // Basic scan information
        report.put("scanId", scanResult.getId());
        report.put("url", scanResult.getUrl());
        report.put("scanName", scanResult.getScanName());
        report.put("status", scanResult.getStatus());
        report.put("startedAt", scanResult.getStartedAt());
        report.put("completedAt", scanResult.getCompletedAt());
        report.put("complianceScore", scanResult.getComplianceScore());
        
        // Issue statistics
        report.put("totalIssues", scanResult.getIssues().size());
        report.put("issuesBySeverity", issueDetectionService.getIssueSeverityCounts(scanResultId));
        report.put("issuesByType", issueDetectionService.getIssueTypeCounts(scanResultId));
        
        // Scan details
        report.put("pagesScanned", scanResult.getPagesScanned());
        report.put("totalElementsChecked", scanResult.getTotalElementsChecked());
        report.put("deepScan", scanResult.getDeepScan());
        report.put("maxPages", scanResult.getMaxPages());
        
        return report;
    }

    /**
     * Generate a trend report showing compliance scores over time for a URL.
     * 
     * @param url The URL to analyze
     * @param limit Maximum number of results to include
     * @return List of compliance scores with dates
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> generateComplianceTrendReport(String url, int limit) {
        log.info("Generating compliance trend report for URL: {}", url);
        return scanResultRepository.findByUrlAndStatusOrderByCompletedAtDesc(url, ScanStatus.COMPLETED, Pageable.ofSize(limit))
                .stream()
                .map(scan -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("date", scan.getCompletedAt());
                    data.put("score", scan.getComplianceScore());
                    data.put("totalIssues", scan.getIssues().size());
                    return data;
                })
                .collect(Collectors.toList());
    }

    /**
     * Generate a detailed issue report for a scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @return Map containing detailed issue information
     */
    @Transactional(readOnly = true)
    public Map<String, Object> generateDetailedIssueReport(Long scanResultId) {
        log.info("Generating detailed issue report for scan result ID: {}", scanResultId);
        
        WebsiteScanResult scanResult = scanResultRepository.findById(scanResultId)
                .orElseThrow(() -> new RuntimeException("Scan result not found: " + scanResultId));
        
        Map<String, Object> report = new HashMap<>();
        
        // Basic scan information
        report.put("scanId", scanResult.getId());
        report.put("url", scanResult.getUrl());
        report.put("scanName", scanResult.getScanName());
        report.put("completedAt", scanResult.getCompletedAt());
        
        // Detailed issue information
        report.put("issues", issueDetectionService.getIssuesForScanResult(scanResultId));
        
        // Issue statistics by severity
        report.put("issuesBySeverity", issueDetectionService.getIssueSeverityCounts(scanResultId));
        
        // Issue statistics by type
        report.put("issuesByType", issueDetectionService.getIssueTypeCounts(scanResultId));
        
        return report;
    }

    /**
     * Generate a comparison report between two scan results.
     * 
     * @param scanResultId1 First scan result ID
     * @param scanResultId2 Second scan result ID
     * @return Map containing comparison data
     */
    @Transactional(readOnly = true)
    public Map<String, Object> generateComparisonReport(Long scanResultId1, Long scanResultId2) {
        log.info("Generating comparison report between scan results {} and {}", scanResultId1, scanResultId2);
        
        WebsiteScanResult scan1 = scanResultRepository.findById(scanResultId1)
                .orElseThrow(() -> new RuntimeException("Scan result not found: " + scanResultId1));
        WebsiteScanResult scan2 = scanResultRepository.findById(scanResultId2)
                .orElseThrow(() -> new RuntimeException("Scan result not found: " + scanResultId2));
        
        Map<String, Object> report = new HashMap<>();
        
        // Basic comparison
        report.put("scan1", generateScanSummaryReport(scanResultId1));
        report.put("scan2", generateScanSummaryReport(scanResultId2));
        
        // Calculate differences
        Map<String, Object> differences = new HashMap<>();
        differences.put("complianceScore", scan2.getComplianceScore() - scan1.getComplianceScore());
        differences.put("totalIssues", scan2.getIssues().size() - scan1.getIssues().size());
        
        // Compare issue counts by severity
        Map<String, Object> severityDifferences = new HashMap<>();
        Map<Severity, Long> severityCounts1 = issueDetectionService.getIssueSeverityCounts(scanResultId1);
        Map<Severity, Long> severityCounts2 = issueDetectionService.getIssueSeverityCounts(scanResultId2);
        
        for (Severity severity : Severity.values()) {
            long count1 = severityCounts1.getOrDefault(severity, 0L);
            long count2 = severityCounts2.getOrDefault(severity, 0L);
            severityDifferences.put(severity.name(), count2 - count1);
        }
        
        differences.put("issuesBySeverity", severityDifferences);
        report.put("differences", differences);
        
        return report;
    }

    /**
     * Generate a dashboard report with summary statistics.
     * 
     * @param startDate Start date for the report period
     * @param endDate End date for the report period
     * @return Map containing dashboard statistics
     */
    @Transactional(readOnly = true)
    public Map<String, Object> generateDashboardReport(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Generating dashboard report for period {} to {}", startDate, endDate);
        
        Map<String, Object> report = new HashMap<>();
        
        // Total scans in period
        long totalScans = scanResultRepository.countByCreatedAtBetween(startDate, endDate);
        report.put("totalScans", totalScans);
        
        // Scans by status
        Map<String, Long> scansByStatus = new HashMap<>();
        for (ScanStatus status : ScanStatus.values()) {
            scansByStatus.put(status.name(), scanResultRepository.countByStatus(status));
        }
        report.put("scansByStatus", scansByStatus);
        
        // Average compliance score
        List<WebsiteScanResult> completedScans = scanResultRepository.findByStatus(ScanStatus.COMPLETED);
        double averageScore = completedScans.stream()
                .mapToDouble(WebsiteScanResult::getComplianceScore)
                .average()
                .orElse(0.0);
        report.put("averageComplianceScore", averageScore);
        
        // Total issues found
        long totalIssues = completedScans.stream()
                .mapToLong(scan -> scan.getIssues().size())
                .sum();
        report.put("totalIssues", totalIssues);
        
        return report;
    }
} 