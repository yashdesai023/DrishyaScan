package com.drishyascan.model.enums;

/**
 * Enum representing the possible roles a user can have in the DrishyaScan system.
 * These roles determine the level of access and permissions within the application.
 */
public enum UserRole {
    /**
     * Administrators have full access to all system features and settings
     */
    ADMIN,
    
    /**
     * Developers can manage scans, view reports, and access technical details
     */
    DEVELOPER,
    
    /**
     * Content managers can view reports and make content-related changes
     */
    CONTENT_MANAGER
}