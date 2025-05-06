const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const result = document.getElementById('result');
const ctx = wheel.getContext('2d');

// Çark dilimleri
const segments = [
    '%30 İndirimli Filtre Kahve',
    'Cheesecake %50 İndirimli',
    '1 Soğuk İçecek Bizden',
    'Bugün Şansın Yok 😅',
    'Tatlı + Kahve Kombo %20 İndirim',
    'Tekrar Dene!',
    'Kurabiye Hediye',
    'Arkadaşına da Kazandır!'
];

// Soft renkler
const colors = [
    '#2C3E50', // Koyu mavi
    '#34495E', // Lacivert
    '#2980B9', // Mavi
    '#16A085', // Turkuaz
    '#27AE60', // Yeşil
    '#8E44AD', // Mor
    '#2C3E50', // Koyu mavi
    '#34495E'  // Lacivert
];

let currentRotation = 0;
let isSpinning = false;

// 3D gölge efekti
function drawShadow(x, y, radius) {
    const gradient = ctx.createRadialGradient(x, y, radius * 0.8, x, y, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Metni çiz
function drawText(text, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Metin için arka plan
    const textWidth = ctx.measureText(text).width;
    const padding = 10;
    
    // Metin arka planı için gradient
    const gradient = ctx.createLinearGradient(-textWidth/2, -15, textWidth/2, 15);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-textWidth/2 - padding, -15, textWidth + padding*2, 30);
    
    // Metin gölgesi
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Metin
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(text, 0, 0);
    
    ctx.restore();
}

// Çarkı çiz
function drawWheel() {
    const centerX = wheel.width / 2;
    const centerY = wheel.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const segmentAngle = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, wheel.width, wheel.height);

    // Çark gölgesi
    drawShadow(centerX, centerY, radius + 5);

    // Dış çerçeve
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dilimleri çiz
    for (let i = 0; i < segments.length; i++) {
        const startAngle = i * segmentAngle + currentRotation;
        const endAngle = startAngle + segmentAngle;

        // Dilim
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        // Dilim gradient
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, colors[i]);
        gradient.addColorStop(1, adjustColor(colors[i], -20));
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Dilim kenarı
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Metni çiz
        const textAngle = startAngle + segmentAngle / 2;
        const textRadius = radius * 0.6; // Metni biraz daha içeri al
        const textX = centerX + Math.cos(textAngle) * textRadius;
        const textY = centerY + Math.sin(textAngle) * textRadius;
        
        // Metni yatay tutmak için açıyı ayarla
        const textRotation = textAngle + Math.PI/2;
        drawText(segments[i], textX, textY, textRotation);
    }

    // Merkez noktası
    const centerGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 15
    );
    centerGradient.addColorStop(0, '#fff');
    centerGradient.addColorStop(1, '#ccc');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Renk koyulaştırma fonksiyonu
function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
}

// Çarkı döndür
function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    result.textContent = '';

    const spinAngle = 3600 + Math.random() * 360; // En az 10 tam tur
    const spinDuration = 6000; // 6 saniye
    const startTime = performance.now();
    const startRotation = currentRotation;

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Gelişmiş easing fonksiyonu
        const easeOut = (t) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };
        
        currentRotation = startRotation + (spinAngle * Math.PI / 180) * easeOut(progress);
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            
            // Kazanan dilimi hesapla
            const normalizedRotation = currentRotation % (2 * Math.PI);
            const segmentAngle = (2 * Math.PI) / segments.length;
            const winningIndex = Math.floor(((2 * Math.PI - normalizedRotation) % (2 * Math.PI)) / segmentAngle);
            
            // Sonuç animasyonu
            result.style.opacity = '0';
            setTimeout(() => {
                result.textContent = `Tebrikler! ${segments[winningIndex]}`;
                result.style.opacity = '1';
            }, 100);
        }
    }

    requestAnimationFrame(animate);
}

// Event listener
spinBtn.addEventListener('click', spinWheel);

// İlk çizim
drawWheel(); 