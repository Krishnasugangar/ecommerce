package com.ecommerce.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ecommerce.dto.order.OrderResponse;
import com.ecommerce.dto.order.PlaceOrderRequest;
import com.ecommerce.dto.order.UpdateOrderStatusRequest;

public interface OrderService {

    OrderResponse placeOrder(Long userId, PlaceOrderRequest request);

    Page<OrderResponse> getMyOrders(Long userId, Pageable pageable);

    OrderResponse getMyOrder(Long userId, Long orderId);

    OrderResponse cancelOrder(Long userId, Long orderId);

    Page<OrderResponse> getAllOrders(Pageable pageable);

    OrderResponse updateStatus(Long orderId, UpdateOrderStatusRequest request);
}
