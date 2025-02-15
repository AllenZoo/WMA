package com.vlf.wma.api.features.user.signUpRequest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
@Repository
public interface SignUpRequestRepository extends JpaRepository<SignUpRequest, Long> {

    Optional<SignUpRequest> findByEmail(String email);

    /**
     * Updates an existing SignUpRequest by Email. If SignUpRequest with given email does not exist, do nothing.
     * @param email
     * @param request
     */
    @Modifying
    @Transactional
    @Query("UPDATE SignUpRequest s SET s.username = :#{#request.username}, " +
            "s.password = :#{#request.password}, " +
            "s.email = :#{#request.email}, " +
            "s.code = :#{#request.code}, " +
            "s.expirationDate = :#{#request.expirationDate} " +
            "WHERE s.email = :email")
    void updateSignUpRequestByEmail(@Param("email") String email, @Param("request") SignUpRequest request);

}
