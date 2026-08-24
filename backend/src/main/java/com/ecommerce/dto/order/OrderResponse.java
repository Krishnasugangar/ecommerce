package com.ecommerce.dto.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.ecommerce.dto.address.AddressResponse;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.enums.PaymentStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderResponse {

    private Long id;
    private Long userId;
    private String customerEmail;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private AddressResponse shippingAddress;
    private List<OrderItemResponse> items;
    private Instant createdAt;
    private Instant updatedAt;
}
