import React, { useState } from 'react'
import { Row, Col, Tabs, Button, message, Modal } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import ButtonCardCourse from '../Button/ButtonCardCourse'
import CreateCourseModal from '../Form/CreateCourseModal'
import EditCourseModal from '../Form/EditCourseModal'

const mockCourses = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    title: 'React Fundamentals',
    description: 'Learn the basics of React including components, props, state, and hooks.',
    students: 456,
    completion: 82,
    status: 'Published'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
    title: 'JavaScript Mastery',
    description: 'Master modern JavaScript ES6+ features and best practices.',
    students: 234,
    completion: 75,
    status: 'Published'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    title: 'Python Basics',
    description: 'Introduction to Python programming for beginners.',
    students: 189,
    completion: 68,
    status: 'Published'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js and Express.',
    students: 312,
    completion: 71,
    status: 'Published'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
    title: 'Advanced TypeScript',
    description: 'Deep dive into TypeScript type system and advanced patterns.',
    students: 0,
    completion: 0,
    status: 'Draft'
  },
]

export const Courses = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [courses, setCourses] = useState(mockCourses)

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'all') return true
    if (activeTab === 'published') return course.status === 'Published'
    if (activeTab === 'drafts') return course.status === 'Draft'
    return true
  })

  const tabItems = [
    {
      key: 'all',
      label: `All Courses (${courses.length})`,
    },
    {
      key: 'published',
      label: `Published (${courses.filter(c => c.status === 'Published').length})`,
    },
    {
      key: 'drafts',
      label: `Drafts (${courses.filter(c => c.status === 'Draft').length})`,
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
      onOk() {
        // Remove from UI immediately
        setCourses(courses.filter(c => c.id !== id))
        message.success('Course deleted successfully!')
        
        // TODO: Call API to delete from database
        // api.deleteCourse(id)
      },
    })
  }

  const handleCreateCourse = (values) => {
    console.log('New course:', values)
    message.success(values.status === 'published' ? 'Course published successfully!' : 'Course saved as draft!')
    setIsModalOpen(false)
  }

  const handleEditCourse = (values) => {
    console.log('Update course:', values)
    message.success(values.status === 'published' ? 'Course updated and published!' : 'Course updated as draft!')
    setEditingCourse(null)
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

      <Row gutter={[24, 24]}>
        {filteredCourses.map(course => (
          <Col xs={24} sm={12} lg={8} key={course.id}>
            <ButtonCardCourse
              image={course.image}
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
    </div>
  )
}

export default Courses
