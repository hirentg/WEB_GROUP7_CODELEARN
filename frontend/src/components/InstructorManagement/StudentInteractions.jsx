import React, { useState } from 'react'
import { Card, Input, Tabs, Button, Avatar, Badge, Space } from 'antd'
import { 
  SearchOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  MessageOutlined,
  UserOutlined
} from '@ant-design/icons'

const { Search } = Input
const { TabPane } = Tabs

// Mock data for student questions
const mockQuestions = [
  {
    id: 1,
    student: {
      name: 'Sarah Johnson',
      avatar: null,
    },
    course: 'React Fundamentals',
    topic: 'Understanding Hooks',
    question: "How do I handle state in functional components? I'm confused about when to use useState vs useReducer.",
    timestamp: '5 min ago',
    status: 'pending',
  },
  {
    id: 2,
    student: {
      name: 'Michael Chen',
      avatar: null,
    },
    course: 'JavaScript Mastery',
    topic: 'Async/Await Patterns',
    question: 'Can you explain the difference between Promise.all() and Promise.race()?',
    timestamp: '1 hour ago',
    status: 'answered',
    replies: 2,
  },
  {
    id: 3,
    student: {
      name: 'Emma Davis',
      avatar: null,
    },
    course: 'Python Basics',
    topic: 'List Comprehensions',
    question: 'Can you provide more examples of list comprehensions with conditions?',
    timestamp: '2 hours ago',
    status: 'pending',
  },
  {
    id: 4,
    student: {
      name: 'James Wilson',
      avatar: null,
    },
    course: 'Web Development',
    topic: 'CSS Grid Layout',
    question: 'This lesson was super helpful! The grid-template-areas example really clarified things.',
    timestamp: '3 hours ago',
    status: 'answered',
  },
  {
    id: 5,
    student: {
      name: 'Lisa Anderson',
      avatar: null,
    },
    course: 'React Fundamentals',
    topic: 'Component Lifecycle',
    question: 'What is the difference between useEffect and useLayoutEffect?',
    timestamp: '5 hours ago',
    status: 'pending',
  },
]

const StudentInteractions = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter questions based on active tab
  const getFilteredQuestions = () => {
    let filtered = mockQuestions
    
    if (activeTab === 'pending') {
      filtered = filtered.filter(q => q.status === 'pending')
    } else if (activeTab === 'answered') {
      filtered = filtered.filter(q => q.status === 'answered')
    }

    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const pendingCount = mockQuestions.filter(q => q.status === 'pending').length
  const answeredCount = mockQuestions.filter(q => q.status === 'answered').length

  const filteredQuestions = getFilteredQuestions()

  return (
    <div>
      <h1 style={{ marginBottom: 8, fontSize: 28, fontWeight: 600 }}>Student Interactions</h1>
      <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 15 }}>
        Respond to questions and engage with your students
      </p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        <Card style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>Pending Questions</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{pendingCount}</div>
            </div>
            <div style={{ 
              width: 56, 
              height: 56, 
              borderRadius: 12, 
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ClockCircleOutlined style={{ fontSize: 28, color: '#f59e0b' }} />
            </div>
          </div>
        </Card>

        <Card style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>Answered Today</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>12</div>
            </div>
            <div style={{ 
              width: 56, 
              height: 56, 
              borderRadius: 12, 
              background: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircleOutlined style={{ fontSize: 28, color: '#10b981' }} />
            </div>
          </div>
        </Card>

        <Card style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>Avg Response Time</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>2.5h</div>
            </div>
            <div style={{ 
              width: 56, 
              height: 56, 
              borderRadius: 12, 
              background: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageOutlined style={{ fontSize: 28, color: '#3b82f6' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
        <Search
          placeholder="Search questions, students, or courses..."
          size="large"
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          style={{ marginBottom: 24 }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="large"
        >
          <TabPane 
            tab={
              <span style={{ fontSize: 15 }}>
                All ({mockQuestions.length})
              </span>
            } 
            key="all" 
          />
          <TabPane 
            tab={
              <span style={{ fontSize: 15 }}>
                Pending ({pendingCount})
              </span>
            } 
            key="pending" 
          />
          <TabPane 
            tab={
              <span style={{ fontSize: 15 }}>
                Answered ({answeredCount})
              </span>
            } 
            key="answered" 
          />
        </Tabs>

        {/* Questions List */}
        <div style={{ marginTop: 24 }}>
          {filteredQuestions.map((question) => (
            <Card 
              key={question.id}
              style={{ 
                marginBottom: 16, 
                borderRadius: 8,
                border: '1px solid #f3f4f6',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', gap: 16 }}>
                <Avatar 
                  size={48} 
                  icon={<UserOutlined />}
                  style={{ 
                    background: question.status === 'pending' ? '#ef4444' : '#10b981',
                    flexShrink: 0 
                  }}
                >
                  {question.student.name.charAt(0)}
                </Avatar>
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 8 
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                        {question.student.name}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: 14 }}>
                        {question.course} • {question.topic}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ color: '#9ca3af', fontSize: 13 }}>
                        {question.timestamp}
                      </span>
                      <Badge 
                        status={question.status === 'pending' ? 'warning' : 'success'} 
                        text={
                          <span style={{ 
                            color: question.status === 'pending' ? '#f59e0b' : '#10b981',
                            fontSize: 12,
                            fontWeight: 500
                          }}>
                            {question.status}
                          </span>
                        }
                      />
                    </div>
                  </div>

                  <div style={{ 
                    background: '#f9fafb',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 16,
                    border: '1px solid #f3f4f6'
                  }}>
                    <MessageOutlined style={{ color: '#6366f1', marginRight: 8 }} />
                    <span style={{ color: '#374151', fontSize: 14 }}>
                      {question.question}
                    </span>
                  </div>

                  <Space size="middle">
                    <Button 
                      type="primary" 
                      style={{ 
                        background: '#6366f1',
                        borderColor: '#6366f1',
                        borderRadius: 6,
                        fontWeight: 500
                      }}
                    >
                      Reply
                    </Button>
                    {question.status === 'pending' ? (
                      <Button 
                        style={{ 
                          borderRadius: 6,
                          borderColor: '#d1d5db',
                          color: '#6b7280'
                        }}
                      >
                        Mark as Answered
                      </Button>
                    ) : (
                      <>
                        {question.replies && (
                          <Button 
                            style={{ 
                              borderRadius: 6,
                              borderColor: '#d1d5db',
                              color: '#6b7280'
                            }}
                          >
                            View {question.replies} replies
                          </Button>
                        )}
                        <Button 
                          style={{ 
                            borderRadius: 6,
                            borderColor: '#d1d5db',
                            color: '#6b7280'
                          }}
                        >
                          Mark as Pending
                        </Button>
                      </>
                    )}
                  </Space>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default StudentInteractions
