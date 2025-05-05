package com.drishyascan.repository;

import com.drishyascan.model.Issue;
import com.drishyascan.model.WebsiteScanResult;
import com.drishyascan.model.enums.IssueType;
import com.drishyascan.model.enums.Severity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Repository for accessing Issue entities from the database.
 */
@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    
    /**
     * Find all issues for a specific scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @return List of issues
     */
    List<Issue> findByScanResultId(Long scanResultId);
    
    /**
     * Find all issues for a specific scan result.
     * 
     * @param scanResult The scan result entity
     * @return List of issues
     */
    List<Issue> findByScanResult(WebsiteScanResult scanResult);
    
    /**
     * Count issues by severity for a specific scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @return Count of issues by severity
     */
    @Query("SELECT i.severity as severity, COUNT(i) as count FROM Issue i WHERE i.scanResult.id = :scanResultId GROUP BY i.severity")
    List<Map<String, Object>> countBySeverityForScanResult(Long scanResultId);
    
    /**
     * Count issues by type for a specific scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @return Count of issues by type
     */
    @Query("SELECT i.type as type, COUNT(i) as count FROM Issue i WHERE i.scanResult.id = :scanResultId GROUP BY i.type")
    List<Map<String, Object>> countByTypeForScanResult(Long scanResultId);
    
    /**
     * Find issues by severity for a specific scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @param severity The severity level
     * @return List of issues
     */
    List<Issue> findByScanResultIdAndSeverity(Long scanResultId, Severity severity);
    
    /**
     * Find issues by type for a specific scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @param type The issue type
     * @return List of issues
     */
    List<Issue> findByScanResultIdAndType(Long scanResultId, IssueType type);
    
    /**
     * Count the number of issues for a specific scan result.
     * 
     * @param scanResultId The ID of the scan result
     * @return The count of issues
     */
    long countByScanResultId(Long scanResultId);
}