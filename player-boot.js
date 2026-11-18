/* Shared cinematic transition for genuine console boot; never simulate gameplay.
   The real EmulatorJS iframe is created immediately underneath the overlay. */
export function attachBootOverlay(viewport, system, title) {
  viewport.classList.remove('boot-complete');
  viewport.querySelectorAll('.player-boot-overlay').forEach(node=>node.remove());
  const overlay=document.createElement('div');
  overlay.className='player-boot-overlay';
  const label=document.createElement('small');
  label.textContent='UGN EMULATOR // '+String(system||'CONSOLE').toUpperCase();
  const titleNode=document.createElement('strong');
  titleNode.textContent=String(title||'GAME')+' — BOOTING';
  const subtitle=document.createElement('small');
  subtitle.textContent='INITIALIZING AUTHENTIC EMULATION CORE';
  overlay.append(label,titleNode,subtitle);
  viewport.append(overlay);
  // Do not obscure an emulator loading screen indefinitely on a slow connection.
  const timer=setTimeout(()=>viewport.classList.add('boot-complete'),16000);
  return () => {
    clearTimeout(timer);
    viewport.classList.add('boot-complete');
  };
}
