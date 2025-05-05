package com.drishyascan.service;

import com.drishyascan.dto.IssueDTO;
import com.drishyascan.model.Issue;
import com.drishyascan.model.WebsiteScanResult;
import com.drishyascan.model.enums.IssueType;
import com.drishyascan.model.enums.Severity;
import com.drishyascan.repository.IssueRepository;
import com.drishyascan.util.WCAGReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for detecting accessibility issues in HTML content.
 * This is a simulation that generates random but realistic-looking accessibility issues.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class IssueDetectionService {

    private final IssueRepository issueRepository;
    private final Random random = new Random();
    
    private static final Map<IssueType, List<String>> ISSUE_TEMPLATES = new HashMap<>();
    
    static {
        // Initialize issue description templates
        ISSUE_TEMPLATES.put(IssueType.CONTRAST, Arrays.asList(
            "Text has insufficient contrast ratio of {1}:1 (should be at least 4.5:1)",
            "Button text has poor contrast ratio of {1}:1 against background",
            "Link text with contrast ratio of {1}:1 is difficult to read",
            "Foreground and background color contrast is only {1}:1, failing WCAG AA requirements"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.ALT_TEXT, Arrays.asList(
            "Image missing alt text",
            "Image has empty alt attribute",
            "Informative image has generic alt text 'image'",
            "Complex image missing long description",
            "Decorative image should have empty alt text, not missing attribute"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.HEADING_STRUCTURE, Arrays.asList(
            "Heading levels should only increase by one - h{1} followed by h{2}",
            "First heading on page is not h1",
            "Multiple h1 headings found on page",
            "Empty heading element",
            "Section lacks appropriate heading structure"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.KEYBOARD_NAVIGATION, Arrays.asList(
            "Custom control is not keyboard accessible",
            "Keyboard focus trap in dialog",
            "Element with onClick event not keyboard focusable",
            "Dropdown menu not navigable by keyboard",
            "Interactive element has negative tabindex preventing focus"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.FORM_LABELS, Arrays.asList(
            "Form input has no associated label",
            "Form field uses placeholder as label",
            "Select element missing label",
            "Required field not indicated to screen readers",
            "Label not programmatically associated with input element"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.ARIA_ATTRIBUTES, Arrays.asList(
            "ARIA attribute used on non-interactive element",
            "Element with aria-hidden=\"true\" contains focusable elements",
            "Missing required ARIA attributes for this role",
            "Invalid ARIA attribute value",
            "ARIA role doesn't match the element's native semantics"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.COLOR_ALONE, Arrays.asList(
            "Error state indicated by color alone",
            "Required fields indicated only by color",
            "Chart data distinguished only by color",
            "Form validation feedback relies on color only",
            "Status information conveyed only through color change"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.LINK_PURPOSE, Arrays.asList(
            "Link text 'click here' does not describe purpose",
            "Multiple links with same text but different destinations",
            "Link contains no text content",
            "Link text does not describe target",
            "Generic link text 'read more' lacks context"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.TABLE_HEADERS, Arrays.asList(
            "Data table missing header cells",
            "Table headers not properly associated with cells",
            "Complex table missing proper row/column headers",
            "Missing table caption for complex data",
            "Table cells not properly associated with headers using headers attribute"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.ERROR_IDENTIFICATION, Arrays.asList(
            "Form error message not programmatically associated with field",
            "Error message not announced to screen readers",
            "Form validation error does not describe how to fix the issue",
            "Error state not conveyed to assistive technology",
            "Form submission fails silently without error notification"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.FOCUS_VISIBLE, Arrays.asList(
            "Element focus indicator not visible",
            "Custom button removes focus outline",
            "Focus indicator too subtle to perceive",
            "Interactive element has no visible focus state",
            "Focus styles removed with outline: none without alternative"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.DOCUMENT_LANGUAGE, Arrays.asList(
            "HTML lang attribute missing",
            "Incorrect language code in lang attribute",
            "Content in different language not marked with lang attribute",
            "Lang attribute value does not match page content",
            "Lang attribute uses country code only without language specification"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.TEXT_RESIZE, Arrays.asList(
            "Text disappears when zoomed to 200%",
            "Content overlaps when text is resized",
            "Fixed size text cannot be enlarged",
            "Horizontal scrolling required when text is resized",
            "Absolute units used for font sizes instead of relative units"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.AUDIO_CONTROL, Arrays.asList(
            "Audio starts automatically without controls to stop it",
            "Video with audio lacks pause/mute controls",
            "Background audio cannot be turned off",
            "Audio longer than 3 seconds plays automatically",
            "Media controls are not keyboard accessible"
        ));
        
        ISSUE_TEMPLATES.put(IssueType.TEXT_SPACING, Arrays.asList(
            "Line height less than 1.5 times font size",
            "Paragraph spacing less than 2 times font size",
            "Letter spacing less than 0.12 times font size",
            "Word spacing less than 0.16 times font size",
            "Text container restricts spacing adjustments with !important rules"
        ));
    }
    
    /**
     * Generates a random CSS selector for demo purposes.
     * Creates realistic selectors that might be found in a web page.
     * 
     * @return A random CSS selector
     */
    private String generateRandomSelector() {
        String[] elements = {"div", "span", "a", "button", "img", "input", "form", "h1", "h2", "h3", "p", "ul", "li", "table", "nav", "section", "article", "main", "aside", "header", "footer"};
        String[] attributes = {"id", "class", "role", "data-testid", "aria-label", "title", "name"};
        String[] values = {"header", "main", "footer", "navigation", "content", "sidebar", "banner", "user", "menu", "button", "card", "container", "wrapper", "dialog", "modal", "list", "item"};
        String[] ariaRoles = {"button", "checkbox", "dialog", "menu", "menuitem", "tab", "tabpanel", "tooltip", "navigation", "banner", "main", "form"};
        
        StringBuilder selector = new StringBuilder();
        
        // Choose selector complexity
        int selectorType = random.nextInt(10);
        
        if (selectorType < 3) {
            // Simple element selector (30% chance)
            selector.append(elements[random.nextInt(elements.length)]);
        } else if (selectorType < 6) {
            // Element with ID (30% chance)
            selector.append(elements[random.nextInt(elements.length)])
                   .append("#")
                   .append(values[random.nextInt(values.length)])
                   .append("-")
                   .append(UUID.randomUUID().toString().substring(0, 4));
        } else if (selectorType < 8) {
            // Element with class (20% chance)
            selector.append(elements[random.nextInt(elements.length)])
                   .append(".")
                   .append(values[random.nextInt(values.length)]);
            
            // 50% chance for multiple classes
            if (random.nextBoolean()) {
                selector.append(".")
                       .append(values[random.nextInt(values.length)]);
            }
        } else {
            // Element with attribute (20% chance)
            selector.append(elements[random.nextInt(elements.length)])
                   .append("[");
            
            // Choose attribute type
            int attrType = random.nextInt(5);
            if (attrType == 0) {
                selector.append(attributes[random.nextInt(attributes.length)])
                       .append("=\"")
                       .append(values[random.nextInt(values.length)])
                       .append("-")
                       .append(UUID.randomUUID().toString().substring(0, 4))
                       .append("\"]");
            } else if (attrType == 1) {
                // ARIA role
                selector.append("role=\"")
                       .append(ariaRoles[random.nextInt(ariaRoles.length)])
                       .append("\"]");
            } else if (attrType == 2) {
                // aria-* attribute
                selector.append("aria-")
                       .append(random.nextBoolean() ? "label" : "describedby")
                       .append("=\"")
                       .append(values[random.nextInt(values.length)])
                       .append("\"]");
            } else {
                // data-* attribute
                selector.append("data-")
                       .append(values[random.nextInt(values.length)])
                       .append("=\"")
                       .append(UUID.randomUUID().toString().substring(0, 6))
                       .append("\"]");
            }
        }
        
        // 30% chance to add a child selector
        if (random.nextInt(10) < 3) {
            selector.append(" > ")
                   .append(elements[random.nextInt(elements.length)]);
            
            // 50% chance to add another attribute to the child
            if (random.nextBoolean()) {
                if (random.nextBoolean()) {
                    // Add a class
                    selector.append(".")
                           .append(values[random.nextInt(values.length)]);
                } else {
                    // Add an id
                    selector.append("#")
                           .append(values[random.nextInt(values.length)])
                           .append("-")
                           .append(UUID.randomUUID().toString().substring(0, 4));
                }
            }
        }
        
        // 20% chance to add :nth-child
        if (random.nextInt(10) < 2) {
            selector.append(":nth-child(").append(random.nextInt(5) + 1).append(")");
        }
        
        // 10% chance to add a pseudo-class
        if (random.nextInt(10) < 1) {
            String[] pseudoClasses = {":hover", ":focus", ":active", ":first-child", ":last-child"};
            selector.append(pseudoClasses[random.nextInt(pseudoClasses.length)]);
        }
        
        return selector.toString();
    }
    
    /**
     * Get a random description for a specific issue type.
     * Substitutes placeholders in templates with realistic values.
     * 
     * @param issueType The issue type
     * @return A random description with substituted values
     */
    private String getRandomDescription(IssueType issueType) {
        List<String> templates = ISSUE_TEMPLATES.getOrDefault(issueType, Collections.singletonList("Accessibility issue detected"));
        String template = templates.get(random.nextInt(templates.size()));
        
        // Replace placeholders with random values
        if (template.contains("{1}")) {
            if (issueType == IssueType.CONTRAST) {
                // For contrast issues, use realistic contrast ratio values
                double ratio = 1.0 + (random.nextDouble() * 3.5); // Between 1.0 and 4.5
                template = template.replace("{1}", String.format("%.1f", ratio));
            } else if (issueType == IssueType.HEADING_STRUCTURE) {
                // For heading issues, use realistic heading levels
                int level1 = random.nextInt(3) + 1; // h1, h2, or h3
                int level2 = level1 + 2 + random.nextInt(3); // Skip by 2-4 levels
                template = template.replace("{1}", String.valueOf(level1)).replace("{2}", String.valueOf(level2));
            } else {
                template = template.replace("{1}", String.valueOf(random.nextInt(5) + 1));
            }
        }
        
        return template;
    }
    
    /**
     * Assigns a severity to an issue based on its type and random factors.
     * Some issue types are more likely to have higher severity.
     * 
     * @param issueType The issue type
     * @return An appropriate severity level
     */
    private Severity assignSeverity(IssueType issueType) {
        // Define issue types that tend to be more severe
        Set<IssueType> highPriorityIssues = Set.of(
            IssueType.KEYBOARD_NAVIGATION,
            IssueType.ALT_TEXT,
            IssueType.FORM_LABELS,
            IssueType.ERROR_IDENTIFICATION
        );
        
        // Define issue types that tend to be less severe
        Set<IssueType> lowPriorityIssues = Set.of(
            IssueType.TEXT_SPACING,
            IssueType.FOCUS_VISIBLE,
            IssueType.LINK_PURPOSE
        );
        
        int randomFactor = random.nextInt(10);
        
        if (highPriorityIssues.contains(issueType)) {
            if (randomFactor < 7) return Severity.HIGH;
            if (randomFactor < 9) return Severity.MEDIUM;
            return Severity.LOW;
        } else if (lowPriorityIssues.contains(issueType)) {
            if (randomFactor < 7) return Severity.LOW;
            if (randomFactor < 9) return Severity.MEDIUM;
            return Severity.HIGH;
        } else {
            // For other issue types, distribute evenly
            if (randomFactor < 4) return Severity.LOW;
            if (randomFactor < 8) return Severity.MEDIUM;
            return Severity.HIGH;
        }
    }
    
    /**
     * Generate random accessibility issues for a given HTML content.
     * Note: Currently this is a simulation and doesn't actually analyze the HTML.
     * 
     * @param html The HTML content to analyze
     * @return List of detected issues
     */
    public List<Issue> detectIssues(String html) {
        log.info("Detecting accessibility issues in HTML content...");
        
        // Determine the number of issues to generate (0-10)
        int issueCount = random.nextInt(11);
        log.info("Generating {} simulated accessibility issues", issueCount);
        
        List<Issue> issues = new ArrayList<>();
        
        // Keep track of used types to avoid duplicates (for more realistic results)
        Set<IssueType> usedTypes = new HashSet<>();
        
        // Generate the specified number of random issues
        for (int i = 0; i < issueCount; i++) {
            IssueType[] issueTypes = IssueType.values();
            
            // Try to avoid duplicate issue types unless we've used them all
            IssueType randomType;
            if (usedTypes.size() < issueTypes.length) {
                do {
                    randomType = issueTypes[random.nextInt(issueTypes.length)];
                } while (usedTypes.contains(randomType));
            } else {
                randomType = issueTypes[random.nextInt(issueTypes.length)];
            }
            
            usedTypes.add(randomType);
            
            // Assign a severity that makes sense for this issue type
            Severity randomSeverity = assignSeverity(randomType);
            
            // Create a new issue (without saving it yet)
            Issue issue = Issue.builder()
                    .type(randomType)
                    .description(getRandomDescription(randomType))
                    .elementSelector(generateRandomSelector())
                    .severity(randomSeverity)
                    .helpUrl(WCAGReference.getHelpUrl(randomType))
                    .build();
            
            issues.add(issue);
        }
        
        return issues;
    }
    
    /**
     * Links the detected issues to a scan result and saves them to the database.
     * 
     * @param issues The list of detected issues
     * @param scanResult The scan result to link the issues to
     * @return The list of saved issues
     */
    @Transactional
    public List<Issue> saveIssues(List<Issue> issues, WebsiteScanResult scanResult) {
        log.info("Saving {} issues for scan result ID: {}", issues.size(), scanResult.getId());
        
        issues.forEach(issue -> issue.setScanResult(scanResult));
        return issueRepository.saveAll(issues);
    }
    
    /**
     * Retrieves all issues for a specific scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @return List of issues as DTOs
     */
    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesForScanResult(Long scanResultId) {
        log.info("Retrieving issues for scan result ID: {}", scanResultId);
        
        List<Issue> issues = issueRepository.findByScanResultId(scanResultId);
        return issues.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Retrieves issues filtered by severity for a specific scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @param severity The severity level to filter by
     * @return List of issues as DTOs
     */
    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesBySeverity(Long scanResultId, Severity severity) {
        log.info("Retrieving {} severity issues for scan result ID: {}", severity, scanResultId);
        
        List<Issue> issues = issueRepository.findByScanResultIdAndSeverity(scanResultId, severity);
        return issues.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Retrieves issues filtered by type for a specific scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @param type The issue type to filter by
     * @return List of issues as DTOs
     */
    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesByType(Long scanResultId, IssueType type) {
        log.info("Retrieving {} type issues for scan result ID: {}", type, scanResultId);
        
        List<Issue> issues = issueRepository.findByScanResultIdAndType(scanResultId, type);
        return issues.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Gets the count of issues by severity for a scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @return Map of severity to count
     */
    @Transactional(readOnly = true)
    public Map<Severity, Long> getIssueSeverityCounts(Long scanResultId) {
        log.info("Getting issue severity counts for scan result ID: {}", scanResultId);
        
        List<Map<String, Object>> results = issueRepository.countBySeverityForScanResult(scanResultId);
        Map<Severity, Long> countMap = new HashMap<>();
        
        for (Map<String, Object> result : results) {
            Severity severity = (Severity) result.get("severity");
            Long count = ((Number) result.get("count")).longValue();
            countMap.put(severity, count);
        }
        
        // Ensure all severities are present in the map
        for (Severity severity : Severity.values()) {
            countMap.putIfAbsent(severity, 0L);
        }
        
        return countMap;
    }
    
    /**
     * Gets the count of issues by type for a scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @return Map of issue type to count
     */
    @Transactional(readOnly = true)
    public Map<IssueType, Long> getIssueTypeCounts(Long scanResultId) {
        log.info("Getting issue type counts for scan result ID: {}", scanResultId);
        
        List<Map<String, Object>> results = issueRepository.countByTypeForScanResult(scanResultId);
        Map<IssueType, Long> countMap = new HashMap<>();
        
        for (Map<String, Object> result : results) {
            IssueType type = (IssueType) result.get("type");
            Long count = ((Number) result.get("count")).longValue();
            countMap.put(type, count);
        }
        
        return countMap;
    }
    
    /**
     * Maps an Issue entity to an IssueDTO.
     * Adds additional fields that might be useful for the frontend.
     * 
     * @param issue The issue entity
     * @return The issue DTO
     */
    public IssueDTO mapToDTO(Issue issue) {
        return IssueDTO.builder()
                .id(issue.getId())
                .scanResultId(issue.getScanResult().getId())
                .type(issue.getType())
                .description(issue.getDescription())
                .elementSelector(issue.getElementSelector())
                .severity(issue.getSeverity())
                .helpUrl(issue.getHelpUrl())
                .createdAt(issue.getCreatedAt())
                .typeName(issue.getType().name())
                .severityName(issue.getSeverity().name())
                .wcagCriterion(WCAGReference.getWCAGCriterion(issue.getType()))
                .build();
    }
}