package com.sandy.expensetracker.expensetracker;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest
@AutoConfigureMockMvc (addFilters = false)
class ExpenseTrackerSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String email;
    private static String token;

    // ================= SIGNUP =================
    @Test
    @Order(1)
    void testSignup() throws Exception {

        email = "secure" + System.currentTimeMillis() + "@gmail.com";

        String json = """
            {
              "name": "Secure User",
              "email": "%s",
              "password": "123456"
            }
        """.formatted(email);

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());
    }

    // ================= LOGIN =================
    @Test
    @Order(2)
    void testLoginAndGetToken() throws Exception {

        String json = """
            {
              "email": "%s",
              "password": "123456"
            }
        """.formatted(email);

        String response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        token = objectMapper.readTree(response).get("token").asText();

        Assertions.assertNotNull(token);
    }

    // ================= ACCESS PROTECTED API =================
    @Test
    @Order(3)
    void testAccessProtectedApi() throws Exception {

        mockMvc.perform(get("/api/budget"))
                .andExpect(status().isForbidden()); // ❌ no token

        mockMvc.perform(get("/api/budget")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()); // ✅ with token
    }

    // ================= ADD BUDGET =================
    @Test
    @Order(4)
    void testAddBudgetWithJWT() throws Exception {

        String json = """
            {
              "name": "Secure Budget",
              "income": 70000,
              "date": "2026-04-01"
            }
        """;

        mockMvc.perform(post("/api/budget")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.income").value(70000));
    }

    // ================= ADD EXPENSE =================
    @Test
    @Order(5)
    void testAddExpenseWithJWT() throws Exception {

        String json = """
            {
              "amount": 1500,
              "category": "Travel",
              "date": "2026-04-01"
            }
        """;

        mockMvc.perform(post("/api/expenses")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(1500));
    }

    // ================= INVALID TOKEN =================
    @Test
    @Order(6)
    void testInvalidToken() throws Exception {

        mockMvc.perform(get("/api/budget")
                        .header("Authorization", "Bearer invalid_token"))
                .andExpect(status().isForbidden());
    }
}