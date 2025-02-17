package book_exchange_platform.backend;

import ch.vorburger.exec.ManagedProcessException;
import ch.vorburger.mariadb4j.DB;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "book_exchange_platform")
public class BackendApplication {

	public static void main(String[] args) throws ManagedProcessException {
		SpringApplication.run(BackendApplication.class, args);
	}

}
