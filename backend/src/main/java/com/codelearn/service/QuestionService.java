package com.codelearn.service;

import com.codelearn.dto.CreateAnswerRequest;
import com.codelearn.dto.QuestionResponse;
import com.codelearn.model.Answer;
import com.codelearn.model.Question;
import com.codelearn.model.User;
import com.codelearn.model.Video;
import com.codelearn.repository.AnswerRepository;
import com.codelearn.repository.QuestionRepository;
import com.codelearn.repository.UserRepository;
import com.codelearn.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VideoRepository videoRepository;
    
    /**
     * Get all questions for courses taught by an instructor
     */
    public List<QuestionResponse> getQuestionsByInstructorId(Long instructorId) {
        List<Question> questions = questionRepository.findQuestionsByInstructorId(instructorId);
        return questions.stream()
                .map(this::mapToQuestionResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get unanswered questions for an instructor
     */
    public List<QuestionResponse> getUnansweredQuestionsByInstructorId(Long instructorId) {
        List<Question> questions = questionRepository.findUnansweredQuestionsByInstructorId(instructorId);
        return questions.stream()
                .map(this::mapToQuestionResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Create an answer for a question
     * @param request CreateAnswerRequest with questionId and content
     * @param userId ID of the user creating the answer
     * @return The created Answer entity
     */
    public Answer createAnswer(CreateAnswerRequest request, Long userId) {
        // Check if question exists
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // Get user to check role
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create answer
        Answer answer = new Answer();
        answer.setQuestionId(request.getQuestionId());
        answer.setUserId(userId);
        answer.setContent(request.getContent());
        answer.setUpvotes(0);
        answer.setIsBestAnswer(false);
        
        // Check if user is instructor for this course
        Video video = videoRepository.findById(question.getVideoId()).orElse(null);
        boolean isInstructor = false;
        
        if (video != null && video.getCourse() != null) {
            // Check if user is the course instructor or has INSTRUCTOR role
            isInstructor = video.getCourse().getInstructorId().equals(userId) 
                          || "INSTRUCTOR".equalsIgnoreCase(user.getRole());
        }
        
        answer.setIsInstructorAnswer(isInstructor);
        
        // Save answer
        Answer savedAnswer = answerRepository.save(answer);
        
        // Only update question's isAnswered status if the answer is from an instructor
        if (isInstructor && !question.getIsAnswered()) {
            question.setIsAnswered(true);
            questionRepository.save(question);
        }
        
        return savedAnswer;
    }
    
    /**
     * Map Question entity to QuestionResponse DTO
     */
    private QuestionResponse mapToQuestionResponse(Question question) {
        QuestionResponse response = new QuestionResponse();
        response.setId(question.getId());
        response.setUserId(question.getUserId());
        response.setVideoId(question.getVideoId());
        response.setTitle(question.getTitle());
        response.setContent(question.getContent());
        response.setUpvotes(question.getUpvotes());
        response.setIsAnswered(question.getIsAnswered());
        response.setCreatedAt(question.getCreatedAt());
        response.setUpdatedAt(question.getUpdatedAt());
        
        // Get user info
        User user = userRepository.findById(question.getUserId()).orElse(null);
        if (user != null) {
            response.setUserName(user.getName());
            response.setUserAvatar(user.getAvatarUrl());
        }
        
        // Get video info
        Video video = videoRepository.findById(question.getVideoId()).orElse(null);
        if (video != null) {
            response.setVideoTitle(video.getTitle());
            if (video.getCourse() != null) {
                response.setCourseId(video.getCourse().getId());
                response.setCourseTitle(video.getCourse().getTitle());
            }
        }
        
        // Get answers
        List<Answer> answers = answerRepository.findByQuestionIdOrderByCreatedAtAsc(question.getId());
        response.setAnswerCount(answers.size());
        
        List<QuestionResponse.AnswerInfo> answerInfos = answers.stream()
                .map(this::mapToAnswerInfo)
                .collect(Collectors.toList());
        response.setAnswers(answerInfos);
        
        return response;
    }
    
    /**
     * Map Answer entity to AnswerInfo DTO
     */
    private QuestionResponse.AnswerInfo mapToAnswerInfo(Answer answer) {
        User user = userRepository.findById(answer.getUserId()).orElse(null);
        
        return new QuestionResponse.AnswerInfo(
            answer.getId(),
            answer.getUserId(),
            user != null ? user.getName() : "Unknown",
            user != null ? user.getAvatarUrl() : null,
            answer.getContent(),
            answer.getUpvotes(),
            answer.getIsInstructorAnswer(),
            answer.getIsBestAnswer(),
            answer.getCreatedAt()
        );
    }
}
