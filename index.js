document.addEventListener('DOMContentLoaded', function() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotInput = document.getElementById('chatbot-input-field');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotContainer = document.getElementById('chatbot-container');

  chatbotToggle.addEventListener('click', function() {
      if (!chatbotWindow.classList.contains('active')) {
          chatbotToggle.classList.add('animating');
          setTimeout(() => {
              chatbotToggle.classList.remove('animating');
              chatbotContainer.classList.add('chat-active');
              setTimeout(() => {
                  chatbotWindow.classList.add('active');
                  chatbotInput.focus();
                  if (chatbotMessages.children.length === 0) {
                      addMessage('bot', '¡Hola! Soy el asistente de Maljut Pizzas. ¿En qué puedo ayudarte? 🍕');
                  }
              }, 200);
          }, 120);
      } else {
          closeChat();
      }
  });

  function closeChat() {
      chatbotWindow.classList.remove('active');
      chatbotContainer.classList.remove('chat-active');
      chatbotContainer.classList.add('closing'); // Agrega la clase para la animación de cierre
      setTimeout(() => {
          chatbotContainer.classList.remove('closing'); // Elimina la clase después de la animación
      }, 300); // La duración debe coincidir con la de la transición CSS
  }

  chatbotClose.addEventListener('click', closeChat);

  chatbotInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          sendMessage();
      }
  });

  chatbotSend.addEventListener('click', sendMessage);

  function sendMessage() {
      const message = chatbotInput.value.trim();
      if (message) {
          addMessage('user', message);
          chatbotInput.value = '';

          setTimeout(() => {
              const responses = [
                  '¡Gracias por tu mensaje! Te ayudo con información sobre nuestros productos.',
                  '¿Te gustaría conocer nuestras promociones especiales?',
                  'Puedo ayudarte con el menú, promociones o información de contacto.',
                  '¿Necesitas ayuda con el pedido o tienes alguna pregunta específica?'
              ];
              const randomResponse = responses[Math.floor(Math.random() * responses.length)];
              addMessage('bot', randomResponse);
          }, 1000);
      }
  }

  function addMessage(sender, text) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chatbot-message ${sender}-message`;

      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      messageContent.textContent = text;

      messageDiv.appendChild(messageContent);
      chatbotMessages.appendChild(messageDiv);

      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  document.addEventListener('click', function(e) {
      if (!chatbotContainer.contains(e.target) && chatbotWindow.classList.contains('active')) {
          closeChat();
      }
  });
});

const style = document.createElement('style');
style.textContent = `
  .chatbot-message {
      margin-bottom: 0.5rem;
      display: flex;
  }

  .user-message {
      justify-content: flex-end;
  }

  .bot-message {
      justify-content: flex-start;
  }

  .message-content {
      max-width: 80%;
      padding: 0.75rem 1rem;
      border-radius: 18px;
      word-wrap: break-word;
  }

  .user-message .message-content {
      background: #25d366;
      color: white;
      border-bottom-right-radius: 4px;
  }

  .bot-message .message-content {
      background: white;
      color: #333;
      border: 1px solid #e9ecef;
      border-bottom-left-radius: 4px;
  }

  /* Estilos para la animación de cierre */
  .chatbot-container.closing {
      opacity: 0;
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  }
`;
document.head.appendChild(style);