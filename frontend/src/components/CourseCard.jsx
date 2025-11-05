import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="course-card">
      <div className="thumb" style={{ backgroundImage: `url(${course.thumbnailUrl})` }} />
      <div className="course-info">
        <div className="course-title">{course.title}</div>
        <div className="course-author">{course.instructor}</div>
        <div className="course-rating-row">
          <span className="rating-value">{course.rating?.toFixed ? course.rating.toFixed(1) : course.rating}</span>
          <span className="stars" aria-hidden>★★★★★</span>
          <span className="rating-count">({course.numRatings?.toLocaleString?.() || course.numRatings})</span>
        </div>
        <div className="course-meta"><span>{course.duration}</span></div>
        <div className="course-price">{course.price || 'Free'}</div>
      </div>
    </Link>
  )
}


