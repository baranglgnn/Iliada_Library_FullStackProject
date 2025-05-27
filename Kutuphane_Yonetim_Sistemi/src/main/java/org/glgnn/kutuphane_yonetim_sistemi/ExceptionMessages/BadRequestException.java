package org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
