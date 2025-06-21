package com.demo.rbac.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest.Builder;

import java.util.HashMap;
import java.util.Map;

public class CustomAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

    private final DefaultOAuth2AuthorizationRequestResolver defaultResolver;

    public CustomAuthorizationRequestResolver(ClientRegistrationRepository repo, String baseUri) {
        this.defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(repo, baseUri);
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        return customize(defaultResolver.resolve(request), request);
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
        return customize(defaultResolver.resolve(request, clientRegistrationId), request);
    }

    private OAuth2AuthorizationRequest customize(OAuth2AuthorizationRequest request, HttpServletRequest servletRequest) {
        if (request == null) return null;

        String role = servletRequest.getParameter("role"); // This comes from your frontend

        Map<String, Object> extra = new HashMap<>(request.getAdditionalParameters());
        if (role != null) {
            extra.put("role", role); // Put it in the 'state'
        }

        return OAuth2AuthorizationRequest.from(request)
                .additionalParameters(extra)
                .state(role) // you can encode role in state, or store in additionalParameters
                .build();
    }
}
