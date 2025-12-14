import React, { useState } from 'react'
import InstructorLayout from '../components/Layout/InstructorLayout'
import { Overview, StudentInteractions, Analytics, ProfileSettings } from '../components/InstructorManagement/Overview'
import { Courses } from '../components/InstructorManagement/Courses'
import { Quizzes } from '../components/InstructorManagement/Quizzes'

const viewComponents = {
  overview: <Overview />,
  courses: <Courses />,
  quizzes: <Quizzes />,
  interactions: <StudentInteractions />,
  analytics: <Analytics />,
  profile: <ProfileSettings />,
}

const InstructorPage = () => {
  const [selected, setSelected] = useState('overview')

  return (
    <InstructorLayout selected={selected} onSelect={(k) => setSelected(k)}>
      {viewComponents[selected]}
    </InstructorLayout>
  )
}

export default InstructorPage
