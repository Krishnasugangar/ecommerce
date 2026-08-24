package com.ecommerce.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.enums.RoleName;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.RoleRepository;
import com.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.seed.sample-data:true}")
    private boolean seedSampleData;

    @Bean
    CommandLineRunner seedData() {
        return args -> initialize();
    }

    @Transactional
    public void initialize() {
        Role customerRole = ensureRole(RoleName.ROLE_CUSTOMER);
        Role adminRole = ensureRole(RoleName.ROLE_ADMIN);

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setPhone("0000000000");
            admin.setRole(adminRole);
            admin.setEnabled(true);
            userRepository.save(admin);
            log.info("Bootstrap admin user created: {}", adminEmail);
        }

        if (!seedSampleData || productRepository.count() > 0) {
            return;
        }

        Category electronics = createCategory("Electronics", "Phones, laptops, and accessories");
        Category fashion = createCategory("Fashion", "Apparel and lifestyle products");
        Category home = createCategory("Home", "Home and kitchen essentials");

        productRepository.saveAll(List.of(
                createProduct("Wireless Headphones", "Noise-cancelling over-ear headphones",
                        new BigDecimal("129.99"), 40, electronics,
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"),
                createProduct("Smart Watch", "Fitness tracking smart watch with GPS",
                        new BigDecimal("199.00"), 25, electronics,
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"),
                createProduct("Classic Sneakers", "Comfortable everyday sneakers",
                        new BigDecimal("79.50"), 60, fashion,
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"),
                createProduct("Ceramic Mug Set", "Set of 4 ceramic coffee mugs",
                        new BigDecimal("24.99"), 80, home,
                        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600")
        ));

        // Ensure customer role exists for registration path even if sample seed skipped mid-run.
        if (customerRole.getId() == null) {
            roleRepository.save(customerRole);
        }
        log.info("Sample catalog data seeded");
    }

    private Role ensureRole(RoleName roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
    }

    private Category createCategory(String name, String description) {
        return categoryRepository.findByNameIgnoreCase(name).orElseGet(() -> {
            Category category = new Category();
            category.setName(name);
            category.setDescription(description);
            return categoryRepository.save(category);
        });
    }

    private Product createProduct(
            String name,
            String description,
            BigDecimal price,
            int stock,
            Category category,
            String imageUrl
    ) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStockQuantity(stock);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        product.setActive(true);
        return product;
    }
}
