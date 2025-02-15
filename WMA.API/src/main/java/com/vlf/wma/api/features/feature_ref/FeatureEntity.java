package com.vlf.wma.api.features.feature_ref;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class FeatureEntity {

    @Id
    private Long featureEntityId;

    public void setId(Long id) {
        this.featureEntityId = id;
    }

    public Long getId() {
        return featureEntityId;
    }
}
