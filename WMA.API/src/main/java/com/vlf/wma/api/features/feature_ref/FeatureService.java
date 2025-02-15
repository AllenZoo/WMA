package com.vlf.wma.api.features.feature_ref;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * For Project Structure Reference!
 * Service Classes should handle the business logic of the application. (Querying for data via Repository, Formatting
 * specific data)
 */
@Service
public class FeatureService {
    @Autowired
    private FeatureRepository repo;
    public FeatureEntity getEntityById(long id) {
        return repo.findById(id);
    }
}
