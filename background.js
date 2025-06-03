// background.js (Public Demo Version)

// This function would normally query a reverse image search API (e.g., Google Lens)
// and return a list of visually similar products.
async function searchGoogleLens(imageUrl) {
  // Placeholder: logic removed for demo purposes
  return [
    {
      title: "Similar Product 1",
      price: "$49.99",
      link: "https://example.com/product1",
    },
    {
      title: "Similar Product 2",
      price: "$39.99",
      link: "https://example.com/product2",
    },
  ];
}

// Listener for content script messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeDetails') {
    const productDetails = request.data;

    if (!productDetails.imageUrl) {
      sendResponse({ error: 'Missing imageUrl' });
      return;
    }

    // Simulated async response with fake data
    (async () => {
      try {
        const lensResults = await searchGoogleLens(productDetails.imageUrl);
        sendResponse({
          action: 'displayResults',
          data: lensResults,
          originalPrice: "N/A", // original price handling removed for demo
        });
      } catch (error) {
        sendResponse({
          action: 'displayResults',
          data: [],
          originalPrice: 'N/A',
          error: 'Demo mode only',
        });
      }
    })();

    return true;
  }
});
