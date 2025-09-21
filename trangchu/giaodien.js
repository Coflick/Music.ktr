
document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-btn');
    const playControl = document.querySelector('.fa-play-circle, .fa-pause-circle');
    const songTitle = document.querySelector('.song-details h4');
    const songArtist = document.querySelector('.song-details p');
    const mainProgress = document.querySelector('.player .progress-bar .progress');
    let isPlaying = false;

    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.music-card');
            if (!card) return;
            const title = card.querySelector('h3')?.textContent || "Bài hát";
            const artist = card.querySelector('p')?.textContent || "Nghệ sĩ";

            songTitle.textContent = title;
            songArtist.textContent = artist;

            // Reset progress bar khi chọn bài mới
            if (mainProgress) mainProgress.style.width = "0%";

            togglePlay(true);
        });
    });

    if (playControl) {
        playControl.addEventListener('click', function() {
            togglePlay(!isPlaying);
        });
    }

    function togglePlay(state) {
        isPlaying = state;
        if (playControl) {
            playControl.classList.toggle('fa-play-circle', !isPlaying);
            playControl.classList.toggle('fa-pause-circle', isPlaying);
        }
    }

    // Chỉ gán sự kiện cho progress bar có .progress
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const progress = bar.querySelector('.progress');
        if (!progress) return;
        bar.addEventListener('click', function(e) {
            const width = this.clientWidth;
            const clickX = e.offsetX;
            progress.style.width = (clickX / width * 100) + '%';
        });
    });
});
