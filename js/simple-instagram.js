/**
 * Simple Instagram Gallery - No external dependencies
 * Displays fallback images immediately without complex loading
 */

(function() {
    'use strict';
    
    // Instagram-style images - using reliable placeholder service
    const instagramPosts = [
        {
            image: 'https://picsum.photos/400/400?random=1',
            alt: 'Ungdomsaktivitet',
            caption: 'Tillsammans skapar vi framtiden! 🌟'
        },
        {
            image: 'https://picsum.photos/400/400?random=2',
            alt: 'Sport och gemenskap',
            caption: 'Sport och gemenskap för alla ⚽'
        },
        {
            image: 'https://picsum.photos/400/400?random=3',
            alt: 'Kreativa workshops',
            caption: 'Kreativa workshops 🎨'
        },
        {
            image: 'https://picsum.photos/400/400?random=4',
            alt: 'Utbildning',
            caption: 'Utbildning och utveckling 📚'
        },
        {
            image: 'https://picsum.photos/400/400?random=5',
            alt: 'Community event',
            caption: 'Community events 🤝'
        },
        {
            image: 'https://picsum.photos/400/400?random=6',
            alt: 'Av unga för unga',
            caption: 'Av unga för unga 💫'
        }
    ];

    function createInstagramGallery() {
        const galleryGrid = document.querySelector('.gallery-grid');
        const loadingDiv = document.querySelector('.instagram-loading');
        
        if (!galleryGrid) {
            console.log('Gallery grid not found');
            return;
        }
        
        // Hide loading
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
        
        // Clear existing content
        galleryGrid.innerHTML = '';
        
        // Create posts
        instagramPosts.forEach((post, index) => {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6 mb-4';
            
            const delay = index * 0.2;
            
            col.innerHTML = `
                <div class="gallery-item fade-in-up" style="animation-delay: ${delay}s;">
                    <img src="${post.image}" alt="${post.alt}" class="img-fluid" 
                         onerror="this.onerror=null; if(window.createCanvasImages) { const imgs=window.createCanvasImages(); this.src=imgs[${index}] || 'https://via.placeholder.com/400x400/D4AF37/000000?text=${encodeURIComponent(post.alt)}'; } else { this.src='https://via.placeholder.com/400x400/D4AF37/000000?text=${encodeURIComponent(post.alt)}'; }"
                         onload="this.style.opacity=1" 
                         style="opacity:0;transition:opacity 0.5s ease;">
                    <div class="gallery-overlay">
                        <a href="https://www.instagram.com/m.sungdomsforening/" target="_blank" class="gallery-link">
                            <i class="fab fa-instagram"></i>
                            <span>Se på Instagram</span>
                        </a>
                    </div>
                </div>
            `;
            
            galleryGrid.appendChild(col);
        });
        
        console.log('Instagram gallery loaded successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createInstagramGallery);
    } else {
        createInstagramGallery();
    }
    
    // Fallback - try again after a short delay
    setTimeout(createInstagramGallery, 1000);
    
})();