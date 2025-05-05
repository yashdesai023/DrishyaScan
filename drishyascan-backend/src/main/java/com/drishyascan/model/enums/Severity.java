package com.drishyascan.model.enums;

/**
 * Enum representing the severity levels of accessibility issues.
 */
public enum Severity {
    LOW("Minor issue that affects few users or has minimal impact"),
    MEDIUM("Moderate issue that affects some users or has notable impact"),
    HIGH("Critical issue that affects many users or has severe impact");

    private final String description;

    Severity(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}