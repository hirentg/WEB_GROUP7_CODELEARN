import { Link, useNavigate } from 'react-router-dom'
import { Layout, Input, Button, Avatar, Space, Badge, Dropdown } from 'antd'
import { SearchOutlined, BellOutlined, UserOutlined, LogoutOutlined, BookOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'

const { Header } = Layout

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const userMenu = [
    {
      key: 'learning',
      label: 'My Learning',
      icon: <BookOutlined />,
      onClick: () => navigate('/')
    },
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
            placeholder="Search for anything..."
            prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
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
              <Link to="/my-learning" style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500 }}>
                My Learning
              </Link>
              <Badge dot offset={[-4, 4]}>
                <BellOutlined style={{ fontSize: '20px', color: 'var(--text-secondary)', cursor: 'pointer' }} />
              </Badge>
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


