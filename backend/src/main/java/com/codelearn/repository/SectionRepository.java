package com.codelearn.repository;

import com.codelearn.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByCourseIdOrderByOrderIndexAsc(String courseId);

    @Modifying
    @Query("DELETE FROM Section s WHERE s.courseId = :courseId")
    void deleteByCourseId(@Param("courseId") String courseId);
}
