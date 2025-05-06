class WheelGame {
    constructor() {
        this.canvas = document.getElementById('wheel');
        this.ctx = this.canvas.getContext('2d');
        this.spinBtn = document.getElementById('spin-btn');
        this.resultDisplay = document.getElementById('result');
        this.userName = document.getElementById('userName');
        
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

    // ... geri kalan JavaScript kodları aynı ...
}

document.addEventListener('DOMContentLoaded', () => {
    new WheelGame();
});
