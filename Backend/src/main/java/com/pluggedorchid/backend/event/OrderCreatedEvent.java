package com.pluggedorchid.backend.event;

import com.pluggedorchid.backend.entity.Order;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class OrderCreatedEvent {
    private final Order order;
}