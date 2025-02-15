package com.vlf.wma.api.features.auth.passwordResetRequest;

import com.vlf.wma.api.features.user.signUpRequest.SignUpRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface ResetPasswordRepository extends JpaRepository<ResetPasswordRequest, Long> {
    Optional<ResetPasswordRequest> findByEmail(String email);

    /**
     * Updates an existing SignUpRequest by Email. If SignUpRequest with given email does not exist, do nothing.
     * @param email
     * @param request
     */
    @Modifying
    @Transactional
    @Query("UPDATE reset_password_requests r " +
            "SET " +
            "r.expirationDate = :#{#request.expirationDate}, " +
            "r.token = :#{#request.token} " +
            "WHERE r.email = :email")
    void updateSignUpRequestByEmail(@Param("email") String email, @Param("request") ResetPasswordRequest request);
}
