import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Rate, Button, Card, Spin, Alert, List, Space, Breadcrumb, Divider, Tag, message } from 'antd'
import { PlayCircleOutlined, CheckCircleOutlined, GlobalOutlined, ClockCircleOutlined, FileTextOutlined, UserOutlined, PlayCircleFilled, CheckCircleFilled } from '@ant-design/icons'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const { Title, Paragraph, Text } = Typography

export default function CourseDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [isPurchased, setIsPurchased] = useState(false)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([
      api.get(`/courses/${id}`),
      user ? api.get(`/purchases/check/${id}`) : Promise.resolve({ purchased: false })
    ])
      .then(([courseData, purchaseData]) => {
        if (active) {
          setCourse(courseData)
          setIsPurchased(purchaseData?.purchased || false)
        }
      })
      .catch(() => active && setError('Failed to load course'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id, user])

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setPurchasing(true)
    try {
      await api.post(`/purchases/${id}`)
      message.success('Course purchased successfully!')
      setIsPurchased(true)
    } catch (err) {
      message.error('Failed to purchase course. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  const curriculum = [
    'Introduction and setup',
    'Core concepts and best practices',
    'Project: build a real-world app',
    'Deployment and next steps'
  ]

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" tip="Loading course..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container section-padding">
        <Alert message={error} type="error" showIcon />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container section-padding">
        <Alert message="Course not found" type="warning" showIcon />
      </div>
    )
  }

  return (
    <div>
      {/* Header Section */}
      <div style={{ background: '#1f2937', color: '#fff', padding: '64px 0' }}>
        <div className="container">
          <Breadcrumb
            items={[{ title: 'Home', href: '/' }, { title: 'Courses' }, { title: course.title }]}
            style={{ marginBottom: '24px', filter: 'invert(1)' }}
          />
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={16}>
              <Title level={1} style={{ color: '#fff', fontSize: '40px', marginBottom: '16px' }}>{course.title}</Title>
              <Paragraph style={{ color: '#d1d5db', fontSize: '18px', maxWidth: '800px' }}>
                Master {course.title} with this comprehensive guide. Learn from the best and build your career.
              </Paragraph>

              <Space size="middle" wrap style={{ marginBottom: '24px' }}>
                <Tag color="gold" style={{ color: '#000', fontWeight: 700 }}>Bestseller</Tag>
                <Space>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>{course.rating?.toFixed(1) || '4.8'}</span>
                  <Rate disabled defaultValue={course.rating || 4.8} style={{ fontSize: '14px', color: '#f59e0b' }} />
                  <span style={{ color: '#9ca3af', textDecoration: 'underline' }}>({course.numRatings?.toLocaleString() || '1,234'} ratings)</span>
                </Space>
                <span style={{ color: '#d1d5db' }}>• 10,000+ students</span>
              </Space>

              <Space size="large" style={{ color: '#d1d5db' }}>
                <Space><UserOutlined /> Created by <span style={{ color: '#60a5fa', textDecoration: 'underline' }}>{course.instructor}</span></Space>
                <Space><GlobalOutlined /> English</Space>
                <Space><ClockCircleOutlined /> Last updated 11/2024</Space>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="container section-padding">
        <Row gutter={[48, 48]}>
          <Col xs={24} lg={16}>
            {/* What you'll learn */}
            <Card style={{ marginBottom: '32px', border: '1px solid var(--border-color)' }}>
              <Title level={3} style={{ marginTop: 0 }}>What you'll learn</Title>
              <Row gutter={[16, 16]}>
                {[
                  'Build powerful applications from scratch',
                  'Understand the core concepts deeply',
                  'Best practices for clean code',
                  'Deploy your apps to production'
                ].map((item, idx) => (
                  <Col xs={24} md={12} key={idx}>
                    <Space align="start">
                      <CheckCircleOutlined style={{ color: 'var(--text-secondary)', marginTop: '4px' }} />
                      <Text>{item}</Text>
                    </Space>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* Course Content */}
            <div style={{ marginBottom: '48px' }}>
              <Title level={3}>Course content</Title>
              <div style={{ marginBottom: '16px' }}>
                <Text type="secondary">4 sections • {course.lessons} lectures • {course.duration} total length</Text>
              </div>
              <List
                bordered
                dataSource={curriculum}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: '16px 24px', background: 'var(--bg-surface)' }}>
                    <Space>
                      <PlayCircleOutlined style={{ color: 'var(--text-secondary)' }} />
                      <Text strong>{item}</Text>
                    </Space>
                    <Text type="secondary">15:00</Text>
                  </List.Item>
                )}
              />
            </div>

            {/* Requirements */}
            <div style={{ marginBottom: '48px' }}>
              <Title level={3}>Requirements</Title>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-main)' }}>
                <li>Basic understanding of programming concepts</li>
                <li>A computer with internet access</li>
                <li>No prior experience with this specific tech stack needed</li>
              </ul>
            </div>

            {/* Description */}
            <div>
              <Title level={3}>Description</Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                This course is designed to take you from beginner to advanced. We cover everything you need to know to build professional-grade applications.
                You will learn through hands-on projects and real-world examples. By the end of this course, you will be confident in your ability to tackle complex problems.
              </Paragraph>
            </div>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            <div style={{ position: 'sticky', top: '100px' }}>
              <Card
                className="shadow-lg"
                style={{
                  borderTop: '4px solid var(--primary)',
                  overflow: 'hidden'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: '#000',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  position: 'relative',
                  cursor: 'pointer'
                }}>
                  <PlayCircleFilled style={{ fontSize: '64px', opacity: 0.8 }} />
                  <Text style={{ position: 'absolute', bottom: '16px', color: '#fff', fontWeight: 600 }}>Preview this course</Text>
                </div>

                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div>
                    <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {course.price || 'Free'}
                      {course.oldPrice && <Text delete type="secondary" style={{ fontSize: '18px', fontWeight: 400 }}>{course.oldPrice}</Text>}
                    </Title>
                  </div>

                  <Space direction="vertical" style={{ width: '100%' }}>
                    {isPurchased ? (
                      <Button 
                        type="primary" 
                        size="large" 
                        block 
                        icon={<PlayCircleFilled />}
                        style={{ height: '48px', fontSize: '16px', fontWeight: 700 }}
                        onClick={() => navigate(`/course/${id}/learn`)}
                      >
                        Continue Learning
                      </Button>
                    ) : (
                      <>
                        <Button 
                          type="primary" 
                          size="large" 
                          block 
                          style={{ height: '48px', fontSize: '16px', fontWeight: 700 }}
                          onClick={handlePurchase}
                          loading={purchasing}
                        >
                          {user ? 'Purchase Course' : 'Login to Purchase'}
                        </Button>
                        <Button 
                          size="large" 
                          block 
                          style={{ height: '48px', fontSize: '16px', fontWeight: 700 }}
                          onClick={() => navigate('/login')}
                        >
                          Add to Cart
                        </Button>
                      </>
                    )}
                  </Space>

                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>30-Day Money-Back Guarantee</Text>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <Space direction="vertical" size="small">
                    <Text strong>This course includes:</Text>
                    <Space><FileTextOutlined /> {course.duration} on-demand video</Space>
                    <Space><FileTextOutlined /> 5 downloadable resources</Space>
                    <Space><GlobalOutlined /> Full lifetime access</Space>
                    <Space><CheckCircleOutlined /> Certificate of completion</Space>
                  </Space>
                </Space>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}




