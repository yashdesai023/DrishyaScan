package com.drishyascan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.drishyascan")
@EnableJpaRepositories("com.drishyascan.repository")
@EntityScan("com.drishyascan.model")
public class DrishyascanBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(DrishyascanBackendApplication.class, args);
    }
}
