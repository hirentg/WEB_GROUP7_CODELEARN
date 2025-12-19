import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Card, Button, Space, Empty, Spin, message, Divider, Row, Col, Image } from 'antd'
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import cartApi from '../services/cartApi'
import { useAuth } from '../context/AuthContext'

const { Title, Text, Paragraph } = Typography

export default function CartPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const [removing, setRemoving] = useState(null)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        fetchCart()
    }, [user, navigate])

    const fetchCart = async () => {
        try {
            const data = await cartApi.getCart()
            setCart(data)
        } catch (err) {
            message.error('Failed to load cart')
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveItem = async (courseId) => {
        setRemoving(courseId)
        try {
            await cartApi.removeFromCart(courseId)
            message.success('Course removed from cart')
            fetchCart()
        } catch (err) {
            message.error('Failed to remove course')
        } finally {
            setRemoving(null)
        }
    }

    const calculateTotal = () => {
        if (!cart?.items) return 0
        return cart.items.reduce((sum, item) => {
            const price = parseFloat(item.coursePrice?.replace(/[^0-9.]/g, '') || 0)
            return sum + price
        }, 0)
    }

    const handleCheckout = () => {
        if (cart?.items?.length > 0) {
            // For now, checkout first item (can be extended for multiple)
            navigate(`/checkout/${cart.items[0].courseId}`)
        }
    }

    if (!user) return null

    if (loading) {
        return (
            <div style={{ height: '60vh', display: 'grid', placeItems: 'center' }}>
                <Spin size="large" tip="Loading cart..." />
            </div>
        )
    }

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
            <div className="container" style={{ padding: '32px 0' }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/')}
                    style={{ marginBottom: '24px' }}
                >
                    Continue Shopping
                </Button>

                <Title level={2} style={{ marginBottom: '32px' }}>
                    <ShoppingCartOutlined style={{ marginRight: '12px' }} />
                    Shopping Cart
                </Title>

                {cart?.items?.length > 0 ? (
                    <Row gutter={[32, 32]}>
                        <Col xs={24} lg={16}>
                            <Card>
                                <Text strong style={{ fontSize: '16px' }}>
                                    {cart.itemCount} {cart.itemCount === 1 ? 'Course' : 'Courses'} in Cart
                                </Text>

                                <Divider />

                                {cart.items.map((item, index) => (
                                    <div key={item.id}>
                                        <div style={{ display: 'flex', gap: '16px', padding: '16px 0' }}>
                                            <Image
                                                src={item.courseThumbnail || '/placeholder-course.jpg'}
                                                alt={item.courseTitle}
                                                width={120}
                                                height={80}
                                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                                            />
                                            <div style={{ flex: 1 }}>
                                                <Text
                                                    strong
                                                    style={{ fontSize: '16px', display: 'block', cursor: 'pointer' }}
                                                    onClick={() => navigate(`/course/${item.courseId}`)}
                                                >
                                                    {item.courseTitle}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                                    By {item.courseInstructor}
                                                </Text>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <Text strong style={{ fontSize: '18px', color: '#6366f1' }}>
                                                    {item.coursePrice || 'Free'}
                                                </Text>
                                                <div style={{ marginTop: '8px' }}>
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        loading={removing === item.courseId}
                                                        onClick={() => handleRemoveItem(item.courseId)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        {index < cart.items.length - 1 && <Divider style={{ margin: 0 }} />}
                                    </div>
                                ))}
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card style={{ position: 'sticky', top: '100px' }}>
                                <Title level={4} style={{ marginTop: 0 }}>Summary</Title>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <Text>Subtotal:</Text>
                                    <Text strong>${calculateTotal().toFixed(2)}</Text>
                                </div>

                                <Divider />

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <Text strong style={{ fontSize: '18px' }}>Total:</Text>
                                    <Text strong style={{ fontSize: '24px', color: '#6366f1' }}>
                                        ${calculateTotal().toFixed(2)}
                                    </Text>
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    style={{ height: '48px', fontWeight: 700 }}
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </Button>

                                <Text
                                    type="secondary"
                                    style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '12px' }}
                                >
                                    30-Day Money-Back Guarantee
                                </Text>
                            </Card>
                        </Col>
                    </Row>
                ) : (
                    <Card style={{ textAlign: 'center', padding: '60px' }}>
                        <Empty
                            image={<ShoppingCartOutlined style={{ fontSize: '64px', color: '#d1d5db' }} />}
                            description={
                                <div>
                                    <Title level={4} style={{ marginTop: '16px' }}>Your cart is empty</Title>
                                    <Paragraph type="secondary">
                                        Explore our courses and add some to your cart!
                                    </Paragraph>
                                </div>
                            }
                        >
                            <Button type="primary" size="large" onClick={() => navigate('/')}>
                                Browse Courses
                            </Button>
                        </Empty>
                    </Card>
                )}
            </div>
        </div>
    )
}
