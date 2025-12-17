import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Card, Spin, Alert, List, Button, Space, Tag, message } from 'antd'
import { PlayCircleOutlined, CheckCircleOutlined, LeftOutlined, FormOutlined, TrophyOutlined } from '@ant-design/icons'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const { Title, Paragraph, Text } = Typography

export default function CourseLearnPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [watchedVideos, setWatchedVideos] = useState(new Set())

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    let isMounted = true

    // Check if course is purchased
    api.get(`/purchases/check/${id}`)
      .then((res) => {
        if (!res?.purchased) {
          navigate(`/course/${id}`)
          return
        }
      })
      .catch(() => {
        if (isMounted) navigate(`/course/${id}`)
      })

    // Load course, videos, and quizzes
    Promise.all([
      api.get(`/courses/${id}`),
      api.get(`/courses/${id}/videos`),
      api.get(`/quizzes`).catch(() => [])
    ])
      .then(([courseData, videosData, quizzesData]) => {
        if (isMounted) {
          setCourse(courseData)
          setVideos(videosData || [])
          const courseQuizzes = Array.isArray(quizzesData)
            ? quizzesData.filter(q => q.courseId === id)
            : []
          setQuizzes(courseQuizzes)
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

  const updateProgress = async (videoIndex) => {
    if (!videos.length) return
    const progressPercent = Math.round(((videoIndex + 1) / videos.length) * 100)
    try {
      await api.post('/purchases/progress', { courseId: id, progressPercent })
    } catch (err) {
      console.error('Failed to update progress:', err)
    }
  }

  const handleVideoEnd = () => {
    if (selectedVideo) {
      const currentIndex = videos.findIndex(v => v.id === selectedVideo.id)
      setWatchedVideos(prev => new Set([...prev, selectedVideo.id]))
      updateProgress(currentIndex)
      message.success('Video completed! 🎉')
    }
  }

  if (!user) return null

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
                      onEnded={handleVideoEnd}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <Title level={3} style={{ marginTop: 0 }}>{selectedVideo.title}</Title>
                  {selectedVideo.description && <Paragraph>{selectedVideo.description}</Paragraph>}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <Text type="secondary">Select a video to start learning</Text>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Course Content" style={{ marginBottom: '16px' }}>
              <List
                dataSource={videos}
                locale={{ emptyText: 'No videos available yet' }}
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
                      {watchedVideos.has(video.id) ? (
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      ) : selectedVideo?.id === video.id ? (
                        <PlayCircleOutlined style={{ color: 'var(--primary)' }} />
                      ) : (
                        <PlayCircleOutlined style={{ color: 'var(--text-muted)' }} />
                      )}
                      <div>
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

            <Card title={<Space><FormOutlined /><span>Course Quizzes</span></Space>}>
              {quizzes.length > 0 ? (
                <List
                  dataSource={quizzes}
                  renderItem={(quiz) => (
                    <List.Item>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text strong>{quiz.title}</Text>
                          <Tag color="blue">{quiz.questions?.length || 0} Q</Tag>
                        </div>
                        <Button
                          type="primary"
                          block
                          style={{ marginTop: '8px' }}
                          icon={<TrophyOutlined />}
                          onClick={() => navigate(`/quiz/${quiz.id}`)}
                        >
                          Take Quiz
                        </Button>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <Text type="secondary">Complete videos to unlock quizzes</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {watchedVideos.size} / {videos.length} watched
                  </Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
