/**
 * Create local canvas-based images for Instagram gallery
 * Used as ultimate fallback when all external services fail
 */

function createCanvasImages() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const designs = [
        {
            bgColor: '#D4AF37',
            textColor: '#000',
            text: ['M.S', 'Ungdoms-', 'förening'],
            subtitle: '🌟'
        },
        {
            bgColor: '#FFD700', 
            textColor: '#000',
            text: ['Sport &', 'Gemenskap'],
            subtitle: '⚽'
        },
        {
            bgColor: '#B8860B',
            textColor: '#FFF',
            text: ['Kreativa', 'Workshops'],
            subtitle: '🎨'
        },
        {
            bgColor: '#DAA520',
            textColor: '#000',
            text: ['Utbildning', '& Utveckling'],
            subtitle: '📚'
        },
        {
            bgColor: '#CD853F',
            textColor: '#FFF',
            text: ['Community', 'Events'],
            subtitle: '🤝'
        },
        {
            bgColor: '#FFD700',
            textColor: '#000',
            text: ['Av unga', 'för unga'],
            subtitle: '💫'
        }
    ];

    return designs.map((design, index) => {
        // Clear and fill background
        ctx.fillStyle = design.bgColor;
        ctx.fillRect(0, 0, 400, 400);
        
        // Add gradient overlay
        const gradient = ctx.createLinearGradient(0, 0, 400, 400);
        gradient.addColorStop(0, 'rgba(0,0,0,0.1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 400);
        
        // Add main text
        ctx.fillStyle = design.textColor;
        ctx.font = 'bold 42px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        design.text.forEach((line, lineIndex) => {
            const y = 160 + (lineIndex - (design.text.length - 1) / 2) * 50;
            ctx.fillText(line, 200, y);
        });
        
        // Add subtitle/emoji
        ctx.font = '48px Arial, sans-serif';
        ctx.fillText(design.subtitle, 200, 280);
        
        // Add border
        ctx.strokeStyle = design.textColor;
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, 360, 360);
        
        return canvas.toDataURL('image/png');
    });
}

// Export function
window.createCanvasImages = createCanvasImages;