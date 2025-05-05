package com.drishyascan.util;

import com.drishyascan.model.enums.IssueType;

import java.util.HashMap;
import java.util.Map;

/**
 * Utility class for WCAG references and help URLs.
 */
public class WCAGReference {

    private static final Map<IssueType, String> WCAG_CRITERIA = new HashMap<>();
    private static final Map<IssueType, String> HELP_URLS = new HashMap<>();
    
    static {
        // Initialize WCAG criteria mappings
        WCAG_CRITERIA.put(IssueType.CONTRAST, "1.4.3 Contrast (Minimum)");
        WCAG_CRITERIA.put(IssueType.ALT_TEXT, "1.1.1 Non-text Content");
        WCAG_CRITERIA.put(IssueType.HEADING_STRUCTURE, "1.3.1 Info and Relationships");
        WCAG_CRITERIA.put(IssueType.KEYBOARD_NAVIGATION, "2.1.1 Keyboard");
        WCAG_CRITERIA.put(IssueType.FORM_LABELS, "3.3.2 Labels or Instructions");
        WCAG_CRITERIA.put(IssueType.ARIA_ATTRIBUTES, "4.1.2 Name, Role, Value");
        WCAG_CRITERIA.put(IssueType.COLOR_ALONE, "1.4.1 Use of Color");
        WCAG_CRITERIA.put(IssueType.LINK_PURPOSE, "2.4.4 Link Purpose (In Context)");
        WCAG_CRITERIA.put(IssueType.TABLE_HEADERS, "1.3.1 Info and Relationships");
        WCAG_CRITERIA.put(IssueType.ERROR_IDENTIFICATION, "3.3.1 Error Identification");
        WCAG_CRITERIA.put(IssueType.FOCUS_VISIBLE, "2.4.7 Focus Visible");
        WCAG_CRITERIA.put(IssueType.DOCUMENT_LANGUAGE, "3.1.1 Language of Page");
        WCAG_CRITERIA.put(IssueType.TEXT_RESIZE, "1.4.4 Resize Text");
        WCAG_CRITERIA.put(IssueType.AUDIO_CONTROL, "1.4.2 Audio Control");
        WCAG_CRITERIA.put(IssueType.TEXT_SPACING, "1.4.12 Text Spacing");
        
        // Initialize help URL mappings (WCAG quick reference URLs)
        HELP_URLS.put(IssueType.CONTRAST, "https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum");
        HELP_URLS.put(IssueType.ALT_TEXT, "https://www.w3.org/WAI/WCAG21/quickref/#non-text-content");
        HELP_URLS.put(IssueType.HEADING_STRUCTURE, "https://www.w3.org/WAI/WCAG21/quickref/#info-and-relationships");
        HELP_URLS.put(IssueType.KEYBOARD_NAVIGATION, "https://www.w3.org/WAI/WCAG21/quickref/#keyboard");
        HELP_URLS.put(IssueType.FORM_LABELS, "https://www.w3.org/WAI/WCAG21/quickref/#labels-or-instructions");
        HELP_URLS.put(IssueType.ARIA_ATTRIBUTES, "https://www.w3.org/WAI/WCAG21/quickref/#name-role-value");
        HELP_URLS.put(IssueType.COLOR_ALONE, "https://www.w3.org/WAI/WCAG21/quickref/#use-of-color");
        HELP_URLS.put(IssueType.LINK_PURPOSE, "https://www.w3.org/WAI/WCAG21/quickref/#link-purpose-in-context");
        HELP_URLS.put(IssueType.TABLE_HEADERS, "https://www.w3.org/WAI/WCAG21/quickref/#info-and-relationships");
        HELP_URLS.put(IssueType.ERROR_IDENTIFICATION, "https://www.w3.org/WAI/WCAG21/quickref/#error-identification");
        HELP_URLS.put(IssueType.FOCUS_VISIBLE, "https://www.w3.org/WAI/WCAG21/quickref/#focus-visible");
        HELP_URLS.put(IssueType.DOCUMENT_LANGUAGE, "https://www.w3.org/WAI/WCAG21/quickref/#language-of-page");
        HELP_URLS.put(IssueType.TEXT_RESIZE, "https://www.w3.org/WAI/WCAG21/quickref/#resize-text");
        HELP_URLS.put(IssueType.AUDIO_CONTROL, "https://www.w3.org/WAI/WCAG21/quickref/#audio-control");
        HELP_URLS.put(IssueType.TEXT_SPACING, "https://www.w3.org/WAI/WCAG21/quickref/#text-spacing");
    }
    
    /**
     * Get the WCAG criterion for a given issue type.
     * 
     * @param issueType The issue type
     * @return The WCAG criterion
     */
    public static String getWCAGCriterion(IssueType issueType) {
        return WCAG_CRITERIA.getOrDefault(issueType, "Unknown WCAG criterion");
    }
    
    /**
     * Get the help URL for a given issue type.
     * 
     * @param issueType The issue type
     * @return The help URL
     */
    public static String getHelpUrl(IssueType issueType) {
        return HELP_URLS.getOrDefault(issueType, "https://www.w3.org/WAI/WCAG21/quickref/");
    }
}