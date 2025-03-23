# BookXChange API Test Flow
# This script tests the API endpoints of the Book Exchange Platform
# Flow: Register -> Login -> Test various endpoints

# Base URL
$baseUrl = "http://localhost:8080"

# Generate a unique email to avoid conflicts when registering repeatedly
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$randomPart = -join ((65..90) + (97..122) | Get-Random -Count 5 | ForEach-Object { [char]$_ })
$userEmail = "test$timestamp$randomPart@example.com"

Write-Host "=== BookXChange API Test Flow ===" -ForegroundColor Cyan
Write-Host "Starting test with user email: $userEmail" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

# Step 1: Register a new user
Write-Host "`n[STEP 1] Registering new user..." -ForegroundColor Green

$registerBody = @{
    fullName = "Test User"
    email = $userEmail
    password = "password123"
    phoneNumber = 9721234567
    preferredExchangeLocation = "Main Campus"
} | ConvertTo-Json

$registerHeaders = @{
    "Content-Type" = "application/json"
}

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/book_exchange_platform/auth/register" -Method Post -Body $registerBody -Headers $registerHeaders -ErrorAction Stop
    $jwtToken = $registerResponse.token
    
    if ($jwtToken) {
        Write-Host "[SUCCESS] Registration successful! JWT token received." -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Registration succeeded but no JWT token received." -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Registration failed: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit
}

# Step 2: Login with the registered user
Write-Host "`n[STEP 2] Logging in with new user..." -ForegroundColor Green

$loginBody = @{
    email = $userEmail
    password = "password123"
} | ConvertTo-Json

$loginHeaders = @{
    "Content-Type" = "application/json"
}

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/book_exchange_platform/auth/login" -Method Post -Body $loginBody -Headers $loginHeaders -ErrorAction Stop
    $jwtToken = $loginResponse.token
    $userId = $loginResponse.userId
    
    if ($jwtToken) {
        Write-Host "[SUCCESS] Login successful! JWT token received." -ForegroundColor Green
        Write-Host "[INFO] User ID: $userId" -ForegroundColor Cyan
    } else {
        Write-Host "[WARNING] Login succeeded but no JWT token received." -ForegroundColor Yellow
        exit
    }
} catch {
    Write-Host "[ERROR] Login failed: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit
}

# Authentication headers for subsequent requests
$authHeaders = @{
    "Authorization" = "Bearer $jwtToken"
    "Content-Type" = "application/json"
}

# Step 3: Get all books (public endpoint)
Write-Host "`n[STEP 3] Fetching all books..." -ForegroundColor Green

