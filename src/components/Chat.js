// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../actions';
import webSocketService from '../services/webSocket';

const Chat = () => {
  const messages = useSelector((state) => state.messages);
  const dispatch = useDispatch();

  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState('Anonymous'); // Default user name

  const handleSendMessage = () => {
    if (webSocketService.isWebSocketOpen()) {
      const message = {
        text: newMessage,
        timestamp: Date.now(),
        user: currentUser,
      };
      console.log('Sending message:', message);
      webSocketService.send(message);
      setNewMessage('');
    } else {
      console.log('WebSocket connection is not open yet. Queuing message...');
      // You might want to queue the message and send it once the connection is open
    }
  };

  useEffect(() => {
    // Load message history from local storage
    const storedHistory = JSON.parse(localStorage.getItem('messageHistory')) || [];
    dispatch({ type: 'SET_MESSAGES', payload: storedHistory });

    // Connect to WebSocket
    webSocketService.connect(
      (message) => {
        dispatch(addMessage(message));

        // Save the message to local storage immediately after receiving it
        const updatedHistory = [...storedHistory, message];
        localStorage.setItem('messageHistory', JSON.stringify(updatedHistory));

        console.log('Received message:', message);
      },
      (history) => {
        // Set message history on initial connection
        dispatch({ type: 'SET_MESSAGES', payload: history });
      }
    );
  }, [dispatch]);

  // Check if the WebSocket connection is open periodically
  useEffect(() => {
    const checkWebSocketStatus = setInterval(() => {
      if (webSocketService.isWebSocketOpen()) {
        // If the connection is open, send any queued messages
        clearInterval(checkWebSocketStatus);
        // Implement your logic to handle queued messages, if any
      }
    }, 1000); // Check every 1 second

    // Clean up the interval on component unmount
    return () => clearInterval(checkWebSocketStatus);
  }, []);

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.user}:</strong> {message.text} -{' '}
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <label>
          Your Name:
          <input
            type="text"
            placeholder="Enter your name"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default Chat;
