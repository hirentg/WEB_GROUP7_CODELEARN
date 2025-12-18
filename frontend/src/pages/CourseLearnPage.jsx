import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Card, Spin, Alert, List, Button, Space, Tag, message, Progress, Modal, Input, Form, Avatar, Divider, Badge } from 'antd'
import { PlayCircleOutlined, CheckCircleOutlined, LeftOutlined, FormOutlined, TrophyOutlined, QuestionCircleOutlined, UserOutlined, MessageOutlined, LikeOutlined } from '@ant-design/icons'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

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
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [submittingQuestion, setSubmittingQuestion] = useState(false)
  const [form] = Form.useForm()

  // Q&A State
  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)

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
      api.get(`/quizzes/course/${id}`).catch(() => [])
    ])
      .then(([courseData, videosData, quizzesData]) => {
        if (isMounted) {
          setCourse(courseData)
          setVideos(videosData || [])
          setQuizzes(Array.isArray(quizzesData) ? quizzesData : [])
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

    // Load watched videos from localStorage
    const savedWatched = localStorage.getItem(`watched_${id}`)
    if (savedWatched) {
      setWatchedVideos(new Set(JSON.parse(savedWatched)))
    }

    return () => { isMounted = false }
  }, [id, user, navigate])

  // Fetch questions when video changes
  useEffect(() => {
    if (selectedVideo?.id) {
      setLoadingQuestions(true)
      api.get(`/questions/video/${selectedVideo.id}`)
        .then(data => setQuestions(Array.isArray(data) ? data : []))
        .catch(() => setQuestions([]))
        .finally(() => setLoadingQuestions(false))
    }
  }, [selectedVideo?.id])

  // Save watched videos to localStorage
  useEffect(() => {
    if (watchedVideos.size > 0) {
      localStorage.setItem(`watched_${id}`, JSON.stringify([...watchedVideos]))
    }
  }, [watchedVideos, id])

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return ''
    const now = new Date()
    const date = new Date(timestamp)
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
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

  const handleAskQuestion = async (values) => {
    if (!selectedVideo) {
      message.warning('Please select a video first')
      return
    }

    setSubmittingQuestion(true)
    try {
      await api.post('/questions', {
        videoId: selectedVideo.id,
        title: values.title,
        content: values.content
      })
      message.success('Question submitted successfully!')
      setQuestionModalOpen(false)
      form.resetFields()
      // Refresh questions
      const data = await api.get(`/questions/video/${selectedVideo.id}`)
      setQuestions(Array.isArray(data) ? data : [])
    } catch (err) {
      message.error('Failed to submit question')
    } finally {
      setSubmittingQuestion(false)
    }
  }

  // Calculate progress
  const progressPercent = videos.length > 0
    ? Math.round((watchedVideos.size / videos.length) * 100)
    : 0

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

          {/* Progress Bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Text style={{ color: '#d1d5db' }}>Course Progress</Text>
              <Text style={{ color: '#fff', fontWeight: 600 }}>{progressPercent}% Complete</Text>
            </div>
            <Progress
              percent={progressPercent}
              showInfo={false}
              strokeColor={{ from: '#6366f1', to: '#8b5cf6' }}
              trailColor="rgba(255,255,255,0.2)"
            />
          </div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <Title level={3} style={{ marginTop: 0, marginBottom: 0 }}>{selectedVideo.title}</Title>
                    <Button
                      icon={<QuestionCircleOutlined />}
                      onClick={() => setQuestionModalOpen(true)}
                    >
                      Ask a Question
                    </Button>
                  </div>
                  {selectedVideo.description && <Paragraph>{selectedVideo.description}</Paragraph>}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <Text type="secondary">Select a video to start learning</Text>
                </div>
              )}
            </Card>

            {/* Q&A Discussion Section */}
            <Card
              title={
                <Space>
                  <MessageOutlined />
                  <span>Q&A Discussion</span>
                  <Badge count={questions.length} style={{ backgroundColor: '#6366f1' }} />
                </Space>
              }
              extra={
                <Button type="primary" size="small" onClick={() => setQuestionModalOpen(true)}>
                  Ask Question
                </Button>
              }
            >
              {loadingQuestions ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Spin />
                </div>
              ) : questions.length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={questions}
                  renderItem={(question) => (
                    <List.Item style={{ padding: '16px 0' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Avatar
                          src={question.userAvatar}
                          icon={!question.userAvatar && <UserOutlined />}
                          style={{
                            backgroundColor: question.isAnswered ? '#52c41a' : '#6366f1',
                            flexShrink: 0
                          }}
                        >
                          {!question.userAvatar && question.userName?.charAt(0)}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <Text strong style={{ fontSize: '15px' }}>{question.userName}</Text>
                              <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
                                {formatTimeAgo(question.createdAt)}
                              </Text>
                            </div>
                            {question.isAnswered && (
                              <Tag color="success">Answered</Tag>
                            )}
                          </div>

                          <Title level={5} style={{ margin: '8px 0 4px' }}>{question.title}</Title>
                          <Paragraph style={{ marginBottom: '12px', color: '#4b5563' }}>
                            {question.content}
                          </Paragraph>

                          {/* Answers */}
                          {question.answers && question.answers.length > 0 && (
                            <div style={{
                              marginTop: '12px',
                              padding: '12px',
                              background: '#f0fdf4',
                              borderRadius: '8px',
                              borderLeft: '3px solid #22c55e'
                            }}>
                              {question.answers.map((answer, idx) => (
                                <div key={answer.id} style={{ marginBottom: idx < question.answers.length - 1 ? 12 : 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <Avatar
                                      size="small"
                                      src={answer.userAvatar}
                                      icon={!answer.userAvatar && <UserOutlined />}
                                      style={{ backgroundColor: answer.isInstructorAnswer ? '#6366f1' : '#9ca3af' }}
                                    />
                                    <Text strong style={{ fontSize: '13px' }}>{answer.userName}</Text>
                                    {answer.isInstructorAnswer && (
                                      <Tag color="purple" style={{ fontSize: '10px' }}>Instructor</Tag>
                                    )}
                                    <Text type="secondary" style={{ fontSize: '11px' }}>
                                      {formatTimeAgo(answer.createdAt)}
                                    </Text>
                                  </div>
                                  <Paragraph style={{ marginBottom: 0, marginLeft: '32px', fontSize: '13px' }}>
                                    {answer.content}
                                  </Paragraph>
                                  {idx < question.answers.length - 1 && <Divider style={{ margin: '12px 0' }} />}
                                </div>
                              ))}
                            </div>
                          )}

                          <Space style={{ marginTop: '8px' }}>
                            <Button type="text" size="small" icon={<LikeOutlined />}>
                              {question.upvotes || 0}
                            </Button>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {question.answerCount || 0} {question.answerCount === 1 ? 'answer' : 'answers'}
                            </Text>
                          </Space>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  <MessageOutlined style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>No questions yet</div>
                  <div style={{ fontSize: '14px' }}>Be the first to ask a question about this video!</div>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            {/* Course Progress Card */}
            <Card
              title="Your Progress"
              style={{ marginBottom: '16px' }}
              extra={<Text type="secondary">{watchedVideos.size}/{videos.length} videos</Text>}
            >
              <Progress
                type="circle"
                percent={progressPercent}
                strokeColor={{ '0%': '#6366f1', '100%': '#8b5cf6' }}
                format={percent => (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{percent}%</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Complete</div>
                  </div>
                )}
              />
            </Card>

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
                  <Text type="secondary">No quizzes available yet</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {watchedVideos.size} / {videos.length} videos watched
                  </Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {/* Ask Question Modal */}
      <Modal
        title="Ask a Question"
        open={questionModalOpen}
        onCancel={() => {
          setQuestionModalOpen(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAskQuestion}>
          <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
            <Text type="secondary">About: </Text>
            <Text strong>{selectedVideo?.title}</Text>
          </div>

          <Form.Item
            name="title"
            label="Question Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Brief summary of your question" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Your Question"
            rules={[{ required: true, message: 'Please enter your question' }]}
          >
            <TextArea
              rows={4}
              placeholder="Describe your question in detail..."
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setQuestionModalOpen(false)
                form.resetFields()
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={submittingQuestion}>
                Submit Question
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
