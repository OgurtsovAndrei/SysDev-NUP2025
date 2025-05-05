// Chat page functions
import { getChatHistory, sendChatMessage } from './model.js';

let chatMessages = [];

// Initialize chat page
async function initializeChatPage() {
  if (!document.getElementById('chatMessages')) return; // Not on chat page

  try {
    // Fetch chat history from API
    chatMessages = await getChatHistory();

    // Display chat history
    if (chatMessages && chatMessages.length > 0) {
      // Clear chat display
      const chatMessagesElement = document.getElementById('chatMessages');
      chatMessagesElement.innerHTML = '';

      // Display each message
      chatMessages.forEach(message => {
        if (message.type === 'user') {
          displayUserMessage(message.text, message.time);
        } else {
          displayOperatorMessage(message.text, message.time);
        }
      });
    } else {
      // Display welcome message if no chat history
      addOperatorMessage("Hello! How can I assist you today?");
    }
  } catch (error) {
    console.error('Failed to load chat history:', error);
    // Navigate to home page instead of showing error
    window.location.href = 'index.html';
  }
}

// Add a user message to the chat
async function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();

  if (!message) return; // Don't send empty messages

  try {
    // Add user message to chat display
    addUserMessage(message);

    // Clear input field
    messageInput.value = '';

    // Send message to API
    await sendChatMessage(message);

    // The backend will automatically generate and store the operator response
    // We don't need to wait for it here, as it will be included in the next getChatHistory call
    // However, for a better user experience, we could implement real-time updates with WebSockets

    // For now, we'll fetch the updated chat history after a short delay
    setTimeout(async () => {
      try {
        // Fetch updated chat history
        chatMessages = await getChatHistory();

        // Display the latest operator message if there is one
        if (chatMessages && chatMessages.length > 0) {
          const latestMessage = chatMessages[chatMessages.length - 1];
          if (latestMessage.type === 'operator') {
            displayOperatorMessage(latestMessage.text, latestMessage.time);
          }
        }
      } catch (error) {
        console.error('Failed to fetch updated chat history:', error);
      }
    }, 1000);
  } catch (error) {
    console.error('Failed to send message:', error);
    // Navigate to home page instead of showing error
    window.location.href = 'index.html';
  }
}

// Handle Enter key press in the input field
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
    event.preventDefault();
  }
}

// Insert a quick message into the input field
function insertQuickMessage(message) {
  const messageInput = document.getElementById('messageInput');
  messageInput.value = message;
  messageInput.focus();
}

// Display a user message in the chat (for API responses)
function displayUserMessage(message, timestamp) {
  const chatMessagesElement = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.className = 'message user-message';

  // Add message text
  messageElement.textContent = message;

  // Add timestamp
  const timeElement = document.createElement('div');
  timeElement.className = 'message-time';
  timeElement.textContent = formatTimestamp(timestamp);
  messageElement.appendChild(timeElement);

  // Add to chat display
  chatMessagesElement.appendChild(messageElement);

  // Scroll to bottom
  chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

// Display an operator message in the chat (for API responses)
function displayOperatorMessage(message, timestamp) {
  const chatMessagesElement = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.className = 'message operator-message';

  // Add message text
  messageElement.textContent = message;

  // Add timestamp
  const timeElement = document.createElement('div');
  timeElement.className = 'message-time';
  timeElement.textContent = formatTimestamp(timestamp);
  messageElement.appendChild(timeElement);

  // Add to chat display
  chatMessagesElement.appendChild(messageElement);

  // Scroll to bottom
  chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

// Add a user message to the chat display (for new messages)
function addUserMessage(message) {
  const chatMessagesElement = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.className = 'message user-message';

  // Add message text
  messageElement.textContent = message;

  // Add timestamp
  const timeElement = document.createElement('div');
  timeElement.className = 'message-time';
  const currentTime = getCurrentTime();
  timeElement.textContent = currentTime;
  messageElement.appendChild(timeElement);

  // Add to chat display
  chatMessagesElement.appendChild(messageElement);

  // Store in messages array (local copy only, actual storage is on the server)
  chatMessages.push({
    type: 'user',
    text: message,
    time: new Date().toISOString() // ISO format for consistency with API
  });

  // Scroll to bottom
  chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;

  // Log to console
  console.log('User message sent:', message);
}

// Add an operator message to the chat display (for welcome message)
function addOperatorMessage(message) {
  const chatMessagesElement = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.className = 'message operator-message';

  // Add message text
  messageElement.textContent = message;

  // Add timestamp
  const timeElement = document.createElement('div');
  timeElement.className = 'message-time';
  const currentTime = getCurrentTime();
  timeElement.textContent = currentTime;
  messageElement.appendChild(timeElement);

  // Add to chat display
  chatMessagesElement.appendChild(messageElement);

  // Store in messages array (local copy only, actual storage is on the server)
  chatMessages.push({
    type: 'operator',
    text: message,
    time: new Date().toISOString() // ISO format for consistency with API
  });

  // Scroll to bottom
  chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

// Get current time in HH:MM format
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Format ISO 8601 timestamp to HH:MM format
function formatTimestamp(timestamp) {
  if (!timestamp) return getCurrentTime(); // Fallback to current time if no timestamp

  try {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return getCurrentTime(); // Fallback to current time if error
  }
}

// Expose functions to the global scope
window.initializeChatPage = initializeChatPage;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.insertQuickMessage = insertQuickMessage;
