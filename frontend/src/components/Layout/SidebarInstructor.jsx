import React from 'react'
import { Menu, Avatar, Space, Badge } from 'antd'
import {
  DashboardOutlined,
  BookOutlined,
  ProfileOutlined,
  TeamOutlined,
  LineChartOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons'

const items = [
  { key: 'overview', icon: <DashboardOutlined />, label: 'Overview' },
  { key: 'courses', icon: <BookOutlined />, label: 'Courses' },
  { key: 'quizzes', icon: <ProfileOutlined />, label: 'Quizzes & Assignments' },
  { key: 'interactions', icon: <TeamOutlined />, label: 'Student Interactions' },
  { key: 'analytics', icon: <LineChartOutlined />, label: 'Analytics' },
  { key: 'profile', icon: <SettingOutlined />, label: 'Profile & Settings' },
]

const SidebarInstructor = ({ selected = 'overview', onSelect = () => {} }) => {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 24px' }}>
        <Avatar size={48} style={{ background: '#6366f1' }}>P</Avatar>
        <div>
          <div style={{ fontWeight: 700 }}>Code Learn</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Instructor Dashboard</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Badge count={3} size="small">
            <BellOutlined style={{ fontSize: 18, color: '#374151' }} />
          </Badge>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selected]}
        onClick={(e) => onSelect(e.key)}
        items={items}
        style={{ borderRight: 'none' }}
      />
    </div>
  )
}

export default SidebarInstructor
