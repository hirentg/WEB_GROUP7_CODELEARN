import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Typography } from 'antd'
import HomePage from './pages/HomePage'
import CourseDetailsPage from './pages/CourseDetailsPage'
import CourseLearnPage from './pages/CourseLearnPage'
import MyCoursesPage from './pages/MyCoursesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import InstructorPage from './pages/InstructorPage'
import Navbar from './components/Navbar'

const { Footer } = Layout
const { Text } = Typography

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout.Content style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:id" element={<CourseDetailsPage />} />
          <Route path="/instructor" element={<InstructorPage />} />
          <Route path="/course/:id/learn" element={<CourseLearnPage />} />
          <Route path="/my-learning" element={<MyCoursesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout.Content>
      <Footer style={{ textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
        <Text type="secondary">© {new Date().getFullYear()} CodeLearn</Text>
      </Footer>
    </Layout>
  )
}


