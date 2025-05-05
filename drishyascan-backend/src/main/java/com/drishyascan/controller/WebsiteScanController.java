package com.drishyascan.controller;

import com.drishyascan.dto.ScanRequestDTO;
import com.drishyascan.dto.WebsiteScanResultDto;
import com.drishyascan.model.WebsiteScanResult;
import com.drishyascan.service.WebsiteScanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for website scanning operations.
 */
@RestController
@RequestMapping("/v1/scans")
@RequiredArgsConstructor
@Tag(name = "Website Scanning", description = "API for initiating and retrieving website accessibility scans")
public class WebsiteScanController {

    private final WebsiteScanService websiteScanService;

    /**
     * Initiates a new website accessibility scan.
     *
     * @param scanRequestDTO The scan request details
     * @param userDetails The authenticated user details
     * @return The created scan result
     */
    @PostMapping
    @Operation(
        summary = "Initiate website scan",
        description = "Starts a new accessibility scan for the specified website URL",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Scan initiated successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = WebsiteScanResultDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid URL or scan parameters")
        }
    )
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<WebsiteScanResultDto> initiateWebsiteScan(
            @Valid @RequestBody ScanRequestDTO scanRequestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        WebsiteScanResultDto result = websiteScanService.initiateWebsiteScan(
                scanRequestDTO, userDetails.getUsername());
        
        return ResponseEntity.ok(result);
    }

    /**
     * Retrieves a specific scan result by its ID.
     *
     * @param scanId The ID of the scan result
     * @return The scan result
     */
    @GetMapping("/{scanId}")
    @Operation(
        summary = "Get scan result by ID",
        description = "Retrieves details of a specific website accessibility scan",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Scan result retrieved successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = WebsiteScanResultDto.class))
            ),
            @ApiResponse(responseCode = "404", description = "Scan result not found")
        }
    )
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Optional<WebsiteScanResult>> getScanResultById(
            @Parameter(description = "ID of the scan result") @PathVariable Long scanId) {
        
        return ResponseEntity.ok(websiteScanService.getScanResultById(scanId));
    }

    /**
     * Retrieves all scan results for the authenticated user.
     *
     * @param userDetails The authenticated user details
     * @return List of scan results
     */
    @GetMapping("/my-scans")
    @Operation(
        summary = "Get user's scan results",
        description = "Retrieves all website accessibility scans initiated by the authenticated user",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Scan results retrieved successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = WebsiteScanResultDto.class))
            )
        }
    )
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<WebsiteScanResultDto>> getUserScanResults(@AuthenticationPrincipal UserDetails userDetails) {
        // Assuming you have a method in your service to fetch scans by username or user ID
        // This is just a placeholder, you'll need to implement the actual logic in your service
        List<WebsiteScanResultDto> userScans = websiteScanService.getAllScanResults(null).stream().filter(scan -> scan.getScanName().contains(userDetails.getUsername())).collect(Collectors.toList());
        return ResponseEntity.ok(userScans);
    }    
}