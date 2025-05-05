package com.drishyascan.dto;

import com.drishyascan.model.enums.ScanStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Data Transfer Object for website scan results.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebsiteScanResultDto {
    
    private Long id;
    private String url;
    private String scanName;
    private ScanStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer pagesScanned;
    private Integer totalElementsChecked;
    private Double complianceScore;
    private Boolean includeScreenshots;
    private Boolean deepScan;
    private Integer maxPages;
    private String notes;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Summary information
    private Long totalIssuesCount;
    private Map<String, Long> issuesBySeverity;
    private Map<String, Long> issuesByType;
    
    // Detailed issue information (optional - can be loaded separately for performance)
    private List<IssueDTO> issues;
    
    // Progress information for long-running scans
    private Integer progressPercentage;
    private String currentActivity;
}