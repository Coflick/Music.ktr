tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#1DB954",
        secondary: "#191414",
        accent: "#1ED760",
        background: "#121212",
        foreground: "#FFFFFF",
        muted: "#282828",
        "muted-foreground": "#B3B3B3",
      },
    },
  },
};
  // Basic interactivity for the music player
        document.addEventListener('DOMContentLoaded', function() {
            const playButton = document.querySelector('footer button .fa-play');
            let isPlaying = false;
            
            if (playButton) {
                playButton.parentElement.addEventListener('click', function() {
                    isPlaying = !isPlaying;
                    if (isPlaying) {
                        playButton.classList.remove('fa-play');
                        playButton.classList.add('fa-pause');
                    } else {
                        playButton.classList.remove('fa-pause');
                        playButton.classList.add('fa-play');
                    }
                });
            }
            
            // Add hover effects to music cards
            const musicCards = document.querySelectorAll('.music-card');
            musicCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        });