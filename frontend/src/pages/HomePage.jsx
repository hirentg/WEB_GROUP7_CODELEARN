import { useEffect, useState } from 'react'
import { Row, Col, Typography, Input, Tag, Card, Avatar, Rate, Spin, Alert, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import CourseCard from '../components/CourseCard'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const { Title, Paragraph, Text } = Typography

export default function HomePage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    api.get('/courses')
      .then((res) => {
        if (isMounted) setCourses(res)
      })
      .catch(() => {
        if (isMounted) setError('Failed to load courses')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const experts = [
    { name: 'Jane Doe', title: 'Staff Engineer', company: 'TechCorp' },
    { name: 'John Smith', title: 'Principal Developer', company: 'Acme Inc.' },
    { name: 'Mary Lee', title: 'Senior Instructor', company: 'CodeAcademy' },
    { name: 'Alex Johnson', title: 'Architect', company: 'CloudWorks' }
  ]

  const testimonials = [
    { rating: 5, text: 'Clear explanations and practical projects. Highly recommend!', author: 'Priya K.' },
    { rating: 5, text: 'Great pacing and relevant topics. I landed a new job.', author: 'Daniel R.' },
    { rating: 4, text: 'Hands-on approach made concepts click for me.', author: 'Mei L.' }
  ]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
      {user ? (
        <div style={{ background: '#f7f9fa', padding: '44px 24px', borderRadius: '8px', marginBottom: '32px' }}>
          <Title level={1}>Welcome back, {user.name || user.email}!</Title>
          <Paragraph>Pick up where you left off or discover new courses.</Paragraph>
        </div>
      ) : (
        <div style={{ background: '#f7f9fa', padding: '44px 24px', borderRadius: '8px', marginBottom: '32px' }}>
          <Title level={1}>Unlock your potential with world-class courses</Title>
          <Paragraph>Learn in-demand skills with affordable video courses.</Paragraph>
          <Input
            size="large"
            placeholder="What do you want to learn?"
            prefix={<SearchOutlined />}
            style={{ maxWidth: '640px', marginTop: '16px' }}
          />
          <Space size="small" style={{ marginTop: '12px' }}>
            <Tag>Web Development</Tag>
            <Tag>Java</Tag>
            <Tag>React</Tag>
            <Tag>Spring Boot</Tag>
          </Space>
        </div>
      )}

      {user && (
        <div style={{ marginBottom: '48px' }}>
          <Title level={2}>Continue learning</Title>
          <Row gutter={[16, 16]}>
            {courses.slice(0, 2).map((c) => (
              <Col xs={24} sm={12} md={12} key={`cont-${c.id}`}>
                <CourseCard course={c} />
              </Col>
            ))}
          </Row>
        </div>
      )}

      <div style={{ marginBottom: '48px' }}>
        <Title level={2}>Top picks in Development</Title>
        {loading && <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '40px' }} />}
        {error && <Alert message={error} type="error" />}
        {!loading && !error && (
          <Row gutter={[16, 16]}>
            {courses.concat(courses).slice(0, 8).map((c) => (
              <Col xs={24} sm={12} md={8} lg={6} key={c.id}>
                <CourseCard course={c} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      <div style={{ marginBottom: '48px' }}>
        <Title level={2}>Learn from the best</Title>
        <Row gutter={[16, 16]}>
          {experts.map((e) => (
            <Col xs={24} sm={12} md={6} key={e.name}>
              <Card style={{ textAlign: 'center' }}>
                <Avatar size={56} style={{ backgroundColor: '#111827', marginBottom: '12px' }}>
                  {e.name.charAt(0)}
                </Avatar>
                <Title level={5}>{e.name}</Title>
                <Text type="secondary">{e.title} • {e.company}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <Title level={2}>What learners say</Title>
        <Row gutter={[16, 16]}>
          {testimonials.map((t, idx) => (
            <Col xs={24} sm={12} md={8} key={idx}>
              <Card>
                <Rate disabled defaultValue={t.rating} style={{ marginBottom: '12px' }} />
                <Paragraph>{t.text}</Paragraph>
                <Text type="secondary">— {t.author}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}


