import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Rate, Button, Card, Spin, Alert, List, Space, Breadcrumb, Divider, Tag, message, Avatar, Input, Form } from 'antd'
import { PlayCircleOutlined, CheckCircleOutlined, GlobalOutlined, ClockCircleOutlined, FileTextOutlined, UserOutlined, PlayCircleFilled, CheckCircleFilled, ShoppingCartOutlined, StarFilled } from '@ant-design/icons'
import { api } from '../services/api'
import cartApi from '../services/cartApi'
import { ratingApi } from '../services/ratingApi'
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
  const [addingToCart, setAddingToCart] = useState(false)
  const [error, setError] = useState('')
  const [reviews, setReviews] = useState([])
  const [userRating, setUserRating] = useState(null)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewForm] = Form.useForm()

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

  // Load reviews
  useEffect(() => {
    if (id) {
      ratingApi.getCourseRatings(id)
        .then(data => setReviews(Array.isArray(data) ? data : []))
        .catch(() => { })
    }
  }, [id])

  // Load user's rating if logged in
  useEffect(() => {
    if (user && id && isPurchased) {
      ratingApi.getUserRating(id)
        .then(data => {
          if (data) {
            setUserRating(data)
            reviewForm.setFieldsValue({ rating: data.rating, review: data.review })
          }
        })
        .catch(() => { })
    }
  }, [user, id, isPurchased, reviewForm])

  const handleSubmitReview = async (values) => {
    if (!user || !isPurchased) return
    setSubmittingReview(true)
    try {
      const newRating = await ratingApi.submitRating(id, values.rating, values.review)
      setUserRating(newRating)
      message.success(userRating ? 'Review updated!' : 'Review submitted!')
      // Reload reviews
      const updatedReviews = await ratingApi.getCourseRatings(id)
      setReviews(Array.isArray(updatedReviews) ? updatedReviews : [])
    } catch (err) {
      message.error('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const handlePurchase = () => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', `/checkout/${id}`)
      navigate('/login')
      return
    }
    // Navigate to checkout page instead of direct purchase
    navigate(`/checkout/${id}`)
  }

  const handleAddToCart = async () => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', `/course/${id}`)
      navigate('/login')
      return
    }
    setAddingToCart(true)
    try {
      await cartApi.addToCart(id)
      message.success('Course added to cart!')
    } catch (err) {
      const errorMsg = err?.response?.data?.error || 'Failed to add to cart'
      message.error(errorMsg)
    } finally {
      setAddingToCart(false)
    }
  }

  // Helper to format video duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Parse whatYouLearn (could be JSON array or newline-separated string)
  const parseWhatYouLearn = () => {
    if (!course?.whatYouLearn) return [
      'Build powerful applications from scratch',
      'Understand the core concepts deeply',
      'Best practices for clean code',
      'Deploy your apps to production'
    ]
    try {
      const parsed = JSON.parse(course.whatYouLearn)
      return Array.isArray(parsed) ? parsed : course.whatYouLearn.split('\n').filter(Boolean)
    } catch {
      return course.whatYouLearn.split('\n').filter(Boolean)
    }
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
                {parseWhatYouLearn().map((item, idx) => (
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
                <Text type="secondary">
                  {course.sections?.length || 0} sections • {course.lessons || 0} lectures • {course.duration || '0h'} total length
                </Text>
              </div>

              {course.sections && course.sections.length > 0 ? (
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
                  {course.sections.map((section, sectionIdx) => (
                    <details key={section.id || sectionIdx} style={{ borderBottom: sectionIdx < course.sections.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                      <summary style={{
                        padding: '16px 24px',
                        background: 'var(--bg-subtle)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>Section {sectionIdx + 1}: {section.title}</span>
                        <Text type="secondary" style={{ fontWeight: 400 }}>
                          {section.videos?.length || 0} lectures
                        </Text>
                      </summary>
                      <div style={{ background: 'var(--bg-surface)' }}>
                        {section.videos && section.videos.map((video, videoIdx) => (
                          <div key={video.id || videoIdx} style={{
                            padding: '12px 24px 12px 40px',
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <Space>
                              <PlayCircleOutlined style={{ color: 'var(--text-muted)' }} />
                              <Text>{video.title}</Text>
                            </Space>
                            <Text type="secondary">{formatDuration(video.duration)}</Text>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
                  <Text type="secondary">No course content available yet</Text>
                </div>
              )}
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
            <div style={{ marginBottom: '48px' }}>
              <Title level={3}>Description</Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                This course is designed to take you from beginner to advanced. We cover everything you need to know to build professional-grade applications.
                You will learn through hands-on projects and real-world examples. By the end of this course, you will be confident in your ability to tackle complex problems.
              </Paragraph>
            </div>

            {/* Student Reviews Section */}
            <div style={{ marginBottom: '48px' }}>
              <Title level={3}>
                <StarFilled style={{ color: '#f59e0b', marginRight: 8 }} />
                Student Reviews
                <Text type="secondary" style={{ fontSize: '16px', fontWeight: 400, marginLeft: 12 }}>
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </Text>
              </Title>

              {/* Submit Review Form - only for purchased courses */}
              {isPurchased && user && (
                <Card style={{ marginBottom: 24, background: 'var(--bg-subtle)' }}>
                  <Title level={5} style={{ marginTop: 0 }}>
                    {userRating ? 'Update Your Review' : 'Leave a Review'}
                  </Title>
                  <Form form={reviewForm} onFinish={handleSubmitReview} layout="vertical">
                    <Form.Item
                      name="rating"
                      label="Rating"
                      rules={[{ required: true, message: 'Please select a rating' }]}
                    >
                      <Rate />
                    </Form.Item>
                    <Form.Item name="review" label="Your Review (optional)">
                      <Input.TextArea
                        rows={3}
                        placeholder="Share your experience with this course..."
                        maxLength={500}
                        showCount
                      />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={submittingReview}>
                      {userRating ? 'Update Review' : 'Submit Review'}
                    </Button>
                  </Form>
                </Card>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={reviews}
                  renderItem={(review) => (
                    <List.Item style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={review.userAvatar}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: 'var(--primary)' }}
                          >
                            {review.userName?.[0]?.toUpperCase()}
                          </Avatar>
                        }
                        title={
                          <Space>
                            <Text strong>{review.userName || 'Anonymous'}</Text>
                            <Rate disabled value={review.rating} style={{ fontSize: 14 }} />
                          </Space>
                        }
                        description={
                          <div>
                            {review.review && (
                              <Paragraph style={{ marginBottom: 4, marginTop: 8 }}>
                                {review.review}
                              </Paragraph>
                            )}
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <Text type="secondary">No reviews yet. Be the first to review this course!</Text>
                </div>
              )}
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
                          icon={<ShoppingCartOutlined />}
                          onClick={handleAddToCart}
                          loading={addingToCart}
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




