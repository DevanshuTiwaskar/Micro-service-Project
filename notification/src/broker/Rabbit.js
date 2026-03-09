import amqp from "amqplib";
import config from "../config/config.js";

let channel;

export const connectRabbit = async () => {
  const connection = await amqp.connect(config.RABBITMQ_URI);
  channel = await connection.createChannel();

  await channel.assertExchange("app.events", "topic", { durable: true });

  const q = await channel.assertQueue("notification.queue", { durable: true });
  await channel.bindQueue(q.queue, "app.events", "#");

  console.log("🐰 Notification connected to RabbitMQ");
};

export const consumeEvents = (callback) => {
  channel.consume("notification.queue", (msg) => {
    const data = JSON.parse(msg.content.toString());
    callback(data, msg.fields.routingKey);
    channel.ack(msg);
  });
};
