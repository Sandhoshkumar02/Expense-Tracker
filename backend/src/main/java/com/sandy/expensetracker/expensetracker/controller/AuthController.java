// AuthController.java
package com.sandy.expensetracker.expensetracker.controller;

import com.sandy.expensetracker.expensetracker.model.User;
import com.sandy.expensetracker.expensetracker.repository.UserRepository;
import com.sandy.expensetracker.expensetracker.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        String token = userService.login(user.getEmail(), user.getPassword());
        return Map.of("token", token);
    }

    // GET PROFILE
    @GetMapping("/profile")
    public User getProfile() {
        User user = getAuthenticatedUser();

        if (user.getProfileImage() == null) {
            user.setProfileImage("default.png");
        }

        return user;
    }

    // UPDATE NAME
    @PutMapping("/profile")   // ✅ FIXED
    public User updateProfile(@RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();

        String newName = body.get("name");
        if (newName != null && !newName.trim().isEmpty()) {
            user.setName(newName.trim());
        }

        return userRepository.save(user);
    }

    // UPLOAD IMAGE
    @PostMapping("/profile/upload")   // ✅ KEEP THIS
    public Map<String, String> uploadProfile(
            @RequestParam("file") MultipartFile file) throws IOException {

        User user = getAuthenticatedUser();

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (!file.getContentType().startsWith("image/")) {
            throw new RuntimeException("Only image files allowed");
        }

        String originalName = file.getOriginalFilename();
        String cleanName = originalName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
        String fileName = System.currentTimeMillis() + "_" + cleanName;

        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        File uploadPath = new File(uploadDir);

        if (!uploadPath.exists()) {
            uploadPath.mkdirs();
        }

        file.transferTo(new File(uploadDir + fileName));

        user.setProfileImage(fileName);
        userRepository.save(user);

        return Map.of(
                "message", "Profile updated successfully",
                "profileImage", fileName
        );
    }

    // ✅ Reads from SecurityContext — no extra DB call, no token parsing
    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}