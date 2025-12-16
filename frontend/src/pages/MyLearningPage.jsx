import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Card, Spin, Alert, Empty, Button, Progress, Tag, Space } from 'antd'
import { PlayCircleOutlined, BookOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const { Title, Paragraph, Text } = Typography

export default function MyLearningPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || !user.id) {
      // Lưu redirect path để quay lại sau khi login
      localStorage.setItem('redirectAfterLogin', '/my-learning')
      navigate('/login?redirect=/my-learning')
      return
    }

    let isMounted = true
    api.get('/users/my-learning')
      .then((res) => {
        console.log('My Learning API response:', res)
        if (isMounted) {
          if (Array.isArray(res)) {
            setCourses(res)
          } else {
            setCourses([])
          }
        }
      })
      .catch((err) => {
        console.error('Error loading my learning courses:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load your courses')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [user, navigate])

  if (!user) {
    return null
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="container section-padding">
      <div style={{ marginBottom: '48px' }}>
        <Title level={1} style={{ marginBottom: '16px' }}>
          My Learning
        </Title>
        <Paragraph type="secondary" style={{ fontSize: '18px' }}>
          Continue your learning journey. {courses.length > 0 && `You have ${courses.length} course${courses.length > 1 ? 's' : ''} in progress.`}
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
          {courses.map((course) => {
            const isCompleted = course.progress === 100
            
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={course.courseId || course.id}>
                <Card
                  hoverable
                  className="card-hover"
                  cover={
                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        background: course.thumbnail 
                          ? `url(${course.thumbnail}) center/cover`
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        position: 'relative',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => navigate(`/course/${course.courseId || course.id}`)}
                    >
                      {!course.thumbnail && (
                        <PlayCircleOutlined style={{ fontSize: '48px', color: '#fff', opacity: 0.9 }} />
                      )}
                      {isCompleted && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(34, 197, 94, 0.9)',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CheckCircleOutlined style={{ fontSize: '24px', color: '#fff' }} />
                        </div>
                      )}
                    </div>
                  }
                  onClick={() => navigate(`/course/${course.courseId || course.id}`)}
                  style={{ height: '100%' }}
                >
                  <Card.Meta
                    title={
                      <div>
                        <div style={{ marginBottom: '8px' }}>{course.courseName || course.title}</div>
                        {isCompleted && (
                          <Tag color="success" icon={<CheckCircleOutlined />}>
                            Completed
                          </Tag>
                        )}
                        {!isCompleted && course.progress > 0 && (
                          <Tag color="processing" icon={<ClockCircleOutlined />}>
                            In Progress
                          </Tag>
                        )}
                        {course.progress === 0 && (
                          <Tag color="default">Not Started</Tag>
                        )}
                      </div>
                    }
                    description={
                      <div style={{ marginTop: '12px' }}>
                        {course.description && (
                          <Paragraph 
                            ellipsis={{ rows: 2 }} 
                            style={{ 
                              marginBottom: '12px', 
                              color: '#666', 
                              fontSize: '13px',
                              minHeight: '40px'
                            }}
                          >
                            {course.description}
                          </Paragraph>
                        )}
                        
                        {course.progress > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <Text type="secondary" style={{ fontSize: '12px' }}>Progress</Text>
                              <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600 }}>{course.progress}%</Text>
                            </div>
                            <Progress 
                              percent={course.progress} 
                              size="small" 
                              strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                              }}
                            />
                          </div>
                        )}
                        
                        {course.purchaseDate && (
                          <div style={{ marginBottom: '12px', color: '#999', fontSize: '11px' }}>
                            <ClockCircleOutlined /> Purchased: {formatDate(course.purchaseDate)}
                          </div>
                        )}
                        
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          block
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/course/${course.courseId || course.id}`)
                          }}
                        >
                          {isCompleted ? 'Review Course' : course.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                        </Button>
                      </div>
                    }
                  />
                </Card>
              </Col>
            )
          })}
        </Row>
      )}
    </div>
  )
}

