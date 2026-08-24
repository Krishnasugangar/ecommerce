package com.ecommerce.service;

import java.util.List;

import com.ecommerce.dto.address.AddressRequest;
import com.ecommerce.dto.address.AddressResponse;

public interface AddressService {

    List<AddressResponse> getAddresses(Long userId);

    AddressResponse create(Long userId, AddressRequest request);

    AddressResponse update(Long userId, Long addressId, AddressRequest request);

    void delete(Long userId, Long addressId);

    AddressResponse setDefault(Long userId, Long addressId);
}
