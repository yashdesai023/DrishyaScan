-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP,
    profile_image_url VARCHAR(512)
);

-- Create website_scan_results table
CREATE TABLE IF NOT EXISTS website_scan_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    scan_name VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    compliance_score DOUBLE,
    pages_scanned INTEGER,
    total_elements_checked INTEGER,
    deep_scan BOOLEAN,
    include_screenshots BOOLEAN,
    max_pages INTEGER,
    callback_url VARCHAR(255),
    error_message TEXT,
    notes TEXT
);

-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    scan_result_id BIGINT NOT NULL,
    description VARCHAR(500) NOT NULL,
    help_url VARCHAR(500),
    element_selector VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (scan_result_id) REFERENCES website_scan_results(id)
);

-- Create websites table
CREATE TABLE IF NOT EXISTS websites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
); 