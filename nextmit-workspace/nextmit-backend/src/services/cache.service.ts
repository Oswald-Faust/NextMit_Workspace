import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

export class CacheService {
  private redis: Redis;
  private defaultTTL: number = 3600; // 1 heure par défaut

  constructor() {
    this.redis = new Redis(config.redis.url, {
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

    this.redis.on('error', (error) => {
      logger.error('Redis error:', error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.redis.setex(key, ttl, serialized);
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  async invalidate(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Cache invalidate error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error('Cache invalidate pattern error:', error);
    }
  }

  async increment(key: string, value: number = 1): Promise<number> {
    try {
      return await this.redis.incrby(key, value);
    } catch (error) {
      logger.error('Cache increment error:', error);
      return 0;
    }
  }

  async decrement(key: string, value: number = 1): Promise<number> {
    try {
      return await this.redis.decrby(key, value);
    } catch (error) {
      logger.error('Cache decrement error:', error);
      return 0;
    }
  }

  async getOrSet<T>(
    key: string,
    callback: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const fresh = await callback();
    await this.set(key, fresh, ttl);
    return fresh;
  }
} 