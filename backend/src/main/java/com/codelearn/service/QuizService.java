package com.codelearn.service;

import com.codelearn.dto.*;
import com.codelearn.model.*;
import com.codelearn.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuizQuestionRepository quizQuestionRepository;
    
    @Autowired
    private QuizAttemptRepository quizAttemptRepository;
    
    @Autowired
    private VideoRepository videoRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private QuizOptionRepository quizOptionRepository;
    
    public List<InstructorQuizResponse> getInstructorQuizzes(Long instructorId) {
        // Get all quizzes for instructor's courses
        List<Quiz> quizzes = quizRepository.findByInstructorId(instructorId);
        
        System.out.println("=== DEBUG: Found " + quizzes.size() + " quizzes for instructor ID: " + instructorId);
        
        return quizzes.stream().map(quiz -> {
            // Get video details
            Video video = videoRepository.findById(quiz.getVideoId()).orElse(null);
            
            String courseTitle = "";
            String courseId = "";
            String videoTitle = "";
            
            if (video != null) {
                videoTitle = video.getTitle();
                courseId = video.getCourseId();
                
                // Get course details
                Course course = courseRepository.findById(courseId).orElse(null);
                if (course != null) {
                    courseTitle = course.getTitle();
                }
            }
            
            // Get questions count
            Long questionsCount = quizQuestionRepository.countByQuizId(quiz.getId());
            
            // Get attempts count
            Long attemptsCount = quizAttemptRepository.countByQuizId(quiz.getId());
            
            // Get average score
            Double avgScore = quizAttemptRepository.calculateAverageScore(quiz.getId());
            if (avgScore == null) {
                avgScore = 0.0;
            }
            
            // Get status from database (convert to lowercase for frontend)
            String status = quiz.getStatus() != null ? quiz.getStatus().toLowerCase() : "draft";
            
            return new InstructorQuizResponse(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                courseTitle,
                courseId,
                quiz.getVideoId(),
                videoTitle,
                questionsCount.intValue(),
                attemptsCount.intValue(),
                avgScore,
                quiz.getPassingScore(),
                quiz.getTimeLimitMinutes(),
                status
            );
        }).collect(Collectors.toList());
    }
    
    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElse(null);
    }
    
    public QuizDetailResponse getQuizDetail(Long id, Long instructorId) {
        // Get quiz
        Quiz quiz = quizRepository.findById(id).orElse(null);
        if (quiz == null) {
            return null;
        }
        
        // Verify ownership
        Video video = videoRepository.findById(quiz.getVideoId()).orElse(null);
        if (video == null) {
            throw new RuntimeException("Video not found");
        }
        
        Course course = courseRepository.findById(video.getCourseId()).orElse(null);
        if (course == null || !course.getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to view this quiz");
        }
        
        // Get questions with options
        List<QuizQuestion> questions = quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId());
        
        List<QuizDetailResponse.QuestionDetail> questionDetails = questions.stream().map(question -> {
            List<QuizOption> options = quizOptionRepository.findByQuestionIdOrderByOrderIndexAsc(question.getId());
            
            List<QuizDetailResponse.OptionDetail> optionDetails = options.stream()
                .map(option -> new QuizDetailResponse.OptionDetail(
                    option.getId(),
                    option.getOptionText(),
                    option.getIsCorrect(),
                    option.getOrderIndex()
                ))
                .collect(Collectors.toList());
            
            return new QuizDetailResponse.QuestionDetail(
                question.getId(),
                question.getQuestionText(),
                question.getQuestionType(),
                question.getPoints(),
                question.getExplanation(),
                question.getOrderIndex(),
                optionDetails
            );
        }).collect(Collectors.toList());
        
        return new QuizDetailResponse(
            quiz.getId(),
            quiz.getVideoId(),
            video.getTitle(),
            course.getTitle(),
            quiz.getTitle(),
            quiz.getDescription(),
            quiz.getPassingScore(),
            quiz.getTimeLimitMinutes(),
            quiz.getStatus(),
            questionDetails
        );
    }
    
    @Transactional
    public Quiz updateQuiz(Long id, CreateQuizRequest request, Long instructorId) {
        // Get existing quiz
        Quiz quiz = quizRepository.findById(id).orElse(null);
        if (quiz == null) {
            throw new RuntimeException("Quiz not found");
        }
        
        // Verify ownership
        Video video = videoRepository.findById(quiz.getVideoId()).orElse(null);
        if (video == null) {
            throw new RuntimeException("Video not found");
        }
        
        Course course = courseRepository.findById(video.getCourseId()).orElse(null);
        if (course == null || !course.getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to update this quiz");
        }
        
        // Update basic quiz fields
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setPassingScore(request.getPassingScore() != null ? request.getPassingScore() : 70);
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setStatus(request.getStatus() != null && request.getStatus().equalsIgnoreCase("active") ? "ACTIVE" : "DRAFT");
        
        Quiz updatedQuiz = quizRepository.save(quiz);
        
        // Delete all old questions (cascade delete options)
        List<QuizQuestion> oldQuestions = quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId());
        for (QuizQuestion oldQuestion : oldQuestions) {
            quizOptionRepository.deleteByQuestionId(oldQuestion.getId());
        }
        quizQuestionRepository.deleteByQuizId(quiz.getId());
        
        // Recreate questions and options
        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            for (CreateQuizRequest.QuestionRequest questionReq : request.getQuestions()) {
                // Create Question
                QuizQuestion question = new QuizQuestion();
                question.setQuizId(updatedQuiz.getId());
                question.setQuestionText(questionReq.getQuestionText());
                question.setQuestionType(questionReq.getQuestionType());
                question.setPoints(questionReq.getPoints() != null ? questionReq.getPoints() : 1);
                question.setExplanation(questionReq.getExplanation());
                question.setOrderIndex(questionReq.getOrderIndex());
                
                QuizQuestion savedQuestion = quizQuestionRepository.save(question);
                
                // Create Options
                if ("TRUE_FALSE".equals(questionReq.getQuestionType())) {
                    // For Yes/No questions, create 2 options
                    QuizOption yesOption = new QuizOption(
                        savedQuestion.getId(),
                        "Yes",
                        questionReq.getCorrectAnswerIndex() != null && questionReq.getCorrectAnswerIndex() == 0,
                        0
                    );
                    QuizOption noOption = new QuizOption(
                        savedQuestion.getId(),
                        "No",
                        questionReq.getCorrectAnswerIndex() != null && questionReq.getCorrectAnswerIndex() == 1,
                        1
                    );
                    quizOptionRepository.save(yesOption);
                    quizOptionRepository.save(noOption);
                    
                } else if ("SINGLE_CHOICE".equals(questionReq.getQuestionType())) {
                    // For multiple choice, create options from request
                    if (questionReq.getOptions() != null) {
                        for (int i = 0; i < questionReq.getOptions().size(); i++) {
                            CreateQuizRequest.OptionRequest optionReq = questionReq.getOptions().get(i);
                            QuizOption option = new QuizOption(
                                savedQuestion.getId(),
                                optionReq.getOptionText(),
                                questionReq.getCorrectAnswerIndex() != null && questionReq.getCorrectAnswerIndex() == i,
                                i
                            );
                            quizOptionRepository.save(option);
                        }
                    }
                }
            }
        }
        
        return updatedQuiz;
    }
    
    @Transactional
    public void deleteQuiz(Long id, Long instructorId) {
        // Get quiz
        Quiz quiz = quizRepository.findById(id).orElse(null);
        if (quiz == null) {
            throw new RuntimeException("Quiz not found");
        }
        
        // Verify ownership
        Video video = videoRepository.findById(quiz.getVideoId()).orElse(null);
        if (video == null) {
            throw new RuntimeException("Video not found");
        }
        
        Course course = courseRepository.findById(video.getCourseId()).orElse(null);
        if (course == null || !course.getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to delete this quiz");
        }
        
        // Delete quiz attempts first (foreign key constraint)
        quizAttemptRepository.deleteByQuizId(quiz.getId());
        
        // Delete all questions (cascade delete options)
        List<QuizQuestion> questions = quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId());
        for (QuizQuestion question : questions) {
            quizOptionRepository.deleteByQuestionId(question.getId());
        }
        quizQuestionRepository.deleteByQuizId(quiz.getId());
        
        // Delete quiz
        quizRepository.deleteById(id);
    }
    
    @Transactional
    public Quiz createQuiz(CreateQuizRequest request, Long instructorId) {
        // Verify video exists and belongs to instructor
        Video video = videoRepository.findById(request.getVideoId()).orElse(null);
        if (video == null) {
            throw new RuntimeException("Video not found with id: " + request.getVideoId());
        }
        
        // Verify video belongs to instructor's course
        Course course = courseRepository.findById(video.getCourseId()).orElse(null);
        if (course == null || !course.getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You don't have permission to create quiz for this video");
        }
        
        // Create Quiz
        Quiz quiz = new Quiz();
        quiz.setVideoId(request.getVideoId());
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setPassingScore(request.getPassingScore() != null ? request.getPassingScore() : 70);
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setStatus(request.getStatus() != null && request.getStatus().equalsIgnoreCase("active") ? "ACTIVE" : "DRAFT");
        quiz.setCreatedAt(LocalDateTime.now());
        
        Quiz savedQuiz = quizRepository.save(quiz);
        
        // Create Questions and Options
        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            for (CreateQuizRequest.QuestionRequest questionReq : request.getQuestions()) {
                // Create Question
                QuizQuestion question = new QuizQuestion();
                question.setQuizId(savedQuiz.getId());
                question.setQuestionText(questionReq.getQuestionText());
                question.setQuestionType(questionReq.getQuestionType());
                question.setPoints(questionReq.getPoints() != null ? questionReq.getPoints() : 1);
                question.setExplanation(questionReq.getExplanation());
                question.setOrderIndex(questionReq.getOrderIndex());
                
                QuizQuestion savedQuestion = quizQuestionRepository.save(question);
                
                // Create Options
                if ("TRUE_FALSE".equals(questionReq.getQuestionType())) {
                    // For Yes/No questions, create 2 options
                    QuizOption yesOption = new QuizOption(
                        savedQuestion.getId(),
                        "Yes",
                        questionReq.getCorrectAnswerIndex() != null && questionReq.getCorrectAnswerIndex() == 0,
                        0
                    );
                    QuizOption noOption = new QuizOption(
                        savedQuestion.getId(),
                        "No",
                        questionReq.getCorrectAnswerIndex() != null && questionReq.getCorrectAnswerIndex() == 1,
                        1
                    );
                    quizOptionRepository.save(yesOption);
                    quizOptionRepository.save(noOption);
                    
                } else if ("SINGLE_CHOICE".equals(questionReq.getQuestionType())) {
                    // For multiple choice, create options from request
                    if (questionReq.getOptions() != null) {
                        for (int i = 0; i < questionReq.getOptions().size(); i++) {
                            CreateQuizRequest.OptionRequest optionReq = questionReq.getOptions().get(i);
                            QuizOption option = new QuizOption(
                                savedQuestion.getId(),
                                optionReq.getOptionText(),
                                questionReq.getCorrectAnswerIndex() != null && questionReq.getCorrectAnswerIndex() == i,
                                i
                            );
                            quizOptionRepository.save(option);
                        }
                    }
                }
            }
        }
        
        return savedQuiz;
    }
}
