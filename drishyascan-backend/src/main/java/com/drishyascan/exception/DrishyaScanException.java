// 4. Exception Package
package com.drishyascan.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Base exception class for application-specific exceptions.
 */
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class DrishyaScanException extends RuntimeException {
    
    public DrishyaScanException(String message) {
        super(message);
    }
    
    public DrishyaScanException(String message, Throwable cause) {
        super(message, cause);
    }
}
