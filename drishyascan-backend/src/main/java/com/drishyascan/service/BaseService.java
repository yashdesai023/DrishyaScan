// 8. Service Package
package com.drishyascan.service;

import org.springframework.stereotype.Service;

/**
 * Base service interface that defines common service methods.
 */
public interface BaseService<T, ID> {
    
    T findById(ID id);
    
    T save(T entity);
    
    void deleteById(ID id);
}