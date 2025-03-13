# test-endpoints.ps1
# Script to test the Book Exchange Platform backend endpoints

# Define color codes for output formatting
$Green = [ConsoleColor]::Green
$Red = [ConsoleColor]::Red
$Yellow = [ConsoleColor]::Yellow
$Cyan = [ConsoleColor]::Cyan

# Define the base URL
$baseUrl = "http://localhost:8080"

# Define endpoints to test
$endpoints = @(
    @{
        "name" = "Get All Books";
        "method" = "GET";
        "url" = "$baseUrl/book_exchange_platform/books/all";
        "expectedStatus" = 200;
        "description" = "Retrieves all books in the system";
    },
    @{
        "name" = "Get Most Wanted Books";
        "method" = "GET";
        "url" = "$baseUrl/book_exchange_platform/books/most_wanted";
        "expectedStatus" = 200;
        "description" = "Retrieves the most requested books";
    },
    @{
        "name" = "Get Book by ID";
        "method" = "GET";
        "url" = "$baseUrl/book_exchange_platform/books/1";
        "expectedStatus" = 200;
        "description" = "Retrieves a specific book by ID";
    },
    @{
        "name" = "Get All Users";
        "method" = "GET";
        "url" = "$baseUrl/book_exchange_platform/users/all";
        "expectedStatus" = 200;
        "description" = "Retrieves all users in the system";
    },
    @{
        "name" = "Get User by ID";
        "method" = "GET";
        "url" = "$baseUrl/book_exchange_platform/users/1";
        "expectedStatus" = 200;
        "description" = "Retrieves a specific user by ID";
    },
    @{
        "name" = "Get All Matches";
        "method" = "GET";
        "url" = "$baseUrl/book_exchange_platform/matches/all";
        "expectedStatus" = 200;
        "description" = "Retrieves all matches in the system";
    }
)

# Function to test an endpoint
function Test-Endpoint {
    param (
        [Parameter(Mandatory=$true)]
        [hashtable]$Endpoint
    )

    Write-Host "Testing endpoint: " -NoNewline
    Write-Host $Endpoint.name -ForegroundColor $Cyan

    try {
        $params = @{
            Uri = $Endpoint.url
            Method = $Endpoint.method
            ErrorAction = "Stop"
            TimeoutSec = 10
        }

        Write-Host "  URL: $($Endpoint.url)" -ForegroundColor $Yellow
        Write-Host "  Method: $($Endpoint.method)" -ForegroundColor $Yellow
        Write-Host "  Description: $($Endpoint.description)" -ForegroundColor $Yellow
        
        # Make the request
        $response = Invoke-WebRequest @params
        
        # Check if the status code matches expected
        if ($response.StatusCode -eq $Endpoint.expectedStatus) {
            Write-Host "  Status: SUCCESS ($($response.StatusCode))" -ForegroundColor $Green
            
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
            
            return $true
        } else {
            Write-Host "  Status: FAILED (Expected: $($Endpoint.expectedStatus), Got: $($response.StatusCode))" -ForegroundColor $Red
            return $false
        }
    } catch {
        $errorMessage = $_.Exception.Message
        
        # Check if it's a WebException with a response
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            Write-Host "  Status: ERROR ($statusCode)" -ForegroundColor $Red
            Write-Host "  Error: $errorMessage" -ForegroundColor $Red
            
            # Try to get response body for more details
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                $reader.Close()
                
                Write-Host "  Response Body: $responseBody" -ForegroundColor $Red
            } catch {
                # Ignore errors when trying to read the response body
            }
        } else {
            Write-Host "  Status: ERROR" -ForegroundColor $Red
            Write-Host "  Error: $errorMessage" -ForegroundColor $Red
        }
        
        return $false
    } finally {
        Write-Host ""
    }
}

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
        
        # Check if backend is ready by checking container logs for "Started BackendApplication"
        $backendReady = docker logs book-exchange-backend 2>&1 | Select-String "Started BackendApplication"
        
        if (-not $backendReady) {
            Write-Host "Backend container is running but may not be fully initialized yet." -ForegroundColor $Yellow
            Write-Host "Waiting 10 seconds for backend to initialize..." -ForegroundColor $Yellow
            Start-Sleep -Seconds 10
        }
        
        return $true
    } catch {
        Write-Host "Error checking Docker containers: $_" -ForegroundColor $Red
        return $false
    }
}

# Main script execution
Write-Host "Book Exchange Platform API Test" -ForegroundColor $Cyan
Write-Host "============================" -ForegroundColor $Cyan
Write-Host ""

# Check if Docker containers are running
$containersRunning = Check-DockerContainers
if (-not $containersRunning) {
    exit 1
}

Write-Host ""
Write-Host "Testing endpoints..." -ForegroundColor $Cyan
Write-Host ""

# Initialize counters
$totalEndpoints = $endpoints.Count
$successCount = 0
$failureCount = 0

# Test each endpoint
foreach ($endpoint in $endpoints) {
    $result = Test-Endpoint -Endpoint $endpoint
    
    if ($result) {
        $successCount++
    } else {
        $failureCount++
    }
}

# Print summary
Write-Host "Test Summary" -ForegroundColor $Cyan
Write-Host "===========" -ForegroundColor $Cyan
Write-Host "Total endpoints tested: $totalEndpoints" -ForegroundColor $Yellow
Write-Host "Successful: $successCount" -ForegroundColor $Green
Write-Host "Failed: $failureCount" -ForegroundColor $Red

# Check for circular reference issues specifically
Write-Host ""
Write-Host "Checking for circular reference issues..." -ForegroundColor $Cyan

$circularReferenceEndpoint = $endpoints | Where-Object { $_.name -eq "Get All Books" }
if ($circularReferenceEndpoint) {
    $result = Test-Endpoint -Endpoint $circularReferenceEndpoint
    
    if ($result) {
        Write-Host "No circular reference issues detected in the /books/all endpoint!" -ForegroundColor $Green
    } else {
        Write-Host "Circular reference issues may still be present in the /books/all endpoint." -ForegroundColor $Red
        Write-Host "Check the backend logs for more details:" -ForegroundColor $Yellow
        Write-Host "  docker logs book-exchange-backend" -ForegroundColor $Yellow
    }
}

# Exit with appropriate code
if ($failureCount -gt 0) {
    exit 1
} else {
    exit 0
}
