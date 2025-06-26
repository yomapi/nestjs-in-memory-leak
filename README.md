## Description

[Nest](https://github.com/nestjs/nest) framework In memory cache memory leak minimum reproduction code

## Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the server:**

   ```bash
   npm run start
   ```

3. **Run the test script:**
   ```bash
   ./test-cache.sh
   ```

## Memory Leak Detection Process

### Step 1: Baseline Memory Snapshot

1. Start the NestJS server
2. Take initial heap snapshot using Chrome DevTools Memory tab
3. Note the baseline memory usage

### Step 2: Generate Cache Load

1. Run the test script to generate 5000 cache entries
2. Each request creates a new CacheData instance with 10-second TTL
3. Monitor memory growth during the process

### Step 3: Wait for TTL Expiration

1. Wait 10+ seconds after test completion
2. Take another heap snapshot
3. Compare with baseline snapshot

### Step 4: Analyze Results

1. Search for `CacheData` instances in snapshots
2. Verify that instances are properly cleaned up after TTL
3. Check for any retained references causing memory leaks

## Result (Memory Leak)

Heap memory usage increased and never decrease.
