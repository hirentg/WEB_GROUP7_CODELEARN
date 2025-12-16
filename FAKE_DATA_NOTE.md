# FAKE DATA - My Learning Page

## 📝 Lưu ý quan trọng

Trang **My Learning** hiện đang sử dụng **FAKE DATA** để test UI. Dữ liệu không được lưu trong database.

## 🔧 Cách hoạt động hiện tại

### Backend API
- **Endpoint**: `GET /api/users/my-learning`
- **Controller**: `MyLearningController.java`
- **Dữ liệu**: Hardcoded fake data trong controller
- **Security**: Public access (không cần authentication) - chỉ để test

### Fake Data Structure
```json
[
  {
    "courseId": "react-pro",
    "courseName": "React for Professionals",
    "description": "Master React with this comprehensive guide...",
    "thumbnail": "https://images.unsplash.com/...",
    "purchaseDate": "2024-12-01T10:00:00",
    "progress": 65
  },
  ...
]
```

### Các trạng thái Progress
- **0%**: Not Started (chưa bắt đầu)
- **1-99%**: In Progress (đang học)
- **100%**: Completed (đã hoàn thành)

## 🚀 Cách chuyển sang dữ liệu thật

### Bước 1: Tạo Database Schema
Cần có các bảng:
- `orders` - Đơn hàng
- `order_items` - Chi tiết đơn hàng
- `courses` - Khóa học
- `users` - Người dùng

### Bước 2: Tạo Entities
- `Order` entity với status (PENDING, PAID, CANCELLED)
- `OrderItem` entity liên kết Order và Course
- Chỉ trả về courses có `Order.status = PAID`

### Bước 3: Tạo Service
```java
@Service
public class MyLearningService {
    public List<PurchasedCourseDTO> getMyLearningCourses(Long userId) {
        // Query từ database:
        // SELECT oi.* FROM order_items oi
        // JOIN orders o ON oi.order_id = o.id
        // WHERE o.user_id = :userId AND o.status = 'PAID'
    }
}
```

### Bước 4: Cập nhật Controller
Thay thế `MyLearningController` bằng controller thật:
```java
@GetMapping("/my-learning")
public ResponseEntity<?> getMyLearning(HttpServletRequest request) {
    // Lấy userId từ JWT token
    Long userId = jwtUtil.getUserIdFromToken(request.getHeader("Authorization"));
    
    // Gọi service để lấy từ database
    List<PurchasedCourseDTO> courses = myLearningService.getMyLearningCourses(userId);
    
    return ResponseEntity.ok(courses);
}
```

### Bước 5: Cập nhật Security
Thay đổi trong `SecurityConfig.java`:
```java
.requestMatchers(HttpMethod.GET, "/api/users/my-learning").authenticated()
```

### Bước 6: Thêm Progress Tracking
Để track progress thực tế, cần:
- Bảng `course_progress` hoặc `video_progress`
- Lưu progress khi user xem video/hoàn thành bài học
- Tính toán progress từ số video đã xem / tổng số video

## 📍 File locations

- **Frontend**: `frontend/src/pages/MyLearningPage.jsx`
- **Backend Controller**: `backend/src/main/java/com/codelearn/controller/MyLearningController.java`
- **Route**: `/my-learning` (đã thêm vào `App.jsx`)
- **API Endpoint**: `/api/users/my-learning`

## ✅ Hiện tại đang hoạt động

- ✅ Trang My Learning hiển thị 4 fake courses
- ✅ Progress bars hoạt động
- ✅ Status tags (Completed, In Progress, Not Started)
- ✅ Purchase dates hiển thị
- ✅ Navigation đến course details
- ✅ Empty state khi không có courses

## ⚠️ Cần làm để production

1. Tạo database schema cho Orders và OrderItems
2. Tạo entities và repositories
3. Tạo service để query từ database
4. Thêm authentication cho API endpoint
5. Implement progress tracking system
6. Xóa fake data controller

