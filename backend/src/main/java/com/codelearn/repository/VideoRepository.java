package com.codelearn.repository;

import com.codelearn.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByCourseIdOrderByOrderIndexAsc(String courseId);

    List<Video> findBySectionIdOrderByOrderIndexAsc(Long sectionId);

    void deleteBySectionId(Long sectionId);

    @Modifying
    @Query("DELETE FROM Video v WHERE v.course.id = :courseId")
    void deleteByCourseId(@Param("courseId") String courseId);
}
