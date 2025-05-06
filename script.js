class WheelGame {
    constructor() {
        this.canvas = document.getElementById('wheel');
        this.ctx = this.canvas.getContext('2d');
        this.spinBtn = document.getElementById('spin-btn');
        this.resultDisplay = document.getElementById('result');
        
        // Kullanıcı bilgileri
        this.userName = document.getElementById('userName');
        this.dateTimeDisplay = document.getElementById('currentDateTime');
        
        this.prizes = [
            { text: 'Kurabiye\nHediye', color: '#FF6B6B' },
            { text: 'Arkadaşına da\nKazandır!', color: '#4ECDC4' },
            { text: '%30 İndirimli\nFiltre Kahve', color: '#45B7D1' },
            { text: 'Cheesecake\n%50 İndirimli', color: '#96CEB4' },
            { text: '1 Soğuk İçecek\nBizden', color: '#FFEEAD' },
            { text: 'Bugün\nŞansın Yok 😅', color: '#D4A5A5' },
            { text: 'Tatlı + Kahve\n%20 İndirim', color: '#9AC1D9' },
            { text: 'Tekrar\nDene!', color: '#FFD93D' }
        ];

        this.currentRotation = 0;
        this.isSpinning = false;
        this.sliceAngle = (Math.PI * 2) / this.prizes.length;
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.setupCanvas();
        this.drawWheel();
    }

    setupCanvas() {
        const size = Math.min(
            this.canvas.parentElement.offsetWidth,
            this.canvas.parentElement.offsetHeight
        );
        this.canvas.width = size;
        this.canvas.height = size;
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
            const startAngle = (i * this.sliceAngle) - Math.PI / 2;
            const endAngle = ((i + 1) * this.sliceAngle) - Math.PI / 2;

            // Dilim çizimi
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.lineTo(center, center);
            ctx.fillStyle = prize.color;
            ctx.fill();
            
            // Dilim kenarı
            ctx.strokeStyle = '#ffffff40';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Text
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(startAngle + this.sliceAngle / 2);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 16px Poppins';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Text outline
            ctx.strokeStyle = '#00000080';
            ctx.lineWidth = 3;
            
            const lines = prize.text.split('\n');
            const lineHeight = 25;
            const textRadius = radius * 0.65;
            
            lines.forEach((line, j) => {
                const y = (j * lineHeight) - ((lines.length - 1) * lineHeight / 2);
                const x = textRadius;
                
                // Text gölgesi
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                
                ctx.strokeText(line, x, y);
                ctx.fillText(line, x, y);
                
                // Gölgeyi sıfırla
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            });
            
            ctx.restore();
        });
    }

    spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.resultDisplay.classList.remove('show');
        
        // Rastgele ödül seçimi
        const prizeIndex = Math.floor(Math.random() * this.prizes.length);
        
        // Dönüş hesaplaması
        const extraSpins = 5 + Math.floor(Math.random() * 5); // 5-10 tam tur
        const sliceDegree = 360 / this.prizes.length;
        
        // Çarkın durması gereken açıyı hesapla
        // İşaretçi üstte (0 derece) olduğu için, hedef dilimin üst noktasına gelmesi için
        // 360 - (dilim açısı * dilim indeksi) formülünü kullanıyoruz
        const targetDegree = 360 - (prizeIndex * sliceDegree);
        
        // Toplam dönüş = Ekstra dönüşler + Hedef açı
        const finalRotation = (extraSpins * 360) + targetDegree;
        
        // Mevcut rotasyona ekle
        this.currentRotation += finalRotation;
        
        // Dönüş animasyonu
        this.canvas.style.transform = `rotate(${this.currentRotation}deg)`;

        // Sonucu göster
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
            requestAnimationFrame(() => {
                this.init();
            });
        });
    }
}

// Oyunu başlat
document.addEventListener('DOMContentLoaded', () => {
    new WheelGame();
});
