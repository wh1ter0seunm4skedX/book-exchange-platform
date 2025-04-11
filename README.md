# 📚 Hey, Welcome to BookXChange!

Hey there! BookXChange is a chill little platform we've built for University students to swap textbooks. It's got this neat system that matches people who've got books to give with folks who need them—no fuss, just quick, real-time magic. Think of it as your study buddy who's always got your back.

## 🚀 What's It Got?
- **Sign Up & Log In**: Easy, secure way to join the party.
- **List Your Books**: Got extras? Pop 'em up for exchange.
- **Auto-Matching**: Our algorithm plays matchmaker for books—super fast.
- **Ping! Notifications**: Get a nudge when a match pops up.
- **Your Profile**: Tweak your book list or how people can reach you.

## 🛠️ How's It Made?
**Frontend** (the pretty part):
- React (Vite for speed)
- TailwindCSS
- React Router

**Backend** (the brains):
- Java with Spring Boot
- RESTful API (talks to the frontend)
- MariaDB
- JWT 

**Extras**:
- Docker & Docker Compose (runs everything in a snap)
- Postman 

## 🐳 Getting It Running with Docker
### What You'll Need
- [Docker](https://www.docker.com/products/docker-desktop/) installed. That's it!

### Let's Roll
1. **Grab the Code**
   ```bash
   git clone https://github.com/wh1ter0seunm4skedX/book-exchange-platform.git
   cd book-exchange-platform
   ```

2. **Fire It Up**
   ```bash
   docker-compose up -d
   ```
   This spins up:
   - MariaDB (the database)
   - Spring Boot (the backend)
   - React (the frontend)

3. **Check It's Alive**
   ```bash
   docker-compose ps
   ```
   Look for these running smoothly:
   - `book-exchange-frontend`
   - `book-exchange-backend`
   - `book-exchange-mariadb`

4. **Hop In**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8080](http://localhost:8080)
   - Database: `localhost:3307` (user: `root`, pass: `root`)

### Shutting It Down
- Stop everything:
  ```bash
  docker-compose down
  ```
- Wipe the slate clean (⚠️ this zaps the database!):
  ```bash
  docker-compose down -v
  ```

### Made Changes?
Rebuild and restart:
```bash
docker-compose build --no-cache
docker-compose up -d
```

## 🔒 How the API Locks Down
We use JWT (fancy tokens) for security:
- **Sign Up**: POST `/book_exchange_platform/auth/register`
- **Log In**: POST `/book_exchange_platform/auth/login`

Once you're in, slap this on your requests:
```
Authorization: Bearer [your-token-here]
```

### 🧪 Testing the API
We've got you covered with a full Postman collection! Check out the `api-tests` folder for:
- Complete API documentation
- Ready-to-use test scenarios
- Authentication flows
- Book management endpoints
- Trade management endpoints

## 📂 What's Where
```
📁 book-exchange-platform/
 ├── 📁 frontend/         # Where the React magic happens
 ├── 📁 backend/          # Spring Boot's home
 ├── 📁 api-tests/        # Postman collection & API tests
 ├── 📄 docker-compose.yml # Ties it all together
 ├── 📄 README.md         # You're reading it!
 └── 📄 .gitignore        # Keeps the junk out
```

## 🗄️ Database Lowdown
We've got a MariaDB setup with these tables:
- **books**: All the books up for grabs
- **users**: Who's who
- **user_books_published**: What you're offering
- **user_books_requested**: What you're after
- **trading**: Where the swaps get planned

### 🔄 Trade Expiration
Trades automatically expire after 14 days if not completed. This keeps the platform fresh and ensures books don't get stuck in limbo!

### 🏫 Campus Locations
We support multiple campus locations for book exchanges:
- Raanana Campus
- Tel Aviv Campus
- Jerusalem Campus
- Haifa Campus
- Beer Sheva Campus

### 📚 Sample Data
The platform comes pre-loaded with:
- 32 popular Computer Science textbooks
- 5 sample user accounts
- Various book listings and requests

## 📅 Where We're At
- ✅ **Design Done** (January 2025) – Nailed the blueprint.
- ✅ **Backend Basics** (February 2025) – Got the guts working.
- ✅ **Frontend Kickoff** (February 2025) – Built the face of it.
- ✅ **MVP Ready** (March 2025) – Listings and matching? Check!
- 🔄 **Polishing Up** (March-April 2025) – Smoother UI, extra tweaks.
- 🎯 **Testing & Launch** (April 2025) – We're live, baby! Just tidying up docs now.
