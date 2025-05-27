package org.glgnn.kutuphane_yonetim_sistemi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class KutuphaneYonetimSistemiApplication {

    public static void main(String[] args) {
        SpringApplication.run(KutuphaneYonetimSistemiApplication.class, args);
    }

}