try {
    $allBooksResponse = Invoke-RestMethod -Uri "$baseUrl/book_exchange_platform/books/all" -Method Get -ErrorAction Stop
    Write-Host "[SUCCESS] Successfully retrieved all books" -ForegroundColor Green
    
    if ($allBooksResponse.Count -gt 0) {
        Write-Host "[INFO] Book count: $($allBooksResponse.Count)" -ForegroundColor Cyan
        Write-Host "[INFO] First book: $($allBooksResponse[0].title) (ID: $($allBooksResponse[0].id))" -ForegroundColor Cyan
    } else {
        Write-Host "[INFO] No books found in the system" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Failed to fetch all books: $_" -ForegroundColor Red
}

# Step 4: Get user profile (authenticated endpoint)
Write-Host "`n[STEP 4] Fetching user profile..." -ForegroundColor Green

try {
    $userProfileResponse = Invoke-RestMethod -Uri "$baseUrl/book_exchange_platform/users/$userId" -Method Get -Headers $authHeaders -ErrorAction Stop
    Write-Host "[SUCCESS] Successfully retrieved user profile" -ForegroundColor Green
    Write-Host "[INFO] User details:" -ForegroundColor Cyan
    Write-Host "   - Name: $($userProfileResponse.fullName)" -ForegroundColor Cyan
    Write-Host "   - Email: $($userProfileResponse.email)" -ForegroundColor Cyan
    Write-Host "   - Location: $($userProfileResponse.preferredExchangeLocation)" -ForegroundColor Cyan
} catch {
    Write-Host "[ERROR] Failed to fetch user profile: $_" -ForegroundColor Red
}

# Step 5: Get most wanted books (authenticated endpoint)
Write-Host "`n[STEP 5] Fetching most wanted books..." -ForegroundColor Green

try {
    $mostWantedResponse = Invoke-RestMethod -Uri "$baseUrl/book_exchange_platform/books/most_wanted" -Method Get -Headers $authHeaders -ErrorAction Stop
    Write-Host "[SUCCESS] Successfully retrieved most wanted books" -ForegroundColor Green
    
    if ($mostWantedResponse.Count -gt 0) {
        Write-Host "[INFO] Most wanted books: $($mostWantedResponse.Count)" -ForegroundColor Cyan
        Write-Host "[INFO] First most wanted book: $($mostWantedResponse[0].title) (ID: $($mostWantedResponse[0].id))" -ForegroundColor Cyan
    } else {
        Write-Host "[INFO] No most wanted books found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Failed to fetch most wanted books: $_" -ForegroundColor Red
}

# Step 6: Add a book publication
Write-Host "`n[STEP 6] Adding a book publication..." -ForegroundColor Green

# First, we need a book ID to publish. If we've got books from Step 3, we can use one of those
# Otherwise, we'll create a structure for a new book
if ($allBooksResponse -and $allBooksResponse.Count -gt 0) {
    $bookId = $allBooksResponse[0].id
    $bookTitle = $allBooksResponse[0].title
    Write-Host "[INFO] Using existing book: $bookTitle (ID: $bookId)" -ForegroundColor Cyan
    
    $pubBody = @{
        book = @{
            id = $bookId
            title = $bookTitle
            courseNumber = 101
            coverImageUrl = "http://example.com/cover.jpg"
        }
        bookCondition = "GOOD"
    } | ConvertTo-Json
} else {
    Write-Host "[INFO] No existing books found, creating a new book structure" -ForegroundColor Yellow
    
    $pubBody = @{
        book = @{
            id = 1
            title = "Test Book"
            courseNumber = 101
            coverImageUrl = "http://example.com/cover.jpg"
        }
        bookCondition = "GOOD"
    } | ConvertTo-Json
}

try {
    $pubResponse = Invoke-RestMethod -Uri "$baseUrl/book_exchange_platform/trades/$userId/publish" -Method Post -Headers $authHeaders -Body $pubBody -ErrorAction Stop
    Write-Host "[SUCCESS] Successfully added book publication" -ForegroundColor Green
    Write-Host "[INFO] Publication ID: $($pubResponse.id)" -ForegroundColor Cyan
    
    # Publication ID might be used in a real-world scenario for testing the DELETE endpoint
    # but we won't use it in this script to avoid accidentally removing test data
} catch {
    Write-Host "[ERROR] Failed to add book publication: $_" -ForegroundColor Red
}

# Step 7: Get user publications
Write-Host "`n[STEP 7] Getting user publications..." -ForegroundColor Green

try {
    $userPubsResponse = Invoke-RestMethod -Uri "$baseUrl/book_exchange_platform/trades/$userId/publication" -Method Get -Headers $authHeaders -ErrorAction Stop
    Write-Host "[SUCCESS] Successfully retrieved user publications" -ForegroundColor Green
    
    if ($userPubsResponse.Count -gt 0) {
        Write-Host "[INFO] Publication count: $($userPubsResponse.Count)" -ForegroundColor Cyan
        Write-Host "[INFO] First publication details:" -ForegroundColor Cyan
        Write-Host "   - Book: $($userPubsResponse[0].book.title)" -ForegroundColor Cyan
        Write-Host "   - Condition: $($userPubsResponse[0].bookCondition)" -ForegroundColor Cyan
    } else {
        Write-Host "[INFO] No publications found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Failed to fetch user publications: $_" -ForegroundColor Red
}

# Step 8: Add a book request
Write-Host "`n[STEP 8] Adding a book request..." -ForegroundColor Green

if ($allBooksResponse -and $allBooksResponse.Count -gt 0) {
    # Use a different book than the one we published if possible
    $requestBookIndex = if ($allBooksResponse.Count -gt 1) { 1 } else { 0 }
    $bookId = $allBooksResponse[$requestBookIndex].id
    $bookTitle = $allBooksResponse[$requestBookIndex].title
    
    Write-Host "[INFO] Requesting existing book: $bookTitle (ID: $bookId)" -ForegroundColor Cyan
    
    $requestBody = @{
        id = $bookId
        title = $bookTitle
        courseNumber = 101
        coverImageUrl = "http://example.com/cover.jpg"
    } | ConvertTo-Json
} else {
    Write-Host "[INFO] No existing books found, creating a new book for request" -ForegroundColor Yellow
    
    $requestBody = @{
        id = 2
        title = "Requested Test Book"
        courseNumber = 102
        coverImageUrl = "http://example.com/cover2.jpg"
    } | ConvertTo-Json
}

try {
    $requestResponse = Invoke-RestMethod -Uri "$baseUrl/book_exchange_platform/trades/$userId/request" -Method Post -Headers $authHeaders -Body $requestBody -ErrorAction Stop
    Write-Host "[SUCCESS] Successfully added book request" -ForegroundColor Green
    Write-Host "[INFO] Request ID: $($requestResponse.id)" -ForegroundColor Cyan
    
    # Request ID might be used in a real-world scenario for testing the DELETE endpoint
    # but we won't use it in this script to avoid accidentally removing test data
} catch {
    Write-Host "[ERROR] Failed to add book request: $_" -ForegroundColor Red
}

# Step 9: Get user requests
Write-Host "`n[STEP 9] Getting user requests..." -ForegroundColor Green

try {
    $userRequestsResponse = Invoke-RestMethod -Uri "$baseUrl/book_exchange_platform/trades/$userId/request" -Method Get -Headers $authHeaders -ErrorAction Stop
    Write-Host "[SUCCESS] Successfully retrieved user requests" -ForegroundColor Green
    
    if ($userRequestsResponse.Count -gt 0) {
        Write-Host "[INFO] Request count: $($userRequestsResponse.Count)" -ForegroundColor Cyan
        Write-Host "[INFO] First request details:" -ForegroundColor Cyan
        Write-Host "   - Book: $($userRequestsResponse[0].book.title)" -ForegroundColor Cyan
        Write-Host "   - ID: $($userRequestsResponse[0].id)" -ForegroundColor Cyan
    } else {
        Write-Host "[INFO] No requests found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Failed to fetch user requests: $_" -ForegroundColor Red
}

# Step 10: Check for matches
Write-Host "`n[STEP 10] Checking for matches..." -ForegroundColor Green

try {
    $matchesResponse = Invoke-RestMethod -Uri "$baseUrl/book_exchange_platform/trades/$userId/match" -Method Get -Headers $authHeaders -ErrorAction Stop
    Write-Host "[SUCCESS] Successfully checked for matches" -ForegroundColor Green
    
    if ($matchesResponse.Count -gt 0) {
        Write-Host "[INFO] Match count: $($matchesResponse.Count)" -ForegroundColor Cyan
        Write-Host "[INFO] First match details:" -ForegroundColor Cyan
        Write-Host "   - Provider: $($matchesResponse[0].providerId)" -ForegroundColor Cyan
        Write-Host "   - Requester: $($matchesResponse[0].requesterId)" -ForegroundColor Cyan
        Write-Host "   - Book: $($matchesResponse[0].bookId)" -ForegroundColor Cyan
        Write-Host "   - Status: $($matchesResponse[0].status)" -ForegroundColor Cyan
        
        # Match ID might be used in a real-world scenario for testing confirm/cancel endpoints
        # but we won't use it in this script to avoid modifying test data
    } else {
        Write-Host "[INFO] No matches found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Failed to check for matches: $_" -ForegroundColor Red
}

# Test summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
Write-Host "• User created and authenticated" -ForegroundColor White
Write-Host "• Books API tested" -ForegroundColor White
Write-Host "• User profile retrieved" -ForegroundColor White
Write-Host "• Book publication flow tested" -ForegroundColor White
Write-Host "• Book request flow tested" -ForegroundColor White
Write-Host "• Match checking tested" -ForegroundColor White
Write-Host "API flow testing completed!" -ForegroundColor Cyan
