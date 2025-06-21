package com.demo.rbac.config;

// this class is used to manage frontEnd REACT and backend SpringBoot Collectively


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    @Value("${frontend.url}")
    private String frontendUrl;
    // 5173 is react frontend port number
    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/api/**") // allow all API endpoints
                .allowedOrigins(frontendUrl) // React frontend
                .allowedMethods("GET","POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}
