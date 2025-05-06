class WheelGame {
    constructor() {
        this.canvas = document.getElementById('wheel');
        this.ctx = this.canvas.getContext('2d');
        this.spinBtn = document.getElementById('spin-btn');
        this.resultDisplay = document.getElementById('result');
        this.dateDisplay = document.getElementById('currentDateTime');
        
        this.prizes = [
            { text: '%30 İndirimli\nFiltre Kahve', color: '#FF5252' },
            { text: 'Cheesecake\n%50 İndirimli', color: '#448AFF' },
            { text: '1 Soğuk İçecek\nBizden', color: '#7C4DFF' },
            { text: 'Bugün\nŞansın Yok 😅', color: '#FF4081' },
            { text: 'Tatlı + Kahve\n%20 İndirim', color: '#40C4FF' },
            { text: 'Tekrar\nDene!', color: '#64FFDA' },
            { text: 'Kurabiye\nHediye', color: '#FF6E40' },
            { text: 'Arkadaşına da\nKazandır!', color: '#69F0AE' }
        ];

        this.currentRotation = 0;
        this.isSpinning = false;
        this.sliceAngle = (Math.PI * 2) / this.prizes.length;
        
        this.updateDateTime();
        this.init();
        this.setupEventListeners();
    }

    updateDateTime() {
        const now = new Date();
        this.dateDisplay.textContent = now.toISOString().slice(0, 19).replace('T', ' ');
    }

    init() {
        const size = Math.min(
            this.canvas.parentElement.offsetWidth,
            this.canvas.parentElement.offsetHeight
        );
        this.canvas.width = size;
        this.canvas.height = size;
        this.drawWheel();
    }

    drawWheel() {
        const ctx = this.ctx;
        const center = this.canvas.width / 2;
        const radius = center - 10;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dış çerçeve
        ctx.beginPath();
        ctx.arc(center, center, radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff20';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Dilimler
        this.prizes.forEach((prize, i) => {
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(
                center, center, radius,
                i * this.sliceAngle - Math.PI / 2,
                (i + 1) * this.sliceAngle - Math.PI / 2
            );
            ctx.lineTo(center, center);
            ctx.fillStyle = prize.color;
            ctx.fill();
            
            ctx.strokeStyle = '#ffffff40';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Metinler
        ctx.save();
        ctx.translate(center, center);

        this.prizes.forEach((prize, i) => {
            ctx.save();
            
            const angle = (i * this.sliceAngle) + (this.sliceAngle / 2) - Math.PI / 2;
            ctx.rotate(angle);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 16px Poppins';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.strokeStyle = '#00000080';
            ctx.lineWidth = 4;
            
            const lines = prize.text.split('\n');
            const lineHeight = 25;
            const totalHeight = (lines.length - 1) * lineHeight;
            
            lines.forEach((line, j) => {
                const y = (j * lineHeight) - (totalHeight / 2);
                const x = radius * 0.65;
                
                ctx.strokeText(line, x, y);
                ctx.fillText(line, x, y);
            });
            
            ctx.restore();
        });

        ctx.restore();
    }

    spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.resultDisplay.classList.remove('show');
        
        const prizeIndex = Math.floor(Math.random() * this.prizes.length);
        const extraSpins = 5 + Math.floor(Math.random() * 5);
        const targetAngle = extraSpins * 360 + (prizeIndex * (360 / this.prizes.length));
        const finalRotation = targetAngle + 90; // 90 derece offset işaretçi için
        
        this.currentRotation += finalRotation;
        this.canvas.style.transform = `rotate(${this.currentRotation}deg)`;

        setTimeout(() => {
            this.isSpinning = false;
            this.spinBtn.disabled = false;
            const prizeText = this.prizes[prizeIndex].text.replace('\n', ' ');
            this.resultDisplay.textContent = `🎉 ${prizeText}`;
            this.resultDisplay.classList.add('show');
        }, 4000);
    }

    setupEventListeners() {
        this.spinBtn.addEventListener('click', () => this.spin());
        
        window.addEventListener('resize', () => {
            requestAnimationFrame(() => this.init());
        });
        
        // Her dakika tarih/saat güncelleme
        setInterval(() => this.updateDateTime(), 60000);
    }
}

// Oyunu başlat
document.addEventListener('DOMContentLoaded', () => {
    new WheelGame();
});