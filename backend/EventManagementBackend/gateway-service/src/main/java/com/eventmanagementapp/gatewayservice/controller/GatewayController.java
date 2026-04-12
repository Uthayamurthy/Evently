package com.eventmanagementapp.gatewayservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Enumeration;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class GatewayController {

    private static final String STUDENT_SERVICE = "http://localhost:8081";
    private static final String FACULTY_SERVICE = "http://localhost:8082";
    private static final String EVENT_SERVICE = "http://localhost:8083";

    @Autowired
    private RestTemplate restTemplate;

    @RequestMapping("/student/**")
    public ResponseEntity<?> forwardToStudent(HttpServletRequest request) {
        String url = buildTargetUrl(request, STUDENT_SERVICE, "/api/student", "/student");
        return forwardRequest(request, url);
    }

    @RequestMapping("/faculty/**")
    public ResponseEntity<?> forwardToFaculty(HttpServletRequest request) {
        String url = buildTargetUrl(request, FACULTY_SERVICE, "/api/faculty", "/faculty");
        return forwardRequest(request, url);
    }

    @RequestMapping("/events/**")
    public ResponseEntity<?> forwardToEvent(HttpServletRequest request) {
        String url = buildTargetUrl(request, EVENT_SERVICE, "/api/events", "/events");
        return forwardRequest(request, url);
    }

    @RequestMapping("/od/**")
    public ResponseEntity<?> forwardToOD(HttpServletRequest request) {
        String url = buildTargetUrl(request, EVENT_SERVICE, "/api/od", "/od");
        return forwardRequest(request, url);
    }

    private ResponseEntity<?> forwardRequest(HttpServletRequest request, String url) {
        try {
            String method = request.getMethod();
            HttpMethod httpMethod = HttpMethod.valueOf(method);

            HttpHeaders headers = new HttpHeaders();
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String name = headerNames.nextElement();
                if (shouldForwardHeader(name)) {
                    headers.add(name, request.getHeader(name));
                }
            }

            Object userEmail = request.getAttribute("X-User-Email");
            Object userRole = request.getAttribute("X-User-Role");
            Object userId = request.getAttribute("X-User-Id");

            if (userEmail != null) {
                headers.add("X-User-Email", userEmail.toString());
            }
            if (userRole != null) {
                headers.add("X-User-Role", userRole.toString());
            }
            if (userId != null) {
                headers.add("X-User-Id", userId.toString());
            }

            String body = "";
            if ("POST".equals(method) || "PUT".equals(method) || "PATCH".equals(method)) {
                body = request.getReader().lines().collect(Collectors.joining());
            }

            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            return restTemplate.exchange(url, httpMethod, entity, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Gateway error: " + e.getMessage());
        }
    }

    private String buildTargetUrl(HttpServletRequest request, String serviceBaseUrl, String gatewayPrefix, String servicePrefix) {
        String path = request.getRequestURI().replace(gatewayPrefix, servicePrefix);
        String query = request.getQueryString();
        if (query != null && !query.isBlank()) {
            return serviceBaseUrl + path + "?" + query;
        }
        return serviceBaseUrl + path;
    }

    private boolean shouldForwardHeader(String headerName) {
        return !"Authorization".equalsIgnoreCase(headerName)
            && !"Host".equalsIgnoreCase(headerName)
            && !"Content-Length".equalsIgnoreCase(headerName)
            && !"Transfer-Encoding".equalsIgnoreCase(headerName)
            && !"Connection".equalsIgnoreCase(headerName);
    }
}
