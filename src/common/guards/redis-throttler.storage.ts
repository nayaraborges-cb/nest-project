import { ThrottlerStorage } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ThrottlerStorageOptions } from '@nestjs/throttler/dist/throttler-storage-options.interface';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }
  storage: Record<string, ThrottlerStorageOptions>;
  increment(key: string, ttl: number): Promise<ThrottlerStorageRecord> {
    throw new Error('Method not implemented.');
  }

  async getRecord(key: string): Promise<number[]> {
    const data = await this.redis.lrange(key, 0, -1);
    return data.map((v) => Number(v));
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    const now = Date.now();
    const multi = this.redis.multi();

    // push timestamp
    multi.rpush(key, now.toString());

    // define TTL
    multi.expire(key, ttl);

    await multi.exec();
  }
}
