import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Button, Skeleton } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import CourseCard from '../components/Course/CourseCard';

const { Title, Paragraph } = Typography;

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to your Java backend
    fetch('http://localhost:8080/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch", err);
        // Fallback dummy data if backend isn't running
        setCourses([
          { id: 1, title: "Java Spring Boot Masterclass", level: "Advanced" },
          { id: 2, title: "React & Ant Design Fundamentals", level: "Beginner" },
          { id: 3, title: "Data Structures & Algorithms", level: "Intermediate" },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '60px 0', marginBottom: '40px' }}>
        <Title level={1} style={{ fontSize: '3rem', marginBottom: 16 }}>
          Learn to Code <span style={{ color: '#6366f1' }}>Faster.</span>
        </Title>
        <Paragraph style={{ fontSize: 18, color: '#64748b', maxWidth: 600, margin: '0 auto 32px' }}>
          Join thousands of students mastering Java, React, and System Design with our interactive courses.
        </Paragraph>
        <Button type="primary" size="large" icon={<RocketOutlined />} style={{ padding: '0 40px' }}>
          Start Learning Now
        </Button>
      </div>

      {/* Featured Courses Section */}
      <Title level={2} style={{ marginBottom: 32 }}>Featured Courses</Title>
      
      <Row gutter={[24, 24]}>
        {loading ? (
           // Skeleton loading state
           [1,2,3].map(i => (
             <Col xs={24} sm={12} md={8} key={i}>
               <Skeleton active card />
             </Col>
           ))
        ) : (
          courses.map(course => (
            <Col xs={24} sm={12} md={8} key={course.id}>
              <CourseCard course={course} />
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default Home;