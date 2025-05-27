package org.glgnn.kutuphane_yonetim_sistemi.Services;

public interface EmailService {
    void sendSimpleMessage(String to, String subject, String text);
}
