import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout, Input, Button, Avatar, Space, Badge, Dropdown, Popover, List, Typography, Spin } from 'antd'
import { SearchOutlined, BellOutlined, UserOutlined, LogoutOutlined, BookOutlined, ShoppingCartOutlined, CheckOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import notificationApi from '../services/notificationApi'
import cartApi from '../services/cartApi'

const { Header } = Layout
const { Text } = Typography

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (value) => {
    if (value?.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`)
      setSearchQuery('')
    }
  }

  // Fetch unread count and cart count periodically
  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      fetchCartCount()
      const interval = setInterval(() => {
        fetchUnreadCount()
        fetchCartCount()
      }, 30000) // Every 30 seconds
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchCartCount = async () => {
    try {
      const data = await cartApi.getCount()
      setCartCount(data?.count || 0)
    } catch (err) {
      console.error('Failed to fetch cart count')
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationApi.getUnreadCount()
      setUnreadCount(data?.count || 0)
    } catch (err) {
      console.error('Failed to fetch notification count')
    }
  }

  const fetchNotifications = async () => {
    setLoadingNotifications(true)
    try {
      const data = await notificationApi.getNotifications()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch notifications')
    } finally {
      setLoadingNotifications(false)
    }
  }

  const handleNotificationOpen = (open) => {
    setNotificationOpen(open)
    if (open) {
      fetchNotifications()
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications(prev => prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all as read')
    }
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

  const notificationContent = (
    <div style={{ width: '360px', maxHeight: '400px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Text strong style={{ fontSize: '16px' }}>Notifications</Text>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            onClick={handleMarkAllAsRead}
            style={{ padding: 0 }}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
        {loadingNotifications ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <Spin size="small" />
          </div>
        ) : notifications.length > 0 ? (
          <List
            dataSource={notifications.slice(0, 10)}
            renderItem={(notification) => (
              <List.Item
                style={{
                  padding: '12px 16px',
                  background: notification.isRead ? '#fff' : '#f0f7ff',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0'
                }}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong={!notification.isRead} style={{ fontSize: '14px' }}>
                      {notification.title}
                    </Text>
                    {!notification.isRead && (
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#6366f1',
                        flexShrink: 0,
                        marginTop: 4
                      }} />
                    )}
                  </div>
                  <Text
                    type="secondary"
                    style={{ fontSize: '13px', display: 'block', marginTop: 4 }}
                    ellipsis
                  >
                    {notification.message}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px', marginTop: 4, display: 'block' }}>
                    {formatTimeAgo(notification.createdAt)}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 24px', color: '#9ca3af' }}>
            <BellOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
            <div>No notifications yet</div>
          </div>
        )}
      </div>
    </div>
  )

  const userMenu = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    // Show My Learning for students, Dashboard for instructors
    ...(user?.role === 'INSTRUCTOR'
      ? [{
        key: 'dashboard',
        label: 'Dashboard',
        icon: <BookOutlined />,
        onClick: () => navigate('/instructor')
      }]
      : [{
        key: 'learning',
        label: 'My Learning',
        icon: <BookOutlined />,
        onClick: () => navigate('/my-learning')
      }]
    ),
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: () => { logout(); navigate('/') }
    }
  ]

  return (
    <Header className="navbar-glass" style={{
      padding: 0,
      height: 'auto',
      lineHeight: 'normal'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        <Link to="/" style={{
          fontSize: '24px',
          fontWeight: 800,
          background: 'linear-gradient(to right, var(--primary), var(--primary-hover))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none',
          letterSpacing: '-0.5px'
        }}>
          CodeLearn
        </Link>

        <div style={{ flex: 1, maxWidth: '480px', margin: '0 48px' }}>
          <Input
            size="large"
            placeholder="Search for courses..."
            prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={(e) => handleSearch(e.target.value)}
            style={{
              borderRadius: '999px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-subtle)'
            }}
            variant="borderless"
          />
        </div>

        <Space size="large">
          {user ? (
            <>
              {/* Show My Learning only for non-instructors (students) */}
              {user.role !== 'INSTRUCTOR' && (
                <Link to="/my-learning" style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
                  My Learning
                </Link>
              )}

              {/* Show Instructor Dashboard link for instructors */}
              {user.role === 'INSTRUCTOR' && (
                <Link to="/instructor" style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
                  Dashboard
                </Link>
              )}

              {/* Cart Icon - only for students */}
              {user.role !== 'INSTRUCTOR' && (
                <Badge count={cartCount} offset={[-4, 4]}>
                  <ShoppingCartOutlined
                    style={{ fontSize: '20px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => navigate('/cart')}
                  />
                </Badge>
              )}

              {/* Notification Bell - only for students */}
              {user.role !== 'INSTRUCTOR' && (
                <Popover
                  content={notificationContent}
                  trigger="click"
                  open={notificationOpen}
                  onOpenChange={handleNotificationOpen}
                  placement="bottomRight"
                  arrow={false}
                >
                  <Badge count={unreadCount} offset={[-4, 4]} size="small">
                    <BellOutlined style={{ fontSize: '20px', color: 'var(--text-secondary)', cursor: 'pointer' }} />
                  </Badge>
                </Popover>
              )}

              <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                <Avatar
                  size={40}
                  src={user.avatar}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: 'var(--primary)',
                    cursor: 'pointer',
                    border: '2px solid #fff',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {user.name?.[0]?.toUpperCase()}
                </Avatar>
              </Dropdown>
            </>
          ) : (
            <Space size="middle">
              <Button type="text" onClick={() => navigate('/login')} style={{ fontWeight: 600 }}>
                Log in
              </Button>
              <Button type="primary" onClick={() => navigate('/register')} shape="round" size="large" style={{ fontWeight: 600 }}>
                Sign up
              </Button>
            </Space>
          )}
        </Space>
      </div>
    </Header>
  )
}
