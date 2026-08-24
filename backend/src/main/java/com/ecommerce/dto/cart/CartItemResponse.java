package com.ecommerce.dto.cart;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CartItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal priceAtAddition;
    private BigDecimal subtotal;
    private Integer stockQuantity;
}
