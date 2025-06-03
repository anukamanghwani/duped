// content.js (Demo Version)

// Simulate floating button + popup for demo purposes only

window.addEventListener('load', () => {
  createFloatingButton();
});

function createFloatingButton() {
  if (document.getElementById('duped-floating-button-container')) return;

  const container = document.createElement('div');
  container.id = 'duped-floating-button-container';
  container.style.position = 'fixed';
  container.style.top = '20%';
  container.style.right = '0px';
  container.style.zIndex = '10000';

  const button = document.createElement('button');
  button.id = 'duped-floating-button';
  button.textContent = 'Dupe It';
  button.style.cssText = `
    width: 80px; height: 50px; border: none;
    background-color: black; color: white;
    font-size: 16px; font-weight: bold; font-style: italic;
    border-top-left-radius: 10px; border-bottom-left-radius: 10px;
    cursor: pointer; z-index: 10001;
  `;

  button.onclick = () => {
    showDemoPopup();
  };

  container.appendChild(button);
  document.body.appendChild(container);
}

function showDemoPopup() {
  if (document.getElementById('duped-popup-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'duped-popup-overlay';
  overlay.style.cssText = `
    position: fixed; top: 10%; right: 10px; width: 350px; height: 60%;
    background: white; border: 1px solid #ddd; border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2); padding: 20px; z-index: 10002;
    overflow-y: auto;
  `;

  overlay.innerHTML = `
    <button id="duped-close-btn" style="position:absolute; top:5px; right:5px;">&times;</button>
    <h2>Duped (Demo)</h2>
    <p>This is a public demo. The full version of this extension automatically detects fashion products, scrapes pricing and image data, and finds affordable dupes across stores.</p>
    <p>To see the full version or request access, contact <strong>anukamanghwani@gmail.com</strong>.</p>
  `;

  overlay.querySelector('#duped-close-btn').addEventListener('click', () => {
    overlay.remove();
  });

  document.body.appendChild(overlay);
}
