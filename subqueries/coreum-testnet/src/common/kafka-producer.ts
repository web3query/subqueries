import { Kafka } from 'kafkajs'
import { toJson } from './utils'
import {
  Account,
  AccountBalance,
  ChainHourlySnapshot,
  Contract,
  ContractHourlySnapshot,
} from '../types'

const k = new Kafka({
  brokers: ['104.248.248.241:19092', '104.248.248.241:29092', '104.248.248.241:39092'],
  clientId: 'coreum-producer-client',
})
export const producer = k.producer({ allowAutoTopicCreation: true })

type MessageType =
  | Account
  | Contract
  | AccountBalance
  | ContractHourlySnapshot
  | ChainHourlySnapshot

/**
 * Send a batch of messages to kafka
 * @param messages
 * @param topic
 */
export function sendMessages(messages: MessageType[], topic: string): void {
  const msgs = messages.map((m) => ({ value: toJson(m) }))
  producer
    .connect()
    .then(() => {
      producer
        .send({ messages: msgs, topic })
        // .then((record) => logger.info(`record: ${JSON.stringify(record)}`))
        .catch((err) =>
          logger.error(`failed to send message to kafka. reason: ${JSON.stringify(err)}`),
        )
    })
    .catch((err) => logger.error(`failed to connect kafka. reason: ${JSON.stringify(err)}`))
}
