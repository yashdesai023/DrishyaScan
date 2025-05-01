// 2. Controller Package
package com.drishyascan.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Base controller that handles common API endpoints.
 */
@RestController
@RequestMapping("/")
public class BaseController {
    
    @GetMapping("/health")
    public String healthCheck() {
        return "DrishyaScan Backend Service is running!";
    }
}
