// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const socket = io('http://localhost:3001');

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ sender: '', content: '' });

  useEffect(() => {
    // Fetch initial messages from the server
    axios.get('http://localhost:3000/messages')
      .then(response => setMessages(response.data))
      .catch(error => console.error(error));

    // Listen for 'newMessage' events from the server
    socket.on('newMessage', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      // Disconnect the socket when the component unmounts
      socket.disconnect();
    };
  }, []);
// Add these functions in src/App.js

const assignMessage = (messageId, agentId) => {
    axios.post(`http://localhost:3000/messages/assign/${messageId}/${agentId}`)
      .catch(error => console.error(error));
  };
  
  const lockMessage = (messageId, agentId) => {
    axios.post(`http://localhost:3000/messages/lock/${messageId}/${agentId}`)
      .catch(error => console.error(error));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessage(prevMessage => ({ ...prevMessage, [name]: value }));
  };

  
   // Update handleSubmit function in src/App.js

const handleSubmit = (e) => {
    e.preventDefault();
  
    // Simulate sending a message to the server
    axios.post('http://localhost:3000/messages', { ...newMessage, assignedAgent: null, lockedBy: null })
      .then(response => {
        // Clear the form and let Socket.IO handle real-time updates
        setNewMessage({ sender: '', content: '' });
      })
      .catch(error => console.error(error));
  };
  
  return (
    <div className="container">
      <h1 className="mt-4 mb-4">Branch Messaging App</h1>
      <div className="row">
        <div className="col-md-8">
          <ul className="list-group">
          {messages.map(message => (
  <li key={message._id} className="list-group-item">
    <strong>{message.sender}:</strong> {message.content}
    {!message.assignedAgent && (
      <button
        className="btn btn-sm btn-success ms-2"
        onClick={() => assignMessage(message._id, 'agent123')} // Replace 'agent123' with the actual agent ID
      >
        Assign
      </button>
    )}
    {message.assignedAgent === 'agent123' && !message.lockedBy && (
      <button
        className="btn btn-sm btn-warning ms-2"
        onClick={() => lockMessage(message._id, 'agent123')} // Replace 'agent123' with the actual agent ID
      >
        Lock
      </button>
    )}
  </li>
))}
          </ul>
        </div>
        <div className="col-md-4">
          {/* Form for sending new messages */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Sender:</label>
              <input
                type="text"
                className="form-control"
                name="sender"
                value={newMessage.sender}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Content:</label>
              <input
                type="text"
                className="form-control"
                name="content"
                value={newMessage.content}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

