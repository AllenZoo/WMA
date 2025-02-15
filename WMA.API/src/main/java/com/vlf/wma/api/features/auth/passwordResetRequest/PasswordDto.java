package com.vlf.wma.api.features.auth.passwordResetRequest;

import lombok.*;

/**
 * Class used to transfer the data of the new password of user.
 */
@Getter
@Setter
@EqualsAndHashCode
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PasswordDto {
    private String email;
    private String newPassword;

    public boolean isValid() {
        return email != null && newPassword != null;
    }
}
