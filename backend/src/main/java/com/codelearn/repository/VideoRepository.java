package com.codelearn.repository;

import com.codelearn.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {

    List<Video> findBySectionIdOrderByOrderIndexAsc(Long sectionId);

    List<Video> findByIsFreePreviewTrue();

    // From feature/page-for-constructor branch
    List<Video> findByCourseIdOrderByOrderIndexAsc(String courseId);
}
