package com.pluggedorchid.backend.mapper;

import com.pluggedorchid.backend.dto.OrderResponse;
import com.pluggedorchid.backend.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = ProductMapper.class)
public interface OrderMapper {

    @Mapping(source = "user.id", target = "buyerId")
    @Mapping(source = "recipientName", target = "recipientName")
    @Mapping(source = "whatsappNumber", target = "whatsappNumber")
    OrderResponse toResponse(Order order);
}