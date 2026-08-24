package com.ecommerce.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.dto.address.AddressRequest;
import com.ecommerce.dto.address.AddressResponse;
import com.ecommerce.entity.Address;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.mapper.AddressMapper;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.AddressService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByDefaultAddressDescIdDesc(userId).stream()
                .map(AddressMapper::toResponse)
                .toList();
    }

    @Override
    public AddressResponse create(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Address address = new Address();
        address.setUser(user);
        applyRequest(address, request);

        boolean makeDefault = Boolean.TRUE.equals(request.getDefaultAddress())
                || addressRepository.findByUserIdAndDefaultAddressTrue(userId).isEmpty();
        if (makeDefault) {
            addressRepository.clearDefaultForUser(userId);
            address.setDefaultAddress(true);
        }

        return AddressMapper.toResponse(addressRepository.save(address));
    }

    @Override
    public AddressResponse update(Long userId, Long addressId, AddressRequest request) {
        Address address = getOwnedAddress(userId, addressId);
        applyRequest(address, request);
        if (Boolean.TRUE.equals(request.getDefaultAddress())) {
            addressRepository.clearDefaultForUser(userId);
            address.setDefaultAddress(true);
        }
        return AddressMapper.toResponse(addressRepository.save(address));
    }

    @Override
    public void delete(Long userId, Long addressId) {
        Address address = getOwnedAddress(userId, addressId);
        boolean wasDefault = address.isDefaultAddress();
        addressRepository.delete(address);
        if (wasDefault) {
            addressRepository.findByUserIdOrderByDefaultAddressDescIdDesc(userId).stream()
                    .findFirst()
                    .ifPresent(next -> {
                        next.setDefaultAddress(true);
                        addressRepository.save(next);
                    });
        }
    }

    @Override
    public AddressResponse setDefault(Long userId, Long addressId) {
        Address address = getOwnedAddress(userId, addressId);
        addressRepository.clearDefaultForUser(userId);
        address.setDefaultAddress(true);
        return AddressMapper.toResponse(addressRepository.save(address));
    }

    private Address getOwnedAddress(Long userId, Long addressId) {
        return addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
    }

    private void applyRequest(Address address, AddressRequest request) {
        address.setFullName(request.getFullName().trim());
        address.setPhone(request.getPhone().trim());
        address.setAddressLine1(request.getAddressLine1().trim());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setPostalCode(request.getPostalCode().trim());
        address.setCountry(request.getCountry().trim());
    }
}
