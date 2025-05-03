package com.drishyascan.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        // Log the full exception stack trace for debugging
        logger.error("Unhandled exception occurred", ex);
        
        ErrorResponse errorResponse = new ErrorResponse(
            "Internal Server Error",
            ex.getMessage(),
            LocalDateTime.now(),
            HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        logger.error("Validation error", ex);
        
        ErrorResponse errorResponse = new ErrorResponse(
            "Bad Request",
            ex.getMessage(),
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value()
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
        logger.error("Authentication error", ex);
        
        ErrorResponse errorResponse = new ErrorResponse(
            "Authentication Failed",
            "Invalid email or password",
            LocalDateTime.now(),
            HttpStatus.UNAUTHORIZED.value()
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ValidationErrorResponse errorResponse = new ValidationErrorResponse(
            "Validation Error",
            "The request contains invalid data",
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),
            errors
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    // Error response classes
    public static class ErrorResponse {
        private String error;
        private String message;
        private LocalDateTime timestamp;
        private int status;
        
        public ErrorResponse(String error, String message, LocalDateTime timestamp, int status) {
            this.error = error;
            this.message = message;
            this.timestamp = timestamp;
            this.status = status;
        }
        
        // Getters and setters
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
        public int getStatus() { return status; }
        public void setStatus(int status) { this.status = status; }
    }
    
    public static class ValidationErrorResponse extends ErrorResponse {
        private Map<String, String> validationErrors;
        
        public ValidationErrorResponse(String error, String message, LocalDateTime timestamp, int status, Map<String, String> validationErrors) {
            super(error, message, timestamp, status);
            this.validationErrors = validationErrors;
        }
        
        public Map<String, String> getValidationErrors() { return validationErrors; }
        public void setValidationErrors(Map<String, String> validationErrors) { this.validationErrors = validationErrors; }
    }
}