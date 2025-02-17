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
        //Create our database with default root user and no password
        //mariaDB4jSpringService.getConfiguration().addArg("--character-set-server=utf8");
        //mariaDB4jSpringService.getConfiguration().addArg("--collation-server=utf8_general_ci");
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



//@Bean
//MariaDB4jSpringService mariaDB4jSpringService() {
//    MariaDB4jSpringService mariaDB4jSpringService = new MariaDB4jSpringService();
//    mariaDB4jSpringService.start();
//    return mariaDB4jSpringService;
//}
//
//@Bean
//DataSource dataSource(MariaDB4jSpringService mariaDB4jSpringService,
//                      @Value("${app.mariaDB4j.databaseName}") String databaseName,
//                      @Value("${spring.datasource.username}") String datasourceUsername,
//                      @Value("${spring.datasource.password}") String datasourcePassword,
//                      @Value("${spring.datasource.driver-class-name}") String datasourceDriver) throws ManagedProcessException {
//    //Create our database with default root user and no password
//    DBConfigurationBuilder config = mariaDB4jSpringService.getConfiguration();
//    config.setPort(3307);
//
//    mariaDB4jSpringService.getDB().createDB(databaseName);
//
//
//    return DataSourceBuilder
//            .create()
//            .username(datasourceUsername)
//            .password(datasourcePassword)
//            .url(config.getURL(databaseName))
//            .driverClassName(datasourceDriver)
//            .build();
//}