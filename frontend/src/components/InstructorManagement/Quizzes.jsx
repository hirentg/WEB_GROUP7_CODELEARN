import React, { useState } from 'react'
import { Table, Button, Badge, Progress, Space, Modal, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import CreateQuizModal from '../Form/CreateQuizModal'

const mockQuizzes = [
  {
    id: 1,
    title: 'React Hooks Quiz',
    course: 'React Fundamentals',
    questions: 10,
    attempts: 234,
    avgScore: 78,
    status: 'active'
  },
  {
    id: 2,
    title: 'JavaScript ES6 Assessment',
    course: 'JavaScript Mastery',
    questions: 15,
    attempts: 189,
    avgScore: 82,
    status: 'active'
  },
  {
    id: 3,
    title: 'Python Functions Quiz',
    course: 'Python Basics',
    questions: 8,
    attempts: 156,
    avgScore: 75,
    status: 'active'
  },
  {
    id: 4,
    title: 'Final Assessment Draft',
    course: 'Web Development Bootcamp',
    questions: 20,
    attempts: 0,
    avgScore: 0,
    status: 'draft'
  }
]

export const Quizzes = () => {
  const [quizzes, setQuizzes] = useState(mockQuizzes)
  const [isCreating, setIsCreating] = useState(false)

  const handleEdit = (id) => {
    console.log('Edit quiz:', id)
    message.info('Edit quiz functionality coming soon')
  }

  const handleDelete = (id) => {
    const quiz = quizzes.find(q => q.id === id)
    
    Modal.confirm({
      title: 'Delete Quiz',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div style={{ paddingBottom: 24 }}>
          <p>Are you sure you want to delete <strong>"{quiz?.title}"</strong>?</p>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 0 }}>This action cannot be undone.</p>
        </div>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk() {
        setQuizzes(quizzes.filter(q => q.id !== id))
        message.success('Quiz deleted successfully!')
        // TODO: Call API to delete from database
      },
    })
  }

  const handleCreateQuiz = () => {
    setIsCreating(true)
  }

  const handleSubmitQuiz = (values) => {
    console.log('New quiz:', values)
    message.success(values.status === 'active' ? 'Quiz published successfully!' : 'Quiz saved as draft!')
    setIsCreating(false)
  }

  const columns = [
    {
      title: 'Quiz Title',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
      render: (text) => <span style={{ fontWeight: 600, color: '#1f2937' }}>{text}</span>
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
      width: '18%',
      render: (text) => <span style={{ color: '#6b7280' }}>{text}</span>
    },
    {
      title: 'Questions',
      dataIndex: 'questions',
      key: 'questions',
      width: '10%',
      align: 'center',
      render: (num) => <span style={{ color: '#4b5563', fontWeight: 500 }}>{num}</span>
    },
    {
      title: 'Attempts',
      dataIndex: 'attempts',
      key: 'attempts',
      width: '10%',
      align: 'center',
      render: (num) => <span style={{ color: '#4b5563', fontWeight: 500 }}>{num}</span>
    },
    {
      title: 'Avg Score',
      dataIndex: 'avgScore',
      key: 'avgScore',
      width: '15%',
      render: (score) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress 
            percent={score} 
            size="small" 
            strokeColor={score > 0 ? '#10b981' : '#d1d5db'}
            showInfo={false}
            style={{ flex: 1, maxWidth: 100 }}
          />
          <span style={{ color: '#4b5563', fontWeight: 500, minWidth: 35 }}>{score}%</span>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      align: 'center',
      render: (status) => (
        <Badge 
          color={status === 'active' ? '#10b981' : '#f59e0b'} 
          text={status}
          style={{ 
            color: status === 'active' ? '#10b981' : '#f59e0b',
            fontWeight: 500
          }}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            style={{ color: '#6b7280' }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          />
        </Space>
      )
    }
  ]

  // If creating quiz, show the form
  if (isCreating) {
    return (
      <CreateQuizModal
        onClose={() => setIsCreating(false)}
        onSubmit={handleSubmitQuiz}
      />
    )
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: 24 
      }}>
        <div>
          <h1 style={{ marginBottom: 8, fontSize: 32, fontWeight: 700 }}>Quizzes & Assignments</h1>
          <p style={{ color: '#6b7280', fontSize: 16 }}>Create and manage assessments for your courses</p>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />}
          onClick={handleCreateQuiz}
          style={{ 
            borderRadius: 8,
            fontWeight: 600,
            background: '#6366f1',
            borderColor: '#6366f1',
            height: 48,
            paddingLeft: 24,
            paddingRight: 24
          }}
        >
          Create Quiz
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={quizzes}
        rowKey="id"
        pagination={false}
        style={{ 
          background: '#fff',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  )
}

export default Quizzes
