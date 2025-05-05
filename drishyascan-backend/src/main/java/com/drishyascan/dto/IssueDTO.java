package com.drishyascan.dto;

import com.drishyascan.model.enums.IssueType;
import com.drishyascan.model.enums.Severity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for accessibility issues.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueDTO {
    
    private Long id;
    private Long scanResultId;
    private IssueType type;
    private String description;
    private String elementSelector;
    private Severity severity;
    private String helpUrl;
    private LocalDateTime createdAt;
    
    // Additional fields that might be useful for the frontend
    private String typeName;  // String representation of the issue type
    private String severityName;  // String representation of the severity
    private String wcagCriterion;  // Related WCAG criterion (optional)
}