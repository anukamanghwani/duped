
scrapeProductDetails().then((success) => {
  if (success) {
    createFloatingButton();
  } else {
  }
});

function createFloatingButton() {
  if (document.getElementById('duped-floating-button-container')) {
    return;
  }

  // Create container for the shadow DOM
  const container = document.createElement('div');
  container.id = 'duped-floating-button-container';
  container.style.position = 'fixed';
  container.style.top = '20%';
  container.style.right = '0px';
  container.style.zIndex = '10000';

  const shadowRoot = container.attachShadow({ mode: 'open' });

  // Create button in shadow DOM
  const button = document.createElement('button');
  button.id = 'duped-floating-button';
  button.className = 'duped-floating-button';
  button.textContent = 'd';

  const style = document.createElement('style');
  style.innerHTML = `
    #duped-floating-button {
      position: fixed !important;
      top: 20% !important;
      right: 0 !important;
      width: 80px !important;
      height: 50px !important;
      border: none !important;
      background-color: black !important;
      color: white !important;
      font-size: 40px !important;
      font-weight: bold !important;
      font-family: "Times New Roman", Georgia, serif !important;
      font-style: italic !important;
      text-align: left !important;
      padding-left: 10px !important;
      display: flex !important;
      justify-content: flex-start !important;
      align-items: center !important;
      cursor: pointer !important;
      border-top-left-radius: 10px !important;
      border-bottom-left-radius: 10px !important;
      animation: duped-slideIn 1s ease-out forwards !important;
      z-index: 10001 !important;
    }

    #duped-floating-button::after {
      content: "● ●\\A ● ●\\A ● ●";
      font-size: 6px;
      color: #555555;
      margin-left: auto;
      padding-right: 10px;
      line-height: 1.2;
      white-space: pre;
    }

    @keyframes duped-slideIn {
      0% { right: -100px; opacity: 0; }
      100% { right: 0px; opacity: 1; }
    }
  `;

  shadowRoot.appendChild(style);
  shadowRoot.appendChild(button);
  document.body.appendChild(container);

  button.addEventListener('click', () => {
   // console.log("Floating button clicked. Sending request to API...");
    sendScrapedDataToAPI();
    showSignUpOrWelcome();
  });
}

