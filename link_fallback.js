
// Robust fallback for "Ver todos os itens" and "Solicitar Orçamento"
(function(){
  function toggleItems(basketId, btn){
    var list = document.getElementById('items-' + basketId);
    if(!list) return;
    var hidden = list.classList.contains('hidden');
    if (hidden){
      list.classList.remove('hidden');
      btn.textContent = 'Ocultar itens';
    } else {
      list.classList.add('hidden');
      btn.textContent = 'Ver todos os itens';
    }
  }

  function handleQuote(btn){
    var card = btn.closest('.basket-card') || document;
    var title = card.querySelector('h3');
    var priceEl = card.querySelector('.price');
    var name = title ? title.textContent.replace('🎁 ','') : 'Cesta de Natal';
    var price = priceEl ? (' no valor de ' + priceEl.textContent) : '';
    var msg = 'Olá! Tenho interesse na ' + name + price + '. Gostaria de solicitar um orçamento. 🎄';
    var phone = '551533260763';
    var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener');
  }

  document.addEventListener('click', function(e){
    var t = e.target;
    // Clique no botão flutuante do WhatsApp (mensagem genérica)
    var waFloat = t.closest && t.closest('.whatsapp-float');
    if (waFloat){
      e.preventDefault();
      var phone = '551533260763';
      var msg = 'Olá! Gostaria de falar com a CONQUISTA sobre as cestas de Natal. Pode me ajudar? 🎄';
      var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener');
      return;
    }


    // Toggle itens
    var btnToggle = t.closest && t.closest('.toggle-items');
    if (btnToggle){
      e.preventDefault();
      var id = btnToggle.dataset.basket || btnToggle.getAttribute('data-basket');
      if (id) toggleItems(id, btnToggle);
      return;
    }

    // Solicitar orçamento
    var btnQuote = t.closest && t.closest('.btn--primary');
    if (btnQuote && /Solicitar Orçamento/i.test(btnQuote.textContent)){
      e.preventDefault();
      handleQuote(btnQuote);
      return;
    }
  }, true);
})();
