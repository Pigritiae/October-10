const queryInput = document.getElementById('query');
const searchButton = document.getElementById('search');
const mediaContainer = document.getElementById('mediaContainer');
const mediaTypeSelect = document.getElementById('mediaType');

// ⚠️ IMPORTANT: Please note that exposing a real API key directly in client-side code is a security risk.
// This is for demonstration only. Use a proxy server in a real application.
const apiKey = 'JyPTbxG1yiFodNKbx90AzXHrgqcr5pLmWFTr3rqTPhd2vaK799S4wTj1';
const perPage = 15;

searchButton.addEventListener('click', () => {
    // 💡 Correction: Use .value instead of .ariaValueMax
    const query = queryInput.value.trim(); 
    const mediaType = mediaTypeSelect.value;
    
    if (query === '') {
        alert('Please enter a search query.');
        return;
    }
    
    searchMedia(query, mediaType);
});

async function fetchPexels(url) {
    const response = await fetch(url, {
        headers: {
            Authorization: apiKey
        }
    });
    if (!response.ok) {
        throw new Error(`Pexels API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

async function searchMedia(query, mediaType) {
    try {
        mediaContainer.innerHTML = '';
        
        let foundMedia = 0;

        // --- Search Photos ---
        if (mediaType === 'photos' || mediaType === 'both') {
            const photosUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;
            const data = await fetchPexels(photosUrl);
            
            // 💡 Correction: Photo response uses data.photos
            if (data && data.photos && data.photos.length > 0) { 
                data.photos.forEach(photo => {
                    const imgElem = document.createElement('img');
                    // Use the 'small' size for display
                    imgElem.src = photo.src.small; 
                    imgElem.alt = photo.alt || 'Pexels Photo';
                    mediaContainer.appendChild(imgElem);
                    foundMedia++;
                });
            }
        }

        // --- Search Videos ---
        // 💡 Correction: Added logic for videos, which uses a different endpoint
        if (mediaType === 'videos' || mediaType === 'both') {
            const videosUrl = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;
            const data = await fetchPexels(videosUrl);

            // Video response uses data.videos
            if (data && data.videos && data.videos.length > 0) { 
                data.videos.forEach(video => {
                    const videoElem = document.createElement('video');
                    
                    // Find the high-quality video file link
                    const highQualityFile = video.video_files.find(file => file.quality === 'hd' || file.quality === 'sd');
                    
                    if (highQualityFile) {
                        videoElem.src = highQualityFile.link;
                        videoElem.controls = true;
                        videoElem.alt = video.image_id || 'Pexels Video';
                        videoElem.autoplay = false; // Prevents overwhelming bandwidth
                        videoElem.loop = true;
                        mediaContainer.appendChild(videoElem);
                        foundMedia++;
                    }
                });
            }
        }
        
        // --- Display Results Message ---
        if (foundMedia === 0) {
            mediaContainer.innerHTML = `<p>No ${mediaType.toUpperCase()} found for "${query}". Try a different term.</p>`;
        }

    } catch (error) {
        console.error('Error at Searching Media:', error);
        mediaContainer.innerHTML = '<p>An Error has Occurred when Searching Media. Please Try Again Later.</p>';
    }
}
/* Código corrigido pela IA Gemini */ 