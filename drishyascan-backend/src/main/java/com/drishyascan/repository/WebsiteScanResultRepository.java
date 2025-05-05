package com.drishyascan.repository;

import com.drishyascan.model.WebsiteScanResult;
import com.drishyascan.model.enums.ScanStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for accessing WebsiteScanResult entities from the database.
 */
@Repository
public interface WebsiteScanResultRepository extends JpaRepository<WebsiteScanResult, Long> {
    
    /**
     * Find all scan results for a specific URL.
     * 
     * @param url The URL that was scanned
     * @return List of scan results
     */
    List<WebsiteScanResult> findByUrlOrderByCreatedAtDesc(String url);
    
    /**
     * Find all scan results with a specific status.
     * 
     * @param status The scan status
     * @return List of scan results
     */
    List<WebsiteScanResult> findByStatus(ScanStatus status);
    
    /**
     * Find all scan results with a specific status, paginated.
     * 
     * @param status The scan status
     * @param pageable Pagination information
     * @return Page of scan results
     */
    Page<WebsiteScanResult> findByStatus(ScanStatus status, Pageable pageable);
    
    /**
     * Find scan results with a specific status that have been in that status for too long.
     * Useful for identifying stalled scans.
     * 
     * @param status The scan status
     * @param cutoffTime Time threshold
     * @return List of scan results
     */
    List<WebsiteScanResult> findByStatusAndStartedAtBefore(ScanStatus status, LocalDateTime cutoffTime);
    
    /**
     * Find the most recent scan result for a specific URL.
     * 
     * @param url The URL that was scanned
     * @return Optional containing the most recent scan result, if any
     */
    Optional<WebsiteScanResult> findFirstByUrlOrderByCreatedAtDesc(String url);
    
    /**
     * Search for scan results by URL or scan name.
     * 
     * @param searchTerm The search term
     * @param pageable Pagination information
     * @return Page of scan results
     */
    @Query("SELECT sr FROM WebsiteScanResult sr WHERE " +
           "LOWER(sr.url) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(sr.scanName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<WebsiteScanResult> searchByUrlOrScanName(String searchTerm, Pageable pageable);
    
    /**
     * Get the number of scans performed within a date range.
     * 
     * @param startDate Start of the date range
     * @param endDate End of the date range
     * @return Count of scans
     */
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Get the number of scans with a specific status.
     * 
     * @param status The scan status
     * @return Count of scans
     */
    long countByStatus(ScanStatus status);

    /**
     * Find scan results by URL and status, ordered by completion date.
     * 
     * @param url The URL that was scanned
     * @param status The scan status
     * @param pageable Optional pagination information
     * @return List of scan results
     */
    List<WebsiteScanResult> findByUrlAndStatusOrderByCompletedAtDesc(String url, ScanStatus status, Pageable pageable);
}