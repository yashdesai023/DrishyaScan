package com.drishyascan.exception;

public class WebsiteScanException extends RuntimeException {
    
    public WebsiteScanException(String message) {
        super(message);
    }
    
    public WebsiteScanException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static class WebsiteNotFoundException extends WebsiteScanException {
        public WebsiteNotFoundException(Long websiteId) {
            super("Website not found with ID: " + websiteId);
        }
    }
    
    public static class UnauthorizedScanException extends WebsiteScanException {
        public UnauthorizedScanException(Long websiteId) {
            super("You are not authorized to scan website with ID: " + websiteId);
        }
    }
    
    public static class ScanFailedException extends WebsiteScanException {
        public ScanFailedException(String url, String reason) {
            super("Scan failed for website " + url + ": " + reason);
        }
    }
}