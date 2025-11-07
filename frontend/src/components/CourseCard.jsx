import { useNavigate } from 'react-router-dom'
import { Card, Rate, Typography, Space } from 'antd'

const { Meta } = Card
const { Text, Title } = Typography

export default function CourseCard({ course }) {
  const navigate = useNavigate()
  
  return (
    <Card
      hoverable
      style={{ width: '100%' }}
      cover={
        <div 
          style={{ 
            height: '140px', 
            backgroundImage: `url(${course.thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} 
        />
      }
      onClick={() => navigate(`/course/${course.id}`)}
    >
      <Meta
        title={<Title level={5} style={{ margin: 0 }}>{course.title}</Title>}
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text type="secondary">{course.instructor}</Text>
            <Space>
              <Text strong style={{ color: '#b4690e' }}>
                {course.rating?.toFixed ? course.rating.toFixed(1) : course.rating}
              </Text>
              <Rate disabled defaultValue={course.rating} style={{ fontSize: '12px' }} />
              <Text type="secondary">
                ({course.numRatings?.toLocaleString?.() || course.numRatings})
              </Text>
            </Space>
            <Text type="secondary">{course.duration}</Text>
            <Text strong style={{ fontSize: '16px' }}>{course.price || 'Free'}</Text>
          </Space>
        }
      />
    </Card>
  )
}


