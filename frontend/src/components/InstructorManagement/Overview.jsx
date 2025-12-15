import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  UserOutlined, 
  BookOutlined, 
  QuestionCircleOutlined, 
  TrophyOutlined 
} from '@ant-design/icons'

const enrollmentData = [
  { month: 'Jan', students: 387 },
  { month: 'Feb', students: 542 },
  { month: 'Mar', students: 701 },
  { month: 'Apr', students: 892 },
  { month: 'May', students: 1045 },
  { month: 'Jun', students: 1234 },
]

export const Overview = () => {
  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>Welcome back, Professor!</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>Here's what's happening with your courses today</p>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 }}>Total Students</div>
                <div style={{ color: '#fff', fontSize: 30, fontWeight: 700 }}>1,234</div>
                <div style={{ color: '#d1fae5', marginTop: 8, fontSize: 13 }}>+12% from last month</div>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: 12, 
                width: 56, 
                height: 56, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <UserOutlined style={{ fontSize: 28, color: '#fff' }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 }}>Active Courses</div>
                <div style={{ color: '#fff', fontSize: 30, fontWeight: 700 }}>8</div>
                <div style={{ color: '#d1fae5', marginTop: 8, fontSize: 13 }}>+2 from last month</div>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: 12, 
                width: 56, 
                height: 56, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <BookOutlined style={{ fontSize: 28, color: '#fff' }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 }}>Pending Questions</div>
                <div style={{ color: '#fff', fontSize: 30, fontWeight: 700 }}>23</div>
                <div style={{ color: '#d1fae5', marginTop: 8, fontSize: 13 }}>+5 from last month</div>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: 12, 
                width: 56, 
                height: 56, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <QuestionCircleOutlined style={{ fontSize: 28, color: '#fff' }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 4 }}>Avg. Completion</div>
                <div style={{ color: '#fff', fontSize: 30, fontWeight: 700 }}>78%</div>
                <div style={{ color: '#d1fae5', marginTop: 8, fontSize: 13 }}>+3% from last month</div>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: 12, 
                width: 56, 
                height: 56, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <TrophyOutlined style={{ fontSize: 28, color: '#fff' }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Student Enrollment Trend">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={enrollmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280" 
              style={{ fontSize: 14 }}
            />
            <YAxis 
              stroke="#6b7280" 
              style={{ fontSize: 14 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: '8px 12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="students" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

export const Quizzes = () => (
  <div>
    <h2>Quizzes & Assignments</h2>
    <p>Manage quizzes and assignments here.</p>
  </div>
)

export const StudentInteractions = () => (
  <div>
    <h2>Student Interactions</h2>
    <p>Questions, messages and discussions appear here.</p>
  </div>
)

export const Analytics = () => (
  <div>
    <h2>Analytics</h2>
    <p>Course and student analytics dashboard.</p>
  </div>
)

export const ProfileSettings = () => (
  <div>
    <h2>Profile & Settings</h2>
    <p>Instructor profile and account settings.</p>
  </div>
)

export default null
