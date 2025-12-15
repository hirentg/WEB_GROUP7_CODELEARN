import React, { useState } from 'react'
import { Menu, Avatar, Space, Badge, Popover, Button, Divider } from 'antd'
import {
  DashboardOutlined,
  BookOutlined,
  ProfileOutlined,
  TeamOutlined,
  LineChartOutlined,
  SettingOutlined,
  BellOutlined,
  MessageOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons'

const items = [
  { key: 'overview', icon: <DashboardOutlined />, label: 'Overview' },
  { key: 'courses', icon: <BookOutlined />, label: 'Courses' },
  { key: 'quizzes', icon: <ProfileOutlined />, label: 'Quizzes & Assignments' },
  { key: 'interactions', icon: <TeamOutlined />, label: 'Student Interactions' },
  { key: 'analytics', icon: <LineChartOutlined />, label: 'Analytics' },
  { key: 'profile', icon: <SettingOutlined />, label: 'Profile & Settings' },
]

// Mock notifications data - initial load
const initialNotifications = [
  {
    id: 1,
    type: 'question',
    icon: <MessageOutlined style={{ color: '#f97316' }} />,
    bgColor: '#fed7aa',
    title: 'New Question from Maria Garcia',
    message: 'What is the difference between map and forEach?',
    course: 'JavaScript Mastery',
    time: 'Just now',
    unread: true,
  },
  {
    id: 2,
    type: 'question',
    icon: <MessageOutlined style={{ color: '#f97316' }} />,
    bgColor: '#fed7aa',
    title: 'New Question from David Lee',
    message: 'Can you explain decorators?',
    course: 'Python Basics',
    time: 'Just now',
    unread: true,
  },
  {
    id: 3,
    type: 'question',
    icon: <MessageOutlined style={{ color: '#f97316' }} />,
    bgColor: '#fed7aa',
    title: 'New Question from Maria Garcia',
    message: 'What is the difference between map and forEach?',
    course: 'JavaScript Mastery',
    time: 'Just now',
    unread: true,
  },
  {
    id: 4,
    type: 'question',
    icon: <MessageOutlined style={{ color: '#f97316' }} />,
    bgColor: '#fed7aa',
    title: 'New Question from Alex Thompson',
    message: 'How do async functions work?',
    course: 'JavaScript Advanced',
    time: 'Just now',
    unread: true,
  },
]

// Additional notifications for "load more"
const additionalNotifications = [
  {
    id: 5,
    type: 'question',
    icon: <MessageOutlined style={{ color: '#f97316' }} />,
    bgColor: '#fed7aa',
    title: 'New Question from Sarah Johnson',
    message: 'Can you explain useState hook?',
    course: 'React Fundamentals',
    time: '1 hour ago',
    unread: false,
  },
  {
    id: 6,
    type: 'question',
    icon: <MessageOutlined style={{ color: '#f97316' }} />,
    bgColor: '#fed7aa',
    title: 'New Question from John Doe',
    message: 'What is the difference between let and const?',
    course: 'JavaScript Basics',
    time: '2 hours ago',
    unread: false,
  },
  {
    id: 7,
    type: 'question',
    icon: <MessageOutlined style={{ color: '#f97316' }} />,
    bgColor: '#fed7aa',
    title: 'New Question from Emily Chen',
    message: 'How to use useEffect properly?',
    course: 'React Advanced',
    time: '3 hours ago',
    unread: false,
  },
]

const NotificationContent = ({ onClose }) => {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [hasMore, setHasMore] = useState(true)
  const [loadedMore, setLoadedMore] = useState(false)
  
  const handleRemoveNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }
  
  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ))
  }
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }
  
  const handleLoadMore = () => {
    if (!loadedMore) {
      setNotifications([...notifications, ...additionalNotifications])
      setLoadedMore(true)
      setHasMore(false) // No more notifications after this
    }
  }
  
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div style={{ width: 420, maxHeight: 600, display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1f2937' }}>Notifications</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>{unreadCount} unread</p>
        </div>
        <Button 
          type="link" 
          size="small" 
          onClick={handleMarkAllAsRead}
          style={{ padding: 0, fontSize: 13, color: '#6366f1', fontWeight: 500 }}
        >
          Mark all read
        </Button>
      </div>
      
      <div style={{ flex: 1, overflow: 'auto', background: '#f9fafb' }}>
        {notifications.map((notification, index) => (
          <div key={notification.id}>
            <div
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                background: notification.unread ? '#fff' : '#fafafa',
                margin: '8px 12px',
                borderRadius: 8,
                position: 'relative',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                border: notification.unread ? '1px solid #f3f4f6' : '1px solid #e5e7eb',
                opacity: notification.unread ? 1 : 0.6,
                transition: 'all 0.3s ease'
              }}
            >
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined style={{ fontSize: 12 }} />}
                onClick={() => handleRemoveNotification(notification.id)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  padding: '4px',
                  height: 24,
                  width: 24,
                  color: '#9ca3af'
                }}
              />
              
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: notification.unread ? notification.bgColor : '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 18,
                  opacity: notification.unread ? 1 : 0.5,
                }}>
                  {React.cloneElement(notification.icon, {
                    style: { color: notification.unread ? '#f97316' : '#9ca3af' }
                  })}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 20 }}>
                  <div style={{ 
                    fontWeight: notification.unread ? 600 : 500, 
                    fontSize: 14,
                    color: notification.unread ? '#1f2937' : '#6b7280',
                    marginBottom: 4
                  }}>
                    {notification.title}
                  </div>
                  <p style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: 13, 
                    color: notification.unread ? '#6b7280' : '#9ca3af',
                    lineHeight: 1.5
                  }}>
                    {notification.message}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 8
                  }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                      {notification.course}
                    </span>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
              
              {notification.unread && (
                <div style={{ paddingLeft: 52 }}>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => handleMarkAsRead(notification.id)}
                    style={{
                      padding: 0,
                      fontSize: 13,
                      color: '#6366f1',
                      fontWeight: 500,
                      height: 'auto'
                    }}
                  >
                    Mark as read
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div style={{ 
          padding: '12px 20px', 
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center',
          background: '#fff'
        }}>
          <Button 
            type="link" 
            onClick={handleLoadMore}
            style={{ fontSize: 14, color: '#6366f1', fontWeight: 500 }}
          >
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  )
}

