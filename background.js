// Function to search Google Shopping with a query
async function searchGoogleLens(imageUrl) {
  const searchParams = new URLSearchParams({
    imageURL: imageUrl, // Set the key to `imageURL` exactly as the server expects
  });

  const searchUrl = `https://remembrance-leaf-20080-d4fb76b7463f.herokuapp.com/?${searchParams.toString()}`;

  try {
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();


    if (!data || !data.visual_matches || data.visual_matches.length === 0) {
      throw new Error('No visual matches returned from the API');
    }

    return data.visual_matches;
  } catch (error) {
    console.error('Error fetching Google Lens results:', error);
    throw error;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'scrapeDetails') {
    const productDetails = request.data;

    if (!productDetails.imageUrl) {
      console.error('imageUrl is missing from productDetails');
      sendResponse({ error: 'imageUrl is missing from productDetails' });
      return;
    }

    // Wrap the async code in an IIFE
    (async () => {
      try {
        // Perform Google Lens search using the image URL
        const lensResults = await searchGoogleLens(productDetails.imageUrl);

        let extractedPrice = parseFloat(productDetails.price.replace(/[^0-9.-]+/g, ""));
        if (isNaN(extractedPrice)) {
          console.warn('Price could not be extracted. Continuing search without price comparison.');
          extractedPrice = 1000000;
        }

        // Send the results back to the content script via sendResponse
        sendResponse({
          action: 'displayResults',
          data: lensResults,
          originalPrice: extractedPrice.toFixed(2),
        });
      } catch (error) {
        console.error('Error in background script:', error);
        sendResponse({ action: 'displayResults', data: [], originalPrice: 'N/A', error: error.message });
      }
    })();

    // Return true to indicate that we will send a response asynchronously
    return true;
  }
});
