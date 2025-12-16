import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { decodeJwt } from '../utils/jwt'

const { Title } = Typography

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  async function onFinish(values) {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', values)
      if (res && res.token) {
        // Decode token to verify role
        const tokenData = decodeJwt(res.token)
        const role = res.role || tokenData?.role
        
        // Save user data with role
        login({ email: res.email, name: res.name, role: role }, res.token)
        message.success('Login successful!')
        
        // Navigate based on role
        if (role === 'INSTRUCTOR') {
          navigate('/instructor')
        } else if (role === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        message.error('Invalid response from server')
      }
    } catch (e) {
      message.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px' }}>
      <Card>
        <Title level={2}>Login</Title>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}