function createPopup(showSignUpForm) {
 // console.log('createPopup called with showSignUpForm:', showSignUpForm);
  if (document.getElementById('duped-popup-overlay')) {
   // console.log("Popup overlay already exists, skipping creation.");
    return;
  }

 // console.log("Creating popup overlay...");
  const overlay = document.createElement('div');
  overlay.id = 'duped-popup-overlay';
  overlay.className = 'duped-popup-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '5%';
  overlay.style.right = '0';
  overlay.style.width = '430px';
  overlay.style.height = '80%';
  overlay.style.boxSizing = 'border-box';
  overlay.style.borderRadius = "8px";
  overlay.style.backgroundColor = 'white';
  overlay.style.zIndex = '10001';
  overlay.style.border = '1px solid #ddd';
  overlay.style.padding = '20px';
  overlay.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
  overlay.style.overflowY = 'auto';
  overlay.style.pointerEvents = 'all';

  const shadowRoot = overlay.attachShadow({ mode: 'open' });

  const closeButton = document.createElement('button');
  closeButton.id = 'duped-close-button';
  closeButton.className = 'duped-close-button';
  closeButton.textContent = '✖';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.border = 'none';
  closeButton.style.background = 'transparent';
  closeButton.style.fontSize = '20px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.zIndex = '10002';
  shadowRoot.appendChild(closeButton);

  closeButton.addEventListener('click', () => {
   //("Close button clicked, removing popup overlay.");
    overlay.remove();
  });

  const content = document.createElement('div');
  content.id = 'duped-popup-content';
  content.style.pointerEvents = 'all';

  if (showSignUpForm) {
  //  console.log("Displaying sign-up form...");
    const form = document.createElement('form');
    form.innerHTML = `
      <div class="duped-custom-heading">Welcome to Duped!</div>
      <h2>Look Great, Spend Smart – Dupe It Before You Buy It</h2>

      <div class="duped-how-it-works">
          <strong>How It Works:</strong>
          <p>Click the <strong>'Dupe It'</strong> button on the side of the screen when you find an item you'd like to 'dupe.' We'll search for affordable alternatives, so you can shop smarter!</p>
      </div>

      <label for="duped-name">Name:</label>
      <input type="text" id="duped-name" name="name" placeholder="Enter your name" required>
      
      <label for="duped-email">Email:</label>
      <input type="email" id="duped-email" name="email" placeholder="Enter your email" required>
      
      <button type="submit">Sign Up</button>

      <p class="duped-note">Note: The pop-up may close after signing up. Just click again to start finding dupes!</p>
    `;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = shadowRoot.getElementById('duped-name').value;
      const email = shadowRoot.getElementById('duped-email').value;
    //  console.log("Sign-up form submitted, sending user details...");
      sendUserDetails(name, email);
      overlay.remove();
    
      chrome.storage.local.set({ 'hasSignedUp': true, 'userName': name }, () => {
      //  console.log("Sign-up status saved.");
        showResultsPopup(content);
        const spinner = shadowRoot.getElementById('duped-spinner');
        if (spinner) {
          spinner.style.display = 'none';
        }
      });
    });
    
    content.appendChild(form);
  } else {
  //  console.log("Displaying results popup...");
    content.innerHTML = `
      <h1>duped</h1>
      <h2>Look Great, Spend Smart - Similar Matches Just for You</h2>
      <hr style="width: 60%; margin: 20px auto; border: 0.5px solid #ddd;">
      <div id="duped-spinner"></div>
      <div id="duped-results"></div>
    `;
    showResultsPopup(content);
  }

  shadowRoot.appendChild(content);
  document.body.appendChild(overlay);

  const style = document.createElement('style');
  style.textContent = `
    #duped-popup-overlay {
      font-family: "Times New Roman", Times, serif;
      position: fixed;
      top: 5%;
      right: 0;
      width: 430px;
      height: 80%;
      box-sizing: border-box;
      background-color: #F3F3F3;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      z-index: 10001;
      overflow-y: auto;
      pointer-events: all;
    }

    h1 {
      font-family: "Times New Roman", Times, serif;
      text-align: center;
      font-size: 28px;
      color: black;
      margin-top: 5px;
      margin-bottom: 10px;
      text-transform: lowercase !important;
    }
    h2 {
      font-size: 12px;
      font-weight: normal;
      color: #555;
      text-align: center;
      line-height: 1.5;
      letter-spacing: 1px;
    }
    #duped-spinner {
    border: 4px solid rgba(243, 243, 243, 0.3);
      border-top: 4px solid #000;
      border-radius: 50%;
      margin: 20px auto;
      width: 20px;
      height: 20px;
      animation: duped-spin 0.75s linear infinite;
      display: block;
    }
    @keyframes duped-spin {
     0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    #duped-results {
      margin-top: 15px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .duped-result-item {
    background-color: #FFF;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
      text-align: center;
    }
    .duped-result-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    }
    .duped-result-item img {
     width: 100%;
      max-width: 125px;
      height: auto;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .duped-price-container {
      display: flex;
      justify-content: center;
      align-items: baseline;
      gap: 4px;
    }
    .duped-current-price {
      font-size: 1.25em;
      font-weight: bold;
      color: black;
    }
    .duped-original-price {
     font-size: 0.9em;
      color: #aaa;
      text-decoration: line-through;
    }
    .duped-result-info h3 {
      margin: 8px 0 4px;
      font-size: 13px;
      color: black;
      text-decoration: underline;
      transition: color 0.2s;
    }
    .duped-result-info h3:hover {
      color: #007BFF;
    }
    .duped-result-info a {
      display: inline-block;
      margin-top: 4px;
      color: #007BFF;
      text-decoration: none;
      font-size: 12px;
    }
    .duped-result-info a:hover {
      text-decoration: underline;
    }


  .duped-second-hand-label {
  font-size: 0.8em;
  color: #3CB371; /* This is the green color */
  margin-top: 2px;
  text-align: center;
}


    .duped-custom-heading {
     font-size: 28px;
      color: #222;
      margin-bottom: 10px;
      text-align: center;
    }

    .duped-how-it-works {
      background-color: #f0f0f0;
      padding: 15px;
      border-left: 4px solid #ccc;
      border-radius: 5px;
      text-align: left;
      color: #333;
      font-size: 0.9em;
      margin-bottom: 15px;
      margin-top: 15px;
    }

    label {
     display: block;
      text-align: left;
      margin: 15px 0 5px;
      color: #444;
      font-size: 0.9em;
    }

    input[type="text"],
    input[type="email"] {
      width: 100%;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 1em;
      transition: all 0.3s;
    }

    input[type="text"]:focus,
    input[type="email"]:focus {
      border-color: #999;
      box-shadow: 0 0 8px rgba(100, 100, 100, 0.1);
      outline: none;
    }

    button[type="submit"] {
      font-family: "Times New Roman", Times, serif;
      margin-top: 20px;
      padding: 12px;
      width: 100%;
      background-color: #333;
      color: white;
      font-size: 1.1em;
      font-weight: bold;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s, box-shadow 0.3s;
    }

    button[type="submit"]:hover {
      background-color: black;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    }

    .duped-note {
      margin-top: 15px;
      font-size: 0.85em;
      color: #888;
      line-height: 1.4;
    }
  `;
  shadowRoot.appendChild(style);
}


