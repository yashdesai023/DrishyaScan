package com.drishyascan.model.enums;

/**
 * Enum representing different types of accessibility issues.
 */
public enum IssueType {
    CONTRAST("Contrast issues between text and background"),
    ALT_TEXT("Missing alternative text for images"),
    HEADING_STRUCTURE("Improper heading structure"),
    KEYBOARD_NAVIGATION("Element not keyboard accessible"),
    FORM_LABELS("Form controls without associated labels"),
    ARIA_ATTRIBUTES("Missing or improper ARIA attributes"),
    COLOR_ALONE("Information conveyed by color alone"),
    LINK_PURPOSE("Link purpose not clear from text"),
    TABLE_HEADERS("Table missing header cells"),
    ERROR_IDENTIFICATION("Form errors not properly identified"),
    FOCUS_VISIBLE("Focus not visible on interactive elements"),
    DOCUMENT_LANGUAGE("Missing document language"),
    TEXT_RESIZE("Text cannot be resized without loss of content"),
    AUDIO_CONTROL("Audio plays automatically without controls"),
    TEXT_SPACING("Inadequate text spacing");

    private final String description;

    IssueType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}