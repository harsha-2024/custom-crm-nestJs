import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';
import { Client } from '@opensearch-project/opensearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private kafka = new Kafka({ clientId: 'search-service', brokers: (process.env.KAFKA_BROKERS||'redpanda:9092').split(','), logLevel: logLevel.ERROR });
  private consumer = this.kafka.consumer({ groupId: 'search-indexers' });
  private os = new Client({ node: process.env.OPENSEARCH_URL || 'http://opensearch:9200' });

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'crm.contact.created', fromBeginning: true });
    await this.consumer.subscribe({ topic: 'crm.contact.updated', fromBeginning: true });
    await this.consumer.subscribe({ topic: 'crm.contact.deleted', fromBeginning: true });

    await this.os.indices.create({ index: 'contacts' }, { ignore: [400] });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const payload = JSON.parse(message.value?.toString() || '{}');
        if (topic.endsWith('deleted')) {
          await this.os.delete({ index: 'contacts', id: payload.id }, { ignore: [404] });
        } else {
          await this.os.index({ index: 'contacts', id: payload.id, body: payload });
        }
      }
    });
  }

  async searchContacts(q: string) {
    const r = await this.os.search({ index: 'contacts', q });
    return (r.hits as any).hits.map((h: any) => ({ id: h._id, ...(h._source||{}) }));
  }
}