function showSignUpOrWelcome() {
 // console.log('showSignUpOrWelcome called');
  chrome.storage.local.get('hasSignedUp', (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error accessing chrome.storage:', chrome.runtime.lastError);
      return;
    }
  //  console.log('chrome.storage.local.get result:', result);
    const hasSignedUp = result.hasSignedUp;
   // console.log('hasSignedUp:', hasSignedUp);
    if (!hasSignedUp) {
    //  console.log('User has not signed up, showing sign-up form');
      createPopup(true);
    } else {
     // console.log('User has signed up, showing results');
      createPopup(false);
    }
  });
}

function sendUserDetails(name, email) {
  fetch('https://whispering-river-10160-f4c365d94623.herokuapp.com/saveUserDetails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email })
  })
  .then(response => response.text())
  .then(data => {
   // console.log(data);
    localStorage.setItem('userName', name);
  })
  .catch(error => console.error('Error:', error));
}




async function scrapeProductDetails() {
 // console.log("Scraping product details...");
  // Define selectors for price and image
  const priceSelectors = [
    'span.price-sales', // Aritzia
    'span[itemprop="price"]',
    'div.pdp-pricing.pdp-mfe-1jiw3ble',
    '.product-price-text.product-price-font-size',
    '.price-standard.strike.dib span',
    '.price-item.price-item--sale',
    '.rec-swiper__slide__text-price--regular',
    '.fs-hover-product-price',
    '.c-pwa-product-price__current',
    'span.qHz0a.EhCiu.dls-ihm460',
    'span.paok-offscreen',
    'div.price__sales span.price--formatted',
    '[data-test-id="product-pricing-list-sale-range-amount"]',
    '[data-test-id="sale-or-our-price-amount"]'
  ];

  const imageUrlSelectors = [
    'img[alt="select to zoom prod image"]', // Hollister & Abercrombie
    'img[alt="Product 0"]', // Hollister & Abercrombie Phone View
    'img.o-pwa-image__img.c-pwa-image-viewer__img[width="600"][height="900"]', // Free People & Urban Outfitters Phone View
    'img.o-pwa-image__img[width="200"][height="300"]', // Free People & Urban Outfitters Computer View
    'img[width="576"][height="865"]', // Brandy Melville
    'img.w-100.lazy.ar-product-detail__product-image', // Aritzia
    'img' // Nordstrom
  ];

  // Get details
  const productDetails = {
    price: getElementText(priceSelectors),
    imageUrl: getElementSrc(imageUrlSelectors) // Extract the image URL
  };


  // Return true if both price and image are found
  const success = !!(productDetails.price && productDetails.imageUrl);
  return success ? productDetails : null;
}

async function sendScrapedDataToAPI() {
  const productDetails = await scrapeProductDetails();
  if (!productDetails) {
    console.error("Failed to scrape product details, cannot send data to API.");
    return;
  }

  chrome.runtime.sendMessage(
    { action: 'scrapeDetails', data: productDetails },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error communicating with background script:', chrome.runtime.lastError);
        return;
      }
      
      if (response && response.error) {
        console.error('Error in background script response:', response.error);
      } else if (response && response.data && response.originalPrice) {
        displayResultsInOverlay(response.data, response.originalPrice);
      } else {
        console.error('Unexpected response format:', response);
      }
    }
  );
  
}

function getElementText(selectors) {
  for (let selector of selectors) {
    let element = document.querySelector(selector);
    if (element && element.innerText) {
      return element.innerText.trim(); // Trim whitespace
    }
  }
  return '';
}

