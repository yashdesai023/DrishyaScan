package com.drishyascan.model;

import com.drishyascan.model.enums.Severity;

import lombok.Data;

/**
 * Represents an accessibility issue found during a scan.
 * Contains details about the issue including type, description, severity, and recommendations.
 */
@Data
public class AccessibilityIssue {
    
    /**
     * Unique identifier for the issue
     */
    private String id;
    
    /**
     * Type identifier for the issue (e.g. "missing_alt_text", "skipped_heading_level")
     */
    private String type;
    
    /**
     * Human-readable description of the issue
     */
    private String description;
    
    /**
     * Severity level of the issue
     */
    private Severity severity;
    
    /**
     * The WCAG criteria that this issue violates
     */
    private String wcagCriteria;
    
    /**
     * Element or selector where the issue was found
     */
    private String element;
    
    /**
     * Recommended action to fix the issue
     */
    private String recommendation;
    
    /**
     * URL where the issue was found (optional, for multi-page scans)
     */
    private String url;
    
    /**
     * Additional context or details about the issue (optional)
     */
    private String context;
    
    /**
     * Impact on users (optional)
     */
    private String impact;
}