// Santa message control
let santaMessageIndex = 0;
let santaMessageInterval;

// DOM elements
let playPauseBtn;
let playPauseIcon;
let playPauseText;
let volumeSlider;
let navButtons;
let basketCards;
let whatsappButtons;
let santaElement;
let santaMessageElement;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeElements();
  initializeAudio();
  initializeNavigation();
  initializeWhatsApp();
  initializeSantaAnimations();
  startSantaMessages();
  
  // Try to start music automatically
  attemptAutoplay();
});


// === Música de fundo (JINGLEBELLS) ===
let bgAudio;

function initializeAudio() {
  bgAudio = document.getElementById('bgMusic');
  if (!bgAudio) {
    // cria dinamicamente se não existir no HTML
    bgAudio = new Audio('jinglebells.mp3.mp3');
    bgAudio.id = 'bgMusic';
    bgAudio.loop = true;
    bgAudio.preload = 'auto';
    try { bgAudio.setAttribute('playsinline',''); } catch(e) {}
    document.body.appendChild(bgAudio);
  }
  bgAudio.loop = true;
  bgAudio.volume = 0.5;

  
  const toggle = document.getElementById('toggleSound');
  if (toggle) {
    toggle.addEventListener('click', () => {
      if (!bgAudio) return;
      const willMute = !bgAudio.muted;
      bgAudio.muted = willMute;
      // sinaliza escolha do usuário para outros scripts
      try { bgAudio.dataset.userMuted = willMute ? 'true' : 'false'; } catch(e){}
      if (willMute) {
        // desligar de verdade
        try { bgAudio.pause(); } catch(e){}
      } else {
        // religar
        try { bgAudio.play().catch(()=>{}); } catch(e){}
      }
      toggle.textContent = bgAudio.muted ? '🔇' : '🔊';
      toggle.setAttribute('aria-label', bgAudio.muted ? 'Som desligado' : 'Som ligado');
    });
  }
);
  }
}

async function attemptAutoplay() {
  if (!bgAudio) return;
  // Respeita a escolha do usuário
  try {
    if (bgAudio.dataset && bgAudio.dataset.userMuted === 'true') {
      return;
    }
  } catch(e){}
  try {
    bgAudio.muted = false;
    await bgAudio.play();
    console.log('🎵 Autoplay tocando com som');
  } catch (e1) {
    console.warn('Autoplay bloqueado, tentando mudo', e1);
    try {
      bgAudio.muted = true;
      await bgAudio.play();
      // liberar som no primeiro gesto (se usuário não tiver mutado)
      const unlock = () => {
        if (!(bgAudio.dataset && bgAudio.dataset.userMuted === 'true')) {
          bgAudio.muted = false;
          bgAudio.play().catch(()=>{});
        }
        document.removeEventListener('pointerdown', unlock);
        document.removeEventListener('keydown', unlock);
      };
      document.addEventListener('pointerdown', unlock, { once: true });
      document.addEventListener('keydown', unlock, { once: true });
    } catch (e2) {
      console.warn('Não conseguiu tocar mesmo mudo', e2);
    }
  }
} catch (e1) {
    console.warn('Autoplay bloqueado, tentando mudo', e1);
    try {
      bgAudio.muted = true;
      await bgAudio.play();
      // liberar som no primeiro gesto
      const unlock = () => {
        bgAudio.muted = false;
        document.removeEventListener('pointerdown', unlock);
        document.removeEventListener('keydown', unlock);
      };
      document.addEventListener('pointerdown', unlock, { once: true });
      document.addEventListener('keydown', unlock, { once: true });
      // opcional: mostra dica
      showUnmuteHint();
    } catch (e2) {
      console.warn('Não conseguiu nem mudo; tocará no primeiro gesto', e2);
      const unlock2 = () => {
        bgAudio.muted = false;
        bgAudio.play().catch(()=>{});
        removeUnmuteHint();
        document.removeEventListener('pointerdown', unlock2);
        document.removeEventListener('keydown', unlock2);
      };
      document.addEventListener('pointerdown', unlock2, { once: true });
      document.addEventListener('keydown', unlock2, { once: true });
      showUnmuteHint();
    }
  }
}

