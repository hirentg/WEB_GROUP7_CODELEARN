package com.codelearn.dto;

public class PaymentResponseDTO {

    private boolean success;
    private String message;
    private String transactionId;
    private String redirectUrl;

    public PaymentResponseDTO() {
    }

    public PaymentResponseDTO(boolean success, String message, String transactionId, String redirectUrl) {
        this.success = success;
        this.message = message;
        this.transactionId = transactionId;
        this.redirectUrl = redirectUrl;
    }

    public static PaymentResponseDTO success(String message, String transactionId) {
        return new PaymentResponseDTO(true, message, transactionId, null);
    }

    public static PaymentResponseDTO failure(String message) {
        return new PaymentResponseDTO(false, message, null, null);
    }

    public static PaymentResponseDTO paypalRedirect(String transactionId, String redirectUrl) {
        return new PaymentResponseDTO(true, "Redirecting to PayPal", transactionId, redirectUrl);
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

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }
}
