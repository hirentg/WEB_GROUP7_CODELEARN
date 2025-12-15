import React, { useState } from 'react'
import { Card, Input, Button, Upload, Avatar, Checkbox, Space, Row, Col } from 'antd'
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

const { TextArea } = Input

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Professor',
    email: 'john.professor@codelearn.com',
    professionalTitle: 'Senior Software Engineer & Educator',
    bio: 'Passionate educator with 10+ years of experience in software development. Specialized in web technologies and love helping students master coding skills.',
    website: 'https://johnprofessor.dev',
    twitter: 'https://twitter.com/johnprofessor',
    linkedin: 'https://linkedin.com/in/johnprofessor',
    github: 'https://github.com/johnprofessor',
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyPerformance: true,
    allowDirectMessage: false,
    autoPublishAssignments: true,
  })

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handlePreferenceChange = (field, checked) => {
    setPreferences({ ...preferences, [field]: checked })
  }

  const handleSave = () => {
    console.log('Saving profile...', formData, preferences)
    // Handle save logic here
  }

  const quickStats = [
    { label: 'Total Courses', value: '8' },
    { label: 'Total Students', value: '1,234' },
    { label: 'Member Since', value: 'Jan 2024' },
    { label: 'Avg Rating', value: '4.8', icon: <StarFilled style={{ color: '#fbbf24', marginLeft: 4 }} /> },
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
                  src="https://randomuser.me/api/portraits/men/32.jpg"
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
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>First Name</label>
                </div>
                <Input 
                  size="large"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  style={{ borderRadius: 8 }}
                />
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Last Name</label>
                </div>
                <Input 
                  size="large"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  style={{ borderRadius: 8 }}
                />
              </Col>
            </Row>

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
                value={formData.professionalTitle}
                onChange={(e) => handleInputChange('professionalTitle', e.target.value)}
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
            {socialLinks.map((social) => (
              <div key={social.key} style={{ marginBottom: 16 }}>
                <Input 
                  size="large"
                  value={formData[social.key]}
                  onChange={(e) => handleInputChange(social.key, e.target.value)}
                  placeholder={social.placeholder}
                  prefix={
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: social.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 8
                    }}>
                      {React.cloneElement(social.icon, { 
                        style: { fontSize: 18, color: social.iconColor } 
                      })}
                    </div>
                  }
                  style={{ borderRadius: 8 }}
                />
              </div>
            ))}
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
    </div>
  )
}

export default ProfileSettings
