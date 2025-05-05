package com.drishyascan.model;

import com.drishyascan.model.enums.IssueType;
import com.drishyascan.model.enums.Severity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing an accessibility issue found during a website scan.
 */
@Entity
@Table(name = "issues")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scan_result_id", nullable = false)
    private WebsiteScanResult scanResult;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueType type;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(name = "element_selector", nullable = false)
    private String elementSelector;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Column(name = "help_url", length = 500)
    private String helpUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}