import { Injectable } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';

@Injectable()
export class EventBus {
  private producer: any;
  private kafka: Kafka;
  constructor() {
    const brokers = (process.env.KAFKA_BROKERS || 'redpanda:9092').split(',');
    this.kafka = new Kafka({ clientId: 'crm-service', brokers, logLevel: logLevel.ERROR });
    this.producer = this.kafka.producer();
    this.producer.connect().catch(console.error);
  }
  async publish(topic: string, payload: any) {
    await this.producer.send({ topic, messages: [{ value: JSON.stringify(payload) }] });
  }
}
