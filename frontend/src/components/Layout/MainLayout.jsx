import React from 'react';
import { Layout, Menu, Button, Avatar, Space } from 'antd';
import { HomeOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  // Simple menu items
  const items = [
    { key: '/', icon: <HomeOutlined />, label: 'Home' },
    { key: '/courses', icon: <BookOutlined />, label: 'Courses' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'sticky', 
          top: 0, 
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
        }}
      >
        {/* Logo Area */}
        <div 
          style={{ color: '#6366f1', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }} 
          onClick={() => navigate('/')}
        >
          Code<span style={{ color: '#1e293b' }}>Learn</span>
        </div>

        {/* Navigation */}
        <Menu 
          theme="light" 
          mode="horizontal" 
          defaultSelectedKeys={['/']} 
          items={items}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, borderBottom: 'none', marginLeft: '40px' }}
        />

        {/* Auth Buttons (Right Side) */}
        <Space>
          <Button type="text" onClick={() => navigate('/login')}>Log in</Button>
          <Button type="primary" onClick={() => navigate('/register')}>Join for Free</Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px 50px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: 'transparent' }}>
        CodeLearn ©2025 Created by Group 7
      </Footer>
    </Layout>
  );
};

export default MainLayout;