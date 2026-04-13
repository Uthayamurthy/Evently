package com.eventmanagementapp.gatewayservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.Enumeration;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class GatewayController {

    @Value("${services.student.url:http://localhost:8081}")
    private String studentServiceUrl;

    @Value("${services.faculty.url:http://localhost:8082}")
    private String facultyServiceUrl;

    @Value("${services.event.url:http://localhost:8083}")
    private String eventServiceUrl;

    @Autowired
    private RestTemplate restTemplate;

    @RequestMapping("/student/**")
    public ResponseEntity<?> forwardToStudent(HttpServletRequest request) {
        String url = buildTargetUrl(request, studentServiceUrl, "/api/student", "/student");
        return forwardRequest(request, url);
    }

    @RequestMapping("/faculty/**")
    public ResponseEntity<?> forwardToFaculty(HttpServletRequest request) {
        String url = buildTargetUrl(request, facultyServiceUrl, "/api/faculty", "/faculty");
        return forwardRequest(request, url);
    }

    @RequestMapping("/events/**")
    public ResponseEntity<?> forwardToEvent(HttpServletRequest request) {
        String url = buildTargetUrl(request, eventServiceUrl, "/api/events", "/events");
        return forwardRequest(request, url);
    }

    @RequestMapping("/od/**")
    public ResponseEntity<?> forwardToOD(HttpServletRequest request) {
        String url = buildTargetUrl(request, eventServiceUrl, "/api/od", "/od");
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

            ResponseEntity<String> response = restTemplate.exchange(url, httpMethod, entity, String.class);
            return ResponseEntity.status(response.getStatusCode())
                .headers(copyResponseHeaders(response.getHeaders()))
                .body(response.getBody());
        } catch (RestClientResponseException e) {
            return ResponseEntity.status(e.getStatusCode())
                .headers(copyResponseHeaders(e.getResponseHeaders()))
                .body(e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("message", "Downstream service is unavailable"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("message", "Gateway error", "details", e.getMessage()));
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

    private HttpHeaders copyResponseHeaders(HttpHeaders originalHeaders) {
        HttpHeaders headers = new HttpHeaders();
        if (originalHeaders == null) {
            return headers;
        }

        MediaType contentType = originalHeaders.getContentType();
        if (contentType != null) {
            headers.setContentType(contentType);
        }

        return headers;
    }
}
