import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

// 캐시에 저장할 데이터 클래스
export class CacheData {
  constructor(
    public readonly id: string,
    public readonly message: string,
    public readonly timestamp: Date,
    public readonly metadata: Record<string, any> = {},
  ) {}

  toString(): string {
    return `CacheData(id=${this.id}, message="${this.message}", timestamp=${this.timestamp.toISOString()})`;
  }
}

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getHello(key: string): Promise<string> {
    // 캐시에서 값 조회
    const cached = await this.cacheManager.get<CacheData>(key);
    if (cached) {
      return `[CACHE] ${cached.toString()}`;
    }

    // 캐시에 값이 없으면 CacheData 인스턴스를 생성하여 저장
    const cacheData = new CacheData(key, `Hello World!`, new Date(), {
      requestCount: 1,
      source: 'app-service',
      version: '1.0.0',
    });

    await this.cacheManager.set(key, cacheData, 10); // 10초간 캐싱
    return cacheData.toString();
  }
}
