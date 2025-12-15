import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Card, Spin, Alert, List, Button, Space } from 'antd'
import { PlayCircleOutlined, CheckCircleOutlined, LeftOutlined } from '@ant-design/icons'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const { Title, Paragraph, Text } = Typography

export default function CourseLearnPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    let isMounted = true

    // Check if course is purchased
    api.get(`/purchases/check/${id}`)
      .then((res) => {
        if (!res.purchased) {
          navigate(`/course/${id}`)
          return
        }
      })
      .catch(() => {
        if (isMounted) navigate(`/course/${id}`)
      })

    // Load course and videos
    Promise.all([
      api.get(`/courses/${id}`),
      api.get(`/courses/${id}/videos`)
    ])
      .then(([courseData, videosData]) => {
        if (isMounted) {
          setCourse(courseData)
          setVideos(videosData || [])
          if (videosData && videosData.length > 0) {
            setSelectedVideo(videosData[0])
          }
        }
      })
      .catch(() => {
        if (isMounted) setError('Failed to load course content')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [id, user, navigate])

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!user) {
    return null
  }

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
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: '#1f2937', color: '#fff', padding: '24px 0' }}>
        <div className="container">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate(`/course/${id}`)}
            style={{ color: '#fff', marginBottom: '16px' }}
          >
            Back to Course
          </Button>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>{course.title}</Title>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 0' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <Card style={{ marginBottom: '24px' }}>
              {selectedVideo ? (
                <div>
                  <div style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    background: '#000',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <video
                      key={selectedVideo.id}
                      controls
                      style={{ width: '100%', height: '100%' }}
                      src={
                        selectedVideo.videoUrl?.startsWith('http') 
                          ? selectedVideo.videoUrl 
                          : `http://localhost:8080/api/videos/${selectedVideo.id}/stream`
                      }
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <Title level={3} style={{ marginTop: 0 }}>{selectedVideo.title}</Title>
                  {selectedVideo.description && (
                    <Paragraph>{selectedVideo.description}</Paragraph>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <Text type="secondary">Select a video to start learning</Text>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Course Content" style={{ position: 'sticky', top: '100px' }}>
              <List
                dataSource={videos}
                renderItem={(video, index) => (
                  <List.Item
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      background: selectedVideo?.id === video.id ? 'var(--bg-subtle)' : 'transparent',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: selectedVideo?.id === video.id ? '1px solid var(--primary)' : '1px solid transparent'
                    }}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <Space>
                      {selectedVideo?.id === video.id ? (
                        <PlayCircleOutlined style={{ color: 'var(--primary)' }} />
                      ) : (
                        <CheckCircleOutlined style={{ color: 'var(--text-muted)' }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <Text strong={selectedVideo?.id === video.id}>
                          {index + 1}. {video.title}
                        </Text>
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {formatDuration(video.duration)}
                          </Text>
                        </div>
                      </div>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

