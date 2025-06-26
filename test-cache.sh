#!/bin/bash

# Cache test script - makes 5000 requests to the NestJS server
# Make sure your NestJS server is running on http://localhost:3000

echo "Starting cache test with 5000 requests..."
echo "=========================================="

# Start time
start_time=$(date +%s)
total_requests=5000

# Counter for progress tracking
counter=0

for i in $(seq 1 $total_requests); do
    # Make HTTP request using curl
    response=$(curl -s http://localhost:3000/)
    echo "Request $i: $response"
    
    # Increment counter
    ((counter++))
    
    # Show progress every 100 requests
    if [ $((counter % 100)) -eq 0 ]; then
        echo ""
        echo "--- Progress: $counter/$total_requests requests completed ---"
        echo ""
    fi
    
    # Add small delay every 1000 requests to prevent server overload
    if [ $((counter % 1000)) -eq 0 ]; then
        sleep 0.1
    fi
done

# End time
end_time=$(date +%s)
duration=$((end_time - start_time))

echo ""
echo "=========================================="
echo "Test completed!"
echo "Total requests: $total_requests"
echo "Total time: ${duration} seconds"
echo "Average time per request: $(echo "scale=3; $duration / $total_requests" | bc) seconds"
echo "Requests per second: $(echo "scale=2; $total_requests / $duration" | bc)" 