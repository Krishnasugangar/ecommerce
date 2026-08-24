package com.ecommerce.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ecommerce.dto.order.OrderResponse;
import com.ecommerce.dto.order.PlaceOrderRequest;
import com.ecommerce.entity.Address;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.enums.PaymentStatus;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock private OrderRepository orderRepository;
    @Mock private CartRepository cartRepository;
    @Mock private AddressRepository addressRepository;
    @Mock private ProductRepository productRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private User user;
    private Product product;
    private Cart cart;
    private Address address;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("customer@example.com");

        Category category = new Category();
        category.setId(1L);
        category.setName("Electronics");

        product = new Product();
        product.setId(3L);
        product.setName("Headphones");
        product.setPrice(new BigDecimal("50.00"));
        product.setStockQuantity(5);
        product.setActive(true);
        product.setCategory(category);

        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(2);
        cartItem.setPriceAtAddition(product.getPrice());

        cart = new Cart();
        cart.setId(2L);
        cart.setUser(user);
        cart.setItems(new ArrayList<>(List.of(cartItem)));
        cartItem.setCart(cart);

        address = new Address();
        address.setId(7L);
        address.setUser(user);
        address.setFullName("Ada Lovelace");
        address.setPhone("1234567890");
        address.setAddressLine1("1 Computing Lane");
        address.setCity("London");
        address.setState("LN");
        address.setPostalCode("E1");
        address.setCountry("UK");
    }

    @Test
    void placeOrder_reducesStockAndClearsCart() {
        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setAddressId(7L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(addressRepository.findByIdAndUserId(7L, 1L)).thenReturn(Optional.of(address));
        when(productRepository.findByIdForUpdate(3L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(100L);
            return order;
        });
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.placeOrder(1L, request);

        assertThat(response.getTotalAmount()).isEqualByComparingTo("100.00");
        assertThat(response.getItems()).hasSize(1);
        assertThat(response.getItems().get(0).getProductName()).isEqualTo("Headphones");
        assertThat(product.getStockQuantity()).isEqualTo(3);
        assertThat(cart.getItems()).isEmpty();
        assertThat(response.getPaymentStatus()).isEqualTo(PaymentStatus.PAID);
    }

    @Test
    void placeOrder_rejectsEmptyCart() {
        cart.getItems().clear();
        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setAddressId(7L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));

        assertThatThrownBy(() -> orderService.placeOrder(1L, request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("empty cart");
    }

    @Test
    void cancelOrder_restoresStock() {
        Order order = new Order();
        order.setId(100L);
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setTotalAmount(new BigDecimal("100.00"));
        order.setItems(new ArrayList<>());
        var shipping = new com.ecommerce.entity.ShippingAddressSnapshot();
        shipping.setFullName("Ada Lovelace");
        shipping.setPhone("1234567890");
        shipping.setAddressLine1("1 Computing Lane");
        shipping.setCity("London");
        shipping.setState("LN");
        shipping.setPostalCode("E1");
        shipping.setCountry("UK");
        order.setShippingAddress(shipping);

        var orderItem = new com.ecommerce.entity.OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setProductName("Headphones");
        orderItem.setQuantity(2);
        orderItem.setPrice(new BigDecimal("50.00"));
        orderItem.setSubtotal(new BigDecimal("100.00"));
        order.getItems().add(orderItem);

        when(orderRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(order));
        when(productRepository.findByIdForUpdate(3L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.cancelOrder(1L, 100L);

        assertThat(response.getStatus()).isEqualTo(OrderStatus.CANCELLED);
        assertThat(response.getPaymentStatus()).isEqualTo(PaymentStatus.REFUNDED);
        assertThat(product.getStockQuantity()).isEqualTo(7);
    }

    @Test
    void cancelOrder_rejectsDeliveredOrder() {
        Order order = new Order();
        order.setId(100L);
        order.setUser(user);
        order.setStatus(OrderStatus.DELIVERED);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setItems(new ArrayList<>());

        when(orderRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.cancelOrder(1L, 100L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("cannot be cancelled");
    }
}
