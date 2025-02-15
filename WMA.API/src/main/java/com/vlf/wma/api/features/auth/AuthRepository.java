package com.vlf.wma.api.features.auth;


import com.vlf.wma.api.features.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

// TODO: decide on what to use this for.
//  Could just delete since we don't need to keep track of auth requests in a DB.
@Repository
public interface AuthRepository extends JpaRepository<UserEntity, Long> {
}
