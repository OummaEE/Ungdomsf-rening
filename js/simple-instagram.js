/**
 * Simple Instagram Gallery - No external dependencies
 * Displays fallback images immediately without complex loading
 */

(function() {
    'use strict';
    
    // Instagram-style images with better content
    const instagramPosts = [
        {
            image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&crop=center',
            alt: 'Ungdomsaktivitet',
            caption: 'Tillsammans skapar vi framtiden! 🌟'
        },
        {
            image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=400&fit=crop&crop=center',
            alt: 'Sport och gemenskap',
            caption: 'Sport och gemenskap för alla ⚽'
        },
        {
            image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=400&fit=crop&crop=center',
            alt: 'Kreativa workshops',
            caption: 'Kreativa workshops 🎨'
        },
        {
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=400&fit=crop&crop=center',
            alt: 'Utbildning',
            caption: 'Utbildning och utveckling 📚'
        },
        {
            image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop&crop=center',
            alt: 'Community event',
            caption: 'Community events 🤝'
        },
        {
            image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=400&h=400&fit=crop&crop=center',
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
                         onerror="this.src='https://via.placeholder.com/400x400/D4AF37/000000?text=${encodeURIComponent(post.alt)}'"
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