import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Card, Form, Input, Button, Avatar, Spin, Alert, message, Divider } from 'antd'
import { UserOutlined, EditOutlined, SaveOutlined, GlobalOutlined, MailOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { userApi } from '../services/userApi'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

export default function ProfilePage() {
    const { user: authUser } = useAuth()
    const navigate = useNavigate()

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editing, setEditing] = useState(false)
    const [error, setError] = useState('')
    const [form] = Form.useForm()

    useEffect(() => {
        if (!authUser) {
            navigate('/login')
            return
        }

        loadProfile()
    }, [authUser, navigate])

    const loadProfile = async () => {
        try {
            const data = await userApi.getMyProfile()
            setProfile(data)
            form.setFieldsValue(data)
        } catch (err) {
            setError('Failed to load profile')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (values) => {
        setSaving(true)
        try {
            const updated = await userApi.updateMyProfile(values)
            setProfile(updated)
            setEditing(false)
            message.success('Profile updated successfully!')
        } catch (err) {
            message.error('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (!authUser) return null

    if (loading) {
        return (
            <div style={{ height: '60vh', display: 'grid', placeItems: 'center' }}>
                <Spin size="large" tip="Loading profile..." />
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

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            {/* Header */}
            <div style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '60px 0 80px'
            }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <Avatar
                        size={120}
                        src={profile?.avatarUrl}
                        icon={<UserOutlined />}
                        style={{
                            border: '4px solid white',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                    />
                    <Title level={2} style={{ color: '#fff', marginTop: 16, marginBottom: 4 }}>
                        {profile?.name || 'User'}
                    </Title>
                    {profile?.headline && (
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                            {profile.headline}
                        </Text>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="container" style={{
                marginTop: -40,
                paddingBottom: 60,
                maxWidth: 700
            }}>
                <Card
                    style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    extra={
                        !editing && (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        )
                    }
                >
                    {editing ? (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSave}
                            initialValues={profile}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Name is required' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Your name" />
                            </Form.Item>

                            <Form.Item label="Headline" name="headline">
                                <Input placeholder="e.g., Software Developer | Tech Enthusiast" />
                            </Form.Item>

                            <Form.Item label="Bio" name="bio">
                                <TextArea
                                    rows={4}
                                    placeholder="Tell us about yourself..."
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>

                            <Form.Item label="Website" name="website">
                                <Input prefix={<GlobalOutlined />} placeholder="https://your-website.com" />
                            </Form.Item>

                            <Form.Item label="Avatar URL" name="avatarUrl">
                                <Input placeholder="https://example.com/avatar.jpg" />
                            </Form.Item>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={saving}
                                    icon={<SaveOutlined />}
                                >
                                    Save Changes
                                </Button>
                                <Button onClick={() => {
                                    setEditing(false)
                                    form.setFieldsValue(profile)
                                }}>
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    ) : (
                        <div>
                            <div style={{ marginBottom: 24 }}>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                                    <MailOutlined /> Email
                                </Text>
                                <Text strong>{profile?.email}</Text>
                            </div>

                            {profile?.bio && (
                                <div style={{ marginBottom: 24 }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                                        About
                                    </Text>
                                    <Paragraph style={{ marginBottom: 0 }}>{profile.bio}</Paragraph>
                                </div>
                            )}

                            {profile?.website && (
                                <div style={{ marginBottom: 24 }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                                        <GlobalOutlined /> Website
                                    </Text>
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                        {profile.website}
                                    </a>
                                </div>
                            )}

                            <Divider />

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Role</Text>
                                    <br />
                                    <Text strong>{profile?.role}</Text>
                                </div>
                                <div>
                                    <Text type="secondary">Member Since</Text>
                                    <br />
                                    <Text strong>
                                        {profile?.createdAt
                                            ? new Date(profile.createdAt).toLocaleDateString()
                                            : 'N/A'}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
