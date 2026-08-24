package com.ecommerce.service.impl;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.dto.admin.DashboardResponse;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.enums.PaymentStatus;
import com.ecommerce.enums.RoleName;
import com.ecommerce.mapper.OrderMapper;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.AdminService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Override
    public DashboardResponse getDashboard() {
        BigDecimal totalSales = orderRepository.sumTotalAmountByPaymentStatus(PaymentStatus.PAID);
        return DashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalCustomers(userRepository.countByRole_Name(RoleName.ROLE_CUSTOMER))
                .totalProducts(productRepository.count())
                .activeProducts(productRepository.countByActiveTrue())
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
                .totalSales(totalSales == null ? BigDecimal.ZERO : totalSales)
                .recentOrders(orderRepository.findTop10ByOrderByCreatedAtDesc().stream()
                        .map(OrderMapper::toResponse)
                        .toList())
                .build();
    }
}
