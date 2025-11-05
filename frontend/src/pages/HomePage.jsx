import { useEffect, useState } from 'react'
import CourseCard from '../components/CourseCard'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    api.get('/courses')
      .then((res) => {
        if (isMounted) setCourses(res)
      })
      .catch(() => {
        if (isMounted) setError('Failed to load courses')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  return (
    <div className="container">
      {user ? (
        <section className="hero light">
          <div className="hero-content">
            <h1>Welcome back, {user.name || user.email}!</h1>
            <p>Pick up where you left off or discover new courses.</p>
          </div>
        </section>
      ) : (
        <section className="hero light">
          <div className="hero-content">
            <h1>Unlock your potential with world-class courses</h1>
            <p>Learn in-demand skills with affordable video courses.</p>
            <div className="hero-search"><input placeholder="What do you want to learn?" /></div>
            <div className="chips">
              <span className="chip">Web Development</span>
              <span className="chip">Java</span>
              <span className="chip">React</span>
              <span className="chip">Spring Boot</span>
            </div>
          </div>
        </section>
      )}

      {user && (
        <section>
          <h2 className="section-title">Continue learning</h2>
          <div className="course-grid">
            {courses.slice(0, 2).map((c) => (
              <CourseCard key={`cont-${c.id}`} course={c} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="section-title">Top picks in Development</h2>
        {loading && <div className="muted">Loading…</div>}
        {error && <div className="error-text">{error}</div>}
        {!loading && !error && (
          <div className="course-grid">
            {courses.concat(courses).slice(0, 8).map((c, idx) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="section-title">Learn from the best</h2>
        <div className="experts-grid">
          {[{name:'Jane Doe',title:'Staff Engineer',company:'TechCorp'},{name:'John Smith',title:'Principal Developer',company:'Acme Inc.'},{name:'Mary Lee',title:'Senior Instructor',company:'CodeAcademy'},{name:'Alex Johnson',title:'Architect',company:'CloudWorks'}].map((e) => (
            <div className="expert-card" key={e.name}>
              <div className="avatar big">{e.name.charAt(0)}</div>
              <div className="expert-name">{e.name}</div>
              <div className="expert-title">{e.title} • {e.company}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">What learners say</h2>
        <div className="testimonials">
          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p>Clear explanations and practical projects. Highly recommend!</p>
            <span className="muted">— Priya K.</span>
          </div>
          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p>Great pacing and relevant topics. I landed a new job.</p>
            <span className="muted">— Daniel R.</span>
          </div>
          <div className="testimonial">
            <div className="stars">★★★★☆</div>
            <p>Hands-on approach made concepts click for me.</p>
            <span className="muted">— Mei L.</span>
          </div>
        </div>
      </section>
    </div>
  )
}


