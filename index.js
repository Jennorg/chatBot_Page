document.addEventListener('DOMContentLoaded', function() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotInput = document.getElementById('chatbot-input-field');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotContainer = document.getElementById('chatbot-container');

  // Backend configuration
  const API_URL = 'https://maljut-backend.vercel.app/api/chat';
  let conversationId = null;

  // Initialize chatbot
  function initChatbot() {
    if (chatbotMessages.children.length === 0) {
      addMessage('bot', '¡Hola! Soy el asistente de Maljut Pizzas 🍕\n\n¿En qué puedo ayudarte?\n• Ver menú\n• Hacer un pedido\n• Consultar promociones\n• Información de sucursales\n• Métodos de pago');
    }
  }

  // Toggle chatbot window
  chatbotToggle.addEventListener('click', function() {
    if (!chatbotWindow.classList.contains('active')) {
      chatbotWindow.classList.add('active');
      chatbotInput.focus();
      initChatbot();
    } else {
      closeChat();
    }
  });

  // Close chatbot
  function closeChat() {
    chatbotWindow.classList.remove('active');
  }

  chatbotClose.addEventListener('click', closeChat);

  // Send message function
  async function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage('user', message);
    chatbotInput.value = '';

    // Show typing indicator
    const typingIndicator = addTypingIndicator();

    try {
      // Send message to backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationId: conversationId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Remove typing indicator
      removeTypingIndicator(typingIndicator);

      // Add bot response
      if (data.data.response) {
        addMessage('bot', data.data.response);
      } else if (data.data.message) {
        addMessage('bot', data.data.message);
      } else {
        addMessage('bot', 'Lo siento, no pude procesar tu mensaje. ¿Podrías intentar de nuevo?');
        console.log(data)
      }

    } catch (error) {
      console.error('Error sending message:', error);
      removeTypingIndicator(typingIndicator);
      
      if (error.message.includes('500')) {
        addMessage('bot', 'El servidor está temporalmente no disponible. Por favor, contacta directamente por WhatsApp o intenta más tarde.');
      } else if (error.message.includes('404')) {
        addMessage('bot', 'El servicio de chat no está disponible en este momento. Por favor, contacta directamente por WhatsApp.');
      } else {
        addMessage('bot', 'Lo siento, hay un problema de conexión. Por favor, intenta de nuevo o contacta directamente por WhatsApp.');
      }
    }
  }

  // Add message to chat
  function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Add typing indicator
  function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return typingDiv;
  }

  // Remove typing indicator
  function removeTypingIndicator(typingIndicator) {
    if (typingIndicator && typingIndicator.parentNode) {
      typingIndicator.parentNode.removeChild(typingIndicator);
    }
  }

  // Event listeners
  chatbotSend.addEventListener('click', sendMessage);
  
  chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Close chat when clicking outside
  document.addEventListener('click', function(e) {
    if (!chatbotContainer.contains(e.target) && chatbotWindow.classList.contains('active')) {
      closeChat();
    }
  });

  // Add CSS for typing indicator
  const style = document.createElement('style');
  style.textContent = `
    .typing-indicator {
      display: flex;
      align-items: center;
      padding: 12px 16px;
    }

    .typing-dots {
      display: flex;
      gap: 4px;
    }

    .typing-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #999;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-dots span:nth-child(1) {
      animation-delay: -0.32s;
    }

    .typing-dots span:nth-child(2) {
      animation-delay: -0.16s;
    }

    @keyframes typing {
      0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .message {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
      margin-bottom: 8px;
    }

    .message.bot {
      background: #e9ecef;
      color: #333;
      align-self: flex-start;
      border-bottom-left-radius: 5px;
    }

    .message.user {
      background: linear-gradient(135deg, #d6a864, #8c674b);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 5px;
      margin-left: auto;
    }

    .chatbot-messages {
      display: flex;
      flex-direction: column;
    }

    .chatbot-window.active {
      display: flex;
    }

    .chatbot-window {
      display: none;
    }
  `;
  document.head.appendChild(style);
});