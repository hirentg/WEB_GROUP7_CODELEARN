import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Card, Button, Radio, Form, Input, Spin, Alert, Space, Divider, message } from 'antd'
import { CreditCardOutlined, PayCircleOutlined, LockOutlined, SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { getImageUrl } from '../utils/imageHelper'

const { Title, Text, Paragraph } = Typography

export default function CheckoutPage() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')
    const [form] = Form.useForm()

    useEffect(() => {
        if (!user) {
            localStorage.setItem('redirectAfterLogin', `/checkout/${courseId}`)
            navigate('/login')
            return
        }

        // Check if already purchased
        api.get(`/purchases/check/${courseId}`)
            .then(res => {
                if (res?.purchased) {
                    message.info('You already own this course!')
                    navigate(`/course/${courseId}/learn`)
                    return
                }
            })

        // Load course details
        api.get(`/courses/${courseId}`)
            .then(data => setCourse(data))
            .catch(() => message.error('Failed to load course'))
            .finally(() => setLoading(false))
    }, [courseId, user, navigate])

    const handlePayment = async (values) => {
        setProcessing(true)

        try {
            const payload = {
                courseId,
                paymentMethod,
                ...(paymentMethod === 'CREDIT_CARD' && {
                    cardDetails: {
                        cardNumber: values.cardNumber?.replace(/\s/g, ''),
                        expiryMonth: values.expiry?.split('/')[0],
                        expiryYear: values.expiry?.split('/')[1],
                        cvv: values.cvv,
                        cardholderName: values.cardholderName
                    }
                })
            }

            const response = await api.post('/purchases/checkout', payload)

            if (response?.success) {
                message.success('Payment successful! Redirecting to your course...')
                setTimeout(() => navigate(`/course/${courseId}/learn`), 1500)
            } else {
                message.error(response?.message || 'Payment failed')
            }
        } catch (error) {
            message.error(error.message || 'Payment processing failed')
        } finally {
            setProcessing(false)
        }
    }

    const handlePayPal = async () => {
        setProcessing(true)

        try {
            const response = await api.post('/purchases/checkout', {
                courseId,
                paymentMethod: 'PAYPAL'
            })

            if (response?.success) {
                message.success('PayPal payment successful! Redirecting to your course...')
                setTimeout(() => navigate(`/course/${courseId}/learn`), 1500)
            } else {
                message.error(response?.message || 'PayPal payment failed')
            }
        } catch (error) {
            message.error(error.message || 'PayPal payment failed')
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div style={{ height: '60vh', display: 'grid', placeItems: 'center' }}>
                <Spin size="large" tip="Loading checkout..." />
            </div>
        )
    }

    if (!course) {
        return (
            <div className="container section-padding">
                <Alert message="Course not found" type="error" showIcon />
            </div>
        )
    }

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '48px 0' }}>
            <div className="container">
                <Title level={2} style={{ marginBottom: '32px' }}>Checkout</Title>

                <Row gutter={[32, 32]}>
                    {/* Payment Form */}
                    <Col xs={24} lg={16}>
                        <Card>
                            <Title level={4} style={{ marginTop: 0 }}>Payment Method</Title>

                            <Radio.Group
                                value={paymentMethod}
                                onChange={e => setPaymentMethod(e.target.value)}
                                style={{ width: '100%', marginBottom: '24px' }}
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Radio.Button
                                        value="CREDIT_CARD"
                                        style={{
                                            width: '100%',
                                            height: '60px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 20px'
                                        }}
                                    >
                                        <CreditCardOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
                                        <span>Credit / Debit Card</span>
                                    </Radio.Button>
                                    <Radio.Button
                                        value="PAYPAL"
                                        style={{
                                            width: '100%',
                                            height: '60px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 20px'
                                        }}
                                    >
                                        <PayCircleOutlined style={{ fontSize: '24px', marginRight: '12px', color: '#003087' }} />
                                        <span>PayPal</span>
                                    </Radio.Button>
                                </Space>
                            </Radio.Group>

                            {paymentMethod === 'CREDIT_CARD' && (
                                <Form form={form} layout="vertical" onFinish={handlePayment}>
                                    <Form.Item
                                        label="Cardholder Name"
                                        name="cardholderName"
                                        rules={[{ required: true, message: 'Please enter cardholder name' }]}
                                    >
                                        <Input placeholder="John Doe" size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Card Number"
                                        name="cardNumber"
                                        rules={[
                                            { required: true, message: 'Please enter card number' },
                                            { pattern: /^[\d\s]{16,19}$/, message: 'Enter 16-digit card number' }
                                        ]}
                                    >
                                        <Input
                                            placeholder="4111 1111 1111 1111"
                                            size="large"
                                            maxLength={19}
                                            prefix={<CreditCardOutlined />}
                                        />
                                    </Form.Item>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Expiry Date"
                                                name="expiry"
                                                rules={[
                                                    { required: true, message: 'Required' },
                                                    { pattern: /^\d{2}\/\d{2}$/, message: 'Use MM/YY format' }
                                                ]}
                                            >
                                                <Input placeholder="MM/YY" size="large" maxLength={5} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="CVV"
                                                name="cvv"
                                                rules={[
                                                    { required: true, message: 'Required' },
                                                    { pattern: /^\d{3,4}$/, message: '3-4 digits' }
                                                ]}
                                            >
                                                <Input placeholder="123" size="large" maxLength={4} type="password" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        block
                                        loading={processing}
                                        style={{ height: '56px', fontSize: '18px', marginTop: '16px' }}
                                    >
                                        <LockOutlined /> Pay {course.price}
                                    </Button>
                                </Form>
                            )}

                            {paymentMethod === 'PAYPAL' && (
                                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                    <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
                                        You will complete your payment via PayPal.
                                    </Paragraph>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={handlePayPal}
                                        loading={processing}
                                        style={{
                                            height: '56px',
                                            width: '100%',
                                            maxWidth: '400px',
                                            fontSize: '18px',
                                            background: '#0070ba'
                                        }}
                                    >
                                        <PayCircleOutlined /> Pay with PayPal
                                    </Button>
                                </div>
                            )}

                            <Divider />

                            <Space style={{ justifyContent: 'center', width: '100%' }}>
                                <SafetyOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                                <Text type="secondary">Secure 256-bit SSL encryption</Text>
                            </Space>
                        </Card>
                    </Col>

                    {/* Order Summary */}
                    <Col xs={24} lg={8}>
                        <Card>
                            <Title level={4} style={{ marginTop: 0 }}>Order Summary</Title>

                            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                <img
                                    src={getImageUrl(course.thumbnailUrl) || 'https://via.placeholder.com/100x60'}
                                    alt={course.title}
                                    style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <div>
                                    <Text strong style={{ display: 'block' }}>{course.title}</Text>
                                    <Text type="secondary">By {course.instructor}</Text>
                                </div>
                            </div>

                            <Divider />

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Text>Original Price:</Text>
                                <Text>{course.price}</Text>
                            </div>

                            <Divider />

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Title level={4} style={{ margin: 0 }}>Total:</Title>
                                <Title level={4} style={{ margin: 0, color: 'var(--primary)' }}>{course.price}</Title>
                            </div>

                            <div style={{ marginTop: '24px', padding: '16px', background: '#f6ffed', borderRadius: '8px' }}>
                                <Space>
                                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                    <Text style={{ color: '#52c41a' }}>30-Day Money-Back Guarantee</Text>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
