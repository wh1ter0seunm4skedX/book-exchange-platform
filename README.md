```
                  ___                   _____          ___                  
    ___          /__/\                 /  /::\        /  /\          ___    
   /  /\         \  \:\               /  /:/\:\      /  /:/_        /__/\   
  /  /:/          \  \:\             /  /:/  \:\    /  /:/ /\       \  \:\  
 /__/::\      _____\__\:\           /__/:/ \__\:|  /  /:/ /:/_       \  \:\ 
 \__\/\:\__  /__/::::::::\          \  \:\ /  /:/ /__/:/ /:/ /\  ___  \__\:\
    \  \:\/\ \  \:\~~\~~\/           \  \:\  /:/  \  \:\/:/ /:/ /__/\ |  |:|
     \__\::/  \  \:\  ~~~             \  \:\/:/    \  \::/ /:/  \  \:\|  |:|
     /__/:/    \  \:\                  \  \::/      \  \:\/:/    \  \:\__|:|
     \__\/      \  \:\                  \__\/        \  \::/      \__\::::/ 
                 \__\/                                \__\/           ~~~~
```

# 📚 BookXChange

BookXChange is a **smart textbook exchange platform** designed for students at the Open University (Of Israel). The platform automates the matching process between users who want to **give away books** and those looking to **receive books**, streamlining the process with **real-time matching algorithms**.

## 🚀 Features
- **User Authentication**: Register and log in securely.
- **Book Listings**: Users can list books for exchange.
- **Matching Algorithm**: Automatically finds matches between book publishers and seekers (and vice versa).
- **Notifications**: Alerts users when a match is found.
- **Profile Management**: Users can update their book lists and contact preferences.

## 🛠️ Tech Stack
**Frontend**:
- React (Vite)
- TailwindCSS
- React Router

**Backend**:
- Java (Spring Boot)
- RESTful API
- MariaDB (JDBC for database connection)
- JWT Authentication

**Tools & Infrastructure**:
- Docker & Docker Compose
- Postman (API Testing)
- GitHub (Version Control & CI/CD)

## 🐳 Docker Setup and Configuration

The Book Exchange Platform uses Docker and Docker Compose for easy setup and deployment. This ensures consistent environments across development and production.

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

### Running the Application

1. **Clone the repo**
   ```powershell
   git clone https://github.com/wh1ter0seunm4skedX/book-exchange-platform.git
   cd book-exchange-platform
   ```

2. **Start the containers**
   ```powershell
   docker-compose up -d
   ```
   This command starts both the MariaDB database and Spring Boot backend in detached mode.

3. **Check container status**
   ```powershell
   docker-compose ps
   ```
   confirm that both containers are running.

4. **Access the application**
   - Backend API: http://localhost:8080
   - MariaDB database: localhost:3307 (username: root, password: root)

### Stopping the Application

```powershell
docker-compose down
```

To remove volumes as well (this will delete all data):
```powershell
docker-compose down -v
```

### Rebuilding After Changes

If you make changes to the code:
```powershell
docker-compose build --no-cache
docker-compose up -d
```

## 🔒 API Authentication

The backend uses JWT (JSON Web Token) authentication:

- **Register**: POST /book_exchange_platform/auth/register
- **Login**: POST /book_exchange_platform/auth/login

After login, include the JWT token in the Authorization header for all authenticated requests:
```
Authorization: Bearer [token]
```

## 📂 Project Structure
```
📁 book-exchange-platform/
 ├── 📁 frontend/         # React frontend application
 ├── 📁 backend/          # Spring Boot backend application
 ├── 📄 docker-compose.yml # Docker Compose configuration
 ├── 📄 README.md         # Project documentation
 └── 📄 .gitignore        # Git ignore configuration
```

## 🗄️ Database Schema

The application uses a MariaDB database with the following tables:
- **books**: Stores information about available books
- **users**: User accounts and profiles
- **user_books_shared**: Books that users are offering
- **user_books_requested**: Books that users are seeking
- **matches**: Potential matches between shared and requested books


## 📅 Roadmap
- ✅ **Completion of Design Document** (January 2025)
- ✅ **Initial Backend Setup** (February 2025)
  - Implement foundational backend structure
  - Setup database schema and basic queries
- ✅ **Initial Frontend Setup** (February 2025)
  - Create basic UI components
  - Implement routing and basic state management
- 🚀 **MVP Development** (March 2025)
  - Implement book listing functionality
  - Develop initial matching algorithm
- 🔄 **Feature Expansion** (March-April 2025)
  - Improve UX/UI
  - Add more things that we will think about along the way
- 🎯 **Final Testing & Deployment** (April 2025)
  - Perform system-wide testing
  - Prepare for deployment and documentation finalization
