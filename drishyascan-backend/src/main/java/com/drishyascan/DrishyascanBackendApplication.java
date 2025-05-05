package com.drishyascan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.drishyascan")
@EnableJpaRepositories("com.drishyascan.repository")
@EntityScan("com.drishyascan.model")
@EnableScheduling
public class DrishyascanBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(DrishyascanBackendApplication.class, args);
    }
}
