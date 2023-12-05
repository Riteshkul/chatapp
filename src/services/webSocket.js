// src/services/webSocket.js
const socket = new WebSocket('ws://localhost:3001');

const webSocketService = {
  messageQueue: [],

  connect: (onMessageCallback, onHistoryCallback) => {
    socket.onopen = () => {
      console.log('WebSocket connection opened');
      // Send queued messages when the connection is established
      webSocketService.sendQueuedMessages();
    };

    socket.onmessage = (event) => {
      const data = event.data;

      try {
        const jsonData = JSON.parse(data);

        if (Array.isArray(jsonData)) {
          onHistoryCallback(jsonData);
        } else {
          onMessageCallback(jsonData);
        }
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    };
  },

  send: (message) => {
    if (webSocketService.isWebSocketOpen()) {
      socket.send(JSON.stringify({ type: 'message', message }));
    } else {
      // Queue the message if the WebSocket connection is not open
      webSocketService.messageQueue.push(message);
      console.log('WebSocket connection is not open yet. Queuing message...');
    }
  },

  sendQueuedMessages: () => {
    while (webSocketService.messageQueue.length > 0) {
      const queuedMessage = webSocketService.messageQueue.shift();
      webSocketService.send(queuedMessage);
    }
  },

  isWebSocketOpen: () => {
    return socket.readyState === WebSocket.OPEN;
  },
};

export default webSocketService;
