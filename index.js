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

  // Configuración de Botpress Cloud
  const BOT_ID = "BOT_ID"; 
  const API_URL = `https://bots.botpress.cloud/v1/chat/${BOT_ID}`;
  const API_KEY = "API_KEY"; 
  let conversationId = null; // Para mantener el contexto de la conversación

  // Función para enviar mensaje y obtener respuesta del bot
  async function sendToBotpress(userMessage) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        type: "text",
        text: userMessage,
        conversationId: conversationId || undefined
      })
    });
    const data = await res.json();
    // Guarda el conversationId para mantener el contexto
    if (data.conversationId) conversationId = data.conversationId;
    // El mensaje del bot está en data.responses[0].payload.text
    return data.responses?.[0]?.payload?.text || "Sin respuesta del bot";
  }

  // Reemplaza la función sendMessage por una versión async
  async function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
      addMessage('user', message);
      chatbotInput.value = '';

      // Llama a Botpress y muestra la respuesta real
      const botReply = await sendToBotpress(message);
      addMessage('bot', botReply);
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