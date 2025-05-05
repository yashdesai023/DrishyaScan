package com.drishyascan.service;

import com.drishyascan.model.Website;
import com.drishyascan.model.WebsiteScanResult;
import com.drishyascan.model.enums.ScanStatus;
import com.drishyascan.repository.WebsiteRepository;
import com.drishyascan.repository.WebsiteScanResultRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScheduledScanService {
    private static final Logger logger = LoggerFactory.getLogger(ScheduledScanService.class);

    @Autowired
    private WebsiteRepository websiteRepository;

    @Autowired
    private WebsiteScanResultRepository scanResultRepository;

    @Autowired
    private WebsiteScanService websiteScanService;

    /**
     * Run scheduled scans every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void runScheduledScans() {
        logger.info("Starting scheduled scans at {}", LocalDateTime.now());
        
        // Get all active websites with scheduled scans
        List<Website> websites = websiteRepository.findByStatus(Website.WebsiteStatus.ACTIVE);
        
        for (Website website : websites) {
            try {
                logger.info("Running scheduled scan for website: {}", website.getUrl());
                
                // Create a new scan result
                WebsiteScanResult scanResult = new WebsiteScanResult();
                scanResult.setUrl(website.getUrl());
                scanResult.setScanName("Scheduled Scan - " + LocalDateTime.now());
                scanResult.setStatus(ScanStatus.PENDING);
                scanResult.setStartedAt(LocalDateTime.now());
                scanResult.setCreatedAt(LocalDateTime.now());
                scanResult.setDeepScan(true);
                scanResult.setIncludeScreenshots(true);
                scanResult.setMaxPages(10);
                
                // Save the scan result
                scanResult = scanResultRepository.save(scanResult);
                
                // Run the scan asynchronously
                websiteScanService.startScanAsync(scanResult.getId());
                
            } catch (Exception e) {
                logger.error("Error running scheduled scan for website {}: {}", website.getUrl(), e.getMessage(), e);
            }
        }
    }

    /**
     * Run scheduled scans at specific times (daily at midnight)
     */
    @Scheduled(cron = "0 0 0 * * ?") // Run at midnight every day
    public void runDailyScans() {
        logger.info("Starting daily scheduled scans at {}", LocalDateTime.now());
        runScheduledScans();
    }
} 