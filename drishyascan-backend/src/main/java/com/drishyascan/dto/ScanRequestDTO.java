package com.drishyascan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for website scan requests.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanRequestDTO {
    
    @NotBlank(message = "URL is required")
    @Pattern(regexp = "^(https?://)[a-zA-Z0-9\\-\\.]+\\.[a-zA-Z]{2,}(:[0-9]{1,5})?(/.*)?$", 
            message = "Please enter a valid URL (e.g., https://example.com)")
    private String url;
    
    @Size(max = 255, message = "Name must be less than 255 characters")
    private String scanName;
    
    private Boolean includeScreenshots;
    
    private Boolean deepScan;
    
    @Max(value = 5, message = "Maximum 5 pages can be scanned in the basic version")
    private Integer maxPages;
    
    private String callbackUrl;
    
    @Size(max = 500, message = "Notes must be less than 500 characters")
    private String notes;
}