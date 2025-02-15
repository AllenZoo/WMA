package com.vlf.wma.api.features.feature_ref;

import org.springframework.stereotype.Repository;

/**
 * For Project Structure Reference!
 * Repository Class should be used for interacting with DB.
 */
@Repository
public class FeatureRepository implements IFeatureRepositoryDemo<FeatureEntity>{

    @Override
    public void save(FeatureEntity featureEntity) {

    }

    @Override
    public FeatureEntity findById(Long id) {
        return null;
    }
}

