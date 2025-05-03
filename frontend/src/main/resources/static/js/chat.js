// Chat page functions
let chatMessages = [];

// Initialize chat page
function initializeChatPage() {
  if (!document.getElementById('chatMessages')) return; // Not on chat page

  // Display welcome message
  addOperatorMessage("Hello! How can I assist you today?");
}

// Add a user message to the chat
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();

  if (!message) return; // Don't send empty messages

  // Add user message to chat
  addUserMessage(message);

  // Clear input field
  messageInput.value = '';

  // Simulate operator response after a delay
  setTimeout(() => {
    simulateOperatorResponse(message);
  }, 1000);
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

// Add a user message to the chat display
function addUserMessage(message) {
  const chatMessagesElement = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.className = 'message user-message';

  // Add message text
  messageElement.textContent = message;

  // Add timestamp
  const timeElement = document.createElement('div');
  timeElement.className = 'message-time';
  timeElement.textContent = getCurrentTime();
  messageElement.appendChild(timeElement);

  // Add to chat display
  chatMessagesElement.appendChild(messageElement);

  // Store in messages array
  chatMessages.push({
    type: 'user',
    text: message,
    time: new Date()
  });

  // Scroll to bottom
  chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;

  // Log to console (simulating backend sending)
  console.log('User message sent:', message);
}

// Add an operator message to the chat display
function addOperatorMessage(message) {
  const chatMessagesElement = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.className = 'message operator-message';

  // Add message text
  messageElement.textContent = message;

  // Add timestamp
  const timeElement = document.createElement('div');
  timeElement.className = 'message-time';
  timeElement.textContent = getCurrentTime();
  messageElement.appendChild(timeElement);

  // Add to chat display
  chatMessagesElement.appendChild(messageElement);

  // Store in messages array
  chatMessages.push({
    type: 'operator',
    text: message,
    time: new Date()
  });

  // Scroll to bottom
  chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

// Simulate operator response based on user message
function simulateOperatorResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  let response;

  // Simple keyword-based responses
  if (lowerMessage.includes('billing') || lowerMessage.includes('payment') || lowerMessage.includes('invoice')) {
    response = "I can help you with billing issues. What specific question do you have about your bill?";
  } else if (lowerMessage.includes('upgrade') || lowerMessage.includes('plan')) {
    response = "We have several upgrade options available. Would you like to know about our Premium Mobile package?";
  } else if (lowerMessage.includes('technical') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('not working')) {
    response = "I'm sorry to hear you're experiencing technical issues. Could you please provide more details about the problem?";
  } else if (lowerMessage.includes('cancel')) {
    response = "We're sorry to hear you want to cancel. Is there anything we can do to improve your experience with us?";
  } else {
    // Default responses
    const defaultResponses = [
      "Thank you for your message. How else can I assist you?",
      "I understand. Is there anything specific you'd like to know?",
      "Let me check that for you. Is there anything else you need help with?",
      "I'd be happy to help with that. Could you provide more details?"
    ];
    response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  addOperatorMessage(response);
}

// Get current time in HH:MM format
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}