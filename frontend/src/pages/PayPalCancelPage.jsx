import { useParams, useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'

/**
 * PayPal Cancel/Failure Page
 * Shown when user cancels or backs out of PayPal payment.
 * No localStorage cleanup needed - backend handles expiration.
 */
export default function PayPalCancelPage() {
    const { courseId } = useParams()
    const navigate = useNavigate()

    return (
        <div style={{
            height: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Result
                status="warning"
                icon={<CloseCircleOutlined style={{ color: '#faad14' }} />}
                title="Payment Cancelled"
                subTitle="You cancelled the PayPal payment. No charges were made."
                extra={[
                    <Button
                        type="primary"
                        key="retry"
                        onClick={() => navigate(`/checkout/${courseId}`)}
                    >
                        Return to Checkout
                    </Button>,
                    <Button
                        key="course"
                        onClick={() => navigate(`/course/${courseId}`)}
                    >
                        Back to Course
                    </Button>
                ]}
            />
        </div>
    )
}
