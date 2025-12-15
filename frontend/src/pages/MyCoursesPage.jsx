import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Card, Spin, Alert, Empty, Button } from 'antd'
import { PlayCircleOutlined, BookOutlined } from '@ant-design/icons'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import CourseCard from '../components/CourseCard'

const { Title, Paragraph } = Typography

export default function MyCoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    let isMounted = true
    api.get('/purchases')
      .then((res) => {
        if (isMounted) setCourses(res || [])
      })
      .catch((err) => {
        if (isMounted) setError('Failed to load your courses')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [user, navigate])

  if (!user) {
    return null
  }

  return (
    <div className="container section-padding">
      <div style={{ marginBottom: '48px' }}>
        <Title level={1} style={{ marginBottom: '16px' }}>
          My Learning
        </Title>
        <Paragraph type="secondary" style={{ fontSize: '18px' }}>
          Continue your learning journey
        </Paragraph>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <Spin size="large" />
        </div>
      )}

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '24px' }} />}

      {!loading && !error && courses.length === 0 && (
        <Empty
          description={
            <div>
              <Title level={4} type="secondary">No courses yet</Title>
              <Paragraph type="secondary">Start learning by purchasing a course</Paragraph>
              <Button type="primary" size="large" onClick={() => navigate('/')}>
                Browse Courses
              </Button>
            </div>
          }
          image={<BookOutlined style={{ fontSize: '64px', color: 'var(--text-muted)' }} />}
        />
      )}

      {!loading && !error && courses.length > 0 && (
        <Row gutter={[24, 32]}>
          {courses.map((course) => (
            <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
              <Card
                hoverable
                className="card-hover"
                cover={
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                      position: 'relative',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => navigate(`/course/${course.id}/learn`)}
                  >
                    <PlayCircleOutlined style={{ fontSize: '48px', color: '#fff', opacity: 0.9 }} />
                  </div>
                }
                onClick={() => navigate(`/course/${course.id}/learn`)}
                style={{ height: '100%' }}
              >
                <Card.Meta
                  title={course.title}
                  description={
                    <div>
                      <div style={{ marginBottom: '8px' }}>{course.instructor}</div>
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        block
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/course/${course.id}/learn`)
                        }}
                      >
                        Continue Learning
                      </Button>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

