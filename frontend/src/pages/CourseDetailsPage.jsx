import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'

export default function CourseDetailsPage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.get(`/courses/${id}`)
      .then((data) => { if (active) setCourse(data) })
      .catch(() => active && setError('Failed to load course'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id])

  if (loading) return <div className="container">Loading…</div>
  if (error) return <div className="container error-text">{error}</div>
  if (!course) return <div className="container">Not found</div>

  return (
    <div className="container">
      <div className="course-details">
        <div className="cd-left">
          <h1>{course.title}</h1>
          <div className="course-author">By {course.instructor}</div>
          <div className="course-rating-row">
            <span className="rating-value">{course.rating?.toFixed ? course.rating.toFixed(1) : course.rating}</span>
            <span className="stars" aria-hidden>★★★★★</span>
            <span className="rating-count">({course.numRatings?.toLocaleString?.() || course.numRatings})</span>
          </div>
          <p className="muted">Duration: {course.duration} • {course.lessons} lessons</p>
        </div>
        <div className="cd-right">
          <div className="video-player">
            <video controls poster={course.thumbnailUrl} width="100%">


                 {/* video link here*/} */
                 
              {/*<source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" /> */}
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="price-and-cta">
            <div className="course-price big">{course.price || 'Free'}</div>
            <button>Buy now</button>
          </div>
        </div>
      </div>
      <section>
        <h2 className="section-title">Course content</h2>
        <ul className="curriculum">
          <li>Introduction and setup</li>
          <li>Core concepts and best practices</li>
          <li>Project: build a real-world app</li>
          <li>Deployment and next steps</li>
        </ul>
      </section>
    </div>
  )
}


