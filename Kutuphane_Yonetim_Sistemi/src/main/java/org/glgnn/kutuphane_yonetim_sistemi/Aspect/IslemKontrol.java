package org.glgnn.kutuphane_yonetim_sistemi.Aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Aspect
@Component
public class IslemKontrol {

    private static final Logger logger = LoggerFactory.getLogger(IslemKontrol.class);

    @Pointcut("execution(* org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl.*.add*(..))")
    public void addOperation() {}

    @Pointcut("execution(* org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl.*.update*(..))")
    public void updateOperation() {}

    @Pointcut("execution(* org.glgnn.kutuphane_yonetim_sistemi.ServicesImpl.*.delete*(..))")
    public void deleteOperation() {}

    @AfterReturning("addOperation()")
    public void logAdd(JoinPoint joinPoint) {
        logAction("CREATE", joinPoint);
    }

    @AfterReturning("updateOperation()")
    public void logUpdate(JoinPoint joinPoint) {
        logAction("UPDATE", joinPoint);
    }

    @AfterReturning("deleteOperation()")
    public void logDelete(JoinPoint joinPoint) {
        logAction("DELETE", joinPoint);
    }

    private void logAction(String actionType, JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        String details = (args.length > 0) ? args[0].toString() : "No details";
        String username = getCurrentUsername();
        String entity = joinPoint.getTarget().getClass().getSimpleName();
        String logEntry = String.format("[%s] USER: %s | ACTION: %s | ENTITY: %s | DETAILS: %s",
                LocalDateTime.now(), username, actionType, entity, details);

        logger.info(logEntry);
    }

    private String getCurrentUsername() {
        try {
            return org.springframework.security.core.context.SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();
        } catch (Exception e) {
            return "anonymous";
        }
    }
}
