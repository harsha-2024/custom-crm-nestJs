import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue, Worker, QueueScheduler, RedisOptions } from 'bullmq';

@Injectable()
export class JobsService implements OnModuleInit {
  private connection: RedisOptions = { url: process.env.REDIS_URL || 'redis://redis:6379' } as any;
  private queue = new Queue('crm-jobs', { connection: this.connection });
  private scheduler = new QueueScheduler('crm-jobs', { connection: this.connection });
  private worker = new Worker('crm-jobs', async job => { console.log('Processing job', job.name, job.data); }, { connection: this.connection });
  async onModuleInit() { await this.queue.add('example', { hello: 'world' }); }
}
