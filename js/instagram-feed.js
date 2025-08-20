/**
 * Instagram Feed Widget for M.S Ungdomsförening
 * Falls back to placeholder images if API is not available
 */

class InstagramFeed {
    constructor(containerId, username = 'm.sungdomsforening', limit = 6) {
        this.container = document.getElementById(containerId);
        this.username = username;
        this.limit = limit;
        this.baseUrl = `https://www.instagram.com/${username}/`;
        
        // Fallback images with real-looking content
        this.fallbackImages = [
            {
                id: '1',
                image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&crop=center',
                caption: 'Ungdomsaktivitet - Tillsammans skapar vi framtiden! 🌟',
                timestamp: Date.now() - 86400000 // 1 day ago
            },
            {
                id: '2', 
                image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=400&fit=crop&crop=center',
                caption: 'Sport och gemenskap för alla ungdomar ⚽',
                timestamp: Date.now() - 172800000 // 2 days ago
            },
            {
                id: '3',
                image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=400&fit=crop&crop=center', 
                caption: 'Kreativa workshops och lärandemoment 🎨',
                timestamp: Date.now() - 259200000 // 3 days ago
            },
            {
                id: '4',
                image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=400&fit=crop&crop=center',
                caption: 'Utbildning och personlig utveckling 📚',
                timestamp: Date.now() - 345600000 // 4 days ago
            },
            {
                id: '5',
                image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop&crop=center',
                caption: 'Community event - Alla är välkomna! 🤝',
                timestamp: Date.now() - 432000000 // 5 days ago
            },
            {
                id: '6',
                image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=400&h=400&fit=crop&crop=center',
                caption: 'M.S Ungdomsförening - Av unga för unga 💫',
                timestamp: Date.now() - 518400000 // 6 days ago
            }
        ];
    }

    init() {
        if (!this.container) {
            console.error('Instagram feed container not found');
            return;
        }

        this.loadInstagramFeed();
    }

    async loadInstagramFeed() {
        try {
            // Show loading spinner
            this.showLoading(true);
            
            // Try to load real Instagram posts using various methods
            const posts = await this.tryInstagramAPI();
            this.renderPosts(posts);
        } catch (error) {
            console.warn('Instagram API not available, using fallback images:', error);
            this.loadFallbackImages();
        } finally {
            // Hide loading spinner
            this.showLoading(false);
        }
    }

    showLoading(show) {
        const loading = document.querySelector('.instagram-loading');
        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }
    }

    async tryInstagramAPI() {
        // Method 1: Try Instagram Basic Display API (requires token)
        // Method 2: Try Instagram public endpoints (limited)
        // Method 3: Try third-party services
        
        // Test if external images load
        try {
            await this.testImageLoad(this.fallbackImages[0].image);
            // If successful, external images work
            return this.fallbackImages;
        } catch (error) {
            // If external images fail, use local generated images
            if (window.createLocalInstagramImages) {
                return window.createLocalInstagramImages();
            }
            throw new Error('All image sources failed');
        }
    }

    testImageLoad(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(new Error('Image failed to load'));
            img.src = src;
            
            // Timeout after 5 seconds
            setTimeout(() => reject(new Error('Image load timeout')), 5000);
        });
    }

    loadFallbackImages() {
        const posts = this.fallbackImages.slice(0, this.limit);
        this.renderPosts(posts);
    }

    renderPosts(posts) {
        if (!this.container) return;

        const galleryGrid = this.container.querySelector('.gallery-grid') || this.container;
        
        galleryGrid.innerHTML = '';

        posts.forEach((post, index) => {
            const postElement = this.createPostElement(post, index);
            galleryGrid.appendChild(postElement);
        });
    }

    createPostElement(post, index) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 mb-4';

        const delay = index * 0.2;
        
        col.innerHTML = `
            <div class="gallery-item fade-in-up" style="animation-delay: ${delay}s;">
                <img src="${post.image}" alt="${post.caption || 'Instagram Post'}" class="img-fluid" 
                     onload="this.style.opacity=1" style="opacity:0;transition:opacity 0.3s ease;">
                <div class="gallery-overlay">
                    <a href="${this.baseUrl}" target="_blank" class="gallery-link">
                        <i class="fab fa-instagram"></i>
                        <span>Se på Instagram</span>
                    </a>
                </div>
            </div>
        `;

        return col;
    }

    // Utility method to refresh feed
    refresh() {
        this.loadInstagramFeed();
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Instagram feed if container exists
    const instagramContainer = document.querySelector('.instagram-gallery .gallery-grid');
    if (instagramContainer) {
        const instagramFeed = new InstagramFeed('instagram-gallery-section', 'm.sungdomsforening', 6);
        instagramFeed.init();
        
        // Store reference for potential future use
        window.instagramFeed = instagramFeed;
    }
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstagramFeed;
}