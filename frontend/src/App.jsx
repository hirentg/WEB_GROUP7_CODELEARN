import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Typography } from 'antd'
import HomePage from './pages/HomePage'
import CourseDetailsPage from './pages/CourseDetailsPage'
import CourseLearnPage from './pages/CourseLearnPage'
import CheckoutPage from './pages/CheckoutPage'
import QuizTakePage from './pages/QuizTakePage'
import MyCoursesPage from './pages/MyCoursesPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import InstructorPage from './pages/InstructorPage'
import AdminPage from './pages/AdminPage'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { Overview, StudentInteractions, Analytics, ProfileSettings } from './components/InstructorManagement/Overview'
import { Courses } from './components/InstructorManagement/Courses'
import { Quizzes } from './components/InstructorManagement/Quizzes'

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

          {/* Instructor routes - only accessible by INSTRUCTOR role */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <InstructorPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/instructor/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="courses" element={<Courses />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="interactions" element={<StudentInteractions />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Admin routes - only accessible by ADMIN role */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/course/:id/learn"
            element={
              <ProtectedRoute>
                <CourseLearnPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/:courseId"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-learning"
            element={
              <ProtectedRoute>
                <MyCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <QuizTakePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout.Content>
      <Footer style={{ textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
        <Text type="secondary">© {new Date().getFullYear()} CodeLearn</Text>
      </Footer>
    </Layout>
  )
}


