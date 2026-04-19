package com.pluggedorchid.backend.entity;

public enum OrderStatus {
    PENDING,    // waiting for admin to contact buyer and confirm
    CONFIRMED,  // admin confirmed – stock deducted, order binding
    DELIVERED,  // admin marked as delivered (after buyer confirms receipt)
    CANCELLED   // cancelled by user (if PENDING) or by admin (anytime before DELIVERED)
}
