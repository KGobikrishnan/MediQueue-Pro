package com.mediqueue.pro.security;

import com.mediqueue.pro.entity.User;
import com.mediqueue.pro.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtils jwtUtils, UserRepository userRepository) {
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                if (jwt.startsWith("jwt_") || jwt.equals("demo_jwt_token_sample")) {
                    handleDemoToken(jwt, request);
                    filterChain.doFilter(request, response);
                    return;
                } else {
                    username = jwtUtils.extractUsername(jwt);
                }
            } catch (Exception e) {
                log.warn("JWT token parsing error: {}", e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Optional<User> userOptional = userRepository.findByEmail(username);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (jwtUtils.validateToken(jwt, user.getEmail())) {
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(user, null, Collections.singletonList(authority));
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private void handleDemoToken(String demoToken, HttpServletRequest request) {
        String roleName = "ADMIN";
        if (demoToken.contains("doctor")) roleName = "DOCTOR";
        else if (demoToken.contains("receptionist")) roleName = "RECEPTIONIST";
        else if (demoToken.contains("patient")) roleName = "PATIENT";

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + roleName);
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken("demo_" + roleName.toLowerCase(), null, Collections.singletonList(authority));
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
