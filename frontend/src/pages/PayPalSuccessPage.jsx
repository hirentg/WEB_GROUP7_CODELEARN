import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, Result, Button, Typography } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { api } from '../services/api'

const { Title, Paragraph } = Typography

/**
 * PayPal Success Callback Page
 * Handles the return from PayPal after user approves the payment.
 * Uses URL token parameter and backend API (no localStorage).
 */
export default function PayPalSuccessPage() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [status, setStatus] = useState('processing') // processing, success, error
    const [message, setMessage] = useState('')

    useEffect(() => {
        const capturePayment = async () => {
            try {
                // PayPal returns with 'token' query param which is the order ID
                const orderId = searchParams.get('token')

                if (!orderId) {
                    setStatus('error')
                    setMessage('PayPal order token not found. Please try again.')
                    return
                }

                // Capture the order via backend (backend validates ownership)
                const response = await api.post('/paypal/capture-order', {
                    orderId
                })

                if (response?.success) {
                    setStatus('success')
                    setMessage(response.message || 'Payment successful!')

                    // Redirect to course after 2 seconds
                    setTimeout(() => {
                        navigate(`/course/${courseId}/learn`)
                    }, 2000)
                } else {
                    setStatus('error')
                    setMessage(response?.message || 'Payment capture failed')
                }
            } catch (error) {
                console.error('PayPal capture error:', error)
                setStatus('error')
                setMessage(error.message || 'Failed to complete payment')
            }
        }

        capturePayment()
    }, [courseId, navigate, searchParams])

    if (status === 'processing') {
        return (
            <div style={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px'
            }}>
                <Spin size="large" />
                <Title level={3}>Completing your payment...</Title>
                <Paragraph type="secondary">Please wait while we confirm your payment with PayPal.</Paragraph>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div style={{
                height: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Result
                    status="success"
                    icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    title="Payment Successful!"
                    subTitle={message}
                    extra={[
                        <Button
                            type="primary"
                            key="course"
                            onClick={() => navigate(`/course/${courseId}/learn`)}
                        >
                            Go to Course
                        </Button>
                    ]}
                />
            </div>
        )
    }

    return (
        <div style={{
            height: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Result
                status="error"
                icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                title="Payment Failed"
                subTitle={message}
                extra={[
                    <Button
                        type="primary"
                        key="retry"
                        onClick={() => navigate(`/checkout/${courseId}`)}
                    >
                        Try Again
                    </Button>,
                    <Button
                        key="home"
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </Button>
                ]}
            />
        </div>
    )
}
