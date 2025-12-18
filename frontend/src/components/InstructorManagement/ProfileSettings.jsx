import React, { useState, useEffect } from 'react'
import { Card, Input, Button, Upload, Avatar, Checkbox, Space, Row, Col, message } from 'antd'
import { 
  CameraOutlined,
  GlobalOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  GithubOutlined,
  UserOutlined,
  SaveOutlined,
  StarFilled
} from '@ant-design/icons'
import { api } from '../../services/api'

const { TextArea } = Input

const ProfileSettings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    qualifications: '',
    bio: '',
    website: '',
    expertise: '',
    avatarUrl: ''
  })

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    avgRating: 0.0,
    memberSince: 'Jan 2024'
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyPerformance: true,
    allowDirectMessage: false,
    autoPublishAssignments: true,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await api.get('/instructor/profile')
      
      if (!data) {
        console.error('No data returned from API')
        message.error('Failed to load profile: No data returned')
        setLoading(false)
        return
      }
      
      setFormData({
        name: data.name || '',
        email: data.email || '',
        qualifications: data.qualifications || '',
        bio: data.bio || '',
        website: data.website || '',
        expertise: data.expertise || '',
        avatarUrl: data.avatarUrl || ''
      })
      
      // Format createdAt to "Month Year" format
      let memberSince = 'Jan 2024'
      if (data.createdAt) {
        const date = new Date(data.createdAt)
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December']
        memberSince = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      }
      
      setStats({
        totalCourses: data.totalCourses || 0,
        totalStudents: data.totalStudents || 0,
        avgRating: data.avgRating || 0.0,
        memberSince: memberSince
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      message.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handlePreferenceChange = (field, checked) => {
    setPreferences({ ...preferences, [field]: checked })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.put('/instructor/profile', formData)
      message.success('Profile updated successfully!')
      fetchProfile() // Refresh data
    } catch (error) {
      console.error('Error saving profile:', error)
      message.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const quickStats = [
    { label: 'Total Courses', value: stats.totalCourses.toString() },
    { label: 'Total Students', value: stats.totalStudents.toLocaleString() },
    { label: 'Member Since', value: stats.memberSince },
    { label: 'Avg Rating', value: stats.avgRating.toFixed(1), icon: <StarFilled style={{ color: '#fbbf24', marginLeft: 4 }} /> },
  ]

  const socialLinks = [
    { 
      key: 'website', 
      icon: <GlobalOutlined />, 
      placeholder: 'https://yourwebsite.com',
      bgColor: '#f3f4f6',
      iconColor: '#6b7280'
    },
    { 
      key: 'twitter', 
      icon: <TwitterOutlined />, 
      placeholder: 'https://twitter.com/username',
      bgColor: '#dbeafe',
      iconColor: '#3b82f6'
    },
    { 
      key: 'linkedin', 
      icon: <LinkedinOutlined />, 
      placeholder: 'https://linkedin.com/in/username',
      bgColor: '#dbeafe',
      iconColor: '#3b82f6'
    },
    { 
      key: 'github', 
      icon: <GithubOutlined />, 
      placeholder: 'https://github.com/username',
      bgColor: '#1f2937',
      iconColor: '#fff'
    },
  ]

  const teachingPrefs = [
    {
      key: 'emailNotifications',
      label: 'Email notifications for new questions',
      description: 'Receive an email when students ask questions',
    },
    {
      key: 'weeklyPerformance',
      label: 'Weekly performance summary',
      description: 'Get a weekly report of your course analytics',
    },
    {
      key: 'allowDirectMessage',
      label: 'Allow students to message directly',
      description: 'Enable private messaging with enrolled students',
    },
    {
      key: 'autoPublishAssignments',
      label: 'Auto-publish assignments',
      description: 'Automatically publish assignments when created',
    },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 8, fontSize: 28, fontWeight: 600 }}>Profile & Settings</h1>
      <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 15 }}>
        Manage your instructor profile and preferences
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p>Loading profile...</p>
        </div>
      ) : (
        <Row gutter={24}>
        {/* Left Column */}
        <Col span={8}>
          {/* Profile Photo Card */}
          <Card 
            title="Profile Photo" 
            style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #e5e7eb' }}
            styles={{ header: { fontWeight: 600, fontSize: 16 } }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                <Avatar 
                  size={140} 
                  icon={<UserOutlined />}
                  style={{ background: '#9ca3af' }}
                  src={formData.avatarUrl || "https://randomuser.me/api/portraits/men/32.jpg"}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  <CameraOutlined style={{ fontSize: 20, color: '#fff' }} />
                </div>
              </div>
              <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
                Upload a professional photo (JPG, PNG, max 5MB)
              </p>
            </div>
          </Card>

          {/* Quick Stats Card */}
          <Card 
            title="Quick Stats" 
            style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
            styles={{ header: { fontWeight: 600, fontSize: 16 } }}
          >
            {quickStats.map((stat, index) => (
              <div 
                key={stat.label}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index < quickStats.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}
              >
                <span style={{ color: '#6b7280', fontSize: 14 }}>{stat.label}</span>
                <span style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center' }}>
                  {stat.value}
                  {stat.icon}
                </span>
              </div>
            ))}
          </Card>
        </Col>

        {/* Right Column */}
        <Col span={16}>
          {/* Basic Information Card */}
          <Card 
            title="Basic Information" 
            style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #e5e7eb' }}
            styles={{ header: { fontWeight: 600, fontSize: 16 } }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Full Name</label>
              </div>
              <Input 
                size="large"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Email</label>
              </div>
              <Input 
                size="large"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Professional Title</label>
              </div>
              <Input 
                size="large"
                value={formData.qualifications}
                onChange={(e) => handleInputChange('qualifications', e.target.value)}
                placeholder="e.g., PhD in Computer Science, 10+ years teaching experience"
                style={{ borderRadius: 8 }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Expertise</label>
              </div>
              <Input 
                size="large"
                value={formData.expertise}
                onChange={(e) => handleInputChange('expertise', e.target.value)}
                placeholder="e.g., Web Development, Machine Learning, Cloud Computing"
                style={{ borderRadius: 8 }}
              />
            </div>

            <div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Bio</label>
              </div>
              <TextArea 
                rows={4}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                style={{ borderRadius: 8, fontSize: 14 }}
              />
            </div>
          </Card>

          {/* Social Links Card */}
          <Card 
            title="Social Links" 
            style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #e5e7eb' }}
            styles={{ header: { fontWeight: 600, fontSize: 16 } }}
          >
            <div style={{ marginBottom: 16 }}>
              <Input 
                size="large"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://github.com/username"
                prefix={
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8
                  }}>
                    <GithubOutlined style={{ fontSize: 18, color: '#fff' }} />
                  </div>
                }
                style={{ borderRadius: 8 }}
              />
            </div>
          </Card>

          {/* Teaching Preferences Card */}
          <Card 
            title="Teaching Preferences" 
            style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #e5e7eb' }}
            styles={{ header: { fontWeight: 600, fontSize: 16 } }}
          >
            {teachingPrefs.map((pref, index) => (
              <div 
                key={pref.key}
                style={{ 
                  paddingBottom: 16,
                  marginBottom: index < teachingPrefs.length - 1 ? 16 : 0,
                  borderBottom: index < teachingPrefs.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}
              >
                <Checkbox 
                  checked={preferences[pref.key]}
                  onChange={(e) => handlePreferenceChange(pref.key, e.target.checked)}
                  style={{ alignItems: 'flex-start' }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#1f2937', marginBottom: 4 }}>
                      {pref.label}
                    </div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>
                      {pref.description}
                    </div>
                  </div>
                </Checkbox>
              </div>
            ))}
          </Card>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button 
              size="large"
              onClick={fetchProfile}
              style={{ 
                borderRadius: 8,
                minWidth: 120,
                fontWeight: 500
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
              style={{ 
                background: '#6366f1',
                borderColor: '#6366f1',
                borderRadius: 8,
                minWidth: 160,
                fontWeight: 500
              }}
            >
              Save Changes
            </Button>
          </div>
        </Col>
      </Row>
      )}
    </div>
  )
}

export default ProfileSettings
