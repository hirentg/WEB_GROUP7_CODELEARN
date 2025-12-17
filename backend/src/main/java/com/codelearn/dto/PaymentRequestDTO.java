package com.codelearn.dto;

import com.codelearn.model.PaymentMethod;

public class PaymentRequestDTO {

    private String courseId;
    private PaymentMethod paymentMethod;
    private CreditCardDetails cardDetails;

    // Getters and Setters
    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public CreditCardDetails getCardDetails() {
        return cardDetails;
    }

    public void setCardDetails(CreditCardDetails cardDetails) {
        this.cardDetails = cardDetails;
    }

    public static class CreditCardDetails {
        private String cardNumber;
        private String expiryMonth;
        private String expiryYear;
        private String cvv;
        private String cardholderName;

        // Getters and Setters
        public String getCardNumber() {
            return cardNumber;
        }

        public void setCardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
        }

        public String getExpiryMonth() {
            return expiryMonth;
        }

        public void setExpiryMonth(String expiryMonth) {
            this.expiryMonth = expiryMonth;
        }

        public String getExpiryYear() {
            return expiryYear;
        }

        public void setExpiryYear(String expiryYear) {
            this.expiryYear = expiryYear;
        }

        public String getCvv() {
            return cvv;
        }

        public void setCvv(String cvv) {
            this.cvv = cvv;
        }

        public String getCardholderName() {
            return cardholderName;
        }

        public void setCardholderName(String cardholderName) {
            this.cardholderName = cardholderName;
        }
    }
}
