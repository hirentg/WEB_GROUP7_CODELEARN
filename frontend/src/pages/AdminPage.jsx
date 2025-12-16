import { Card, Typography, Space } from 'antd'
import { useAuth } from '../context/AuthContext'

const { Title, Text } = Typography

export default function AdminPage() {
  const { user } = useAuth()

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={2}>Admin Dashboard</Title>
          <Text type="secondary">Welcome, {user?.name}</Text>
        </Card>

        <Card title="Admin Features">
          <Space direction="vertical" size="middle">
            <Text>• User Management</Text>
            <Text>• Course Approval</Text>
            <Text>• System Settings</Text>
            <Text>• Analytics</Text>
          </Space>
        </Card>
      </Space>
    </div>
  )
}
