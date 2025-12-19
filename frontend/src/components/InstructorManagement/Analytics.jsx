import React, { useEffect, useState } from 'react'
import { Card, Progress, Table, Space, Spin } from 'antd'
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
import { api } from '../../services/api'

const Analytics = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeStudents: 0,
    courseRating: 0,
    totalReviews: 0
  })
  const [coursePerformanceData, setCoursePerformanceData] = useState([])
  const [progressData, setProgressData] = useState([])
  const [courseStatsData, setCourseStatsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [performanceLoading, setPerformanceLoading] = useState(true)
  const [progressLoading, setProgressLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getInstructorStats()
        setStats({
          totalRevenue: data.totalRevenue || 0,
          activeStudents: data.activeStudents || 0,
          courseRating: data.courseRating || 0,
          totalReviews: data.totalReviews || 0
        })
      } catch (error) {
        console.error('Failed to fetch instructor stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    const fetchCoursePerformance = async () => {
      try {
        const data = await api.getInstructorCoursePerformance()
        setCoursePerformanceData(data || [])
      } catch (error) {
        console.error('Failed to fetch course performance:', error)
      } finally {
        setPerformanceLoading(false)
      }
    }
    
    const fetchProgressDistribution = async () => {
      try {
        const data = await api.getStudentProgressDistribution()
        setProgressData(data || [])
      } catch (error) {
        console.error('Failed to fetch progress distribution:', error)
      } finally {
        setProgressLoading(false)
      }
    }
    
    const fetchDetailedCourseStats = async () => {
      try {
        const data = await api.getDetailedCourseStats()
        // Transform data to include key for table
        const transformedData = data.map((item, index) => ({
          key: (index + 1).toString(),
          ...item
        }))
        setCourseStatsData(transformedData)
      } catch (error) {
        console.error('Failed to fetch detailed course stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }
    
    fetchStats()
    fetchCoursePerformance()
    fetchProgressDistribution()
    fetchDetailedCourseStats()
  }, [])

  // Top metrics data
  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'From course sales',
      icon: <RiseOutlined style={{ fontSize: 24, color: '#10b981' }} />,
      bgColor: '#d1fae5',
    },
    {
      title: 'Active Students',
      value: stats.activeStudents.toLocaleString(),
      change: 'Total enrolled',
      icon: <UserOutlined style={{ fontSize: 24, color: '#3b82f6' }} />,
      bgColor: '#dbeafe',
    },
    {
      title: 'Course Rating',
      value: stats.courseRating.toFixed(1),
      change: `From ${stats.totalReviews} reviews`,
      icon: <TrophyOutlined style={{ fontSize: 24, color: '#f59e0b' }} />,
      bgColor: '#fef3c7',
    },
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
      title: 'Avg Rate',
      dataIndex: 'avgRate',
      key: 'avgRate',
      align: 'center',
      render: (rate) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <StarFilled style={{ fontSize: 14, color: '#fbbf24' }} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>{rate.toFixed(1)}</span>
        </div>
      ),
    },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 8, fontSize: 28, fontWeight: 600 }}>Analytics & Insights</h1>
      <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 15 }}>
        Track student progress and course performance
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
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
          {performanceLoading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin />
            </div>
          ) : (
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
          )}
        </Card>

        {/* Student Progress Distribution Pie Chart */}
        <Card 
          title="Student Progress Distribution" 
          style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
          styles={{ header: { fontWeight: 600, fontSize: 16 } }}
        >
          {progressLoading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin />
            </div>
          ) : (
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
                {progressData.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: 14, color: item.color, fontWeight: 500 }}>
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
        {statsLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin />
          </div>
        ) : (
          <Table 
            columns={courseStatsColumns} 
            dataSource={courseStatsData}
            pagination={false}
            style={{ fontSize: 14 }}
          />
        )}
      </Card>
      </>
      )}
    </div>
  )
}

export default Analytics
