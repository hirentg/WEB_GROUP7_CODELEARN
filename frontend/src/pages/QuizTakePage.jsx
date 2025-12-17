import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Card, Spin, Alert, Button, Radio, Space, Progress, message, Result } from 'antd'
import { LeftOutlined, CheckCircleFilled, CloseCircleFilled, TrophyOutlined } from '@ant-design/icons'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const { Title, Text, Paragraph } = Typography

export default function QuizTakePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [quiz, setQuiz] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        api.get(`/quizzes/${id}`)
            .then((data) => setQuiz(data))
            .catch(() => setError('Failed to load quiz'))
            .finally(() => setLoading(false))
    }, [id, user, navigate])

    const handleAnswerSelect = (questionIndex, optionIndex) => {
        if (submitted) return
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }))
    }

    const handleSubmit = () => {
        if (!quiz?.questions) return

        let correct = 0
        quiz.questions.forEach((question, index) => {
            const selectedOption = selectedAnswers[index]
            if (selectedOption !== undefined && question.options?.[selectedOption]?.isCorrect) {
                correct++
            }
        })

        setScore(correct)
        setSubmitted(true)
        message.success(`Quiz completed! Score: ${correct}/${quiz.questions.length}`)
    }

    if (!user) return null

    if (loading) {
        return (
            <div style={{ height: '60vh', display: 'grid', placeItems: 'center' }}>
                <Spin size="large" tip="Loading quiz..." />
            </div>
        )
    }

    if (error || !quiz) {
        return (
            <div className="container section-padding">
                <Alert message={error || 'Quiz not found'} type="error" showIcon />
                <Button onClick={() => navigate(-1)} style={{ marginTop: '16px' }}>
                    Go Back
                </Button>
            </div>
        )
    }

    const questions = quiz.questions || []
    const currentQ = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    if (submitted) {
        const percentage = Math.round((score / questions.length) * 100)
        const passed = percentage >= 70

        return (
            <div className="container section-padding" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Result
                    icon={passed ? <TrophyOutlined style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#ff4d4f' }} />}
                    status={passed ? 'success' : 'error'}
                    title={passed ? 'Congratulations! 🎉' : 'Keep Learning'}
                    subTitle={`You scored ${score} out of ${questions.length} (${percentage}%)`}
                    extra={[
                        <Button
                            type="primary"
                            key="retry"
                            onClick={() => {
                                setSubmitted(false)
                                setSelectedAnswers({})
                                setCurrentQuestion(0)
                            }}
                        >
                            Try Again
                        </Button>,
                        <Button key="back" onClick={() => navigate(-1)}>
                            Back to Course
                        </Button>
                    ]}
                />
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <div style={{ background: '#1f2937', color: '#fff', padding: '24px 0' }}>
                <div className="container">
                    <Button
                        type="text"
                        icon={<LeftOutlined />}
                        onClick={() => navigate(-1)}
                        style={{ color: '#fff', marginBottom: '16px' }}
                    >
                        Back
                    </Button>
                    <Title level={2} style={{ color: '#fff', margin: 0 }}>{quiz.title}</Title>
                    <Text style={{ color: '#d1d5db' }}>{quiz.description}</Text>
                </div>
            </div>

            <div className="container" style={{ padding: '32px 0', maxWidth: '800px', margin: '0 auto' }}>
                <Progress percent={Math.round(progress)} showInfo={false} style={{ marginBottom: '24px' }} />

                <Card>
                    <div style={{ marginBottom: '24px' }}>
                        <Text type="secondary">Question {currentQuestion + 1} of {questions.length}</Text>
                    </div>

                    <Title level={4}>{currentQ?.text || currentQ?.question}</Title>

                    <Radio.Group
                        value={selectedAnswers[currentQuestion]}
                        onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {currentQ?.options?.map((option, idx) => (
                                <Radio.Button
                                    key={idx}
                                    value={idx}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        padding: '16px 20px',
                                        textAlign: 'left',
                                        whiteSpace: 'normal',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    {option.text || option}
                                </Radio.Button>
                            ))}
                        </Space>
                    </Radio.Group>

                    <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(prev => prev - 1)}
                        >
                            Previous
                        </Button>

                        {currentQuestion < questions.length - 1 ? (
                            <Button
                                type="primary"
                                disabled={selectedAnswers[currentQuestion] === undefined}
                                onClick={() => setCurrentQuestion(prev => prev + 1)}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                disabled={Object.keys(selectedAnswers).length < questions.length}
                                onClick={handleSubmit}
                            >
                                Submit Quiz
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
