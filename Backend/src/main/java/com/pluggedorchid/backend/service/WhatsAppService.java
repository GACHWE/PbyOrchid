package com.pluggedorchid.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class WhatsAppService {

    public void notifyAdminNewOrder(UUID orderId) {
        // Placeholder: log or integrate with Twilio
        log.info("📱 New order placed! Order ID: {}", orderId);
        // TODO: implement actual WhatsApp API call
    }
}