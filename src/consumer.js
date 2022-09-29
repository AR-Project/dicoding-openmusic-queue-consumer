require('dotenv').config();

const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
  // init
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  // open connection to amqp server
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  // make sure 'queue' is exist
  await channel.assertQueue('export:playlist', {
    durable: true,
  });
  console.log('OpenMusic Queue Consumer is listening...');
  // fetch message from queue that being sent from main server
  channel.consume('export:playlist', listener.listen, { noAck: true });
};

init();
