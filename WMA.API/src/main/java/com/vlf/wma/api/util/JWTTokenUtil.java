package com.vlf.wma.api.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JWTTokenUtil {
    private static final Key ACCESS_SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private static final Key REFRESH_SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private static final long ACCESS_TOKEN_VALIDITY = 1000 * 60 * 15; // 15 minutes
    private static final long REFRESH_TOKEN_VALIDITY = 1000 * 60 * 60 * 24 * 7; // 7 days


    /**
     * Utility function for generating a JWT access token. Access Tokens typically
     * expire within 15 minutes.
     * @param username
     * @return
     */
    public String generateToken(String username) {
        return createAccessToken(username, ACCESS_TOKEN_VALIDITY);
    }

    /**
     * Utility function for generating a JWT refresh token. Refresh Tokens typically
     * expire within 7 days.
     * @param username
     * @return
     */
    public String generateRefreshToken(String username) {
        return createRefreshToken(username, REFRESH_TOKEN_VALIDITY);
    }

    /**
     * Utility function that validates an incoming access JWT token.
     * Returns true, if it is valid, and false if it is not.
     * @param token
     * @return
     */
    public Boolean validateAccessToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(ACCESS_SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            throw new AuthenticationCredentialsNotFoundException("JWT was expired or incorrect",
                    ex.fillInStackTrace());
        }
    }

    /**
     * Determines whether the token is valid or not.
     * @param token
     * @return true if token is VALID.
     */
    public Boolean validateRefreshToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(REFRESH_SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            throw new AuthenticationCredentialsNotFoundException("JWT was expired or incorrect",
                    ex.fillInStackTrace());
        }
    }

    /**
     * Utility function to extract Username from JWT Token.
     * @param token
     * @return
     */
    public String extractUsername(String token, TokenType type) {
        return extractClaim(token, Claims::getSubject, type);
    }

    /**
     * Utility function to extract Expiration Date from JWT Token.
     * @param token
     * @return
     */
    public Date extractExpiration(String token, TokenType type) {
        return extractClaim(token, Claims::getExpiration, type);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver, TokenType type) {
        final Claims claims = extractAllClaims(token, type);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token, TokenType type) {
        switch (type) {
            default:
                return null;
            case ACCESS:
                return Jwts.parser().setSigningKey(ACCESS_SECRET_KEY).parseClaimsJws(token).getBody();
            case REFRESH:
                return Jwts.parser().setSigningKey(REFRESH_SECRET_KEY).parseClaimsJws(token).getBody();
        }
    }

    private Boolean isTokenExpired(String token, TokenType type) {
        return extractExpiration(token, type).before(new Date());
    }

    private String createAccessToken(String subject, long validity) {
        return Jwts.builder().setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + validity))
                .signWith(SignatureAlgorithm.HS256, ACCESS_SECRET_KEY).compact();
    }

    private String createRefreshToken(String subject, long validity) {
        return Jwts.builder().setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + validity))
                .signWith(SignatureAlgorithm.HS256, REFRESH_SECRET_KEY).compact();
    }
}

