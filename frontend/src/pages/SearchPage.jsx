import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Card, Rate, Spin, Empty, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { api } from '../services/api'

const { Title, Text, Paragraph } = Typography

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const query = searchParams.get('q') || ''
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState(query)

    useEffect(() => {
        if (query) {
            setLoading(true)
            api.get(`/courses/search?q=${encodeURIComponent(query)}`)
                .then(data => setResults(Array.isArray(data) ? data : []))
                .catch(() => setResults([]))
                .finally(() => setLoading(false))
        } else {
            setResults([])
        }
    }, [query])

    const handleSearch = (value) => {
        if (value?.trim()) {
            setSearchParams({ q: value.trim() })
        }
    }

    return (
        <div className="container section-padding">
            {/* Search Header */}
            <div style={{ marginBottom: 40 }}>
                <Title level={2} style={{ marginBottom: 16 }}>
                    {query ? `Search results for "${query}"` : 'Search Courses'}
                </Title>
                <Input
                    size="large"
                    placeholder="Search for courses..."
                    prefix={<SearchOutlined />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onPressEnter={(e) => handleSearch(e.target.value)}
                    style={{ maxWidth: 500, borderRadius: 8 }}
                />
            </div>

            {/* Results */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 80 }}>
                    <Spin size="large" tip="Searching..." />
                </div>
            ) : results.length > 0 ? (
                <>
                    <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
                        Found {results.length} course{results.length !== 1 ? 's' : ''}
                    </Text>
                    <Row gutter={[24, 24]}>
                        {results.map(course => (
                            <Col xs={24} sm={12} lg={8} xl={6} key={course.id}>
                                <Card
                                    hoverable
                                    onClick={() => navigate(`/course/${course.id}`)}
                                    cover={
                                        <div style={{
                                            height: 160,
                                            overflow: 'hidden',
                                            background: '#f0f0f0'
                                        }}>
                                            <img
                                                alt={course.title}
                                                src={course.thumbnailUrl || 'https://via.placeholder.com/300x160'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    }
                                    bodyStyle={{ padding: 16 }}
                                >
                                    <Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: 8, minHeight: 48 }}>
                                        {course.title}
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        {course.instructor}
                                    </Text>
                                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Text strong style={{ color: '#f59e0b' }}>
                                            {course.rating?.toFixed(1) || '4.5'}
                                        </Text>
                                        <Rate disabled defaultValue={course.rating || 4.5} style={{ fontSize: 12 }} />
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            ({course.numRatings || 0})
                                        </Text>
                                    </div>
                                    <div style={{ marginTop: 8 }}>
                                        <Text strong style={{ fontSize: 16 }}>{course.price || 'Free'}</Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            ) : query ? (
                <Empty
                    description={
                        <span>
                            No courses found for "<strong>{query}</strong>"
                        </span>
                    }
                    style={{ padding: 80 }}
                />
            ) : (
                <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
                    <SearchOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                    <div>Enter a search term to find courses</div>
                </div>
            )}
        </div>
    )
}
