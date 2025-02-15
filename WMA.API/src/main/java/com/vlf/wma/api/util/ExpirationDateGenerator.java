package com.vlf.wma.api.util;

import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

public class ExpirationDateGenerator {
    public static int DEFAULT_EXPIRATION_TIME_MINS = 30;

    public static LocalDateTime generateExpirationDate() {
        return generateExpirationDate(DEFAULT_EXPIRATION_TIME_MINS);
    }

    /**
     * Generates an expiration time with given duration.
     * @param minutesToExpire
     * @return
     */
    public static LocalDateTime generateExpirationDate(int minutesToExpire) {
        return LocalDateTime.now().plusMinutes(minutesToExpire);
    }
}
