import React from 'react'
import { Card, Progress, Table, Space } from 'antd'
import { 
  RiseOutlined, 
  UserOutlined, 
  TrophyOutlined, 
  ClockCircleOutlined,
  StarFilled
} from '@ant-design/icons'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const Analytics = () => {
  // Top metrics data
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+18% this month',
      icon: <RiseOutlined style={{ fontSize: 24, color: '#10b981' }} />,
      bgColor: '#d1fae5',
    },
    {
      title: 'Active Students',
      value: '1,234',
      change: '+12% this month',
      icon: <UserOutlined style={{ fontSize: 24, color: '#3b82f6' }} />,
      bgColor: '#dbeafe',
    },
    {
      title: 'Course Rating',
      value: '4.8',
      change: 'From 567 reviews',
      icon: <TrophyOutlined style={{ fontSize: 24, color: '#f59e0b' }} />,
      bgColor: '#fef3c7',
    },
    {
      title: 'Avg Watch Time',
      value: '24m',
      change: '+5% this week',
      icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#a855f7' }} />,
      bgColor: '#f3e8ff',
    },
  ]

  // Course Performance data
  const coursePerformanceData = [
    { name: 'React Fund.', students: 456, completion: 82 },
    { name: 'JavaScript', students: 234, completion: 75 },
    { name: 'Python', students: 189, completion: 68 },
    { name: 'Web Dev', students: 567, completion: 71 },
  ]

  // Student Progress Distribution
  const progressData = [
    { name: 'Completed', value: 456, color: '#10b981' },
    { name: 'In Progress', value: 234, color: '#6366f1' },
    { name: 'Not Started', value: 8, color: '#f59e0b' },
  ]

  // Weekly Activity data
  const weeklyActivityData = [
    { day: 'Mon', activeStudents: 120, questionsAsked: 15 },
    { day: 'Tue', activeStudents: 150, questionsAsked: 22 },
    { day: 'Wed', activeStudents: 185, questionsAsked: 28 },
    { day: 'Thu', activeStudents: 170, questionsAsked: 25 },
    { day: 'Fri', activeStudents: 140, questionsAsked: 18 },
    { day: 'Sat', activeStudents: 95, questionsAsked: 12 },
    { day: 'Sun', activeStudents: 80, questionsAsked: 10 },
  ]

  // Most Engaging Lessons
  const engagingLessons = [
    { rank: 1, title: 'React Hooks', avgTime: '25 min avg', views: '450 views', completion: 85 },
    { rank: 2, title: 'State Management', avgTime: '30 min avg', views: '380 views', completion: 78 },
    { rank: 3, title: 'Component Lifecycle', avgTime: '22 min avg', views: '420 views', completion: 82 },
    { rank: 4, title: 'Async Patterns', avgTime: '28 min avg', views: '320 views', completion: 70 },
    { rank: 5, title: 'Testing', avgTime: '20 min avg', views: '290 views', completion: 65 },
  ]

  // Detailed Course Statistics
  const courseStatsColumns = [
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Students',
      dataIndex: 'students',
      key: 'students',
      align: 'center',
    },
    {
      title: 'Completion Rate',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (rate) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress 
            percent={rate} 
            showInfo={false} 
            strokeColor="#10b981"
            style={{ flex: 1, maxWidth: 200 }}
          />
          <span style={{ fontSize: 13, color: '#6b7280', minWidth: 35 }}>{rate}%</span>
        </div>
      ),
    },
    {
      title: 'Avg Score',
      dataIndex: 'avgScore',
      key: 'avgScore',
      align: 'center',
      render: (score) => (
        <span style={{ 
          background: '#dbeafe', 
          padding: '4px 12px', 
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          color: '#1e40af'
        }}>
          {score}%
        </span>
      ),
    },
    {
      title: 'Engagement',
      dataIndex: 'engagement',
      key: 'engagement',
      align: 'center',
      render: (stars) => (
        <Space size={2}>
          {[...Array(5)].map((_, i) => (
            <StarFilled key={i} style={{ fontSize: 14, color: '#fbbf24' }} />
          ))}
        </Space>
      ),
    },
  ]

  const courseStatsData = [
    { key: '1', course: 'React Fund.', students: 456, completionRate: 82, avgScore: 78, engagement: 5 },
    { key: '2', course: 'JavaScript', students: 234, completionRate: 75, avgScore: 85, engagement: 5 },
    { key: '3', course: 'Python', students: 189, completionRate: 68, avgScore: 72, engagement: 4 },
    { key: '4', course: 'Web Dev', students: 567, completionRate: 71, avgScore: 80, engagement: 5 },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 8, fontSize: 28, fontWeight: 600 }}>Analytics & Insights</h1>
      <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 15 }}>
        Track student progress and course performance
      </p>

      {/* Top Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        {metrics.map((metric, index) => (
          <Card key={index} style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>{metric.title}</div>
                <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>{metric.value}</div>
                <div style={{ 
                  color: metric.change.includes('+') ? '#10b981' : '#6b7280', 
                  fontSize: 13,
                  fontWeight: 500
                }}>
                  {metric.change}
                </div>
              </div>
              <div style={{ 
                width: 56, 
                height: 56, 
                borderRadius: 12, 
                background: metric.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {metric.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Course Performance & Student Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Course Performance Bar Chart */}
        <Card 
          title="Course Performance" 
          style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
          styles={{ header: { fontWeight: 600, fontSize: 16 } }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coursePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 13 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 13 }} />
              <Tooltip 
                contentStyle={{ 
                  background: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span style={{ color: '#6b7280', fontSize: 13 }}>
                    {value === 'completion' ? 'Completion %' : 'Students'}
                  </span>
                )}
              />
              <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completion" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Student Progress Distribution Pie Chart */}
        <Card 
          title="Student Progress Distribution" 
          style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
          styles={{ header: { fontWeight: 600, fontSize: 16 } }}
        >
          <div style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: 8
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: 14, color: '#10b981', fontWeight: 500 }}>Completed: 456</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#6366f1' }} />
                <span style={{ fontSize: 14, color: '#6366f1', fontWeight: 500 }}>In Progress: 234</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ fontSize: 14, color: '#f59e0b', fontWeight: 500 }}>Not Started: 8</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Activity & Most Engaging Lessons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Weekly Activity Line Chart */}
        <Card 
          title="Weekly Activity" 
          style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
          styles={{ header: { fontWeight: 600, fontSize: 16 } }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 13 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 13 }} />
              <Tooltip 
                contentStyle={{ 
                  background: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span style={{ color: '#6b7280', fontSize: 13 }}>
                    {value === 'activeStudents' ? 'Active Students' : 'Questions Asked'}
                  </span>
                )}
              />
              <Line 
                type="monotone" 
                dataKey="activeStudents" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ fill: '#6366f1', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="questionsAsked" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Most Engaging Lessons */}
        <Card 
          title="Most Engaging Lessons" 
          style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
          styles={{ header: { fontWeight: 600, fontSize: 16 } }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {engagingLessons.map((lesson) => (
              <div 
                key={lesson.rank}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 16,
                  padding: '12px 0',
                  borderBottom: lesson.rank < 5 ? '1px solid #f3f4f6' : 'none'
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: lesson.rank <= 3 ? '#e0e7ff' : '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                  color: lesson.rank <= 3 ? '#6366f1' : '#6b7280',
                  flexShrink: 0
                }}>
                  {lesson.rank}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4
                  }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{lesson.title}</span>
                    <span style={{ color: '#6b7280', fontSize: 13 }}>{lesson.views}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#6b7280', fontSize: 12 }}>{lesson.avgTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Progress 
                      percent={lesson.completion} 
                      showInfo={false}
                      strokeColor="#10b981"
                      style={{ flex: 1 }}
                      size="small"
                    />
                    <span style={{ fontSize: 12, color: '#6b7280', minWidth: 60 }}>
                      {lesson.completion}% completion
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Course Statistics Table */}
      <Card 
        title="Detailed Course Statistics" 
        style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
        styles={{ header: { fontWeight: 600, fontSize: 16 } }}
      >
        <Table 
          columns={courseStatsColumns} 
          dataSource={courseStatsData}
          pagination={false}
          style={{ fontSize: 14 }}
        />
      </Card>
    </div>
  )
}

export default Analytics
