(function () {
  var a = document.getElementById('bgMusic');
  if (!a) return;
  a.volume = 0.5;

  function tryPlayUnmuted() {
    if (!(a.dataset && a.dataset.userMuted === 'true')) { a.muted = false; }
    return a.play();
  }

  function armFirstGesturePlay() {
    function unlock() {
      if (!(a.dataset && a.dataset.userMuted === 'true')) { a.muted = false; }
      a.play().catch(function(){});
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    }
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  tryPlayUnmuted().catch(function () {
    if (!(a.dataset && a.dataset.userMuted === 'true')) { a.muted = true; }
    a.play().then(function () {
      armFirstGesturePlay();
    }).catch(function () {
      armFirstGesturePlay();
    });
  });
})();