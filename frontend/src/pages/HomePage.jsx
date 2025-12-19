import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Input, Tag, Card, Avatar, Rate, Spin, Alert, Space, Button } from 'antd'
import { SearchOutlined, PlayCircleFilled, CheckCircleFilled } from '@ant-design/icons'
import CourseCard from '../components/CourseCard'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const { Title, Paragraph, Text } = Typography

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [purchasedCourses, setPurchasedCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [heroSearchQuery, setHeroSearchQuery] = useState('')

  const handleHeroSearch = (query) => {
    const searchTerm = query || heroSearchQuery
    if (searchTerm?.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

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

  // Fetch purchased courses for logged-in users
  useEffect(() => {
    if (user) {
      api.get('/purchases')
        .then((res) => {
          if (Array.isArray(res)) {
            setPurchasedCourses(res)
          }
        })
        .catch(() => { })
    }
  }, [user])

  const handleResumeLearning = () => {
    if (purchasedCourses.length > 0) {
      // Navigate to the most recently purchased course
      const latestCourse = purchasedCourses[0]
      navigate(`/course/${latestCourse.id}/learn`)
    } else {
      navigate('/my-learning')
    }
  }

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
    <div>
      {/* Hero Section */}
      <div className="hero-gradient section-padding" style={{ textAlign: 'center', paddingBottom: '80px' }}>
        <div className="container">
          {user ? (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <Title level={1} style={{ fontSize: '48px', marginBottom: '24px' }}>
                Welcome back, <span className="text-primary">{user.name || user.email}</span>!
              </Title>
              <Paragraph style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Ready to continue your journey? Pick up where you left off.
              </Paragraph>
              <Button type="primary" size="large" shape="round" icon={<PlayCircleFilled />} onClick={handleResumeLearning}>
                Resume Learning
              </Button>
            </div>
          ) : (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <Title level={1} style={{ fontSize: '56px', marginBottom: '24px', letterSpacing: '-1px' }}>
                Unlock your potential with <span className="text-primary">world-class</span> courses
              </Title>
              <Paragraph style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                Learn in-demand skills from industry experts. Video courses, hands-on projects, and a supportive community.
              </Paragraph>

              <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 32px' }}>
                <Input
                  size="large"
                  placeholder="What do you want to learn?"
                  prefix={<SearchOutlined style={{ color: 'var(--text-muted)', fontSize: '20px' }} />}
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  onPressEnter={() => handleHeroSearch()}
                  style={{
                    height: '64px',
                    fontSize: '18px',
                    borderRadius: '999px',
                    paddingLeft: '24px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid transparent'
                  }}
                />
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  onClick={() => handleHeroSearch()}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '8px',
                    height: '48px',
                    padding: '0 32px',
                    fontSize: '16px'
                  }}
                >
                  Search
                </Button>
              </div>

              <Space size="middle" wrap style={{ justifyContent: 'center' }}>
                <Text type="secondary">Popular:</Text>
                {['Web Development', 'Java', 'React', 'Spring Boot'].map(tag => (
                  <Tag
                    key={tag}
                    onClick={() => handleHeroSearch(tag)}
                    style={{
                      padding: '6px 16px',
                      fontSize: '14px',
                      background: 'rgba(255,255,255,0.6)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    className="hover-tag"
                  >
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </div>
      </div>

      <div className="container section-padding">
        {/* Continue Learning (if user has purchased courses) */}
        {user && purchasedCourses.length > 0 && (
          <div style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '24px' }}>
              <Title level={2} style={{ margin: 0 }}>Continue learning</Title>
              <Button type="link" onClick={() => navigate('/my-learning')}>View all</Button>
            </div>
            <Row gutter={[24, 24]}>
              {purchasedCourses.slice(0, 2).map((c) => (
                <Col xs={24} sm={12} md={12} key={`cont-${c.id}`}>
                  <CourseCard course={c} />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Top Picks */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <Title level={2}>Top picks in Development</Title>
            <Paragraph type="secondary" style={{ fontSize: '18px' }}>Curated courses to get you started</Paragraph>
          </div>

          {loading && <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '80px' }} />}
          {error && <Alert message={error} type="error" showIcon />}

          {!loading && !error && (
            <Row gutter={[24, 32]}>
              {courses.concat(courses).slice(0, 8).map((c, idx) => (
                <Col xs={24} sm={12} md={8} lg={6} key={`${c.id}-${idx}`}>
                  <CourseCard course={c} />
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Features / Why Us */}
        <div style={{
          background: 'var(--bg-subtle)',
          borderRadius: '24px',
          padding: '64px 40px',
          marginBottom: '80px',
          textAlign: 'center'
        }}>
          <Title level={2} style={{ marginBottom: '48px' }}>Why learn with us?</Title>
          <Row gutter={[48, 48]}>
            {[
              { title: 'Expert Instructors', desc: 'Learn from industry leaders who have been there.' },
              { title: 'Self-Paced', desc: 'Start and stop whenever you want. Lifetime access.' },
              { title: 'Interactive', desc: 'Quizzes, coding exercises, and projects to build your portfolio.' }
            ].map((feature, idx) => (
              <Col xs={24} md={8} key={idx}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'var(--primary)',
                    borderRadius: '16px',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    fontSize: '24px'
                  }}>
                    <CheckCircleFilled />
                  </div>
                  <Title level={4} style={{ margin: 0 }}>{feature.title}</Title>
                  <Paragraph type="secondary">{feature.desc}</Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Experts */}
        <div style={{ marginBottom: '80px' }}>
          <Title level={2} style={{ marginBottom: '32px' }}>Learn from the best</Title>
          <Row gutter={[24, 24]}>
            {experts.map((e) => (
              <Col xs={24} sm={12} md={6} key={e.name}>
                <Card hoverable className="card-hover" style={{ textAlign: 'center', height: '100%' }}>
                  <Avatar size={80} src={`https://i.pravatar.cc/150?u=${e.name}`} style={{ marginBottom: '16px', border: '4px solid var(--bg-subtle)' }} />
                  <Title level={5} style={{ marginBottom: '4px' }}>{e.name}</Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>{e.title}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{e.company}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Testimonials */}
        <div style={{ marginBottom: '48px' }}>
          <Title level={2} style={{ marginBottom: '32px' }}>What learners say</Title>
          <Row gutter={[24, 24]}>
            {testimonials.map((t, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <Card className="card-hover" style={{ height: '100%', background: 'var(--bg-surface)' }}>
                  <Rate disabled defaultValue={t.rating} style={{ marginBottom: '16px', color: '#f59e0b', fontSize: '16px' }} />
                  <Paragraph style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '24px' }}>"{t.text}"</Paragraph>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar style={{ backgroundColor: 'var(--secondary)' }}>{t.author[0]}</Avatar>
                    <Text strong>{t.author}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  )
}


