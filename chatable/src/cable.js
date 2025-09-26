import { createConsumer } from '@rails/actioncable';

const consumer = createConsumer(import.meta.env.VITE_WEBSOCKET_URL);

export default consumer;