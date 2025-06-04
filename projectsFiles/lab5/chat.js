// Sebastian Garcia Bustamante
// Configuración inicial
const API_URL = 'https://chat.devng.online/chats';
const MAXIMO_MENSAJES = 140;
const TIEMPO_REFRESH = 5000; // 5 segundos

// Estado de la aplicación
let scrollPosition = 0;
let isScrolledUp = false;
let theme = localStorage.getItem('chat-theme') || 'light';

// Elementos de la pagina
const appContainer = document.createElement('div');
const chatContainer = document.createElement('div');
const messageList = document.createElement('div');
const inputContainer = document.createElement('div');
const usernameInput = document.createElement('input');
const messageInput = document.createElement('textarea');
const sendButton = document.createElement('button');
const themeToggle = document.createElement('button');
const charCounter = document.createElement('span');

// funcion de estilos de la pagina
function initStyles() {
    
    // Reset y estilos base 
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.fontFamily = '"Segoe UI", Roboto, sans-serif';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#f0f2f5';
    document.body.style.overflow = 'hidden'; 

    // Contenedor principal
    appContainer.style.width = '100%';
    appContainer.style.maxWidth = '85%';
    appContainer.style.height = '95vh'; 
    appContainer.style.margin = 'auto';
    appContainer.style.display = 'grid';
    appContainer.style.gridTemplateRows = '1fr auto';
    appContainer.style.flexDirection = 'column';
    appContainer.style.borderRadius = '16px';
    appContainer.style.overflow = 'hidden';
    appContainer.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
    appContainer.style.backgroundColor = theme === 'dark' ? '#2d2d2d' : '#ffffff';
    appContainer.style.position = 'relative';
    appContainer.style.gap = '0';

    // Contenedor de mensajes
    chatContainer.style.flex = '1';
    chatContainer.style.overflowY = 'auto'; 
    chatContainer.style.padding = '20px';
    chatContainer.style.paddingBottom = '20px';
    chatContainer.style.display = 'flex';
    chatContainer.style.flexDirection = 'column';
    chatContainer.style.gap = '15px';
    chatContainer.style.scrollbarWidth = 'thin'; 
    chatContainer.style.scrollbarColor = `${theme === 'dark' ? '#555 #333' : '#ccc #f5f5f5'}`;

    // Barra lateral
    const style = document.createElement('style');
    style.textContent = `
        .chat-container::-webkit-scrollbar {
            width: 8px;
        }
        .chat-container::-webkit-scrollbar-track {
            background: ${theme === 'dark' ? '#333' : '#f5f5f5'};
            border-radius: 10px;
        }
        .chat-container::-webkit-scrollbar-thumb {
            background: ${theme === 'dark' ? '#555' : '#ccc'};
            border-radius: 10px;
        }
        .chat-container::-webkit-scrollbar-thumb:hover {
            background: ${theme === 'dark' ? '#666' : '#aaa'};
        }
    `;
    document.head.appendChild(style);
    chatContainer.classList.add('chat-container');

    // Lista de mensajes
    messageList.style.display = 'flex';
    messageList.style.flexDirection = 'column';
    messageList.style.gap = '15px';

    // Contenedor de inputs
    inputContainer.style.position = 'static';
    inputContainer.style.bottom = '0';
    inputContainer.style.left = '0';
    inputContainer.style.right = '0';
    inputContainer.style.padding = '15px';
    inputContainer.style.display = 'flex';
    inputContainer.style.flexDirection = 'column';
    inputContainer.style.gap = '10px';
    inputContainer.style.backgroundColor = theme === 'dark' ? '#383838' : '#f8f9fa';
    inputContainer.style.borderTop = theme === 'dark' ? '1px solid #444' : '1px solid #e0e0e0';
    inputContainer.style.borderRadius = '0 0 16px 16px';

    // Grupo de inputs + botón
    const inputGroup = document.createElement('div');
    inputGroup.style.display = 'flex';
    inputGroup.style.gap = '10px';
    inputGroup.style.alignItems = 'flex-end'; 

    // Contenedor de campos de texto
    const textFieldsContainer = document.createElement('div');
    textFieldsContainer.style.flex = '1';
    textFieldsContainer.style.display = 'flex';
    textFieldsContainer.style.flexDirection = 'column';
    textFieldsContainer.style.gap = '8px';

    // Input de nombre de usuario
    usernameInput.style.padding = '10px 16px';
    usernameInput.style.borderRadius = '20px';
    usernameInput.style.border = theme === 'dark' ? '1px solid #444' : '1px solid #ddd';
    usernameInput.style.fontSize = '14px';
    usernameInput.style.outline = 'none';
    usernameInput.style.backgroundColor = theme === 'dark' ? '#333' : '#fff';
    usernameInput.style.color = theme === 'dark' ? '#eee' : '#333';
    usernameInput.placeholder = 'Tu nombre';
    usernameInput.style.transition = 'all 0.3s ease';

    // Área de mensaje
    messageInput.style.padding = '10px 16px';
    messageInput.style.borderRadius = '20px';
    messageInput.style.border = theme === 'dark' ? '1px solid #444' : '1px solid #ddd';
    messageInput.style.resize = 'none';
    messageInput.style.minHeight = '45px';
    messageInput.style.maxHeight = '100px';
    messageInput.style.fontSize = '14px';
    messageInput.style.outline = 'none';
    messageInput.style.backgroundColor = theme === 'dark' ? '#333' : '#fff';
    messageInput.style.color = theme === 'dark' ? '#eee' : '#333';
    messageInput.placeholder = 'Escribe tu mensaje... (máx. 140 caracteres)';
    messageInput.style.transition = 'all 0.3s ease';

    // Botón de enviar 
    sendButton.style.padding = '12px';
    sendButton.style.borderRadius = '50%'; 
    sendButton.style.border = 'none';
    sendButton.style.backgroundColor = '#007bff';
    sendButton.style.color = 'white';
    sendButton.style.cursor = 'pointer';
    sendButton.style.display = 'flex';
    sendButton.style.alignItems = 'center';
    sendButton.style.justifyContent = 'center';
    sendButton.style.transition = 'all 0.3s ease';
    sendButton.style.width = '44px'; 
    sendButton.style.height = '44px';
    sendButton.style.flexShrink = '0'; 
    // Figura del boton
    sendButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    // Efectos para el botón
    sendButton.addEventListener('mouseover', () => {
        sendButton.style.backgroundColor = '#0069d9';
        sendButton.style.transform = 'translateY(-2px) scale(1.05)';
    });
    sendButton.addEventListener('mouseout', () => {
        sendButton.style.backgroundColor = '#007bff';
        sendButton.style.transform = 'translateY(0) scale(1)';
    });
    sendButton.addEventListener('mousedown', () => {
        sendButton.style.transform = 'translateY(1px) scale(0.98)';
    });

    // Contador de caracteres
    charCounter.style.textAlign = 'right';
    charCounter.style.fontSize = '12px';
    charCounter.style.marginTop = '2px';
    charCounter.style.color = theme === 'dark' ? '#aaa' : '#666';
    charCounter.textContent = `0/${MAXIMO_MENSAJES}`;

    // Botón de cambio de modo
    themeToggle.style.position = 'absolute';
    themeToggle.style.top = '15px';
    themeToggle.style.right = '15px';
    themeToggle.style.padding = '8px 16px';
    themeToggle.style.borderRadius = '20px';
    themeToggle.style.border = 'none';
    themeToggle.style.backgroundColor = theme === 'dark' ? '#444' : '#e0e0e0';
    themeToggle.style.color = theme === 'dark' ? '#fff' : '#333';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.zIndex = '200';
    themeToggle.style.fontSize = '12px';
    themeToggle.style.display = 'flex';
    themeToggle.style.alignItems = 'center';
    themeToggle.style.gap = '8px';
    themeToggle.innerHTML = theme === 'light' ? '🌙 Modo oscuro' : '🌞 Modo claro';
    themeToggle.style.transition = 'all 0.3s ease';

    // Estructura
    textFieldsContainer.appendChild(usernameInput);
    textFieldsContainer.appendChild(messageInput);
    textFieldsContainer.appendChild(charCounter);
    
    inputGroup.appendChild(textFieldsContainer);
    inputGroup.appendChild(sendButton);
    
    inputContainer.appendChild(inputGroup);
    chatContainer.appendChild(messageList);
    appContainer.appendChild(chatContainer);
    appContainer.appendChild(inputContainer);
    appContainer.appendChild(themeToggle);
    document.body.appendChild(appContainer);

    // Animar el contenedor 
    appContainer.style.boxShadow = theme === 'dark' 
    ? '0 0 0 2px rgba(100, 200, 255, 0.5)' 
    : '0 0 0 2px rgba(255, 215, 0, 0.5)';
    appContainer.style.animation = 'pulseBorder 3s infinite';

    // Animacion 
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulseBorder {
            0% {
                box-shadow: ${theme === 'dark' 
                    ? '0 0 0 2px rgba(100, 200, 255, 0.3)' 
                    : '0 0 0 2px rgba(255, 215, 0, 0.3)'};
            }
            50% {
                box-shadow: ${theme === 'dark' 
                    ? '0 0 0 4px rgba(100, 200, 255, 0.8)' 
                    : '0 0 0 4px rgba(255, 215, 0, 0.8)'};
            }
            100% {
                box-shadow: ${theme === 'dark' 
                    ? '0 0 0 2px rgba(100, 200, 255, 0.3)' 
                    : '0 0 0 2px rgba(255, 215, 0, 0.3)'};
            }
        }
    `;
    document.head.appendChild(pulseStyle);

    

    // Aplicar tema
    applyTheme();

    
}


// Aplicar los temas de la pagina
function applyTheme() {
    if (theme === 'dark') {
        // Estilos para el modo oscuro
        document.body.style.backgroundColor = '#121212';
        appContainer.style.backgroundColor = '#2d2d2d';
        chatContainer.style.backgroundColor = '#2d2d2d';
        inputContainer.style.backgroundColor = '#383838';
        inputContainer.style.borderTop = '1px solid #444';
        usernameInput.style.backgroundColor = '#333';
        usernameInput.style.color = '#eee';
        usernameInput.style.borderColor = '#444';
        messageInput.style.backgroundColor = '#333';
        messageInput.style.color = '#eee';
        messageInput.style.borderColor = '#444';
        themeToggle.style.backgroundColor = '#444';
        themeToggle.style.color = '#fff';
        themeToggle.innerHTML = '🌞 Modo claro';
        charCounter.style.color = '#aaa';
        
        // Efecto de borde para modo oscuro 
        appContainer.style.boxShadow = '0 0 0 2px rgba(100, 200, 255, 0.5)';
        updatePulseAnimation('100, 200, 255'); // Azul claro/ciano
    } else {
        // Estilos para el modo claro
        document.body.style.backgroundColor = '#f0f2f5';
        appContainer.style.backgroundColor = '#ffffff';
        chatContainer.style.backgroundColor = '#ffffff';
        inputContainer.style.backgroundColor = '#f8f9fa';
        inputContainer.style.borderTop = '1px solid #e0e0e0';
        usernameInput.style.backgroundColor = '#fff';
        usernameInput.style.color = '#333';
        usernameInput.style.borderColor = '#ddd';
        messageInput.style.backgroundColor = '#fff';
        messageInput.style.color = '#333';
        messageInput.style.borderColor = '#ddd';
        themeToggle.style.backgroundColor = '#e0e0e0';
        themeToggle.style.color = '#333';
        themeToggle.innerHTML = '🌙 Modo oscuro';
        charCounter.style.color = '#666';
        
        // Efecto de borde para modo claro
        appContainer.style.boxShadow = '0 0 0 2px rgba(255, 215, 0, 0.5)';
        updatePulseAnimation('255, 215, 0'); // Dorado
    }
    
    // Actualizar estilos de los mensajes existentes
    const messages = document.querySelectorAll('#messageList > div');
    messages.forEach(msg => {
        const isOwnMessage = msg.style.alignSelf === 'flex-end';
        if (isOwnMessage) {
            msg.style.backgroundColor = theme === 'dark' ? '#2b5278' : '#007bff';
            msg.style.color = 'white';
        } else {
            msg.style.backgroundColor = theme === 'dark' ? '#383838' : '#f1f1f1';
            msg.style.color = theme === 'dark' ? '#eee' : '#333';
        }
    });
}

// Funcion de animacion del borde
function updatePulseAnimation(rgbColor) {
    let pulseStyle = document.querySelector('style[data-pulse-animation]');
    
    if (!pulseStyle) {
        pulseStyle = document.createElement('style');
        pulseStyle.setAttribute('data-pulse-animation', 'true');
        document.head.appendChild(pulseStyle);
    }
    
    pulseStyle.textContent = `
        @keyframes pulseBorder {
            0% {
                box-shadow: 0 0 0 2px rgba(${rgbColor}, 0.3);
            }
            50% {
                box-shadow: 0 0 0 4px rgba(${rgbColor}, 0.8);
            }
            100% {
                box-shadow: 0 0 0 2px rgba(${rgbColor}, 0.3);
            }
        }
    `;
}

// Mandar la animacion al container
appContainer.style.animation = 'pulseBorder 3s infinite';

// Función para detectar URLs en el texto
function detectUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
}

// Función para determinar si una URL es una imagen
function isImageUrl(url) {
    return /\.(jpeg|jpg|gif|png|webp)$/.test(url);
}

// Función para crear una preview de enlace
function createLinkPreview(url) {
    const previewContainer = document.createElement('div');
    previewContainer.style.marginTop = '5px';
    previewContainer.style.border = '1px solid #ddd';
    previewContainer.style.borderRadius = '4px';
    previewContainer.style.padding = '8px';
    previewContainer.style.maxWidth = '300px';

    if (isImageUrl(url)) {
        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '200px';
        img.style.borderRadius = '4px';
        previewContainer.appendChild(img);
    } else {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = url;
        link.target = '_blank';
        link.style.color = theme === 'dark' ? '#4dabf7' : '#1971c2';
        previewContainer.appendChild(link);
        
        
    }

    return previewContainer;
}

// Función para renderizar mensajes
function renderMessages(messages) {
    const wasAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop === chatContainer.clientHeight;
    
    messageList.innerHTML = '';
    
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.style.padding = '12px 16px';
        messageElement.style.borderRadius = '18px';
        messageElement.style.maxWidth = '70%';
        messageElement.style.wordBreak = 'break-word';
        messageElement.style.position = 'relative';
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        messageElement.style.transition = 'opacity 0.3s, transform 0.3s';
        
        const isOwnMessage = usernameInput.value && msg.username === usernameInput.value;
        if (isOwnMessage) {
            messageElement.style.alignSelf = 'flex-end';
            messageElement.style.backgroundColor = theme === 'dark' ? '#2b5278' : '#007bff';
            messageElement.style.color = 'white';
            messageElement.style.borderRadius = '18px 18px 4px 18px';
        } else {
            messageElement.style.alignSelf = 'flex-start';
            messageElement.style.backgroundColor = theme === 'dark' ? '#383838' : '#f1f1f1';
            messageElement.style.color = theme === 'dark' ? '#eee' : '#333';
            messageElement.style.borderRadius = '18px 18px 18px 4px';
        }
        
        const usernameElement = document.createElement('div');
        usernameElement.style.fontWeight = '600';
        usernameElement.style.marginBottom = '4px';
        usernameElement.style.fontSize = '12px';
        usernameElement.style.opacity = '0.8';
        usernameElement.textContent = msg.username;
        
        const messageTextElement = document.createElement('div');
        messageTextElement.textContent = msg.message;
        messageTextElement.style.fontSize = '14px';
        
        messageElement.appendChild(usernameElement);
        messageElement.appendChild(messageTextElement);
        
        const urls = detectUrls(msg.message);
        urls.forEach(url => {
            messageElement.appendChild(createLinkPreview(url));
        });
        
        messageList.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 10);
    });
    
    if (wasAtBottom || !isScrolledUp) {
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 0);
    }
}

// Función para obtener mensajes del servidor
async function fetchMessages() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener mensajes');
        const messages = await response.json();
        renderMessages(messages);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para enviar un mensaje
async function sendMessage() {
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();

    if (!username || !message) {
        alert('Por favor ingresa un nombre de usuario y un mensaje');
        return;
    }

    if (message.length > MAXIMO_MENSAJES) {
        alert(`El mensaje no puede exceder ${MAXIMO_MENSAJES} caracteres`);
        return;
    }

    try {
        const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, message }),
        });
        
        if (!response.ok) throw new Error('Error al enviar mensaje');
        
        messageInput.value = '';
        charCounter.textContent = `0/${MAXIMO_MENSAJES}`;
        await fetchMessages();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar el mensaje');
    }
}


function setupEventListeners() {
// POder enviar mensajes con el boton del avion
    sendButton.addEventListener('click', sendMessage);

    // Para poder enviar mensajes con el enter.
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Contador de caracteres
    messageInput.addEventListener('input', () => {
        const remaining = MAXIMO_MENSAJES - messageInput.value.length;
        charCounter.textContent = `${messageInput.value.length}/${MAXIMO_MENSAJES}`;
        
        if (remaining < 0) {
            charCounter.style.color = 'red';
        } else if (remaining < 20) {
            charCounter.style.color = 'orange';
        } else {
            charCounter.style.color = theme === 'dark' ? '#aaa' : '#666';
        }
    });

    // Cambiar tema
    themeToggle.addEventListener('click', () => {
        theme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('chat-theme', theme);
        applyTheme();
        fetchMessages(); 
    });

    // Controlar scroll 
    chatContainer.addEventListener('scroll', () => {
        isScrolledUp = chatContainer.scrollHeight - chatContainer.scrollTop > chatContainer.clientHeight + 100;
    });
}

// Inicialización
function init() {
    initStyles();
    setupEventListeners();
    fetchMessages();

    // cada 5 segundos
    setInterval(fetchMessages, TIEMPO_REFRESH
    
    );
}

// Iniciar
init();
