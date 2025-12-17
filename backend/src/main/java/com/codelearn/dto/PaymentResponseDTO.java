package com.codelearn.dto;

public class PaymentResponseDTO {

    private boolean success;
    private String message;
    private String transactionId;

    public PaymentResponseDTO() {
    }

    public PaymentResponseDTO(boolean success, String message, String transactionId) {
        this.success = success;
        this.message = message;
        this.transactionId = transactionId;
    }

    public static PaymentResponseDTO success(String message, String transactionId) {
        return new PaymentResponseDTO(true, message, transactionId);
    }

    public static PaymentResponseDTO failure(String message) {
        return new PaymentResponseDTO(false, message, null);
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
}
