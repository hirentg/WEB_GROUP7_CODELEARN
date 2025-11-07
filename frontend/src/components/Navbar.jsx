import { Link, useNavigate } from 'react-router-dom'
import { Layout, Input, Button, Avatar, Space, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'

const { Header } = Layout
const { Text } = Typography

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  return (
    <Header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 24px'
    }}>
      <Link to="/" style={{ fontSize: '20px', fontWeight: 800, color: '#111827', textDecoration: 'none' }}>
        CodeLearn
      </Link>
      
      <Input
        placeholder="Search for anything"
        prefix={<SearchOutlined />}
        style={{ maxWidth: '400px', flex: 1, margin: '0 24px' }}
      />
      
      <Space size="middle">
        {user ? (
          <>
            <Button type="text" onClick={() => navigate('/')}>My Learning</Button>
            <Button type="text" onClick={() => { logout(); navigate('/') }}>Logout</Button>
            <Avatar style={{ backgroundColor: '#111827' }}>
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </Avatar>
          </>
        ) : (
          <>
            <Button onClick={() => navigate('/login')}>Login</Button>
            <Button type="primary" onClick={() => navigate('/register')}>Sign up</Button>
          </>
        )}
      </Space>
    </Header>
  )
}


