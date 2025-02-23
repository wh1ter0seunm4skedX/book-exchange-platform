package book_exchange_platform.backend.config;

import ch.vorburger.exec.ManagedProcessException;
import ch.vorburger.mariadb4j.DBConfigurationBuilder;
import ch.vorburger.mariadb4j.springframework.MariaDB4jSpringService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import javax.sql.DataSource;

@Configuration
class EmbeddedMariaDbConfig {

    @Bean
    MariaDB4jSpringService mariaDB4jSpringService() throws ManagedProcessException {
        return new MariaDB4jSpringService();
    }

    @Bean
    DataSource dataSource(MariaDB4jSpringService mariaDB4jSpringService,
                          @Value("${app.mariaDB4j.databaseName}") String databaseName,
                          @Value("${spring.datasource.username}") String datasourceUsername,
                          @Value("${spring.datasource.password}") String datasourcePassword,
                          @Value("${spring.datasource.driver-class-name}") String datasourceDriver,
                          @Value("${mariaDB4j.port}") int port) throws ManagedProcessException {
        mariaDB4jSpringService.start();
        mariaDB4jSpringService.getDB().createDB(databaseName);
        mariaDB4jSpringService.getDB().source("schema.sql");
        mariaDB4jSpringService.getDB().source("data.sql");

        String url =  "jdbc:mariadb://localhost:" + port + "/" + databaseName;

        return DataSourceBuilder
                .create()
                .username(datasourceUsername)
                .password(datasourcePassword)
                .url(url)
                .driverClassName(datasourceDriver)
                .build();
    }
}
