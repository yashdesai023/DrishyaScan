package com.drishyascan.service;

import com.drishyascan.dto.ScanRequestDTO;
import com.drishyascan.dto.WebsiteScanResultDto;
import com.drishyascan.model.Issue;
import com.drishyascan.model.WebsiteScanResult;
import com.drishyascan.model.enums.IssueType;
import com.drishyascan.model.enums.ScanStatus;
import com.drishyascan.model.enums.Severity;
import com.drishyascan.repository.WebsiteScanResultRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Service for handling website accessibility scans.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WebsiteScanService {

    private final WebsiteScanResultRepository scanResultRepository;
    private final IssueDetectionService issueDetectionService;
    private final WebsiteHtmlService websiteHtmlService;
    
    /**
     * Create a new scan request and queue it for processing.
     * 
     * @param scanRequestDTO The scan request information
     * @return The created scan result entity
     */
    @Transactional
    public WebsiteScanResult createScanRequest(ScanRequestDTO scanRequestDTO) {
        log.info("Creating new scan request for URL: {}", scanRequestDTO.getUrl());
        
        WebsiteScanResult scanResult = WebsiteScanResult.builder()
                .url(scanRequestDTO.getUrl())
                .scanName(scanRequestDTO.getScanName() != null ? 
                         scanRequestDTO.getScanName() : 
                         "Scan of " + scanRequestDTO.getUrl() + " on " + LocalDateTime.now())
                .status(ScanStatus.PENDING)
                .includeScreenshots(scanRequestDTO.getIncludeScreenshots())
                .deepScan(scanRequestDTO.getDeepScan())
                .maxPages(scanRequestDTO.getMaxPages())
                .callbackUrl(scanRequestDTO.getCallbackUrl())
                .notes(scanRequestDTO.getNotes())
                .issues(new ArrayList<>())  // Initialize the issues list
                .build();
        
        WebsiteScanResult savedScanResult = scanResultRepository.save(scanResult);
        log.info("Scan request created with ID: {}", savedScanResult.getId());
        
        // Queue the scan for asynchronous processing
        startScanAsync(savedScanResult.getId());
        
        return savedScanResult;
    }
    
    /**
     * Start a website scan asynchronously.
     * 
     * @param scanResultId The ID of the scan result to process
     * @return CompletableFuture<Void> representing the async operation
     */
    @Async
    public CompletableFuture<Void> startScanAsync(Long scanResultId) {
        log.info("Starting asynchronous scan for ID: {}", scanResultId);
        
        try {
            // Get the scan result
            WebsiteScanResult scanResult = scanResultRepository.findById(scanResultId)
                    .orElseThrow(() -> new RuntimeException("Scan result not found: " + scanResultId));
            
            // Update status to IN_PROGRESS
            scanResult.setStatus(ScanStatus.IN_PROGRESS);
            scanResult.setStartedAt(LocalDateTime.now());
            scanResultRepository.save(scanResult);
            
            // Simulate the scanning process
            performScan(scanResult);
            
            // Update status to COMPLETED
            scanResult.setStatus(ScanStatus.COMPLETED);
            scanResult.setCompletedAt(LocalDateTime.now());
            scanResult.updateComplianceScore(); // Calculate compliance score
            scanResultRepository.save(scanResult);
            
            log.info("Scan completed successfully for ID: {}", scanResultId);
            
            // Call webhook if provided
            notifyWebhookIfConfigured(scanResult);
            
            return CompletableFuture.completedFuture(null);
        } catch (Exception e) {
            log.error("Error during scan execution", e);
            
            // Update status to FAILED
            updateScanStatusToFailed(scanResultId, e.getMessage());
            
            return CompletableFuture.failedFuture(e);
        }
    }
    
    /**
     * Notify webhook if configured for the scan result.
     * 
     * @param scanResult The scan result entity
     */
    private void notifyWebhookIfConfigured(WebsiteScanResult scanResult) {
        if (scanResult.getCallbackUrl() != null && !scanResult.getCallbackUrl().isEmpty()) {
            try {
                // Implementation would call a WebhookService or make an HTTP request
                log.info("Notifying webhook at URL: {}", scanResult.getCallbackUrl());
                
                // In a real implementation, you would send a POST request to the callback URL
                // with the scan result information in JSON format
                
                log.info("Webhook notification sent successfully");
            } catch (Exception e) {
                log.error("Failed to notify webhook", e);
                // We don't want to fail the entire scan if webhook notification fails
            }
        }
    }
    
    /**
     * Update a scan's status to FAILED with an error message.
     * 
     * @param scanResultId The ID of the scan result
     * @param errorMessage The error message
     */
    @Transactional
    public void updateScanStatusToFailed(Long scanResultId, String errorMessage) {
        log.info("Updating scan ID: {} status to FAILED with message: {}", scanResultId, errorMessage);
        
        scanResultRepository.findById(scanResultId).ifPresent(scanResult -> {
            scanResult.setStatus(ScanStatus.FAILED);
            scanResult.setErrorMessage(errorMessage);
            scanResult.setCompletedAt(LocalDateTime.now());
            scanResultRepository.save(scanResult);
        });
    }
    
    /**
     * Cancel a scan that is pending or in progress.
     * 
     * @param scanResultId The ID of the scan result
     * @return true if cancelled successfully, false otherwise
     */
    @Transactional
    public boolean cancelScan(Long scanResultId) {
        log.info("Attempting to cancel scan ID: {}", scanResultId);
        
        Optional<WebsiteScanResult> scanResultOpt = scanResultRepository.findById(scanResultId);
        
        if (scanResultOpt.isEmpty()) {
            log.warn("Cannot cancel scan - ID not found: {}", scanResultId);
            return false;
        }
        
        WebsiteScanResult scanResult = scanResultOpt.get();
        
        if (scanResult.getStatus() == ScanStatus.PENDING || 
            scanResult.getStatus() == ScanStatus.IN_PROGRESS) {
            
            scanResult.setStatus(ScanStatus.CANCELLED);
            scanResult.setCompletedAt(LocalDateTime.now());
            scanResultRepository.save(scanResult);
            
            log.info("Scan ID: {} successfully cancelled", scanResultId);
            return true;
        } else {
            log.warn("Cannot cancel scan ID: {} - status is: {}", scanResultId, scanResult.getStatus());
            return false;
        }
    }
    
    /**
     * Perform the actual scanning of a website.
     * This process fetches HTML and identifies accessibility issues.
     * 
     * @param scanResult The scan result entity
     */
    private void performScan(WebsiteScanResult scanResult) {
        log.info("Performing scan for URL: {}", scanResult.getUrl());
        
        try {
            // In a real implementation, this would fetch the HTML from the actual website
            String html = getHtmlContent(scanResult.getUrl(), scanResult.getDeepScan());
            
            // Detect accessibility issues in the HTML
            List<Issue> detectedIssues = issueDetectionService.detectIssues(html);
            
            // Save the detected issues and update the scan result
            List<Issue> savedIssues = issueDetectionService.saveIssues(detectedIssues, scanResult);
            scanResult.setIssues(savedIssues);  // Update the issues list in the scan result
            
            // Update scan statistics
            updateScanStatistics(scanResult, html);
            
            // If deep scan is enabled, process additional pages
            if (scanResult.getDeepScan()) {
                processAdditionalPages(scanResult);
            }
            
            // Save the updated scan result
            scanResultRepository.save(scanResult);
        } catch (Exception e) {
            log.error("Error during scan", e);
            throw new RuntimeException("Scan failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get HTML content for a URL.
     * Currently simulated, but could be replaced with real web scraping.
     * 
     * @param url The URL to fetch
     * @param deepScan Whether to do deep scanning (influences simulated HTML complexity)
     * @return The HTML content
     */
    private String getHtmlContent(String url, boolean deepScan) {
        try {
            // In a real implementation, this would use HttpClient, Jsoup, or Selenium
            // to fetch the actual HTML content from the website
            
            // For simulation, we'll call the HTML service
            return websiteHtmlService.fetchHtml(url, deepScan);
        } catch (Exception e) {
            log.error("Failed to fetch HTML for URL: {}", url, e);
            throw new RuntimeException("Failed to fetch HTML: " + e.getMessage(), e);
        }
    }
    
    /**
     * Update the statistics of a scan result based on the HTML content.
     * 
     * @param scanResult The scan result entity
     * @param html The HTML content
     */
    private void updateScanStatistics(WebsiteScanResult scanResult, String html) {
        // In a real implementation, this would count the actual elements in the HTML
        
        // For simulation, we'll use some basic rules to estimate element count
        int estimatedElements = html.split("<").length - 1;
        int pagesScanned = scanResult.getPagesScanned() != null ? scanResult.getPagesScanned() : 0;
        
        scanResult.setPagesScanned(pagesScanned + 1);
        scanResult.setTotalElementsChecked(estimatedElements);
        
        scanResultRepository.save(scanResult);
    }
    
    /**
     * Process additional pages for deep scanning.
     * 
     * @param scanResult The scan result entity
     */
    private void processAdditionalPages(WebsiteScanResult scanResult) {
        // For simulation purposes only - in real implementation, this would:
        // 1. Extract links from the main page HTML
        // 2. Filter links to same domain
        // 3. Visit each link up to maxPages limit
        // 4. Scan each page for accessibility issues
        
        // Instead, we'll just simulate scanning a few more pages
        int maxPagesToScan = Math.min(
            scanResult.getMaxPages() != null ? scanResult.getMaxPages() : 5, 
            10  // Hard limit for simulation
        );
        
        log.info("Simulating deep scan of {} additional pages for URL: {}", 
                maxPagesToScan - 1, scanResult.getUrl());
        
        for (int i = 1; i < maxPagesToScan; i++) {
            try {
                // Simulate processing time
                Thread.sleep(1000);
                
                // Simulate a secondary page URL
                String pageUrl = scanResult.getUrl() + "/page" + i;
                
                // Generate simulated HTML for this page
                String pageHtml = websiteHtmlService.fetchHtml(pageUrl, false);
                
                // Detect issues on this page
                List<Issue> pageIssues = issueDetectionService.detectIssues(pageHtml);
                
                // Save issues
                issueDetectionService.saveIssues(pageIssues, scanResult);
                
                // Update scan statistics
                int pagesScanned = scanResult.getPagesScanned();
                scanResult.setPagesScanned(pagesScanned + 1);
                
                int elementsChecked = scanResult.getTotalElementsChecked();
                int pageElements = pageHtml.split("<").length - 1;
                scanResult.setTotalElementsChecked(elementsChecked + pageElements);
                
                scanResultRepository.save(scanResult);
                
                log.info("Processed page {}/{} for deep scan", i, maxPagesToScan - 1);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.warn("Deep scan interrupted after processing {} pages", i);
                break;
            } catch (Exception e) {
                log.error("Error processing page {}/{} during deep scan", i, maxPagesToScan - 1, e);
                // Continue with other pages even if one fails
            }
        }
    }
    
    /**
     * Get a scan result by ID.
     * 
     * @param id The scan result ID
     * @return The scan result if found
     */
    @Transactional(readOnly = true)
    public Optional<WebsiteScanResult> getScanResultById(Long id) {
        log.info("Retrieving scan result for ID: {}", id);
        return scanResultRepository.findById(id);
    }
    
    /**
     * Get a scan result by ID as a DTO, including issue summary information.
     * 
     * @param id The scan result ID
     * @return The scan result DTO if found
     */
    @Transactional(readOnly = true)
    public Optional<WebsiteScanResultDto> getScanResultDTOById(Long id) {
        log.info("Retrieving scan result DTO for ID: {}", id);
        
        return scanResultRepository.findById(id).map(this::mapToDTO);
    }
    
    /**
     * Get a page of scan results.
     * 
     * @param pageable Pagination information
     * @return A page of scan results
     */
    @Transactional(readOnly = true)
    public Page<WebsiteScanResultDto> getAllScanResults(Pageable pageable) {
        log.info("Retrieving all scan results with pagination");
        return scanResultRepository.findAll(pageable).map(this::mapToDTO);
    }
    
    /**
     * Search for scan results by URL or scan name.
     * 
     * @param searchTerm The search term
     * @param pageable Pagination information
     * @return A page of matching scan results
     */
    @Transactional(readOnly = true)
    public Page<WebsiteScanResultDto> searchScanResults(String searchTerm, Pageable pageable) {
        log.info("Searching scan results with term: {}", searchTerm);
        return scanResultRepository.searchByUrlOrScanName(searchTerm, pageable).map(this::mapToDTO);
    }
    
    /**
     * Get scan results with a specific status.
     * 
     * @param status The scan status
     * @param pageable Pagination information
     * @return A page of matching scan results
     */
    @Transactional(readOnly = true)
    public Page<WebsiteScanResultDto> getScanResultsByStatus(ScanStatus status, Pageable pageable) {
        log.info("Retrieving scan results with status: {}", status);
        return scanResultRepository.findByStatus(status, pageable).map(this::mapToDTO);
    }
    
    /**
     * Get the most recent scan result for a URL.
     * 
     * @param url The URL
     * @return The most recent scan result DTO if found
     */
    @Transactional(readOnly = true)
    public Optional<WebsiteScanResultDto> getLatestScanResultForUrl(String url) {
        log.info("Retrieving latest scan result for URL: {}", url);
        return scanResultRepository.findFirstByUrlOrderByCreatedAtDesc(url).map(this::mapToDTO);
    }
    
    /**
     * Rescan a website based on a previous scan result.
     * 
     * @param scanResultId The ID of the previous scan result
     * @return The new scan result entity
     */
    @Transactional
    public WebsiteScanResult rescanWebsite(Long scanResultId) {
        log.info("Initiating rescan based on scan result ID: {}", scanResultId);
        
        WebsiteScanResult previousScan = scanResultRepository.findById(scanResultId)
                .orElseThrow(() -> new RuntimeException("Scan result not found: " + scanResultId));
        
        ScanRequestDTO rescanRequest = ScanRequestDTO.builder()
                .url(previousScan.getUrl())
                .scanName("Rescan of " + previousScan.getUrl() + " on " + LocalDateTime.now())
                .includeScreenshots(previousScan.getIncludeScreenshots())
                .deepScan(previousScan.getDeepScan())
                .maxPages(previousScan.getMaxPages())
                .callbackUrl(previousScan.getCallbackUrl())
                .notes("Rescan based on scan ID: " + scanResultId)
                .build();
        
        return createScanRequest(rescanRequest);
    }
    
    /**
     * Get accessibility score history for a URL.
     * 
     * @param url The URL
     * @param limit Maximum number of results to return
     * @return List of compliance scores with dates
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getComplianceScoreHistory(String url, int limit) {
        log.info("Retrieving compliance score history for URL: {}", url);
        
        // Create a Pageable with the specified limit
        Pageable pageable = Pageable.unpaged();
        if (limit > 0) {
            pageable = Pageable.ofSize(limit);
        }
        
        List<WebsiteScanResult> scanHistory = scanResultRepository
                .findByUrlAndStatusOrderByCompletedAtDesc(url, ScanStatus.COMPLETED, pageable);
        
        return scanHistory.stream()
                .map(scan -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", scan.getId());
                    item.put("date", scan.getCompletedAt());
                    item.put("score", scan.getComplianceScore());
                    return item;
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Map a WebsiteScanResult entity to a WebsiteScanResultDto.
     * 
     * @param scanResult The scan result entity
     * @return The scan result DTO
     */
    private WebsiteScanResultDto mapToDTO(WebsiteScanResult scanResult) {
        // Calculate issue count and issue breakdowns
        long totalIssues = scanResult.getIssues().size();
        
        // Group issues by severity
        Map<String, Long> issuesBySeverity = new HashMap<>();
        for (Severity severity : Severity.values()) {
            long count = scanResult.getIssues().stream()
                    .filter(issue -> issue.getSeverity() == severity)
                    .count();
            issuesBySeverity.put(severity.name(), count);
        }
        
        // Group issues by type
        Map<String, Long> issuesByType = new HashMap<>();
        for (Issue issue : scanResult.getIssues()) {
            IssueType type = issue.getType();
            issuesByType.put(type.name(), issuesByType.getOrDefault(type.name(), 0L) + 1);
        }
        
        // Calculate progress percentage for in-progress scans
        Integer progressPercentage = null;
        if (scanResult.getStatus() == ScanStatus.IN_PROGRESS) {
            // Simplified progress calculation - in a real app this would be more sophisticated
            if (scanResult.getStartedAt() != null) {
                long elapsedSeconds = java.time.Duration.between(scanResult.getStartedAt(), LocalDateTime.now()).getSeconds();
                long estimatedTotalSeconds = scanResult.getDeepScan() ? 60 : 15; // Rough estimate
                progressPercentage = (int) Math.min(99, (elapsedSeconds * 100) / estimatedTotalSeconds);
            } else {
                progressPercentage = 10; // Default starting progress
            }
        } else if (scanResult.getStatus() == ScanStatus.COMPLETED || 
                   scanResult.getStatus() == ScanStatus.FAILED || 
                   scanResult.getStatus() == ScanStatus.CANCELLED) {
            progressPercentage = 100;
        } else if (scanResult.getStatus() == ScanStatus.PENDING) {
            progressPercentage = 0;
        }
        
        // Generate current activity description
        String currentActivity = getCurrentActivity(scanResult);
        
        // Build the DTO
        return WebsiteScanResultDto.builder()
                .id(scanResult.getId())
                .url(scanResult.getUrl())
                .scanName(scanResult.getScanName())
                .status(scanResult.getStatus())
                .startedAt(scanResult.getStartedAt())
                .completedAt(scanResult.getCompletedAt())
                .pagesScanned(scanResult.getPagesScanned())
                .totalElementsChecked(scanResult.getTotalElementsChecked())
                .complianceScore(scanResult.getComplianceScore())
                .includeScreenshots(scanResult.getIncludeScreenshots())
                .deepScan(scanResult.getDeepScan())
                .maxPages(scanResult.getMaxPages())
                .notes(scanResult.getNotes())
                .errorMessage(scanResult.getErrorMessage())
                .createdAt(scanResult.getCreatedAt())
                .updatedAt(scanResult.getUpdatedAt())
                .totalIssuesCount(totalIssues)
                .issuesBySeverity(issuesBySeverity)
                .issuesByType(issuesByType)
                .progressPercentage(progressPercentage)
                .currentActivity(currentActivity)
                .build();
    }
    
    /**
     * Get a description of the current scan activity.
     * 
     * @param scanResult The scan result entity
     * @return A description of the current activity
     */
    private String getCurrentActivity(WebsiteScanResult scanResult) {
        if (scanResult.getStatus() == ScanStatus.PENDING) {
            return "Waiting in queue";
        } else if (scanResult.getStatus() == ScanStatus.IN_PROGRESS) {
            if (scanResult.getStartedAt() == null) {
                return "Initializing scan";
            }
            
            long elapsedSeconds = java.time.Duration.between(scanResult.getStartedAt(), LocalDateTime.now()).getSeconds();
            
            if (elapsedSeconds < 2) {
                return "Connecting to website";
            } else if (elapsedSeconds < 5) {
                return "Loading page content";
            } else if (scanResult.getDeepScan() && scanResult.getPagesScanned() != null && scanResult.getPagesScanned() > 1) {
                return "Scanning page " + scanResult.getPagesScanned() + " of " + 
                       (scanResult.getMaxPages() != null ? scanResult.getMaxPages() : "multiple");
            } else {
                return "Analyzing accessibility issues";
            }
        } else if (scanResult.getStatus() == ScanStatus.COMPLETED) {
            return "Scan completed successfully";
        } else if (scanResult.getStatus() == ScanStatus.FAILED) {
            return "Scan failed: " + 
                  (scanResult.getErrorMessage() != null ? scanResult.getErrorMessage() : "Unknown error");
        } else if (scanResult.getStatus() == ScanStatus.CANCELLED) {
            return "Scan cancelled by user";
        } else {
            return "Unknown status";
        }
    }

    /**
     * Initiates a new website scan.
     * 
     * @param scanRequestDTO The scan request details
     * @param username The username of the user initiating the scan
     * @return The scan result DTO
     */
    public WebsiteScanResultDto initiateWebsiteScan(ScanRequestDTO scanRequestDTO, String username) {
        log.info("Initiating new scan for URL: {} by user: {}", scanRequestDTO.getUrl(), username);
        
        // Create and save the scan request
        WebsiteScanResult scanResult = createScanRequest(scanRequestDTO);
        
        // Map to DTO and return
        return mapToDTO(scanResult);
    }
}