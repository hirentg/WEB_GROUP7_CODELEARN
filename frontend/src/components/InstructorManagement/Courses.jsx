import React, { useState, useEffect } from 'react'
import { Row, Col, Tabs, Button, message, Modal, Spin } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import ButtonCardCourse from '../Button/ButtonCardCourse'
import CreateCourseModal from '../Form/CreateCourseModal'
import EditCourseModal from '../Form/EditCourseModal'
import { api } from '../../services/api'

export const Courses = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        // Use instructor-specific endpoint to get only their courses
        const data = await api.get('/courses/instructor/my-courses')
        setCourses(data || [])
      } catch (error) {
        console.error('Error fetching courses:', error)
        message.error('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'all') return true
    if (activeTab === 'published') return course.status === 'PUBLISHED'
    if (activeTab === 'drafts') return course.status === 'DRAFT'
    return true
  })

  const tabItems = [
    {
      key: 'all',
      label: `All Courses (${courses.length})`,
    },
    {
      key: 'published',
      label: `Published (${courses.filter(c => c.status === 'PUBLISHED').length})`,
    },
    {
      key: 'drafts',
      label: `Drafts (${courses.filter(c => c.status === 'DRAFT').length})`,
    },
  ]

  const handleEdit = (id) => {
    const course = courses.find(c => c.id === id)
    setEditingCourse(course)
  }

  const handleDelete = (id) => {
    const course = courses.find(c => c.id === id)
    
    Modal.confirm({
      title: 'Delete Course',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div style={{ paddingBottom: 24 }}>
          <p>Are you sure you want to delete <strong>"{course?.title}"</strong>?</p>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 0 }}>This action cannot be undone.</p>
        </div>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      async onOk() {
        try {
          // Call API to delete from database
          await api.delete(`/courses/${id}`)
          
          // Remove from UI after successful deletion
          setCourses(courses.filter(c => c.id !== id))
          message.success('Course deleted successfully!')
        } catch (error) {
          console.error('Error deleting course:', error)
          if (error.response?.status === 403) {
            message.error("You don't have permission to delete this course")
          } else if (error.response?.status === 404) {
            message.error('Course not found')
          } else {
            message.error('Failed to delete course. Please try again.')
          }
        }
      },
    })
  }

  const handleCreateCourse = async (newCourse) => {
    // Refresh the course list after successful creation
    try {
      const data = await api.get('/courses/instructor/my-courses')
      setCourses(data || [])
    } catch (error) {
      console.error('Error refreshing courses:', error)
    }
    setIsModalOpen(false)
  }

  const handleEditCourse = async (values) => {
    try {
      // Call API to update course
      await api.put(`/courses/${editingCourse.id}`, values)
      
      // Refresh course list
      const data = await api.get('/courses/instructor/my-courses')
      setCourses(data || [])
      
      message.success(values.status === 'published' ? 'Course updated and published!' : 'Course updated as draft!')
      setEditingCourse(null)
    } catch (error) {
      console.error('Error updating course:', error)
      message.error('Failed to update course. Please try again.')
    }
  }

  // If editing course, show the edit form
  if (editingCourse) {
    return (
      <EditCourseModal
        course={editingCourse}
        onClose={() => setEditingCourse(null)}
        onSubmit={handleEditCourse}
      />
    )
  }

  // If creating course, show the form
  if (isModalOpen) {
    return (
      <CreateCourseModal
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCourse}
      />
    )
  }

  // Otherwise show the course list
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: 24 
      }}>
        <div>
          <h1 style={{ marginBottom: 8, fontSize: 32, fontWeight: 700 }}>My Courses</h1>
          <p style={{ color: '#6b7280', fontSize: 16 }}>Manage and organize your course content</p>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
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
          Create Course
        </Button>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={tabItems}
        style={{ marginBottom: 24 }}
        size="large"
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#6b7280' }}>Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: 16, color: '#6b7280' }}>No courses found</p>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredCourses.map(course => (
            <Col xs={24} sm={12} lg={8} key={course.id}>
              <ButtonCardCourse
                image={course.thumbnailUrl}
                title={course.title}
                description={course.description}
                students={course.students}
                completion={course.completion}
                status={course.status}
                onEdit={() => handleEdit(course.id)}
                onDelete={() => handleDelete(course.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default Courses
