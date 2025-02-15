package com.vlf.wma.api.util;

import java.security.SecureRandom;
import java.util.Base64;

public class SecureTokenGenerator {

    private static final SecureRandom secureRandom = new SecureRandom(); // SecureRandom is preferred over Random
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding(); // URL safe base64 encoding

    private static final int DEFAULT_TOKEN_BYTE_LENGTH = 64;

    public static String generateToken() {
        return generateToken(DEFAULT_TOKEN_BYTE_LENGTH);
    }

    public static String generateToken(int byteLength) {
        byte[] randomBytes = new byte[byteLength];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }
}
