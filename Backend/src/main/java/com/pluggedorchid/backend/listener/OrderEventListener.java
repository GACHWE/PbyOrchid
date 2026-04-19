package com.pluggedorchid.backend.listener;

import com.pluggedorchid.backend.event.OrderCreatedEvent;
import com.pluggedorchid.backend.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventListener {

    private final WhatsAppService whatsAppService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Order {} created, sending WhatsApp notification", event.getOrder().getId());
        whatsAppService.notifyAdminNewOrder(event.getOrder().getId());
    }
}