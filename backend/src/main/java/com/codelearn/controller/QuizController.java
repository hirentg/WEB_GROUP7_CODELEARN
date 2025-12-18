package com.codelearn.controller;

import com.codelearn.dto.CreateQuizRequest;
import com.codelearn.dto.InstructorQuizResponse;
import com.codelearn.dto.QuizDetailResponse;
import com.codelearn.model.Quiz;
import com.codelearn.service.QuizService;
import com.codelearn.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/quizzes", produces = MediaType.APPLICATION_JSON_VALUE)
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/instructor/my-quizzes")
    public ResponseEntity<List<InstructorQuizResponse>> getInstructorQuizzes(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long instructorId = jwtUtil.getUserIdFromToken(authHeader);

            if (instructorId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            List<InstructorQuizResponse> quizzes = quizService.getInstructorQuizzes(instructorId);
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Quiz> createQuiz(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateQuizRequest request) {
        try {
            Long instructorId = jwtUtil.getUserIdFromToken(authHeader);

            if (instructorId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Quiz quiz = quizService.createQuiz(request, instructorId);
            return ResponseEntity.status(HttpStatus.CREATED).body(quiz);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDetailResponse> getQuizDetail(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            Long instructorId = jwtUtil.getUserIdFromToken(authHeader);

            if (instructorId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            QuizDetailResponse quiz = quizService.getQuizDetail(id, instructorId);
            if (quiz == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(quiz);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody CreateQuizRequest request) {
        try {
            Long instructorId = jwtUtil.getUserIdFromToken(authHeader);

            if (instructorId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Quiz quiz = quizService.updateQuiz(id, request, instructorId);
            return ResponseEntity.ok(quiz);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            Long instructorId = jwtUtil.getUserIdFromToken(authHeader);

            if (instructorId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            quizService.deleteQuiz(id, instructorId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all published quizzes for a course (for students)
     * GET /api/quizzes/course/{courseId}
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<QuizDetailResponse>> getQuizzesByCourse(@PathVariable String courseId) {
        try {
            List<QuizDetailResponse> quizzes = quizService.getQuizzesByCourseId(courseId);
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get quiz for student to take (public access for purchased course)
     * GET /api/quizzes/take/{id}
     */
    @GetMapping("/take/{id}")
    public ResponseEntity<QuizDetailResponse> getQuizForStudent(@PathVariable Long id) {
        try {
            Quiz quiz = quizService.getQuizById(id);
            if (quiz == null) {
                return ResponseEntity.notFound().build();
            }

            // Only allow access to published or active quizzes
            if (!"PUBLISHED".equalsIgnoreCase(quiz.getStatus()) && !"ACTIVE".equalsIgnoreCase(quiz.getStatus())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Get the full quiz detail for taking
            QuizDetailResponse quizDetail = quizService.getQuizDetailForStudent(id);
            if (quizDetail == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(quizDetail);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
