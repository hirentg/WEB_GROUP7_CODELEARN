import React, { useState, useEffect } from 'react'
import { Table, Button, Badge, Progress, Space, Modal, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import CreateQuizModal from '../Form/CreateQuizModal'
import EditQuizModal from '../Form/EditQuizModal'
import { api } from '../../services/api'

export const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingQuizId, setEditingQuizId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      const data = await api.get('/quizzes/instructor/my-quizzes')
      
      // Transform data to match table format
      const transformedData = data.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        video: quiz.videoTitle || 'N/A',
        questions: quiz.questions,
        attempts: quiz.attempts,
        avgScore: Math.round(quiz.avgScore || 0),
        status: quiz.status
      }))
      
      setQuizzes(transformedData)
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      message.error('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id) => {
    setEditingQuizId(id)
  }

  const handleDelete = async (id) => {
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
      async onOk() {
        try {
          await api.delete(`/quizzes/${id}`)
          message.success('Quiz deleted successfully!')
          fetchQuizzes() // Refresh the list
        } catch (error) {
          console.error('Error deleting quiz:', error)
          message.error('Failed to delete quiz')
        }
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
    fetchQuizzes() // Refresh the list
  }

  const handleUpdateQuiz = (values) => {
    console.log('Updated quiz:', values)
    message.success(values.status === 'active' ? 'Quiz updated and published!' : 'Quiz updated as draft!')
    setEditingQuizId(null)
    fetchQuizzes() // Refresh the list
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
      title: 'Video',
      dataIndex: 'video',
      key: 'video',
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
          text={
            <span style={{ 
              color: status === 'active' ? '#10b981' : '#f59e0b',
              fontWeight: 500,
              textTransform: 'capitalize'
            }}>
              {status}
            </span>
          }
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
        loading={loading}
        pagination={false}
        style={{ 
          background: '#fff',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
        }}
      />

      {/* Create Quiz Modal */}
      {isCreating && (
        <Modal
          open={isCreating}
          onCancel={() => setIsCreating(false)}
          footer={null}
          width="100%"
          style={{ top: 0, maxWidth: '100%', padding: 0 }}
          bodyStyle={{ padding: 0 }}
        >
          <CreateQuizModal 
            onClose={() => setIsCreating(false)}
            onSubmit={handleSubmitQuiz}
          />
        </Modal>
      )}

      {/* Edit Quiz Modal */}
      {editingQuizId && (
        <Modal
          open={!!editingQuizId}
          onCancel={() => setEditingQuizId(null)}
          footer={null}
          width="100%"
          style={{ top: 0, maxWidth: '100%', padding: 0 }}
          bodyStyle={{ padding: 0 }}
        >
          <EditQuizModal 
            quizId={editingQuizId}
            onClose={() => setEditingQuizId(null)}
            onSubmit={handleUpdateQuiz}
          />
        </Modal>
      )}
    </div>
  )
}

export default Quizzes
