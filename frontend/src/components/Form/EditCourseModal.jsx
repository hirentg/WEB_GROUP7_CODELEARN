import React, { useState, useEffect } from 'react'
import { Steps, Button, Form, Input, Upload, Card, Checkbox, Space } from 'antd'
import { PlusOutlined, CloseOutlined, CheckCircleFilled } from '@ant-design/icons'

const { TextArea } = Input

const EditCourseModal = ({ course, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const [sections, setSections] = useState([])
  const [courseData, setCourseData] = useState({})

  useEffect(() => {
    // Pre-populate form with course data
    if (course) {
      form.setFieldsValue({
        title: course.title,
        description: course.description,
      })
      setCourseData({
        title: course.title,
        description: course.description,
      })

      // Fake some sections for demo
      const fakeSections = [
        { id: 1, title: 'Getting Started', lessons: ['Introduction', 'Setup Environment'] },
        { id: 2, title: 'Core Concepts', lessons: ['Components', 'Props', 'State'] },
        { id: 3, title: 'Advanced Topics', lessons: ['Hooks', 'Context API', 'Performance'] },
      ]
      setSections(fakeSections)
    }
  }, [course, form])

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        const values = await form.validateFields(['title', 'description'])
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

  const handleSaveDraft = () => {
    const allData = { ...courseData, sections, status: 'draft' }
    onSubmit(allData)
    handleReset()
  }

  const handlePublish = async () => {
    try {
      await form.validateFields(['confirmOriginal', 'confirmReviewed'])
      const allData = { ...courseData, sections, status: 'published' }
      onSubmit(allData)
      handleReset()
    } catch (error) {
      console.error('Please confirm all checkboxes')
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    form.resetFields()
    setFileList([])
    onClose()
  }

  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: '', lessons: [] }])
  }

  const removeSection = (id) => {
    setSections(sections.filter(s => s.id !== id))
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
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Edit Course</h2>
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

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {sections.map((section, index) => (
                <Card
                  key={section.id}
                  size="small"
                  style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
                  title={`Section ${index + 1}`}
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
                  <Input
                    placeholder="Section title"
                    value={section.title}
                    onChange={(e) => {
                      const newSections = [...sections]
                      newSections[index].title = e.target.value
                      setSections(newSections)
                    }}
                  />
                  {section.lessons && section.lessons.length > 0 && (
                    <div style={{ marginTop: 12, color: '#6b7280', fontSize: 13 }}>
                      {section.lessons.length} lesson(s): {section.lessons.join(', ')}
                    </div>
                  )}
                </Card>
              ))}
            </Space>
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
                  <strong>Title:</strong> {courseData.title || course?.title || 'Untitled Course'}
                </div>
                <div>
                  <strong>Sections:</strong> {sections.length}
                </div>
                <div>
                  <strong>Total Lessons:</strong> {sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)}
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
          <Button size="large" onClick={handleSaveDraft}>
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
              style={{ background: '#16a34a', borderColor: '#16a34a' }}
            >
              Publish Course
            </Button>
          )}
        </Space>
      </div>
    </div>
  )
}

export default EditCourseModal
