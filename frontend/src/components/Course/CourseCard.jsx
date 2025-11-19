import React from 'react';
import { Card, Tag, Typography, Rate } from 'antd';

const { Meta } = Card;
const { Text } = Typography;

const CourseCard = ({ course }) => {
  return (
    <Card
      hoverable
      style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}
      cover={
        <img 
          alt={course.title} 
          src={course.image || "https://placehold.co/600x400/6366f1/ffffff?text=Java+Course"} 
          style={{ height: 180, objectFit: 'cover' }}
        />
      }
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Tag color="blue">{course.level || 'Beginner'}</Tag>
        <Rate disabled defaultValue={4.5} style={{ fontSize: 12 }} />
      </div>
      
      <Meta 
        title={course.title} 
        description={
          <Text type="secondary" ellipsis={{ rows: 2 }}>
            {course.description || "Master the fundamentals of programming with this comprehensive guide."}
          </Text>
        } 
      />
      
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong style={{ fontSize: 16 }}>Free</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>1.2k students</Text>
      </div>
    </Card>
  );
};

export default CourseCard;