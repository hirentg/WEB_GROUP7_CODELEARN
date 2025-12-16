import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message, Select } from 'antd'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const { Title } = Typography
const { Option } = Select

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  async function onFinish(values) {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', values)
      if (res && res.status === 'created') {
        message.success('Registration successful! Please login.')
        navigate('/login')
      } else {
        message.error('Registration failed')
      }
    } catch (e) {
      message.error(e.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px' }}>
      <Card>
        <Title level={2}>Create your account</Title>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          initialValues={{ role: 'STUDENT' }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input size="large" />
          </Form.Item>

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

          <Form.Item
            label="Register as"
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select size="large" placeholder="Select your role">
              <Option value="STUDENT">Student</Option>
              <Option value="INSTRUCTOR">Instructor</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}


