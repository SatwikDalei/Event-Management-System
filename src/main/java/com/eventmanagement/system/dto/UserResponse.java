package com.eventmanagement.system.dto;

import java.util.List;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String token;

    public UserResponse(Long id, String name, String email,String token) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.token=token;

    }

    // Getters and setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
