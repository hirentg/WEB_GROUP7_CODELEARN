package com.codelearn.service;

import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * PayPal Payment Service
 * Handles PayPal order creation and capture using the PayPal Checkout SDK.
 */
@Service
public class PayPalService {

    @Autowired
    private PayPalHttpClient payPalHttpClient;

    /**
     * Create a PayPal order for a course purchase.
     * 
     * @param courseId   The ID of the course being purchased
     * @param courseName The name of the course
     * @param amount     The price amount (as BigDecimal)
     * @param returnUrl  URL to redirect after successful payment
     * @param cancelUrl  URL to redirect after cancelled payment
     * @return PayPal Order ID for capturing later
     */
    public String createOrder(String courseId, String courseName, BigDecimal amount,
            String returnUrl, String cancelUrl) throws IOException {

        OrdersCreateRequest request = new OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody(buildOrderRequest(courseId, courseName, amount, returnUrl, cancelUrl));

        HttpResponse<Order> response = payPalHttpClient.execute(request);
        Order order = response.result();

        System.out.println("PayPal Order Created: ID=" + order.id() + ", Status=" + order.status());

        return order.id();
    }

    /**
     * Capture a PayPal order after user approves payment.
     * 
     * @param orderId The PayPal order ID to capture
     * @return The transaction ID if successful, null otherwise
     */
    public String captureOrder(String orderId) throws IOException {
        OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
        request.requestBody(new OrderRequest());

        HttpResponse<Order> response = payPalHttpClient.execute(request);
        Order order = response.result();

        System.out.println("PayPal Order Captured: ID=" + order.id() + ", Status=" + order.status());

        if ("COMPLETED".equals(order.status())) {
            // Extract the transaction ID from the capture
            Capture capture = order.purchaseUnits().get(0).payments().captures().get(0);
            return capture.id();
        }

        return null;
    }

    /**
     * Get the approval URL for the PayPal order.
     * This is the URL where users will be redirected to approve the payment.
     */
    public String getApprovalUrl(String orderId) throws IOException {
        OrdersGetRequest request = new OrdersGetRequest(orderId);
        HttpResponse<Order> response = payPalHttpClient.execute(request);
        Order order = response.result();

        for (LinkDescription link : order.links()) {
            if ("approve".equals(link.rel())) {
                return link.href();
            }
        }

        return null;
    }

    /**
     * Build the order request body for PayPal.
     */
    private OrderRequest buildOrderRequest(String courseId, String courseName, BigDecimal amount,
            String returnUrl, String cancelUrl) {
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.checkoutPaymentIntent("CAPTURE");

        // Set return URLs
        ApplicationContext applicationContext = new ApplicationContext()
                .brandName("CodeLearn")
                .landingPage("BILLING")
                .returnUrl(returnUrl)
                .cancelUrl(cancelUrl)
                .userAction("PAY_NOW");
        orderRequest.applicationContext(applicationContext);

        // Build purchase unit
        List<PurchaseUnitRequest> purchaseUnits = new ArrayList<>();
        PurchaseUnitRequest purchaseUnit = new PurchaseUnitRequest()
                .referenceId(courseId)
                .description("Course: " + courseName)
                .amountWithBreakdown(new AmountWithBreakdown()
                        .currencyCode("USD")
                        .value(amount.toString()));
        purchaseUnits.add(purchaseUnit);

        orderRequest.purchaseUnits(purchaseUnits);

        return orderRequest;
    }
}
