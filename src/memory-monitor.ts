// src/memory-monitor.ts
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const heapdump = require('heapdump');

const MEMORY_INTERVAL_MS = 1000; // 1초마다 메모리 사용량 기록
const SNAPSHOT_INTERVAL_MS = 60000; // 1분마다 스냅샷 생성
const LOG_FILE = path.join(process.cwd(), 'logs', 'memory_log.csv');
const logger = new Logger('MemoryMonitor');
function ensureCsvHeader() {
  // logs 디렉토리가 없으면 생성
  const logsDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, 'timestamp,rss_mb,heapUsed_mb\n');
  }
}

let lastSnapshotTime = 0;

export function startMemoryMonitor(): void {
  ensureCsvHeader();

  // 1초마다 메모리 사용량 기록
  setInterval(() => {
    const memory = process.memoryUsage();
    const rssMb = memory.rss / 1024 / 1024;
    const heapUsedMb = memory.heapUsed / 1024 / 1024;

    logger.log(
      `RSS: ${rssMb.toFixed(2)}MB, Heap Used: ${heapUsedMb.toFixed(2)}MB`,
    );

    const timestamp = new Date().toISOString();
    const line = `${timestamp},${rssMb.toFixed(2)},${heapUsedMb.toFixed(2)}\n`;

    fs.appendFileSync(LOG_FILE, line);

    // 스냅샷 생성 조건: 임계값 초과 + 마지막 스냅샷으로부터 1분 경과
    const now = Date.now();
    if (now - lastSnapshotTime >= SNAPSHOT_INTERVAL_MS) {
      lastSnapshotTime = now;

      // 힙덤프 파일을 heapdumps 디렉토리에 저장
      const heapdumpsDir = path.join(process.cwd(), 'heapdumps');
      if (!fs.existsSync(heapdumpsDir)) {
        fs.mkdirSync(heapdumpsDir, { recursive: true });
      }

      const snapshotFile = path.join(
        heapdumpsDir,
        `heap-${timestamp.replace(/[:.]/g, '-')}.heapsnapshot`,
      );

      logger.log(
        `[MEMORY MONITOR] ${timestamp} - heapUsedMb ${heapUsedMb.toFixed(
          2,
        )}MB → Writing snapshot: ${snapshotFile}`,
      );

      heapdump.writeSnapshot(snapshotFile);
    }
  }, MEMORY_INTERVAL_MS);
}
