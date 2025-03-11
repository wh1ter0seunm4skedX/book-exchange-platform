# Test API endpoints for Book Exchange Platform

# Base URL for API calls
$baseUrl = "http://localhost:8080/book_exchange_platform"

# 1. Register a new user
$registerUrl = "$baseUrl/auth/register"
$registerBody = @{
    email = "test@example.com"
    password = "password123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

Write-Host "Registering a new user..." -ForegroundColor Green
try {
    $registerResponse = Invoke-RestMethod -Uri $registerUrl -Method Post -ContentType "application/json" -Body $registerBody -ErrorAction Stop
    Write-Host "Registration successful!" -ForegroundColor Green
    Write-Host ($registerResponse | ConvertTo-Json)
} catch {
    Write-Host "Registration failed: $_" -ForegroundColor Red
    # If the user already exists, continue with login
    Write-Host "Continuing with login..." -ForegroundColor Yellow
}

# 2. Login to get JWT token
$loginUrl = "$baseUrl/auth/login"
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "`nLogging in..." -ForegroundColor Green
try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -ContentType "application/json" -Body $loginBody -ErrorAction Stop
    Write-Host "Login successful!" -ForegroundColor Green
    $token = $loginResponse
    Write-Host "Token: $token"
} catch {
    Write-Host "Login failed: $_" -ForegroundColor Red
    exit
}

# Create auth header with JWT token
$headers = @{
    "Authorization" = "Bearer $token"
}

# 3. Get all books
$booksUrl = "$baseUrl/books/all"

Write-Host "`nGetting all books..." -ForegroundColor Green
try {
    $booksResponse = Invoke-RestMethod -Uri $booksUrl -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "Books retrieved successfully!" -ForegroundColor Green
    Write-Host ($booksResponse | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "Failed to get books: $_" -ForegroundColor Red
}

# 4. Get user info
$userUrl = "$baseUrl/users/1"  # Assuming user ID 1 exists

Write-Host "`nGetting user info..." -ForegroundColor Green
try {
    $userResponse = Invoke-RestMethod -Uri $userUrl -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "User info retrieved successfully!" -ForegroundColor Green
    Write-Host ($userResponse | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "Failed to get user info: $_" -ForegroundColor Red
}

# 5. Add a book for the user (using user_published endpoint)
$addBookUrl = "$baseUrl/books/1/user_published"  # Assuming user ID 1
$bookBody = @{
    title = "Test Book"
    author = "Test Author"
    isbn = "1234567890123"
    description = "A test book for API testing"
    condition = "NEW"
    genre = "FICTION"
} | ConvertTo-Json

Write-Host "`nAdding a book for the user..." -ForegroundColor Green
try {
    $addBookResponse = Invoke-RestMethod -Uri $addBookUrl -Method Post -ContentType "application/json" -Headers $headers -Body $bookBody -ErrorAction Stop
    Write-Host "Book added successfully!" -ForegroundColor Green
    Write-Host ($addBookResponse | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "Failed to add book: $_" -ForegroundColor Red
}

# 6. Get user's published books
$userBooksUrl = "$baseUrl/books/1/user_published"  # Assuming user ID 1

Write-Host "`nGetting user's published books..." -ForegroundColor Green
try {
    $userBooksResponse = Invoke-RestMethod -Uri $userBooksUrl -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "User's books retrieved successfully!" -ForegroundColor Green
    Write-Host ($userBooksResponse | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "Failed to get user's books: $_" -ForegroundColor Red
}

# 7. Get user's wanted books
$userWantedBooksUrl = "$baseUrl/books/1/user_wanted"  # Assuming user ID 1

Write-Host "`nGetting user's wanted books..." -ForegroundColor Green
try {
    $userWantedBooksResponse = Invoke-RestMethod -Uri $userWantedBooksUrl -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "User's wanted books retrieved successfully!" -ForegroundColor Green
    Write-Host ($userWantedBooksResponse | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "Failed to get user's wanted books: $_" -ForegroundColor Red
}

# 8. Get most wanted books
$mostWantedBooksUrl = "$baseUrl/books/most_wanted"

Write-Host "`nGetting most wanted books..." -ForegroundColor Green
try {
    $mostWantedBooksResponse = Invoke-RestMethod -Uri $mostWantedBooksUrl -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "Most wanted books retrieved successfully!" -ForegroundColor Green
    Write-Host ($mostWantedBooksResponse | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "Failed to get most wanted books: $_" -ForegroundColor Red
}

Write-Host "`nAPI testing completed!" -ForegroundColor Green
