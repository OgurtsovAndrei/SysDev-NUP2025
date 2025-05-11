import {getChatHistory, sendChatMessage} from './model.js';

let chatMessages = [];

async function initializeChatPage() {
    if (!document.getElementById('chatMessages')) return;

    try {
        chatMessages = await getChatHistory();

        if (chatMessages && chatMessages.length > 0) {
            const chatMessagesElement = document.getElementById('chatMessages');
            chatMessagesElement.innerHTML = '';

            chatMessages.forEach(message => {
                if (message.type === 'user') {
                    displayUserMessage(message.text, message.time);
                } else {
                    displayOperatorMessage(message.text, message.time);
                }
            });
        } else {
            addOperatorMessage("Hello! How can I assist you today?");
        }
    } catch (error) {
        console.error('Failed to load chat history:', error);
        window.location.href = 'index.html';
    }
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (!message) return;

    try {
        addUserMessage(message);

        messageInput.value = '';

        await sendChatMessage(message);

        setTimeout(async () => {
            try {
                chatMessages = await getChatHistory();

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
        window.location.href = 'index.html';
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
        event.preventDefault();
    }
}

function insertQuickMessage(message) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = message;
    messageInput.focus();
}

function displayUserMessage(message, timestamp) {
    const chatMessagesElement = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';

    messageElement.textContent = message;

    const timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    timeElement.textContent = formatTimestamp(timestamp);
    messageElement.appendChild(timeElement);

    chatMessagesElement.appendChild(messageElement);

    chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

function displayOperatorMessage(message, timestamp) {
    const chatMessagesElement = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message operator-message';

    messageElement.textContent = message;

    const timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    timeElement.textContent = formatTimestamp(timestamp);
    messageElement.appendChild(timeElement);

    chatMessagesElement.appendChild(messageElement);

    chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

function addUserMessage(message) {
    const chatMessagesElement = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';

    messageElement.textContent = message;

    const timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    const currentTime = getCurrentTime();
    timeElement.textContent = currentTime;
    messageElement.appendChild(timeElement);

    chatMessagesElement.appendChild(messageElement);

    chatMessages.push({
        type: 'user',
        text: message,
        time: new Date().toISOString()
    });

    chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;

    console.log('User message sent:', message);
}

function addOperatorMessage(message) {
    const chatMessagesElement = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message operator-message';

    messageElement.textContent = message;

    const timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    const currentTime = getCurrentTime();
    timeElement.textContent = currentTime;
    messageElement.appendChild(timeElement);

    chatMessagesElement.appendChild(messageElement);

    chatMessages.push({
        type: 'operator',
        text: message,
        time: new Date().toISOString()
    });

    chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function formatTimestamp(timestamp) {
    if (!timestamp) return getCurrentTime();

    try {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return getCurrentTime();
    }
}

window.initializeChatPage = initializeChatPage;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.insertQuickMessage = insertQuickMessage;
