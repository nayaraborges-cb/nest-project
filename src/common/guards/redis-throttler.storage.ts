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

  async increment(key: string, ttl: number): Promise<ThrottlerStorageRecord> {
    const now = Date.now();
    const multi = this.redis.multi();

  
    multi.zremrangebyscore(key, 0, now - ttl * 1000);

   
    multi.zadd(key, now + ttl * 1000, now.toString());

    multi.expire(key, ttl);

    multi.zcard(key);

    const result = await multi.exec();

    if (!result) {
      throw new Error('Redis transaction failed or was aborted.');
    }

    const hits = result[3][1] as number;
    const timeToExpire = result[4][1] as number; 

    return {
      totalHits: hits,
      timeToExpire: timeToExpire,
    };
  }

  async getRecord(key: string): Promise<number[]> {
    const data = await this.redis.lrange(key, 0, -1);
    return data.map((v) => Number(v));
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    const now = Date.now();
    const multi = this.redis.multi();

    multi.rpush(key, now.toString());

    multi.expire(key, ttl);

    await multi.exec();
  }
}
