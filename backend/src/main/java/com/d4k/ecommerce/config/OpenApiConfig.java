package com.d4k.ecommerce.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "VSneakers API",
                version = "1.0",
                description = "REST API Documentation for VSneakers E-commerce Platform. " +
                        "To authenticate: call POST /api/v1/auth/login first — the JWT will be set as an HttpOnly Cookie automatically.",
                contact = @Contact(
                        name = "VSneakers Team",
                        email = "hello@vsneakers.vn"
                )
        ),
        servers = {
                @Server(
                        description = "Local Development",
                        url = "http://localhost:8081"
                )
        },
        security = {
                @SecurityRequirement(name = "cookieAuth")
        }
)
@SecurityScheme(
        name = "cookieAuth",
        description = "JWT Cookie Authentication. Call POST /api/v1/auth/login to authenticate. The JWT token will be set as an HttpOnly Cookie named 'accessToken'.",
        type = SecuritySchemeType.APIKEY,
        in = SecuritySchemeIn.COOKIE,
        paramName = "accessToken"
)
public class OpenApiConfig {
}
