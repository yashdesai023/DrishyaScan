// 9. Util Package
package com.drishyascan.util;

import org.springframework.stereotype.Component;

/**
 * Utility class that provides helper methods for the application.
 */
@Component
public class AppUtils {
    
    /**
     * Checks if a string is null or empty.
     */
    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}