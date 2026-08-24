package com.ecommerce.mapper;

import java.util.List;

import com.ecommerce.dto.address.AddressResponse;
import com.ecommerce.dto.order.OrderItemResponse;
import com.ecommerce.dto.order.OrderResponse;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.entity.ShippingAddressSnapshot;

public final class OrderMapper {

    private OrderMapper() {
    }

    public static OrderResponse toResponse(Order order) {
        ShippingAddressSnapshot shipping = order.getShippingAddress();
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .customerEmail(order.getUser().getEmail())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .shippingAddress(AddressResponse.builder()
                        .fullName(shipping.getFullName())
                        .phone(shipping.getPhone())
                        .addressLine1(shipping.getAddressLine1())
                        .addressLine2(shipping.getAddressLine2())
                        .city(shipping.getCity())
                        .state(shipping.getState())
                        .postalCode(shipping.getPostalCode())
                        .country(shipping.getCountry())
                        .build())
                .items(order.getItems().stream().map(OrderMapper::toItemResponse).toList())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    public static List<OrderItemResponse> toItemResponses(List<OrderItem> items) {
        return items.stream().map(OrderMapper::toItemResponse).toList();
    }

    private static OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .build();
    }
}
