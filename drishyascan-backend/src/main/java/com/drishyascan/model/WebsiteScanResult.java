package com.drishyascan.model;

import com.drishyascan.model.enums.ScanStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing the result of a website accessibility scan.
 */
@Entity
@Table(name = "website_scan_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebsiteScanResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    @Column(name = "scan_name")
    private String scanName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(20)")
    private ScanStatus status;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "pages_scanned")
    private Integer pagesScanned;

    @Column(name = "total_elements_checked")
    private Integer totalElementsChecked;

    @Column(name = "compliance_score")
    private Double complianceScore;

    @Column(name = "include_screenshots")
    private Boolean includeScreenshots;

    @Column(name = "deep_scan")
    private Boolean deepScan;

    @Column(name = "max_pages")
    private Integer maxPages;

    @Column(name = "callback_url")
    private String callbackUrl;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @OneToMany(mappedBy = "scanResult", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Issue> issues = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = ScanStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Calculate compliance score based on the issues found.
     * 
     * @return A score between 0 and 100
     */
    public Double calculateComplianceScore() {
        if (issues == null || issues.isEmpty()) {
            return 100.0; // Perfect score if no issues
        }

        int totalIssues = issues.size();
        
        // Count issues by severity
        long highSeverityCount = issues.stream()
                .filter(issue -> issue.getSeverity() == com.drishyascan.model.enums.Severity.HIGH)
                .count();
        
        long mediumSeverityCount = issues.stream()
                .filter(issue -> issue.getSeverity() == com.drishyascan.model.enums.Severity.MEDIUM)
                .count();
        
        long lowSeverityCount = issues.stream()
                .filter(issue -> issue.getSeverity() == com.drishyascan.model.enums.Severity.LOW)
                .count();
        
        // Calculate weighted score
        // High severity issues reduce score more significantly
        double score = 100.0;
        score -= (highSeverityCount * 5.0); // Each high severity issue reduces score by 5
        score -= (mediumSeverityCount * 2.0); // Each medium severity issue reduces score by 2
        score -= (lowSeverityCount * 0.5); // Each low severity issue reduces score by 0.5
        
        return Math.max(0.0, Math.min(100.0, score)); // Ensure score is between 0 and 100
    }

    /**
     * Update the compliance score based on the current issues.
     */
    public void updateComplianceScore() {
        this.complianceScore = calculateComplianceScore();
    }
}