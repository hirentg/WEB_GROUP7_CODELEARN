import { useNavigate } from 'react-router-dom'
import { Card, Rate, Typography, Space, Tag } from 'antd'

const { Text, Title } = Typography

export default function CourseCard({ course }) {
  const navigate = useNavigate()

  return (
    <Card
      hoverable
      className="card-hover"
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}
      bodyStyle={{ padding: '16px' }}
      cover={
        <div
          style={{
            height: '160px',
            backgroundImage: `url(${course.thumbnailUrl || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Course'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          {course.bestseller && (
            <Tag color="#f59e0b" style={{ position: 'absolute', top: 12, left: 12, margin: 0, fontWeight: 600, border: 'none' }}>
              Bestseller
            </Tag>
          )}
        </div>
      }
      onClick={() => navigate(`/course/${course.id}`)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Title level={5} style={{
          margin: '0 0 8px',
          fontSize: '16px',
          lineHeight: '1.4',
          height: '44px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {course.title}
        </Title>

        <Text type="secondary" style={{ fontSize: '13px', marginBottom: '8px', display: 'block' }}>
          {course.instructor}
        </Text>

        <div style={{ marginTop: 'auto' }}>
          <Space align="center" size={4} style={{ marginBottom: '8px' }}>
            <Text strong style={{ color: '#b4690e', fontSize: '14px' }}>
              {course.rating?.toFixed ? course.rating.toFixed(1) : course.rating}
            </Text>
            <Rate disabled defaultValue={course.rating} style={{ fontSize: '12px', color: '#e59819' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ({course.numRatings?.toLocaleString?.() || course.numRatings})
            </Text>
          </Space>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text strong style={{ fontSize: '18px', color: 'var(--text-main)' }}>
              {course.price || 'Free'}
            </Text>
            {course.oldPrice && (
              <Text delete type="secondary" style={{ fontSize: '14px' }}>
                {course.oldPrice}
              </Text>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}