function showUnmuteHint() {
  if (document.getElementById('unmuteHint')) return;
  const btn = document.createElement('button');
  btn.id = 'unmuteHint';
  btn.textContent = 'Ativar som';
  btn.style.position = 'fixed';
  btn.style.right = '20px';
  btn.style.bottom = '70px';
  btn.style.padding = '10px 14px';
  btn.style.border = '0';
  btn.style.borderRadius = '999px';
  btn.style.boxShadow = '0 2px 8px rgba(0,0,0,.2)';
  btn.style.cursor = 'pointer';
  btn.style.zIndex = '1000';
  btn.addEventListener('click', () => {
    bgAudio.muted = false;
    bgAudio.play().catch(()=>{});
    removeUnmuteHint();
  });
  document.body.appendChild(btn);
}

function removeUnmuteHint() {
  const b = document.getElementById('unmuteHint');
  if (b) b.remove();
}
// === fim música de fundo ===

// Initialize DOM elements
function initializeElements() {
  playPauseBtn = document.getElementById('playPauseBtn');
  playPauseIcon = document.getElementById('playPauseIcon');
  playPauseText = document.getElementById('playPauseText');
  volumeSlider = document.getElementById('volumeSlider');
  navButtons = document.querySelectorAll('.nav-btn');
  basketCards = document.querySelectorAll('.basket-card');
  whatsappButtons = document.querySelectorAll('.whatsapp-btn');
  santaElement = document.querySelector('.santa');
  santaMessageElement = document.querySelector('.santa-message');


// Controle das cestas (mostrar/esconder itens)
// Controle do WhatsApp
// Controle do Papai Noel interativo
class SantaController {
    constructor() {
        this.messages = [
            'Ho Ho Ho!',
            'Feliz Natal!🎄',
           ];
        this.init();
    }

    init() {
        // Aguardar DOM estar carregado
        setTimeout(() => {
            this.santa = document.querySelector('.santa');
            
            if (this.santa) {
                this.santa.addEventListener('click', () => {
                    console.log('Santa clicked!'); // Debug
                    this.showMessage();
                    this.animate();
                });

                // Mensagem automática a cada 20 segundos
                setInterval(() => {
                    if (Math.random() < 0.3) { // 30% de chance
                        this.showMessage();
                    }
                }, 20000);

                console.log('Santa controller initialized');
            } else {
                console.error('Santa element not found');
            }
        }, 100);
    }

    showMessage() {
        if (!this.santa) return;
        
        const message = this.messages[Math.floor(Math.random() * this.messages.length)];
        
        // Criar elemento da mensagem
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.className = 'santa-message';
        messageElement.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 215, 0, 0.95);
            color: #0c1e3d;
            padding: 10px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: messagePopup 3s ease-in-out forwards;
        `;

        // Adicionar animação CSS dinamicamente se ainda não existir
        if (!document.querySelector('#santa-message-style')) {
            const style = document.createElement('style');
            style.id = 'santa-message-style';
            style.textContent = `
                @keyframes messagePopup {
                    0% { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.8); }
                    20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }

        const santaContainer = document.querySelector('.santa-container');
        if (santaContainer) {
            santaContainer.appendChild(messageElement);
            
            // Remover mensagem após 3 segundos
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 3000);
        }
    }

    animate() {
        if (!this.santa) return;
        
        // Adicionar animação especial quando clicado
        this.santa.style.animation = 'none';
        setTimeout(() => {
            this.santa.style.animation = 'bounce 0.5s ease-in-out 3, wave 3s ease-in-out infinite';
        }, 10);
    }
}

// Efeitos visuais adicionais
class VisualEffects {
    constructor() {
        this.init();
    }

    init() {
        this.addSparkles();
        this.addHoverEffects();
        this.addScrollEffects();
    }

    addSparkles() {
        // Adicionar brilhos ocasionais
        setInterval(() => {
            this.createSparkle();
        }, 3000);
    }

    createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.cssText = `
            position: fixed;
            pointer-events: none;
            font-size: ${Math.random() * 20 + 10}px;
            color: #ffd700;
            z-index: 5;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: sparkleEffect 2s ease-out forwards;
        `;

