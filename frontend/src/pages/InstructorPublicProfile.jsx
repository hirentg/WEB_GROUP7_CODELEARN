import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Card, Row, Col, Avatar, Spin, Alert, Space, Tag, Rate, Divider } from 'antd'
import { UserOutlined, BookOutlined, StarFilled, TeamOutlined, CheckCircleFilled } from '@ant-design/icons'
import { api } from '../services/api'
import CourseCard from '../components/CourseCard'

const { Title, Text, Paragraph } = Typography

export default function InstructorPublicProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [instructor, setInstructor] = useState(null)
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return

        setLoading(true)
        Promise.all([
            api.get(`/instructor/profile/${id}/public`),
            api.get(`/courses/instructor/${id}`)
        ])
            .then(([profileData, coursesData]) => {
                setInstructor(profileData)
                setCourses(Array.isArray(coursesData) ? coursesData : [])
            })
            .catch((err) => {
                console.error('Failed to load instructor:', err)
                setError('Failed to load instructor profile')
            })
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div style={{ height: '60vh', display: 'grid', placeItems: 'center' }}>
                <Spin size="large" tip="Loading instructor profile..." />
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

    if (!instructor) {
        return (
            <div className="container section-padding">
                <Alert message="Instructor not found" type="warning" showIcon />
            </div>
        )
    }

    return (
        <div>
            {/* Header Section */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '60px 0',
                color: '#fff'
            }}>
                <div className="container">
                    <Row gutter={[32, 32]} align="middle">
                        <Col xs={24} md={6} style={{ textAlign: 'center' }}>
                            <Avatar
                                size={150}
                                src={instructor.avatarUrl}
                                icon={<UserOutlined />}
                                style={{
                                    border: '4px solid white',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                }}
                            />
                        </Col>
                        <Col xs={24} md={18}>
                            <Space align="center" style={{ marginBottom: 8 }}>
                                <Title level={1} style={{ color: '#fff', margin: 0 }}>
                                    {instructor.name}
                                </Title>
                                {instructor.isVerified && (
                                    <Tag color="blue" icon={<CheckCircleFilled />}>Verified Instructor</Tag>
                                )}
                            </Space>

                            {instructor.expertise && (
                                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, display: 'block', marginBottom: 16 }}>
                                    {instructor.expertise}
                                </Text>
                            )}

                            <Space size="large" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                <Space>
                                    <TeamOutlined />
                                    <span>{instructor.totalStudents?.toLocaleString() || 0} students</span>
                                </Space>
                                <Space>
                                    <BookOutlined />
                                    <span>{instructor.totalCourses || 0} courses</span>
                                </Space>
                                <Space>
                                    <StarFilled style={{ color: '#fbbf24' }} />
                                    <span>{instructor.avgRating?.toFixed(1) || '0.0'} rating</span>
                                </Space>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </div>

            <div className="container section-padding">
                <Row gutter={[48, 48]}>
                    {/* About Section */}
                    <Col xs={24} lg={8}>
                        <Card>
                            <Title level={4} style={{ marginTop: 0 }}>About</Title>

                            {instructor.bio ? (
                                <Paragraph style={{ marginBottom: 24 }}>
                                    {instructor.bio}
                                </Paragraph>
                            ) : (
                                <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                                    This instructor hasn't added a bio yet.
                                </Paragraph>
                            )}

                            {instructor.qualifications && (
                                <>
                                    <Text type="secondary" strong style={{ display: 'block', marginBottom: 8 }}>
                                        Qualifications
                                    </Text>
                                    <Paragraph style={{ whiteSpace: 'pre-line' }}>
                                        {instructor.qualifications}
                                    </Paragraph>
                                </>
                            )}

                            {instructor.createdAt && (
                                <>
                                    <Divider />
                                    <Text type="secondary">Member since</Text>
                                    <br />
                                    <Text>{new Date(instructor.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</Text>
                                </>
                            )}

                            {instructor.website && (
                                <>
                                    <Divider />
                                    <Text type="secondary">Website</Text>
                                    <br />
                                    <a href={instructor.website} target="_blank" rel="noopener noreferrer">
                                        {instructor.website}
                                    </a>
                                </>
                            )}
                        </Card>
                    </Col>

                    {/* Courses Section */}
                    <Col xs={24} lg={16}>
                        <Title level={3}>Courses by {instructor.name}</Title>

                        {courses.length > 0 ? (
                            <Row gutter={[24, 24]}>
                                {courses.map(course => (
                                    <Col xs={24} sm={12} key={course.id}>
                                        <CourseCard course={course} />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Card style={{ textAlign: 'center', padding: '40px 0' }}>
                                <Text type="secondary">No courses available yet</Text>
                            </Card>
                        )}
                    </Col>
                </Row>
            </div>
        </div>
    )
}
