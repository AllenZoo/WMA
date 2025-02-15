package com.vlf.wma.api.features.feature_ref;

public interface IFeatureRepositoryDemo<T> {
    // Save method
    void save(T t);

    // Find a student by its id
    T findById(Long id);
}