        // Adicionar animação de brilho
        if (!document.querySelector('#sparkle-style')) {
            const style = document.createElement('style');
            style.id = 'sparkle-style';
            style.textContent = `
                @keyframes sparkleEffect {
                    0% { opacity: 0; transform: scale(0) rotate(0deg); }
                    50% { opacity: 1; transform: scale(1) rotate(180deg); }
                    100% { opacity: 0; transform: scale(0) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 2000);
    }

    addHoverEffects() {
        setTimeout(() => {
            // Efeito de hover nas cestas
            const basketCards = document.querySelectorAll('.basket-card');
            
            basketCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.background = 'rgba(255, 255, 255, 0.2)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.background = 'rgba(255, 255, 255, 0.15)';
                });
            });
        }, 100);
    }

    addScrollEffects() {
        // Efeito de fade-in ao rolar a página
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        setTimeout(() => {
            // Aplicar aos elementos principais
            const elements = document.querySelectorAll('.basket-card, .reward-card');
            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }, 100);
    }
}

// Utilitários gerais
class Utils {
    static addPulseAnimation() {
        if (!document.querySelector('#pulse-style')) {
            const style = document.createElement('style');
            style.id = 'pulse-style';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3); }
                    50% { transform: scale(1.05); box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5); }
                    100% { transform: scale(1); box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    static formatPhone(phone) {
        return phone.replace(/\D/g, '');
    }

    static isMobile() {
        return window.innerWidth <= 768;
    }
}

// Inicialização da aplicação
class ChristmasApp {
    constructor() {
        this.init();
    }

    init() {
        // Aguardar DOM carregar completamente
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.startApp();
            });
        } else {
            this.startApp();
        }
    }

    startApp() {
        console.log('🎄 Iniciando aplicação das Cestas Natalinas CONQUISTA...');
        
        // Adicionar estilos de animação
        Utils.addPulseAnimation();
        
        // Inicializar componentes com pequeno delay para garantir que DOM está pronto
        setTimeout(() => {
            this.music = new ChristmasMusic();
            this.baskets = new BasketController();
            this.whatsapp = new WhatsAppController();
            this.santa = new SantaController();
            this.effects = new VisualEffects();
            
            console.log('✨ Aplicação carregada com sucesso!');
            
            // Exibir mensagem de boas-vindas após 3 segundos
            setTimeout(() => {
                if (this.santa) {
                    this.santa.showMessage();
                }
            }, 3000);
        }, 200);
    }
}

// Inicializar a aplicação

// === Controle das cestas (mostrar/ocultar itens) — versão robusta ===
class BasketController {
  constructor() { this.init(); }
  init() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.toggle-items');
      if (!btn) return;
      e.preventDefault();
      const id = btn.dataset.basket || btn.getAttribute('data-basket');
      if (!id) return;
      this.toggleItems(id, btn);
    });
  }
  toggleItems(basketId, button) {
    const itemsList = document.getElementById(`items-${basketId}`);
    if (!itemsList) return;
    const isHidden = itemsList.classList.contains('hidden');
    if (isHidden) {
      itemsList.classList.remove('hidden');
      button.textContent = 'Ocultar itens';
      button.style.background = 'rgba(255, 255, 255, 0.35)';
      itemsList.style.maxHeight = itemsList.scrollHeight + 'px';
      itemsList.style.transition = 'max-height 0.4s ease, opacity 0.4s ease, transform 0.4s ease';
      itemsList.style.opacity = '1';
      itemsList.style.transform = 'translateY(0)';
    } else {
      itemsList.classList.add('hidden');
      button.textContent = 'Ver todos os itens';
      button.style.background = 'rgba(255, 255, 255, 0.2)';
    }
  }
}


// === Controle do WhatsApp — versão robusta ===
class WhatsAppController {
  constructor() {
    this.whatsappNumber = '551533260763'; // +55 15 3326-0763
    this.init();
  }
  init() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn--primary');
      if (!btn) return;
      if (!/Solicitar Orçamento/i.test(btn.textContent)) return;
      e.preventDefault();
      this.handleQuoteRequest(btn);
    });
  }
  handleQuoteRequest(buttonEl) {
    const card = buttonEl.closest('.basket-card') || document;
    let name = 'Cesta de Natal';
    let price = '';
    const h3 = card.querySelector('h3');
    if (h3) name = h3.textContent.replace('🎁 ','').trim();
    const priceEl = card.querySelector('.price');
    if (priceEl) price = priceEl.textContent.trim();
    const msg = `Olá! Tenho interesse na ${name}${price?(' no valor de '+price):''}. Gostaria de solicitar um orçamento. 🎄`;
    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
  }
}

const app = new ChristmasApp();