const SidebarInstructor = ({ selected = 'overview', onSelect = () => {} }) => {
  const [notificationOpen, setNotificationOpen] = useState(false)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 24px' }}>
        <Avatar size={48} style={{ background: '#6366f1' }}>P</Avatar>
        <div>
          <div style={{ fontWeight: 700 }}>Code Learn</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Instructor Dashboard</div>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selected]}
        onClick={(e) => onSelect(e.key)}
        items={items}
        style={{ borderRight: 'none', flex: 1 }}
      />
      
      {/* Notifications at bottom */}
      <div style={{ 
        padding: '16px 8px',
        borderTop: '1px solid #f3f4f6',
        marginTop: 'auto'
      }}>
        <Popover
          content={<NotificationContent onClose={() => setNotificationOpen(false)} />}
          trigger="click"
          placement="rightBottom"
          open={notificationOpen}
          onOpenChange={setNotificationOpen}
          overlayStyle={{ padding: 0 }}
          overlayInnerStyle={{ padding: 0, borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <BellOutlined style={{ fontSize: 20, color: '#374151' }} />
            <span style={{ fontSize: 15, fontWeight: 500, color: '#374151' }}>
              Notifications
            </span>
            <Badge 
              count={340} 
              style={{ 
                marginLeft: 'auto',
                background: '#ef4444',
                fontSize: 11,
                height: 20,
                lineHeight: '20px',
                minWidth: 20,
                padding: '0 6px'
              }} 
            />
          </div>
        </Popover>
      </div>
    </div>
  )
}

export default SidebarInstructor
