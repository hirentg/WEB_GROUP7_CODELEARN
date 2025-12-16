import React, { useState, useEffect } from 'react'
import { Steps, Button, Form, Input, Select, InputNumber, Card, Radio, Space, Checkbox, message } from 'antd'
import { CloseOutlined, CheckCircleFilled, PlusOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons'
import { api } from '../../services/api'

const { TextArea } = Input
const { Option } = Select

const EditQuizModal = ({ quizId, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const [questions, setQuestions] = useState([])
  const [quizData, setQuizData] = useState({})
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
    loadQuizData()
  }, [quizId])

  const fetchVideos = async () => {
    try {
      const courses = await api.get('/courses/instructor/my-courses')
      // Get all videos from all courses
      const allVideos = []
      for (const course of courses) {
        const courseDetail = await api.get(`/courses/${course.id}`)
        if (courseDetail.sections) {
          courseDetail.sections.forEach(section => {
            if (section.videos) {
              section.videos.forEach(video => {
                allVideos.push({
                  id: video.id,
                  title: video.title,
                  courseTitle: courseDetail.title
                })
              })
            }
          })
        }
      }
      setVideos(allVideos)
    } catch (error) {
      console.error('Error fetching videos:', error)
      message.error('Failed to load videos')
    }
  }

  const loadQuizData = async () => {
    try {
      setInitialLoading(true)
      const data = await api.get(`/quizzes/${quizId}`)
      
      // Set basic quiz data
      setQuizData({
        videoId: data.videoId,
        title: data.title,
        timeLimit: data.timeLimitMinutes,
        passingScore: data.passingScore
      })

      // Set form fields
      form.setFieldsValue({
        title: data.title,
        videoId: data.videoId,
        timeLimit: data.timeLimitMinutes,
        passingScore: data.passingScore
      })

      // Load questions with options
      const loadedQuestions = data.questions.map(q => {
        // Find correct answer index
        const correctAnswerIndex = q.options.findIndex(opt => opt.isCorrect)
        
        return {
          id: q.id,
          type: q.questionType === 'TRUE_FALSE' ? 'true-false' : 'multiple-choice',
          question: q.questionText,
          points: q.points,
          explanation: q.explanation || '',
          options: q.options.map(opt => opt.optionText),
          correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : null
        }
      })
      
      setQuestions(loadedQuestions)
    } catch (error) {
      console.error('Error loading quiz:', error)
      message.error('Failed to load quiz data')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        const values = await form.validateFields(['title', 'videoId', 'timeLimit', 'passingScore'])
        setQuizData({ ...quizData, ...values })
        setCurrentStep(1)
      } catch (error) {
        console.error('Validation failed:', error)
      }
    } else if (currentStep === 1) {
      setCurrentStep(2)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSaveDraft = async () => {
    try {
      setLoading(true)
      const payload = buildQuizPayload('draft')
      await api.put(`/quizzes/${quizId}`, payload)
      message.success('Quiz saved as draft!')
      onSubmit(payload)
      onClose()
    } catch (error) {
      console.error('Error saving quiz:', error)
      message.error('Failed to save quiz')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    try {
      await form.validateFields(['confirmReviewed'])
      setLoading(true)
      const payload = buildQuizPayload('active')
      await api.put(`/quizzes/${quizId}`, payload)
      message.success('Quiz published successfully!')
      onSubmit(payload)
      onClose()
    } catch (error) {
      if (error.errorFields) {
        console.error('Please confirm checkbox')
      } else {
        console.error('Error publishing quiz:', error)
        message.error('Failed to publish quiz')
      }
    } finally {
      setLoading(false)
    }
  }

  const buildQuizPayload = (status) => {
    return {
      videoId: quizData.videoId,
      title: quizData.title,
      description: '',
      passingScore: quizData.passingScore,
      timeLimitMinutes: quizData.timeLimit,
      status: status, // 'draft' or 'active'
      questions: questions.map((q, idx) => ({
        questionText: q.question,
        questionType: q.type === 'true-false' ? 'TRUE_FALSE' : 'SINGLE_CHOICE',
        points: q.points,
        explanation: q.explanation || '',
        orderIndex: idx,
        correctAnswerIndex: q.correctAnswer,
        options: q.type === 'multiple-choice' ? q.options.map((opt, optIdx) => ({
          optionText: opt,
          orderIndex: optIdx
        })) : []
      }))
    }
  }

  const handleReset = () => {
    onClose()
  }

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: '',
      points: 10,
      explanation: '',
      options: type === 'multiple-choice' ? ['', '', '', ''] : type === 'true-false' ? ['Yes', 'No'] : [],
      correctAnswer: type === 'true-false' ? 0 : null
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q))
  }

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ))
  }

  const addOption = (questionId) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, options: [...q.options, ''] } : q
    ))
  }

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
        : q
    ))
  }

  const steps = [
    {
      title: 'Quiz Details',
      icon: currentStep > 0 ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : '1',
    },
    {
      title: 'Edit Questions',
      icon: currentStep > 1 ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : '2',
    },
    {
      title: 'Review & Publish',
      icon: '3',
    },
  ]

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0)

  if (initialLoading) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading quiz data...</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: '32px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Edit Quiz</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Update your quiz assessment</p>
        </div>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={handleReset}
          style={{ fontSize: 20, color: '#9ca3af' }}
        />
      </div>

      <Steps
        current={currentStep}
        items={steps.map((step, index) => ({
          title: step.title,
          icon: (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 600,
                background: currentStep === index ? '#6366f1' : currentStep > index ? '#52c41a' : '#e5e7eb',
                color: currentStep >= index ? '#fff' : '#6b7280',
              }}
            >
              {step.icon}
            </div>
          ),
        }))}
        style={{ marginBottom: 40 }}
      />

      <Form form={form} layout="vertical">
        {/* Step 1: Quiz Details */}
        {currentStep === 0 && (
          <Card style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Quiz Settings</h3>

            <Form.Item
              name="title"
              label="Quiz Title"
              rules={[{ required: true, message: 'Please enter quiz title' }]}
            >
              <Input placeholder="e.g., React Hooks Quiz" size="large" />
            </Form.Item>

            <Form.Item
              name="videoId"
              label="Video"
              rules={[{ required: true, message: 'Please select a video' }]}
            >
              <Select 
                placeholder="Choose a video..." 
                size="large"
                loading={videos.length === 0}
                disabled={true}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {videos.map(video => (
                  <Option key={video.id} value={video.id}>
                    {video.courseTitle} - {video.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item
                name="timeLimit"
                label="Time Limit (minutes)"
                rules={[{ required: true, message: 'Please enter time limit' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} size="large" />
              </Form.Item>

              <Form.Item
                name="passingScore"
                label="Passing Score (%)"
                rules={[{ required: true, message: 'Please enter passing score' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} max={100} size="large" />
              </Form.Item>
            </div>
          </Card>
        )}

        {/* Step 2: Edit Questions */}
        {currentStep === 1 && (
          <Card style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Questions ({questions.length})</h3>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: 14 }}>Total Points: {totalPoints}</p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ marginBottom: 12, color: '#4b5563', fontWeight: 500 }}>Add Question Type:</p>
                <Space>
                  <Button icon={<PlusOutlined />} onClick={() => addQuestion('multiple-choice')}>
                    Multiple Choice
                  </Button>
                  <Button icon={<PlusOutlined />} onClick={() => addQuestion('true-false')}>
                    True/False
                  </Button>
                </Space>
              </div>
            </div>

            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {questions.map((question, index) => (
                <Card
                  key={question.id}
                  size="small"
                  style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <DragOutlined style={{ color: '#9ca3af', cursor: 'move' }} />
                    <span style={{ fontWeight: 600 }}>Q{index + 1}</span>
                    <span style={{ 
                      background: '#eef2ff', 
                      color: '#6366f1', 
                      padding: '2px 8px', 
                      borderRadius: 4, 
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {question.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
                    </span>
                    <Input
                      placeholder="Question text"
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <InputNumber
                      value={question.points}
                      onChange={(val) => updateQuestion(question.id, 'points', val)}
                      min={1}
                      addonAfter="pts"
                      style={{ width: 100 }}
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => removeQuestion(question.id)}
                      danger
                    />
                  </div>

                  {(question.type === 'multiple-choice' || question.type === 'true-false') && (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ marginBottom: 8, color: '#4b5563', fontWeight: 500 }}>Answer Options</p>
                      <Radio.Group
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {question.options.map((option, optIdx) => (
                            <div key={optIdx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <Radio value={optIdx} />
                              <Input
                                value={option}
                                onChange={(e) => updateOption(question.id, optIdx, e.target.value)}
                                disabled={question.type === 'true-false'}
                                style={{ flex: 1 }}
                              />
                              {question.type === 'multiple-choice' && question.options.length > 2 && (
                                <Button
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  onClick={() => removeOption(question.id, optIdx)}
                                  size="small"
                                />
                              )}
                            </div>
                          ))}
                        </Space>
                      </Radio.Group>
                      {question.type === 'multiple-choice' && (
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => addOption(question.id)}
                          style={{ marginTop: 8 }}
                        >
                          Add Option
                        </Button>
                      )}
                      <p style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>
                        Select the correct answer by clicking the radio button
                      </p>
                    </div>
                  )}

                  <div>
                    <p style={{ marginBottom: 8, color: '#4b5563', fontWeight: 500 }}>Points</p>
                    <InputNumber
                      value={question.points}
                      onChange={(val) => updateQuestion(question.id, 'points', val)}
                      min={1}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <p style={{ marginBottom: 8, color: '#4b5563', fontWeight: 500 }}>
                      Explanation (shown after submission)
                    </p>
                    <TextArea
                      rows={3}
                      value={question.explanation}
                      onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                      placeholder="Explain why this is the correct answer..."
                    />
                  </div>
                </Card>
              ))}
            </Space>
          </Card>
        )}

        {/* Step 3: Review & Publish */}
        {currentStep === 2 && (
          <Card style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Review Quiz</h3>

            <Card style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, marginBottom: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1e40af', marginBottom: 12 }}>Quiz Summary</h4>
              <div style={{ color: '#1e40af', lineHeight: 2 }}>
                <div><strong>Title:</strong> {quizData.title || 'Untitled Quiz'}</div>
                <div><strong>Video:</strong> {videos.find(v => v.id === quizData.videoId)?.title || 'Not selected'}</div>
                <div><strong>Time Limit:</strong> {quizData.timeLimit || 30} minutes</div>
                <div><strong>Passing Score:</strong> {quizData.passingScore || 70}%</div>
                <div><strong>Total Questions:</strong> {questions.length}</div>
                <div><strong>Total Points:</strong> {totalPoints}</div>
              </div>
            </Card>

            <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Question Breakdown</h4>
            <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
              {questions.map((q, idx) => (
                <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f9fafb', borderRadius: 6 }}>
                  <span><strong>Q{idx + 1}:</strong> {q.question || 'No question text'}</span>
                  <Space>
                    <span style={{ 
                      background: '#eef2ff', 
                      color: '#6366f1', 
                      padding: '2px 8px', 
                      borderRadius: 4, 
                      fontSize: 12 
                    }}>
                      {q.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
                    </span>
                    <span style={{ fontWeight: 600 }}>{q.points} pts</span>
                  </Space>
                </div>
              ))}
            </Space>

            <Form.Item
              name="confirmReviewed"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Please confirm')),
                },
              ]}
            >
              <Checkbox>I have reviewed all questions and verified the correct answers</Checkbox>
            </Form.Item>
          </Card>
        )}
      </Form>

      {/* Footer Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 24,
          paddingTop: 24,
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <div>
          {currentStep > 0 ? (
            <Button size="large" onClick={handlePrevious}>
              Previous
            </Button>
          ) : (
            <Button size="large" onClick={handleReset}>
              Cancel
            </Button>
          )}
        </div>

        <Space>
          <Button size="large" icon={<PlusOutlined />} onClick={handleSaveDraft} loading={loading}>
            Save as Draft
          </Button>
          {currentStep < 2 ? (
            <Button
              type="primary"
              size="large"
              onClick={handleNext}
              style={{ background: '#6366f1', borderColor: '#6366f1' }}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              onClick={handlePublish}
              loading={loading}
              style={{ background: '#16a34a', borderColor: '#16a34a' }}
            >
              Publish Quiz
            </Button>
          )}
        </Space>
      </div>
    </div>
  )
}

export default EditQuizModal
