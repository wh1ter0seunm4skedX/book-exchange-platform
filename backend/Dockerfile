FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy gradle files first for better caching
COPY gradle gradle/
COPY build.gradle settings.gradle ./
COPY gradlew gradlew.bat ./

# Make gradlew executable (for Linux environments)
RUN chmod +x ./gradlew

# Install dependencies
RUN ./gradlew --no-daemon dependencies

# Copy source code
COPY src/ src/

# Build the application
RUN ./gradlew build -x test

# Expose the application port
EXPOSE 8080
EXPOSE 5005

# Set environment variables for Spring
ENV SPRING_PROFILES_ACTIVE=default

# Run the application
#CMD ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]

# Run the application with remote debugging enabled
CMD ["java", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]