package com.ecommerce.dto.admin;

import java.math.BigDecimal;
import java.util.List;

import com.ecommerce.dto.order.OrderResponse;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardResponse {

    private long totalUsers;
    private long totalCustomers;
    private long totalProducts;
    private long activeProducts;
    private long totalOrders;
    private long pendingOrders;
    private BigDecimal totalSales;
    private List<OrderResponse> recentOrders;
}