function getElementSrc(selectors) {
  for (let selector of selectors) {
    let element = document.querySelector(selector);
    if (element) {
      if (element.src) {
        return element.src;
      } else {
      }
    } else {
    }
  }
  return '';
}

function displayWelcomeMessage(name, container) {
  container.innerHTML = `<h1>Welcome, ${name}!</h1>`;
}

function showResultsPopup(container) {
  if (!container) {
    container = document.getElementById('duped-popup-content');
  }

  container.innerHTML += `
    <hr style="width: 60%; margin: 20px auto; border: 0.5px solid #ddd;">
    <h2>Join the community! Follow @dupedchromextension on Instagram</h2>
  `;

}

function displayResultsInOverlay(results, originalPrice) {
  
  // Get the overlay element
  const overlay = document.getElementById('duped-popup-overlay');
  if (!overlay) {
    console.error('Overlay not found');
    return;
  }
  
  // Access the shadow root
  const shadowRoot = overlay.shadowRoot;
  if (!shadowRoot) {
    console.error('Shadow root not found');
    return;
  }
  
  // Hide the spinner
  const spinner = shadowRoot.getElementById('duped-spinner');
  if (spinner) {
    spinner.style.display = 'none';
  }

  // Get the results container inside the shadow root
  const resultsDiv = shadowRoot.getElementById('duped-results');
  if (!resultsDiv) {
    console.error('Results div not found');
    return;
  }
  
  resultsDiv.innerHTML = ''; // Clear previous results
  
  if (!results || results.length === 0) {
    resultsDiv.innerHTML = '<p>No results found.</p>';
    return;
  }

  // Convert original price to a number for comparison
  const originalPriceNumber = parseFloat(originalPrice.replace(/[^0-9.-]+/g, ""));
  if (isNaN(originalPriceNumber)) {
    console.error('Original price is not a valid number:', originalPrice);
  }

  // Filter the results based on your criteria
  const filteredResults = results.filter((result) => {
    let priceValue = null;
    if (result.price) {
      if (typeof result.price === 'string') {
        priceValue = result.price;
      } else if (typeof result.price.value === 'string') {
        priceValue = result.price.value;
      }
    }

    if (!priceValue) {
      return false;
    }

    const priceNumber = parseFloat(priceValue.replace(/[^0-9.-]+/g, ""));
    if (isNaN(priceNumber)) {
      return false;
    }

    const inStock = result.in_stock !== undefined ? result.in_stock : true;

    return inStock && priceNumber < originalPriceNumber;
  });

  if (filteredResults.length === 0) {
    resultsDiv.innerHTML = '<p>No results found matching your criteria.</p>';
    return;
  }

  filteredResults.forEach((result) => {
   // console.log('Processing result:', result);
    const resultItem = document.createElement('div');
    resultItem.classList.add('duped-result-item');

    const priceValue = (result.price && result.price.value) ? result.price.value : (result.price || 'N/A');
    const formattedPrice = priceValue.replace('*', '');

    const thumbnail = result.thumbnail || result.imageUrl || '';
    const title = result.source || 'No Title';
    const link = result.link || result.productUrl || '';

    const secondHandStores = ["Poshmark", "Depop", "ThredUp", "The RealReal", "eBay"];
    const titleContent = `
      <h3>${title}</h3>
      ${secondHandStores.includes(title) ? '<p class="duped-second-hand-label">♻️ Second-Hand</p>' : ""}
    `;

    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link;
      anchor.target = '_blank';
      anchor.style.textDecoration = 'none';
      anchor.style.color = 'inherit';

      anchor.innerHTML = `
        <img src="${thumbnail}" alt="${title}">
        <div class="duped-result-info">
          <div class="duped-price-container">
            <p class="duped-current-price">${formattedPrice}</p>
            <p class="duped-original-price">$${originalPrice}</p>
          </div>
          ${titleContent}
        </div>
      `;

      resultItem.appendChild(anchor);
    } else {
      resultItem.innerHTML = `
        <img src="${thumbnail}" alt="${title}">
        <div class="result-info">
          <div class="price-container">
            <p class="current-price">${formattedPrice}</p>
            <p class="original-price">$${originalPrice}</p>
          </div>
          ${titleContent}
        </div>
      `;
    }

    resultsDiv.appendChild(resultItem);
  });
}


