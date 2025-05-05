package com.drishyascan.model.enums;

/**
 * Enum representing different states of a website scan.
 */
public enum ScanStatus {
    PENDING("Scan request received but not yet started"),
    IN_PROGRESS("Scan is currently running"),
    COMPLETED("Scan has successfully completed"),
    FAILED("Scan failed due to an error"),
    CANCELLED("Scan was cancelled by the user");

    private final String description;

    ScanStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}