import React, { useState } from 'react'
import { Steps, Button, Form, Input, Upload, Card, Checkbox, Space, Empty, message } from 'antd'
import { PlusOutlined, CloseOutlined, BookOutlined, CheckCircleFilled } from '@ant-design/icons'
import { api } from '../../services/api'

const { TextArea } = Input

const CreateCourseModal = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const [sections, setSections] = useState([])
  const [courseData, setCourseData] = useState({})
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        const values = await form.validateFields(['title', 'description', 'requirements', 'what_you_learn', 'price'])
        setCourseData({ ...courseData, ...values })
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
    setLoading(true)
    try {
      const payload = {
        title: courseData.title,
        description: courseData.description,
        requirements: courseData.requirements,
        whatYouLearn: courseData.what_you_learn,
        price: courseData.price,
        thumbnailUrl: fileList.length > 0 ? URL.createObjectURL(fileList[0]) : '',
        status: 'draft',
        sections: sections.map((section, idx) => ({
          title: section.title,
          description: section.description || '',
          orderIndex: idx,
          videos: section.videos.map((video, vIdx) => ({
            title: video.title,
            videoUrl: video.videoUrl,
            duration: video.duration,
            orderIndex: vIdx
          }))
        }))
      }
      
      const result = await api.post('/courses', payload)
      message.success('Course saved as draft successfully!')
      
      if (onSubmit) {
        onSubmit(result)
      }
      handleReset()
    } catch (error) {
      console.error('Error saving draft:', error)
      message.error('Failed to save course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    try {
      await form.validateFields(['confirmOriginal', 'confirmReviewed'])
      setLoading(true)
      
      const payload = {
        title: courseData.title,
        description: courseData.description,
        requirements: courseData.requirements,
        whatYouLearn: courseData.what_you_learn,
        price: courseData.price,
        thumbnailUrl: fileList.length > 0 ? URL.createObjectURL(fileList[0]) : '',
        status: 'published',
        sections: sections.map((section, idx) => ({
          title: section.title,
          description: section.description || '',
          orderIndex: idx,
          videos: section.videos.map((video, vIdx) => ({
            title: video.title,
            videoUrl: video.videoUrl,
            duration: video.duration,
            orderIndex: vIdx
          }))
        }))
      }
      
      const result = await api.post('/courses', payload)
      message.success('Course published successfully!')
      
      if (onSubmit) {
        onSubmit(result)
      }
      handleReset()
    } catch (error) {
      if (error.errorFields) {
        console.error('Please confirm all checkboxes')
      } else {
        console.error('Error publishing course:', error)
        message.error('Failed to publish course. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    form.resetFields()
    setFileList([])
    setSections([])
    setCourseData({})
    onClose()
  }

  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: '', description: '', videos: [] }])
  }

  const removeSection = (id) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const updateSection = (index, field, value) => {
    const newSections = [...sections]
    newSections[index][field] = value
    setSections(newSections)
  }

  const addVideo = (sectionIndex) => {
    const newSections = [...sections]
    newSections[sectionIndex].videos.push({
      id: Date.now(),
      title: '',
      description: '',
      duration: 0,
      videoUrl: '',
      orderIndex: newSections[sectionIndex].videos.length
    })
    setSections(newSections)
  }

  const removeVideo = (sectionIndex, videoIndex) => {
    const newSections = [...sections]
    newSections[sectionIndex].videos.splice(videoIndex, 1)
    setSections(newSections)
  }

  const updateVideo = (sectionIndex, videoIndex, field, value) => {
    const newSections = [...sections]
    newSections[sectionIndex].videos[videoIndex][field] = value
    setSections(newSections)
  }

  const uploadProps = {
    fileList,
    beforeUpload: (file) => {
      setFileList([file])
      return false
    },
    onRemove: () => setFileList([]),
    maxCount: 1,
    listType: 'picture-card',
  }

  const steps = [
    {
      title: 'Course Details',
      icon: currentStep > 0 ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : '1',
    },
    {
      title: 'Content Structure',
      icon: currentStep > 1 ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : '2',
    },
    {
      title: 'Publish',
      icon: '3',
    },
  ]

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: '32px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Create New Course</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Build engaging content for your students</p>
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
        {/* Step 1: Course Details */}
        {currentStep === 0 && (
          <Card style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Course Information</h3>

            <Form.Item
              name="title"
              label="Course Title"
              rules={[{ required: true, message: 'Please enter course title' }]}
            >
              <Input placeholder="e.g., React Fundamentals" size="large" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Course Description"
              rules={[{ required: true, message: 'Please enter course description' }]}
            >
              <TextArea
                rows={6}
                placeholder="Describe what students will learn in this course..."
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="requirements"
              label="Requirements"
              rules={[{ required: true, message: 'Please enter course requirements' }]}
            >
              <TextArea
                rows={4}
                placeholder="What are the prerequisites for this course? (e.g., Basic HTML, CSS knowledge)"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="what_you_learn"
              label="What You'll Learn"
              rules={[{ required: true, message: 'Please enter what students will learn' }]}
            >
              <TextArea
                rows={4}
                placeholder="What will students learn by the end of this course? (e.g., Build responsive websites, Master React hooks)"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter course price' }]}
            >
              <Input
                placeholder="e.g., $99.99 or Free"
                size="large"
              />
            </Form.Item>

            <Form.Item name="thumbnail" label="Course Thumbnail">
              <Upload {...uploadProps}>
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Card>
        )}

        {/* Step 2: Content Structure */}
        {currentStep === 1 && (
          <Card style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, minHeight: 300 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Course Content</h3>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addSection}
                style={{ background: '#6366f1', borderColor: '#6366f1' }}
              >
                Add Section
              </Button>
            </div>

            {sections.length === 0 ? (
              <Empty
                image={<BookOutlined style={{ fontSize: 64, color: '#d1d5db' }} />}
                description={
                  <span style={{ color: '#6b7280' }}>
                    No sections yet. Click "Add Section" to get started.
                  </span>
                }
                style={{ padding: '60px 0' }}
              />
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {sections.map((section, sectionIndex) => (
                  <Card
                    key={section.id}
                    size="small"
                    style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
                    title={`Section ${sectionIndex + 1}`}
                    extra={
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => removeSection(section.id)}
                        danger
                        size="small"
                      />
                    }
                  >
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                      <Input
                        placeholder="Section title (e.g., Introduction to React)"
                        value={section.title}
                        onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                        size="large"
                      />
                      <TextArea
                        placeholder="Section description (optional)"
                        value={section.description}
                        onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                        rows={2}
                      />
                      
                      {/* Videos in this section */}
                      <div style={{ marginTop: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontWeight: 500, color: '#6b7280' }}>Videos ({section.videos.length})</span>
                          <Button
                            type="dashed"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => addVideo(sectionIndex)}
                          >
                            Add Video
                          </Button>
                        </div>
                        
                        {section.videos.length > 0 && (
                          <Space direction="vertical" style={{ width: '100%', marginTop: 8 }} size="small">
                            {section.videos.map((video, videoIndex) => (
                              <Card
                                key={video.id}
                                size="small"
                                style={{ background: '#fff', border: '1px solid #e5e7eb' }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div style={{ flex: 1, marginRight: 8 }}>
                                    <Input
                                      placeholder="Video title"
                                      value={video.title}
                                      onChange={(e) => updateVideo(sectionIndex, videoIndex, 'title', e.target.value)}
                                      style={{ marginBottom: 8 }}
                                    />
                                    <Input
                                      placeholder="Video URL"
                                      value={video.videoUrl}
                                      onChange={(e) => updateVideo(sectionIndex, videoIndex, 'videoUrl', e.target.value)}
                                      style={{ marginBottom: 8 }}
                                    />
                                    <div>
                                      <div style={{ marginBottom: 4, fontSize: 13, color: '#6b7280' }}>
                                        Duration (in seconds)
                                      </div>
                                      <Input
                                        type="number"
                                        placeholder="e.g., 300 (5 minutes)"
                                        value={video.duration}
                                        onChange={(e) => updateVideo(sectionIndex, videoIndex, 'duration', parseInt(e.target.value) || 0)}
                                        style={{ width: '100%' }}
                                        min={0}
                                        addonAfter="seconds"
                                      />
                                      <div style={{ marginTop: 4, fontSize: 12, color: '#9ca3af' }}>
                                        Tip: 1 minute = 60 seconds, 5 minutes = 300 seconds
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    onClick={() => removeVideo(sectionIndex, videoIndex)}
                                    danger
                                    size="small"
                                  />
                                </div>
                              </Card>
                            ))}
                          </Space>
                        )}
                      </div>
                    </Space>
                  </Card>
                ))}
              </Space>
            )}
          </Card>
        )}

        {/* Step 3: Publish */}
        {currentStep === 2 && (
          <Card style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Ready to Publish</h3>

            <Card style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, marginBottom: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#166534', marginBottom: 12 }}>Course Summary</h4>
              <div style={{ color: '#15803d', lineHeight: 2 }}>
                <div>
                  <strong>Title:</strong> {courseData.title || 'Untitled Course'}
                </div>
                <div>
                  <strong>Sections:</strong> {sections.length}
                </div>
                <div>
                  <strong>Total Videos:</strong> {sections.reduce((acc, s) => acc + s.videos.length, 0)}
                </div>
              </div>
            </Card>

            <Form.Item
              name="confirmOriginal"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Please confirm')),
                },
              ]}
            >
              <Checkbox>I confirm that all course content is original or properly licensed</Checkbox>
            </Form.Item>

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
              <Checkbox>I have reviewed all lessons for accuracy and quality</Checkbox>
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
          {currentStep > 0 && (
            <Button size="large" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {currentStep === 0 && (
            <Button size="large" onClick={handleReset}>
              Cancel
            </Button>
          )}
        </div>

        <Space>
          <Button size="large" onClick={handleSaveDraft} loading={loading} disabled={loading}>
            Save as Draft
          </Button>
          {currentStep < 2 ? (
            <Button
              type="primary"
              size="large"
              onClick={handleNext}
              style={{ background: '#6366f1', borderColor: '#6366f1' }}
              disabled={loading}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              onClick={handlePublish}
              style={{ background: '#16a34a', borderColor: '#16a34a' }}
              loading={loading}
              disabled={loading}
            >
              Publish Course
            </Button>
          )}
        </Space>
      </div>
    </div>
  )
}

export default CreateCourseModal
