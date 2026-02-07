import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';

@Injectable()
export class ListenerService implements OnModuleInit {
  private kafka = new Kafka({ clientId: 'notification-service', brokers: (process.env.KAFKA_BROKERS||'redpanda:9092').split(','), logLevel: logLevel.ERROR });
  private consumer = this.kafka.consumer({ groupId: 'notification-workers' });

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'crm.contact.created', fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const payload = JSON.parse(message.value?.toString() || '{}');
        console.log(`[notification] ${topic}`, payload);
      }
    });
  }
}
