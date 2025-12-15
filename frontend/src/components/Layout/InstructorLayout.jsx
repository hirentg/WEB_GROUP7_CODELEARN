import React from 'react'
import { Layout } from 'antd'
import SidebarInstructor from './SidebarInstructor'

const { Sider, Content } = Layout

const InstructorLayout = ({ children, selected, onSelect }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} style={{ background: '#fff', borderRight: '1px solid #eef2f7', paddingTop: 18 }}>
        <SidebarInstructor selected={selected} onSelect={onSelect} />
      </Sider>

      <Layout>
        <Content style={{ padding: 24, background: '#f8fafc' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default InstructorLayout
