package org.glgnn.kutuphane_yonetim_sistemi.ExceptionMessages;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
