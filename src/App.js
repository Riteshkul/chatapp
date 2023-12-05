// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Chat from './components/Chat';

function App() {
  return (
    <Provider store={store}>
      <div>
        <h1>React Chat App</h1>
        <Chat />
      </div>
    </Provider>
  );
}

export default App;
