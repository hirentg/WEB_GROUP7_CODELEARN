import React from 'react'
import { Card, Button } from 'antd'
import { EditOutlined, DeleteOutlined, UserOutlined, LineChartOutlined } from '@ant-design/icons'
import { getImageUrl } from '../../utils/imageHelper'

const ButtonCardCourse = ({ 
  image, 
  title, 
  description, 
  students, 
  completion, 
  status = 'Published',
  onEdit,
  onDelete 
}) => {
  return (
    <Card
      hoverable
      style={{ 
        borderRadius: 12, 
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
      cover={
        <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <img
            alt={title}
            src={getImageUrl(image) || 'https://via.placeholder.com/400x200'}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
          <div 
            style={{ 
              position: 'absolute', 
              top: 12, 
              right: 12,
              backgroundColor: status === 'Published' ? '#10b981' : '#f59e0b',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            {status}
          </div>
        </div>
      }
    >
      <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          marginBottom: 8,
          color: '#1f2937'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          color: '#6b7280', 
          fontSize: 14, 
          marginBottom: 16,
          flex: 1,
          lineHeight: 1.6
        }}>
          {description}
        </p>

        <div style={{ 
          display: 'flex', 
          gap: 20, 
          marginBottom: 16,
          paddingTop: 12,
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <UserOutlined style={{ color: '#6b7280', fontSize: 16 }} />
            <span style={{ color: '#4b5563', fontSize: 14, fontWeight: 500 }}>
              {students} students
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <LineChartOutlined style={{ color: '#6b7280', fontSize: 16 }} />
            <span style={{ color: '#4b5563', fontSize: 14, fontWeight: 500 }}>
              {completion}% completion
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={onEdit}
            className="edit-button"
            style={{ 
              flex: 1,
              borderRadius: 8,
              fontWeight: 600,
              background: '#6366f1',
              borderColor: '#6366f1',
              color: '#fff',
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4f46e5'
              e.currentTarget.style.borderColor = '#4f46e5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#6366f1'
              e.currentTarget.style.borderColor = '#6366f1'
            }}
          >
            Edit
          </Button>
          <Button 
            icon={<DeleteOutlined />}
            onClick={onDelete}
            style={{ 
              borderRadius: 8,
              borderColor: '#e5e7eb',
              color: '#6b7280',
              background: '#fff',
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2'
              e.currentTarget.style.borderColor = '#fca5a5'
              e.currentTarget.style.color = '#dc2626'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.color = '#6b7280'
            }}
          />
        </div>
      </div>
    </Card>
  )
}

export default ButtonCardCourse
