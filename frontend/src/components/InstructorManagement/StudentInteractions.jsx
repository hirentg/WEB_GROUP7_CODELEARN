import React, { useState, useEffect } from 'react'
import { Card, Input, Tabs, Button, Avatar, Badge, Space, Spin, message, Modal } from 'antd'
import { 
  SearchOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  MessageOutlined,
  UserOutlined
} from '@ant-design/icons'
import questionApi from '../../services/questionApi'

const { Search } = Input
const { TabPane } = Tabs
const { TextArea } = Input

const StudentInteractions = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [replyModalVisible, setReplyModalVisible] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [viewAllModalVisible, setViewAllModalVisible] = useState(false)
  const [viewAllQuestion, setViewAllQuestion] = useState(null)

  // Fetch questions from backend
  useEffect(() => {
    fetchQuestions()
  }, [activeTab])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      let response
      
      if (activeTab === 'pending') {
        response = await questionApi.getInstructorUnansweredQuestions()
      } else {
        response = await questionApi.getInstructorQuestions()
      }
      
      setQuestions(response || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
      message.error('Failed to load questions')
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  // Format timestamp to relative time
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Unknown'
    
    const now = new Date()
    const date = new Date(timestamp)
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString()
  }

  // Filter questions based on active tab and search
  const getFilteredQuestions = () => {
    let filtered = questions
    
    if (activeTab === 'answered') {
      filtered = filtered.filter(q => q.isAnswered === true)
    }

    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.videoTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const pendingCount = questions.filter(q => q.isAnswered === false).length
  const answeredCount = questions.filter(q => q.isAnswered === true).length
  const totalCount = questions.length

  // Calculate answered today count
  const answeredTodayCount = questions.filter(q => {
    if (!q.isAnswered || !q.answers || q.answers.length === 0) return false
    
    // Find instructor answers
    const instructorAnswers = q.answers.filter(a => a.isInstructorAnswer)
    if (instructorAnswers.length === 0) return false
    
    // Check if any instructor answer was created today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return instructorAnswers.some(answer => {
      const answerDate = new Date(answer.createdAt)
      answerDate.setHours(0, 0, 0, 0)
      return answerDate.getTime() === today.getTime()
    })
  }).length

  const filteredQuestions = getFilteredQuestions()

  // Handle reply button click
  const handleReplyClick = (question) => {
    setSelectedQuestion(question)
    setReplyContent('')
    setReplyModalVisible(true)
  }

  // Handle submit reply
  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      message.warning('Please enter your answer')
      return
    }

    try {
      setSubmitting(true)
      await questionApi.createAnswer(selectedQuestion.id, replyContent)
      message.success('Answer submitted successfully!')
      setReplyModalVisible(false)
      setReplyContent('')
      setSelectedQuestion(null)
      // Refresh questions
      fetchQuestions()
    } catch (error) {
      console.error('Error submitting answer:', error)
      message.error('Failed to submit answer')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle view all replies
  const handleViewAllReplies = (question) => {
    setViewAllQuestion(question)
    setViewAllModalVisible(true)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: 8, fontSize: 28, fontWeight: 600 }}>Student Interactions</h1>
      <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 15 }}>
        Respond to questions and engage with your students
      </p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 32 }}>
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
              <div style={{ fontSize: 32, fontWeight: 700 }}>{answeredTodayCount}</div>
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
                All ({totalCount})
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
          {filteredQuestions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
              <MessageOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <div style={{ fontSize: 16 }}>No questions found</div>
            </div>
          ) : (
            filteredQuestions.map((question) => (
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
                    src={question.userAvatar}
                    icon={!question.userAvatar && <UserOutlined />}
                    style={{ 
                      background: question.isAnswered ? '#10b981' : '#ef4444',
                      flexShrink: 0 
                    }}
                  >
                    {!question.userAvatar && question.userName?.charAt(0)}
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
                          {question.userName || 'Unknown User'}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: 14 }}>
                          {question.courseTitle || 'Unknown Course'} • {question.videoTitle || 'Unknown Video'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: '#9ca3af', fontSize: 13 }}>
                          {getRelativeTime(question.createdAt)}
                        </span>
                        <Badge 
                          status={question.isAnswered ? 'success' : 'warning'} 
                          text={
                            <span style={{ 
                              color: question.isAnswered ? '#10b981' : '#f59e0b',
                              fontSize: 12,
                              fontWeight: 500
                            }}>
                              {question.isAnswered ? 'answered' : 'pending'}
                            </span>
                          }
                        />
                      </div>
                    </div>

                    {/* Question Title */}
                    {question.title && (
                      <div style={{ 
                        fontWeight: 600, 
                        fontSize: 15, 
                        marginBottom: 8,
                        color: '#1f2937'
                      }}>
                        {question.title}
                      </div>
                    )}

                    {/* Question Content */}
                    <div style={{ 
                      background: '#f9fafb',
                      padding: 16,
                      borderRadius: 8,
                      marginBottom: 16,
                      border: '1px solid #f3f4f6'
                    }}>
                      <MessageOutlined style={{ color: '#6366f1', marginRight: 8 }} />
                      <span style={{ color: '#374151', fontSize: 14 }}>
                        {question.content}
                      </span>
                    </div>

                    {/* Answers Section */}
                    {question.answers && question.answers.length > 0 && (
                      <div style={{ 
                        background: '#f0fdf4',
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 12,
                        border: '1px solid #bbf7d0'
                      }}>
                        <div style={{ 
                          fontWeight: 600, 
                          fontSize: 13, 
                          color: '#059669',
                          marginBottom: 8 
                        }}>
                          {question.answerCount} Answer{question.answerCount > 1 ? 's' : ''}
                        </div>
                        {question.answers.slice(0, 2).map((answer, index) => (
                          <div key={answer.id} style={{ 
                            marginBottom: index < question.answers.length - 1 ? 8 : 0,
                            paddingBottom: index < question.answers.length - 1 ? 8 : 0,
                            borderBottom: index < question.answers.length - 1 ? '1px solid #d1fae5' : 'none'
                          }}>
                            <div style={{ fontSize: 13, color: '#065f46', marginBottom: 4 }}>
                              <strong>{answer.userName}</strong>
                              {answer.isInstructorAnswer && (
                                <Badge 
                                  count="Instructor" 
                                  style={{ 
                                    background: '#6366f1', 
                                    marginLeft: 8,
                                    fontSize: 10
                                  }} 
                                />
                              )}
                              <span style={{ color: '#9ca3af', marginLeft: 8, fontWeight: 'normal' }}>
                                • {getRelativeTime(answer.createdAt)}
                              </span>
                            </div>
                            <div style={{ fontSize: 13, color: '#047857' }}>
                              {answer.content.length > 150 
                                ? answer.content.substring(0, 150) + '...' 
                                : answer.content}
                            </div>
                          </div>
                        ))}
                        {question.answers.length > 2 && (
                          <div style={{ 
                            fontSize: 12, 
                            color: '#059669', 
                            marginTop: 8,
                            fontWeight: 500 
                          }}>
                            +{question.answers.length - 2} more answer{question.answers.length - 2 > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )}

                    <Space size="middle">
                      <Button 
                        type="primary"
                        onClick={() => handleReplyClick(question)}
                        style={{ 
                          background: '#6366f1',
                          borderColor: '#6366f1',
                          borderRadius: 6,
                          fontWeight: 500
                        }}
                      >
                        Reply
                      </Button>
                      {question.answerCount > 0 && (
                        <Button 
                          onClick={() => handleViewAllReplies(question)}
                          disabled={question.answers.length <= 2}
                          style={{ 
                            borderRadius: 6,
                            borderColor: '#d1d5db',
                            color: question.answers.length > 2 ? '#6b7280' : '#9ca3af'
                          }}
                        >
                          View All Replies
                        </Button>
                      )}
                    </Space>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      {/* Reply Modal */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            Reply to Question
          </div>
        }
        open={replyModalVisible}
        onCancel={() => {
          setReplyModalVisible(false)
          setReplyContent('')
          setSelectedQuestion(null)
        }}
        footer={[
          <Button 
            key="cancel"
            onClick={() => {
              setReplyModalVisible(false)
              setReplyContent('')
              setSelectedQuestion(null)
            }}
            style={{ borderRadius: 6 }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={handleSubmitReply}
            style={{
              background: '#6366f1',
              borderColor: '#6366f1',
              borderRadius: 6
            }}
          >
            Submit Answer
          </Button>
        ]}
        width={700}
      >
        {selectedQuestion && (
          <div>
            {/* Question Info */}
            <div style={{ 
              background: '#f9fafb', 
              padding: 16, 
              borderRadius: 8,
              marginBottom: 20,
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
                {selectedQuestion.title}
              </div>
              <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>
                by {selectedQuestion.userName} • {selectedQuestion.courseTitle} • {selectedQuestion.videoTitle}
              </div>
              <div style={{ color: '#374151', fontSize: 14 }}>
                {selectedQuestion.content}
              </div>
            </div>

            {/* Reply Input */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>Your Answer</div>
              <TextArea
                placeholder="Write your answer here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={6}
                style={{ borderRadius: 8 }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* View All Replies Modal */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            All Replies
          </div>
        }
        open={viewAllModalVisible}
        onCancel={() => {
          setViewAllModalVisible(false)
          setViewAllQuestion(null)
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setViewAllModalVisible(false)
              setViewAllQuestion(null)
            }}
            style={{
              background: '#6366f1',
              borderColor: '#6366f1',
              borderRadius: 6
            }}
          >
            Close
          </Button>
        ]}
        width={800}
      >
        {viewAllQuestion && (
          <div>
            {/* Question Info */}
            <div style={{ 
              background: '#f9fafb', 
              padding: 16, 
              borderRadius: 8,
              marginBottom: 20,
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
                {viewAllQuestion.title}
              </div>
              <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>
                by {viewAllQuestion.userName} • {viewAllQuestion.courseTitle} • {viewAllQuestion.videoTitle}
              </div>
              <div style={{ color: '#374151', fontSize: 14 }}>
                {viewAllQuestion.content}
              </div>
            </div>

            {/* All Answers */}
            <div>
              <h4 style={{ 
                fontSize: 16, 
                fontWeight: 600, 
                color: '#1f2937',
                marginBottom: 16 
              }}>
                {viewAllQuestion.answerCount} Answer{viewAllQuestion.answerCount > 1 ? 's' : ''}
              </h4>
              
              {viewAllQuestion.answers && viewAllQuestion.answers.map((answer, index) => (
                <div
                  key={answer.id}
                  style={{
                    background: answer.isInstructorAnswer ? '#f0f9ff' : '#f9fafb',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 12,
                    border: answer.isInstructorAnswer ? '1px solid #bfdbfe' : '1px solid #f3f4f6'
                  }}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Avatar 
                      src={answer.userAvatar}
                      icon={!answer.userAvatar && <UserOutlined />}
                      style={{ 
                        background: answer.isInstructorAnswer ? '#3b82f6' : '#9ca3af',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{answer.userName}</span>
                        {answer.isInstructorAnswer && (
                          <Badge 
                            count="Instructor" 
                            style={{ 
                              background: '#6366f1',
                              fontSize: 11
                            }} 
                          />
                        )}
                        <span style={{ color: '#9ca3af', fontSize: 13 }}>
                          {getRelativeTime(answer.createdAt)}
                        </span>
                      </div>
                      <p style={{ 
                        color: '#374151', 
                        lineHeight: 1.6,
                        marginBottom: 0,
                        fontSize: 14
                      }}>
                        {answer.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default StudentInteractions
