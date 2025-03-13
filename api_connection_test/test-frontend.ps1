# test-frontend.ps1
# Script to test the Book Exchange Platform frontend functionality

# Define color codes for output formatting
$Green = [ConsoleColor]::Green
$Red = [ConsoleColor]::Red
$Yellow = [ConsoleColor]::Yellow
$Cyan = [ConsoleColor]::Cyan

# Define the base URL for frontend and backend
$frontendUrl = "http://localhost:5173"
$backendUrl = "http://localhost:8080"

# Function to check if Docker containers are running
function Check-DockerContainers {
    Write-Host "Checking Docker containers..." -ForegroundColor $Cyan
    
    try {
        $containers = docker ps --format "{{.Names}}" | Where-Object { $_ -like "book-exchange-*" }
        
        if ($containers.Count -eq 0) {
            Write-Host "No Book Exchange Platform containers found running!" -ForegroundColor $Red
            Write-Host "Please start the containers with 'docker-compose up -d'" -ForegroundColor $Yellow
            return $false
        }
        
        Write-Host "Found running containers:" -ForegroundColor $Green
        foreach ($container in $containers) {
            Write-Host "  - $container" -ForegroundColor $Green
        }
        
        return $true
    } catch {
        Write-Host "Error checking Docker containers: $_" -ForegroundColor $Red
        return $false
    }
}

# Function to check if frontend is accessible
function Check-Frontend {
    Write-Host "Checking frontend accessibility..." -ForegroundColor $Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $frontendUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "Frontend is accessible at $frontendUrl" -ForegroundColor $Green
            return $true
        } else {
            Write-Host "Frontend returned unexpected status code: $($response.StatusCode)" -ForegroundColor $Red
            return $false
        }
    } catch {
        Write-Host "Error accessing frontend: $_" -ForegroundColor $Red
        Write-Host "Make sure the frontend container is running and port 5173 is accessible" -ForegroundColor $Yellow
        return $false
    }
}

# Function to test backend endpoints directly
function Test-BackendEndpoints {
    Write-Host "Testing backend endpoints directly..." -ForegroundColor $Cyan
    
    $endpoints = @(
        @{
            "name" = "Get All Books";
            "url" = "$backendUrl/book_exchange_platform/books/all";
            "method" = "GET";
        },
        @{
            "name" = "Get Most Wanted Books";
            "url" = "$backendUrl/book_exchange_platform/books/most_wanted";
            "method" = "GET";
        },
        @{
            "name" = "Get All Users";
            "url" = "$backendUrl/book_exchange_platform/users/all";
            "method" = "GET";
        }
    )
    
    $successCount = 0
    $failureCount = 0
    
    foreach ($endpoint in $endpoints) {
        Write-Host "Testing endpoint: $($endpoint.name)" -ForegroundColor $Yellow
        
        try {
            $response = Invoke-WebRequest -Uri $endpoint.url -Method $endpoint.method -ErrorAction Stop
            
            if ($response.StatusCode -eq 200) {
                Write-Host "  Success! Status code: $($response.StatusCode)" -ForegroundColor $Green
                
                # Try to parse the response as JSON
                try {
                    $content = $response.Content | ConvertFrom-Json
                    $contentType = $content.GetType().Name
                    
                    if ($contentType -eq "Object[]") {
                        Write-Host "  Response: Array with $($content.Length) items" -ForegroundColor $Green
                    } else {
                        Write-Host "  Response: Valid JSON object" -ForegroundColor $Green
                    }
                } catch {
                    Write-Host "  Response: Could not parse as JSON" -ForegroundColor $Yellow
                }
                
                $successCount++
            } else {
                Write-Host "  Failed with status code: $($response.StatusCode)" -ForegroundColor $Red
                $failureCount++
            }
        } catch {
            Write-Host "  Error: $_" -ForegroundColor $Red
            $failureCount++
        }
        
        Write-Host ""
    }
    
    Write-Host "Backend endpoint test summary:" -ForegroundColor $Cyan
    Write-Host "  Successful: $successCount" -ForegroundColor $Green
    Write-Host "  Failed: $failureCount" -ForegroundColor $Red
    Write-Host ""
    
    return $successCount -gt 0
}

