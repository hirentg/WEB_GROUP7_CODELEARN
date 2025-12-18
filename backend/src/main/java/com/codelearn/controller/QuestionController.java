package com.codelearn.controller;

import com.codelearn.dto.CreateAnswerRequest;
import com.codelearn.dto.QuestionResponse;
import com.codelearn.model.Answer;
import com.codelearn.model.Question;
import com.codelearn.service.QuestionService;
import com.codelearn.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/questions", produces = MediaType.APPLICATION_JSON_VALUE)
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Get all questions for a video (for students viewing Q&A)
     * GET /api/questions/video/{videoId}
     */
    @GetMapping("/video/{videoId}")
    public ResponseEntity<List<QuestionResponse>> getQuestionsForVideo(@PathVariable Long videoId) {
        try {
            List<QuestionResponse> questions = questionService.getQuestionsByVideoId(videoId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all questions for instructor's courses
     * GET /api/questions/instructor/all
     */
    @GetMapping("/instructor/all")
    public ResponseEntity<List<QuestionResponse>> getInstructorQuestions(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long instructorId = jwtUtil.getUserIdFromToken(authHeader);

            if (instructorId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            List<QuestionResponse> questions = questionService.getQuestionsByInstructorId(instructorId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get unanswered questions for instructor's courses
     * GET /api/questions/instructor/unanswered
     */
    @GetMapping("/instructor/unanswered")
    public ResponseEntity<List<QuestionResponse>> getInstructorUnansweredQuestions(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long instructorId = jwtUtil.getUserIdFromToken(authHeader);

            if (instructorId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            List<QuestionResponse> questions = questionService.getUnansweredQuestionsByInstructorId(instructorId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create an answer for a question
     * POST /api/questions/answers
     */
    @PostMapping("/answers")
    public ResponseEntity<Map<String, Object>> createAnswer(
            @Valid @RequestBody CreateAnswerRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Answer answer = questionService.createAnswer(request, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("id", answer.getId());
            response.put("questionId", answer.getQuestionId());
            response.put("userId", answer.getUserId());
            response.put("content", answer.getContent());
            response.put("isInstructorAnswer", answer.getIsInstructorAnswer());
            response.put("isBestAnswer", answer.getIsBestAnswer());
            response.put("upvotes", answer.getUpvotes());
            response.put("createdAt", answer.getCreatedAt());
            response.put("message", "Answer created successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create answer");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Create a new question (for students)
     * POST /api/questions
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createQuestion(
            @Valid @RequestBody com.codelearn.dto.CreateQuestionRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(authHeader);

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Question question = questionService.createQuestion(request, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("id", question.getId());
            response.put("videoId", question.getVideoId());
            response.put("userId", question.getUserId());
            response.put("title", question.getTitle());
            response.put("content", question.getContent());
            response.put("createdAt", question.getCreatedAt());
            response.put("message", "Question created successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create question");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
