package com.drishyascan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main entry point for the DrishyaScan backend application.
 * This application provides REST APIs for accessibility analysis and reporting.
 */
@SpringBootApplication
@EnableJpaAuditing
public class DrishyascanBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(DrishyascanBackendApplication.class, args);
    }
}