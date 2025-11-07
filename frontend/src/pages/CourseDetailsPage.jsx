import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Typography, Rate, Button, Card, Spin, Alert, List, Space } from 'antd'
import { api } from '../services/api'

const { Title, Paragraph, Text } = Typography

export default function CourseDetailsPage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.get(`/courses/${id}`)
      .then((data) => { if (active) setCourse(data) })
      .catch(() => active && setError('Failed to load course'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id])

  const curriculum = [
    'Introduction and setup',
    'Core concepts and best practices',
    'Project: build a real-world app',
    'Deployment and next steps'
  ]

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <Alert message={error} type="error" />
      </div>
    )
  }

  if (!course) {
    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <Alert message="Course not found" type="warning" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Title level={1}>{course.title}</Title>
          <Paragraph>By {course.instructor}</Paragraph>
          <Space>
            <Text strong style={{ color: '#b4690e' }}>
              {course.rating?.toFixed ? course.rating.toFixed(1) : course.rating}
            </Text>
            <Rate disabled defaultValue={course.rating} />
            <Text type="secondary">
              ({course.numRatings?.toLocaleString?.() || course.numRatings})
            </Text>
          </Space>
          <Paragraph type="secondary">Duration: {course.duration} • {course.lessons} lessons</Paragraph>
        </Col>
        <Col xs={24} lg={10}>
          <Card>
            <div style={{ 
              width: '100%', 
              height: '200px', 
              background: '#000', 
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Text style={{ color: '#fff' }}>Video Player Placeholder</Text>
            </div>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Title level={3} style={{ margin: 0 }}>{course.price || 'Free'}</Title>
              <Button type="primary" size="large" block>Buy now</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '48px' }}>
        <Title level={2}>Course content</Title>
        <List
          bordered
          dataSource={curriculum}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
    </div>
  )
}


