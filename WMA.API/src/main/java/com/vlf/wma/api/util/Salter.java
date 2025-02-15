package com.vlf.wma.api.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// Util Class for SALTING >:)
public class Salter {
    private static final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    /***
     * Salts and Hashes Plain Password using BCrypt.
     * @param plainPassword
     * @return
     */
    public static String hashPassword(String plainPassword) {
        return bCryptPasswordEncoder.encode(plainPassword);
    }

    /***
     * Checks that the plain password matches the hashed password retrieved from Database.
     * @param plainPassword the inputted password.
     * @param hashedPassword the retrieved db password.
     * @return
     */
    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        return bCryptPasswordEncoder.matches(plainPassword, hashedPassword);
    }
}
