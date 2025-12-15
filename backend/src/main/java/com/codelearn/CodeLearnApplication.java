package com.codelearn;

import com.codelearn.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CodeLearnApplication implements CommandLineRunner {
    
    @Autowired
    private CourseService courseService;
    
    public static void main(String[] args) {
        SpringApplication.run(CodeLearnApplication.class, args);
    }
    
    @Override
    public void run(String... args) throws Exception {
        courseService.initializeSampleCourses();
    }
}