# Function to check if the frontend is properly displaying books
function Check-FrontendBooks {
    Write-Host "Checking if frontend is properly displaying books..." -ForegroundColor $Cyan
    
    try {
        # First check the /books/all endpoint directly to confirm it's working
        $booksResponse = Invoke-WebRequest -Uri "$backendUrl/book_exchange_platform/books/all" -Method GET -ErrorAction Stop
        
        if ($booksResponse.StatusCode -eq 200) {
            $books = $booksResponse.Content | ConvertFrom-Json
            $bookCount = $books.Length
            
            Write-Host "Backend /books/all endpoint returned $bookCount books" -ForegroundColor $Green
            
            # Now check if the frontend is using getAllBooks() or getMostWantedBooks()
            Write-Host "Examining frontend code for book loading..." -ForegroundColor $Yellow
            
            $publishModalPath = "c:\Users\micha\CascadeProjects\book-exchange-platform-main\frontend\src\modals\PublishBookModal.jsx"
            $requestModalPath = "c:\Users\micha\CascadeProjects\book-exchange-platform-main\frontend\src\modals\RequestBookModal.jsx"
            
            $publishModalContent = Get-Content -Path $publishModalPath -Raw
            $requestModalContent = Get-Content -Path $requestModalPath -Raw
            
            if ($publishModalContent -match "getAllBooks\(\)" -and $requestModalContent -match "getAllBooks\(\)") {
                Write-Host "Frontend is correctly using getAllBooks() in both modals" -ForegroundColor $Green
                return $true
            } else {
                Write-Host "Frontend may still be using the workaround with getMostWantedBooks()" -ForegroundColor $Yellow
                
                if (-not ($publishModalContent -match "getAllBooks\(\)")) {
                    Write-Host "  PublishBookModal is not using getAllBooks()" -ForegroundColor $Red
                }
                
                if (-not ($requestModalContent -match "getAllBooks\(\)")) {
                    Write-Host "  RequestBookModal is not using getAllBooks()" -ForegroundColor $Red
                }
                
                return $false
            }
        } else {
            Write-Host "Backend /books/all endpoint returned unexpected status code: $($booksResponse.StatusCode)" -ForegroundColor $Red
            return $false
        }
    } catch {
        Write-Host "Error checking frontend books: $_" -ForegroundColor $Red
        return $false
    }
}

# Main script execution
Write-Host "Book Exchange Platform Frontend Test" -ForegroundColor $Cyan
Write-Host "==================================" -ForegroundColor $Cyan
Write-Host ""

# Check if Docker containers are running
$containersRunning = Check-DockerContainers
if (-not $containersRunning) {
    exit 1
}

Write-Host ""

# Check if frontend is accessible
$frontendAccessible = Check-Frontend
if (-not $frontendAccessible) {
    exit 1
}

Write-Host ""

# Test backend endpoints directly
$backendWorking = Test-BackendEndpoints
if (-not $backendWorking) {
    Write-Host "Backend endpoints are not working correctly. Cannot proceed with frontend tests." -ForegroundColor $Red
    exit 1
}

# Check if frontend is properly displaying books
$frontendBooksWorking = Check-FrontendBooks

Write-Host ""
Write-Host "Frontend Testing Summary" -ForegroundColor $Cyan
Write-Host "======================" -ForegroundColor $Cyan
Write-Host "Frontend accessibility: " -NoNewline
Write-Host $(if ($frontendAccessible) { "PASS" } else { "FAIL" }) -ForegroundColor $(if ($frontendAccessible) { $Green } else { $Red })

Write-Host "Backend endpoints: " -NoNewline
Write-Host $(if ($backendWorking) { "PASS" } else { "FAIL" }) -ForegroundColor $(if ($backendWorking) { $Green } else { $Red })

Write-Host "Frontend book display: " -NoNewline
Write-Host $(if ($frontendBooksWorking) { "PASS" } else { "NEEDS UPDATE" }) -ForegroundColor $(if ($frontendBooksWorking) { $Green } else { $Yellow })

if (-not $frontendBooksWorking) {
    Write-Host ""
    Write-Host "Recommendation:" -ForegroundColor $Cyan
    Write-Host "The frontend may still be using the workaround with getMostWantedBooks() instead of getAllBooks()." -ForegroundColor $Yellow
    Write-Host "Since we've fixed the circular reference issue in the backend, you should update the frontend to use getAllBooks() in both modals." -ForegroundColor $Yellow
}

# Exit with appropriate code
if (-not ($frontendAccessible -and $backendWorking)) {
    exit 1
} else {
    exit 0
}
