# Instructor Overview API Documentation

## Endpoint
```
GET /api/instructor/overview
```

## Description
Lấy dữ liệu tổng quan dashboard cho instructor, bao gồm thống kê về students, courses, và enrollment trends.

## Authentication
Requires JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

```json
{
  "totalStudents": {
    "value": 1234,
    "changePercentage": "+12%",
    "changeText": "+150 from last month"
  },
  "activeCourses": {
    "value": 8,
    "changePercentage": "+25%",
    "changeText": "+2 from last month"
  },
  "pendingQuestions": {
    "value": 23,
    "changePercentage": "+5%",
    "changeText": "+1 from last month"
  },
  "avgCompletion": {
    "value": "78%",
    "changePercentage": "+3%",
    "changeText": "+3% from last month"
  },
  "enrollmentTrend": [
    { "month": "Jan", "students": 387 },
    { "month": "Feb", "students": 542 },
    { "month": "Mar", "students": 701 },
    { "month": "Apr", "students": 892 },
    { "month": "May", "students": 1045 },
    { "month": "Jun", "students": 1234 }
  ]
}
```

## Data Fields

### totalStudents
- **value**: Tổng số students đã mua courses của instructor
- **changePercentage**: Phần trăm thay đổi so với tháng trước
- **changeText**: Mô tả chi tiết về sự thay đổi

### activeCourses
- **value**: Số lượng courses đang ở trạng thái PUBLISHED
- **changePercentage**: Phần trăm thay đổi so với tháng trước
- **changeText**: Mô tả chi tiết về sự thay đổi

### pendingQuestions
- **value**: Số câu hỏi chưa được trả lời (hiện tại = 0, cần implement Q&A table)
- **changePercentage**: Phần trăm thay đổi
- **changeText**: Mô tả chi tiết

### avgCompletion
- **value**: Phần trăm trung bình hoàn thành courses (format: "78%")
- **changePercentage**: Phần trăm thay đổi so với tháng trước
- **changeText**: Mô tả chi tiết

### enrollmentTrend
Array of enrollment data cho 6 tháng gần nhất:
- **month**: Tên tháng (Jan, Feb, Mar, ...)
- **students**: Số students đăng ký trong tháng đó

## Database Queries

### Total Students
```sql
SELECT COUNT(DISTINCT pc.user_id) 
FROM purchased_courses pc 
JOIN courses c ON pc.course_id = c.id 
WHERE c.instructor_id = :instructorId
```

### Active Courses
```sql
SELECT COUNT(c) 
FROM Course c 
WHERE c.instructorId = :instructorId 
AND c.status = 'PUBLISHED'
```

### Average Completion
```sql
SELECT AVG(pc.progress_percentage) 
FROM purchased_courses pc 
JOIN courses c ON pc.course_id = c.id 
WHERE c.instructor_id = :instructorId
```

### Enrollment Trend
```sql
SELECT DATE_TRUNC('month', pc.purchased_at) as month, 
       COUNT(DISTINCT pc.user_id) as student_count 
FROM purchased_courses pc 
JOIN courses c ON pc.course_id = c.id 
WHERE c.instructor_id = :instructorId 
AND pc.purchased_at >= :startDate 
GROUP BY DATE_TRUNC('month', pc.purchased_at) 
ORDER BY month ASC
```

## Frontend Integration

```javascript
import { api } from '../../services/api'

async function loadOverviewData() {
  try {
    const response = await api.get('/instructor/overview')
    console.log(response)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message details"
}
```

## Implementation Files

### Backend
- `InstructorOverviewDTO.java` - Response DTO
- `InstructorController.java` - API endpoint
- `InstructorService.java` - Business logic
- `CourseRepository.java` - Course queries
- `PurchasedCourseRepository.java` - Purchase queries

### Frontend
- `Overview.jsx` - Dashboard component
- `api.js` - API service

## Future Enhancements

1. **Pending Questions**: Cần tạo bảng `questions` hoặc `discussions` để track câu hỏi
2. **Real-time Updates**: WebSocket cho real-time notifications
3. **Caching**: Redis cache cho performance
4. **More Metrics**: Revenue, ratings trend, engagement rate
5. **Date Filters**: Allow custom date range selection
