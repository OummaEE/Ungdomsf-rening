/**
 * Instagram Fallback - Local images backup
 * Used when external images fail to load
 */

// Create placeholder images with organization colors
function createLocalInstagramImages() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const images = [
        {
            id: '1',
            text: 'M.S\nUngdoms-\nförening',
            bgColor: '#D4AF37',
            textColor: '#000',
            caption: 'Ungdomsaktivitet - Tillsammans skapar vi framtiden! 🌟'
        },
        {
            id: '2',
            text: 'Sport &\nGemenskap',
            bgColor: '#FFD700', 
            textColor: '#000',
            caption: 'Sport och gemenskap för alla ungdomar ⚽'
        },
        {
            id: '3',
            text: 'Kreativa\nWorkshops',
            bgColor: '#B8860B',
            textColor: '#FFF',
            caption: 'Kreativa workshops och lärandemoment 🎨'
        },
        {
            id: '4',
            text: 'Utbildning\n&\nDevelopment',
            bgColor: '#D4AF37',
            textColor: '#000',
            caption: 'Utbildning och personlig utveckling 📚'
        },
        {
            id: '5',
            text: 'Community\nEvents',
            bgColor: '#DAA520',
            textColor: '#000',
            caption: 'Community event - Alla är välkomna! 🤝'
        },
        {
            id: '6',
            text: 'Av unga\nför unga',
            bgColor: '#FFD700',
            textColor: '#000',
            caption: 'M.S Ungdomsförening - Av unga för unga 💫'
        }
    ];

    return images.map(img => {
        // Clear canvas
        ctx.fillStyle = img.bgColor;
        ctx.fillRect(0, 0, 400, 400);
        
        // Add text
        ctx.fillStyle = img.textColor;
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const lines = img.text.split('\n');
        lines.forEach((line, index) => {
            const y = 200 + (index - (lines.length - 1) / 2) * 50;
            ctx.fillText(line, 200, y);
        });
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        return {
            id: img.id,
            image: dataUrl,
            caption: img.caption,
            timestamp: Date.now() - (parseInt(img.id) * 86400000)
        };
    });
}

// Export for use in instagram-feed.js
window.createLocalInstagramImages = createLocalInstagramImages;