package com.drishyascan.repository;

import com.drishyascan.model.User;
import com.drishyascan.model.Website;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebsiteRepository extends JpaRepository<Website, Long> {

    /**
     * Find all websites owned by a specific user
     * @param owner the user who owns the websites
     * @return list of websites owned by the user
     */
    List<Website> findByOwner(User owner);
    
    /**
     * Find all websites with a specific status
     * @param status the status to filter by
     * @return list of websites with the given status
     */
    List<Website> findByStatus(Website.WebsiteStatus status);
    
    /**
     * Find websites owned by a specific user with a specific status
     * @param owner the user who owns the websites
     * @param status the status to filter by
     * @return list of websites owned by the user with the given status
     */
    List<Website> findByOwnerAndStatus(User owner, Website.WebsiteStatus status);
    
    /**
     * Find a website by its URL
     * @param url the URL to search for
     * @return the website with the given URL, if it exists
     */
    Optional<Website> findByUrl(String url);
    
    /**
     * Check if a website with the given URL exists
     * @param url the URL to check
     * @return true if a website with the URL exists, false otherwise
     */
    boolean existsByUrl(String url);
}