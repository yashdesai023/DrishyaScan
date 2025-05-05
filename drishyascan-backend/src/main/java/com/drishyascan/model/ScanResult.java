package com.drishyascan.model;

import lombok.Data;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import com.drishyascan.model.enums.Severity;

/**
 * Represents the complete results of an accessibility scan.
 */
@Data
public class ScanResult {
    
    /**
     * Unique identifier for the scan result
     */
    private String id;
    
    /**
     * URL that was scanned
     */
    private String url;
    
    /**
     * Timestamp when the scan was performed
     */
    private long timestamp;
    
    /**
     * Whether the scan was a deep scan
     */
    private boolean deepScan;
    
    /**
     * List of all accessibility issues found
     */
    private List<AccessibilityIssue> issues;
    
    /**
     * Summary statistics of issues by severity
     */
    private Map<Severity, Integer> issuesBySeverity;
    
    /**
     * Summary statistics of issues by WCAG criteria
     */
    private Map<String, Integer> issuesByWcagCriteria;
    
    /**
     * Total number of issues found
     */
    private int totalIssues;
    
    /**
     * Calculate summary metrics based on the list of issues.
     * This method should be called after setting the issues list.
     */
    public void calculateSummaryMetrics() {
        // Calculate total issues
        this.totalIssues = issues != null ? issues.size() : 0;
        
        // Group issues by severity
        this.issuesBySeverity = new HashMap<>();
        if (issues != null) {
            for (AccessibilityIssue issue : issues) {
                Severity severity = issue.getSeverity();
                this.issuesBySeverity.put(severity, 
                    this.issuesBySeverity.getOrDefault(severity, 0) + 1);
            }
        }
        
        // Group issues by WCAG criteria
        this.issuesByWcagCriteria = new HashMap<>();
        if (issues != null) {
            for (AccessibilityIssue issue : issues) {
                String criteria = issue.getWcagCriteria();
                if (criteria != null) {
                    this.issuesByWcagCriteria.put(criteria, 
                        this.issuesByWcagCriteria.getOrDefault(criteria, 0) + 1);
                }
            }
        }
    }
    
    /**
     * Get a summary of the most critical issues.
     * @return A list of high severity issues
     */
    public List<AccessibilityIssue> getCriticalIssues() {
        if (issues == null) {
            return List.of();
        }
        
        return issues.stream()
            .filter(issue -> issue.getSeverity() == Severity.HIGH)
            .collect(Collectors.toList());
    }
    
    /**
     * Get the overall accessibility score.
     * Score ranges from 0-100, with higher scores meaning better accessibility.
     * 
     * @return An accessibility score
     */
    public int getAccessibilityScore() {
        if (issues == null || issues.isEmpty()) {
            return 100; // Perfect score if no issues
        }
        
        // Count issues by severity
        int highCount = 0;
        int mediumCount = 0;
        int lowCount = 0;
        
        for (AccessibilityIssue issue : issues) {
            switch (issue.getSeverity()) {
                case HIGH:
                    highCount++;
                    break;
                case MEDIUM:
                    mediumCount++;
                    break;
                case LOW:
                    lowCount++;
                    break;
            }
        }
        
        // Calculate weighted score
        // High issues have the highest impact, low issues have the least
        double weightedIssueCount = 
            (highCount * 5.0) + 
            (mediumCount * 2.0) + 
            (lowCount * 0.5);
        
        // Calculate score (higher is better)
        // Base score of 100, subtract based on weighted issues
        int score = 100 - (int) Math.min(100, weightedIssueCount);
        
        return Math.max(0, score); // Ensure score is not negative
    }
}