package com.davideleonino.locker.security;

import com.davideleonino.locker.model.AdminUser;
import com.davideleonino.locker.service.AdminUserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminUserService adminUserService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // 1. Caso con token Bearer
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsernameFromToken(token);

                // Evita duplicati
                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    AdminUser admin = adminUserService.trovaPerUsername(username).orElse(null);
                    if (admin != null) {
                        // crea oggetto di autenticazione fittizio
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(admin, null, Collections.emptyList());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } else {
                response.setContentType("application/json");
                response.getWriter().write("{\"success\":false,\"message\":\"Token non valido o assente\"}");
                return;
            }

        } else {
            // 2. Nessun token -> blocca se richieste verso endpoint admin tranne login
            String path = request.getRequestURI();
            if (path.startsWith("/admin") && !path.equals("/admin/login")) {
                response.setContentType("application/json");
                response.getWriter().write("{\"success\":false,\"message\":\"Token non valido o assente\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
