import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout, Typography, Menu, Spin, Alert, Button, Progress, Space, message, Collapse, Tag } from 'antd'
import { PlayCircleOutlined, CheckCircleOutlined, LockOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const { Title, Text } = Typography
const { Sider, Content } = Layout

export default function CourseLearningPage() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const { user, token } = useAuth()
    const videoRef = useRef(null)

    const [courseLessons, setCourseLessons] = useState(null)
    const [currentVideo, setCurrentVideo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [collapsed, setCollapsed] = useState(false)
    const [completedVideos, setCompletedVideos] = useState(new Set())

    useEffect(() => {
        if (!user) {
            localStorage.setItem('redirectAfterLogin', `/learn/${courseId}`)
            navigate('/login')
            return
        }

        // Check access and load lessons
        api.get(`/courses/${courseId}/check-access`)
            .then(res => {
                if (!res?.hasAccess) {
                    message.warning('You need to purchase this course first')
                    navigate(`/course/${courseId}`)
                    return
                }
                return api.get(`/courses/${courseId}/lessons`)
            })
            .then(data => {
                if (data) {
                    setCourseLessons(data)
                    // Set first video as current
                    if (data.sections?.length > 0 && data.sections[0].videos?.length > 0) {
                        setCurrentVideo(data.sections[0].videos[0])
                    }
                }
            })
            .catch(err => {
                console.error('Failed to load lessons:', err)
                if (err.message?.includes('403') || err.message?.includes('purchase')) {
                    message.warning('You need to purchase this course first')
                    navigate(`/course/${courseId}`)
                } else {
                    message.error('Failed to load course lessons')
                }
            })
            .finally(() => setLoading(false))
    }, [courseId, user, navigate])

    const handleVideoSelect = (video) => {
        setCurrentVideo(video)
        if (videoRef.current) {
            videoRef.current.load()
        }
    }

    const handleVideoEnded = () => {
        if (currentVideo) {
            setCompletedVideos(prev => new Set([...prev, currentVideo.id]))

            // Update progress on backend
            const totalVideos = courseLessons.totalVideos || 1
            const completed = completedVideos.size + 1
            const percent = Math.round((completed / totalVideos) * 100)
            api.post(`/courses/${courseId}/progress`, { percent }).catch(() => { })
        }
    }

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
                <Spin size="large" tip="Loading course..." />
            </div>
        )
    }

    if (!courseLessons) {
        return (
            <div className="container section-padding">
                <Alert message="Course not found or access denied" type="error" showIcon />
                <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>
                    Back to Home
                </Button>
            </div>
        )
    }

    const progress = courseLessons.totalVideos > 0
        ? Math.round((completedVideos.size / courseLessons.totalVideos) * 100)
        : 0

    // Build menu items from sections
    const menuItems = courseLessons.sections?.map((section, sectionIdx) => ({
        key: `section-${section.id}`,
        label: (
            <div style={{ fontWeight: 600, padding: '8px 0' }}>
                Section {sectionIdx + 1}: {section.title}
            </div>
        ),
        children: section.videos?.map((video, videoIdx) => ({
            key: `video-${video.id}`,
            icon: completedVideos.has(video.id) ? (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
            ) : (
                <PlayCircleOutlined />
            ),
            label: (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: currentVideo?.id === video.id ? 'var(--primary-light)' : 'transparent',
                        padding: '4px 8px',
                        borderRadius: '4px'
                    }}
                >
                    <span style={{
                        fontWeight: currentVideo?.id === video.id ? 600 : 400,
                        maxWidth: '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {videoIdx + 1}. {video.title}
                    </span>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatDuration(video.duration)}
                    </Text>
                </div>
            ),
            onClick: () => handleVideoSelect(video)
        }))
    })) || []

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Video Player Section */}
            <Content style={{ background: '#000', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    background: '#1f2937',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Space>
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/my-learning')}
                            style={{ color: '#fff' }}
                        >
                            Back
                        </Button>
                        <Title level={5} style={{ margin: 0, color: '#fff' }}>
                            {courseLessons.courseTitle}
                        </Title>
                    </Space>
                    <Space>
                        <Text style={{ color: '#fff' }}>Progress: {progress}%</Text>
                        <Progress
                            percent={progress}
                            size="small"
                            style={{ width: '120px' }}
                            strokeColor="#52c41a"
                        />
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ color: '#fff' }}
                        />
                    </Space>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {currentVideo ? (
                        <video
                            ref={videoRef}
                            controls
                            autoPlay
                            onEnded={handleVideoEnded}
                            style={{
                                width: '100%',
                                maxHeight: 'calc(100vh - 200px)',
                                background: '#000'
                            }}
                        >
                            <source src={currentVideo.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div style={{ color: '#fff', textAlign: 'center' }}>
                            <PlayCircleOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
                            <Title level={4} style={{ color: '#fff' }}>Select a lesson to start learning</Title>
                        </div>
                    )}
                </div>

                {currentVideo && (
                    <div style={{
                        background: '#1f2937',
                        padding: '16px 24px',
                        borderTop: '1px solid #374151'
                    }}>
                        <Title level={4} style={{ margin: 0, color: '#fff' }}>
                            {currentVideo.title}
                        </Title>
                        {currentVideo.description && (
                            <Text style={{ color: '#9ca3af' }}>{currentVideo.description}</Text>
                        )}
                    </div>
                )}
            </Content>

            {/* Curriculum Sidebar */}
            <Sider
                width={380}
                collapsedWidth={0}
                collapsed={collapsed}
                style={{
                    background: '#fff',
                    borderLeft: '1px solid #e5e7eb',
                    overflow: 'auto',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    right: 0
                }}
            >
                <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                    <Title level={5} style={{ margin: 0 }}>Course Content</Title>
                    <Text type="secondary">
                        {courseLessons.sections?.length || 0} sections • {courseLessons.totalVideos || 0} lectures
                    </Text>
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={currentVideo ? [`video-${currentVideo.id}`] : []}
                    defaultOpenKeys={courseLessons.sections?.map(s => `section-${s.id}`) || []}
                    items={menuItems}
                    style={{ border: 'none' }}
                />
            </Sider>
        </Layout>
    )
}
