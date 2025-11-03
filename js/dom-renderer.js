// DOM Renderer for MelodyHub
class DOMRenderer {
    constructor() {
        this.songsData = null;
        this.albumsData = null;
        this.currentUser = null;
    }

    // Initialize the renderer
    async init() {
        try {
            await this.loadData();
            this.currentUser = this.getCurrentUser();
            this.renderAll();
        } catch (error) {
            console.error('Lỗi khi khởi tạo DOM Renderer:', error);
        }
    }

    // Load data from JSON files
    async loadData() {
        try {
            const [songsResponse, albumsResponse] = await Promise.all([
                fetch('../json/songs.json'),
                fetch('../json/albums.json')
            ]);

            this.songsData = await songsResponse.json();
            this.albumsData = await albumsResponse.json();
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            throw error;
        }
    }

    // Get current user from session
    getCurrentUser() {
        const stored = sessionStorage.getItem('melodyhub_current_user');
        return stored ? JSON.parse(stored) : null;
    }

    // Render all components
    renderAll() {
        this.renderCategories();
        this.renderFeaturedAlbums();
        this.renderPopularSongs();
        this.renderNewReleases();
        this.setupEventListeners();
    }

    // Render music categories
    renderCategories() {
        const container = document.getElementById('music-categories');
        if (!container || !this.songsData) return;

        const categories = this.songsData.categories;
        container.innerHTML = '';

        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'bg-muted rounded-xl p-4 text-center hover:bg-accent transition cursor-pointer';
            categoryElement.innerHTML = `
                <div class="w-16 h-16 ${category.color} rounded-full mx-auto mb-2 flex items-center justify-center">
                    <i class="${category.icon} text-white text-xl"></i>
                </div>
                <span>${category.name}</span>
            `;
            
            categoryElement.addEventListener('click', () => {
                this.filterByCategory(category.name);
            });
            
            container.appendChild(categoryElement);
        });
    }

    // Render featured albums
    renderFeaturedAlbums() {
        const container = document.getElementById('featured-albums');
        if (!container || !this.albumsData) return;

        const albums = this.albumsData.featuredAlbums;
        container.innerHTML = '';

        albums.forEach(album => {
            const albumElement = document.createElement('div');
            albumElement.className = 'music-card bg-muted rounded-lg overflow-hidden cursor-pointer';
            albumElement.innerHTML = `
                <img src="${album.image}" alt="${album.alt}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-semibold mb-1">${album.name}</h3>
                    <p class="text-muted-foreground text-sm">${album.artist}</p>
                </div>
            `;
            
            albumElement.addEventListener('click', () => {
                this.playAlbum(album);
            });
            
            container.appendChild(albumElement);
        });
    }

    // Render popular songs
    renderPopularSongs() {
        const container = document.getElementById('popular-songs');
        if (!container || !this.songsData) return;

        const songs = this.songsData.songs.slice(0, 4); // Show first 4 songs
        container.innerHTML = '';

        songs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.className = 'flex items-center justify-between p-4 hover:bg-secondary transition';
            songElement.innerHTML = `
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 relative">
                        <img src="${song.image}" alt="${song.alt}" class="w-12 h-12 object-cover rounded">
                        <button class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition play-btn" data-song-id="${song.id}">
                            <i class="fas fa-play text-white bg-primary rounded-full p-2"></i>
                        </button>
                    </div>
                    <div>
                        <h3 class="font-medium">${song.title}</h3>
                        <p class="text-muted-foreground text-sm">${song.artist}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-muted-foreground">${song.duration}</span>
                    <button class="text-muted-foreground hover:text-primary like-btn" data-song-id="${song.id}">
                        <i class="${song.isLiked ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="text-muted-foreground hover:text-primary add-btn" data-song-id="${song.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
            
            container.appendChild(songElement);
        });
    }

    // Render new releases
    renderNewReleases() {
        const container = document.getElementById('new-releases');
        if (!container || !this.albumsData) return;

        const newAlbums = this.albumsData.albums.filter(album => album.isNew);
        container.innerHTML = '';

        newAlbums.forEach(album => {
            const albumElement = document.createElement('div');
            albumElement.className = 'music-card bg-muted rounded-lg overflow-hidden cursor-pointer';
            albumElement.innerHTML = `
                <img src="${album.image}" alt="${album.alt}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-semibold mb-1">${album.name}</h3>
                    <p class="text-muted-foreground text-sm">${album.artist}</p>
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-xs text-muted-foreground">${album.year}</span>
                        <span class="text-xs text-muted-foreground">${album.songCount} bài</span>
                    </div>
                </div>
            `;
            
            albumElement.addEventListener('click', () => {
                this.playAlbum(album);
            });
            
            container.appendChild(albumElement);
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Play buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.play-btn')) {
                const songId = e.target.closest('.play-btn').dataset.songId;
                this.playSong(songId);
            }
        });

        // Like buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) {
                const songId = e.target.closest('.like-btn').dataset.songId;
                this.toggleLike(songId);
            }
        });

        // Add to playlist buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-btn')) {
                const songId = e.target.closest('.add-btn').dataset.songId;
                this.addToPlaylist(songId);
            }
        });

        // Search functionality
        const searchInput = document.querySelector('input[placeholder*="Tìm kiếm"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchContent(e.target.value);
            });
        }
    }

    // Play song
    playSong(songId) {
        const song = this.songsData.songs.find(s => s.id == songId);
        if (!song) return;

        // Update player UI
        this.updatePlayer(song);
        
        // Show notification
        this.showNotification(`Đang phát: ${song.title} - ${song.artist}`);
        
        // Update play count
        song.plays++;
        this.saveData();
    }

    // Play album
    playAlbum(album) {
        this.showNotification(`Đang phát album: ${album.name} - ${album.artist}`);
    }

    // Toggle like
    toggleLike(songId) {
        const song = this.songsData.songs.find(s => s.id == songId);
        if (!song) return;

        song.isLiked = !song.isLiked;
        song.likes += song.isLiked ? 1 : -1;

        // Update UI
        const likeBtn = document.querySelector(`[data-song-id="${songId}"] .like-btn i`);
        if (likeBtn) {
            likeBtn.className = song.isLiked ? 'fas fa-heart' : 'far fa-heart';
        }

        this.saveData();
        this.showNotification(song.isLiked ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích');
    }

    // Add to playlist
    addToPlaylist(songId) {
        const song = this.songsData.songs.find(s => s.id == songId);
        if (!song) return;

        song.isInPlaylist = !song.isInPlaylist;
        this.saveData();
        this.showNotification(song.isInPlaylist ? 'Đã thêm vào playlist' : 'Đã bỏ khỏi playlist');
    }

    // Filter by category
    filterByCategory(categoryName) {
        const filteredSongs = this.songsData.songs.filter(song => song.genre === categoryName);
        this.renderFilteredSongs(filteredSongs);
        this.showNotification(`Đang hiển thị: ${categoryName}`);
    }

    // Render filtered songs
    renderFilteredSongs(songs) {
        const container = document.getElementById('popular-songs');
        if (!container) return;

        container.innerHTML = '';

        songs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.className = 'flex items-center justify-between p-4 hover:bg-secondary transition';
            songElement.innerHTML = `
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 relative">
                        <img src="${song.image}" alt="${song.alt}" class="w-12 h-12 object-cover rounded">
                        <button class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition play-btn" data-song-id="${song.id}">
                            <i class="fas fa-play text-white bg-primary rounded-full p-2"></i>
                        </button>
                    </div>
                    <div>
                        <h3 class="font-medium">${song.title}</h3>
                        <p class="text-muted-foreground text-sm">${song.artist}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-muted-foreground">${song.duration}</span>
                    <button class="text-muted-foreground hover:text-primary like-btn" data-song-id="${song.id}">
                        <i class="${song.isLiked ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="text-muted-foreground hover:text-primary add-btn" data-song-id="${song.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
            
            container.appendChild(songElement);
        });
    }

    // Search content
    searchContent(query) {
        if (!query.trim()) {
            this.renderPopularSongs();
            return;
        }

        const filteredSongs = this.songsData.songs.filter(song => 
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase())
        );

        this.renderFilteredSongs(filteredSongs);
    }

    // Update player
    updatePlayer(song) {
        // Update player UI elements
        const playerTitle = document.querySelector('.song-details h4');
        const playerArtist = document.querySelector('.song-details p');
        const playerImage = document.querySelector('.song-thumbnail img');

        if (playerTitle) playerTitle.textContent = song.title;
        if (playerArtist) playerArtist.textContent = song.artist;
        if (playerImage) playerImage.src = song.image;
    }

    // Show notification
    showNotification(message) {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification-toast');
        existing.forEach(el => el.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-music mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1DB954;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Save data (simulated)
    saveData() {
        // In a real application, this would save to a server
        localStorage.setItem('melodyhub_songs', JSON.stringify(this.songsData));
        localStorage.setItem('melodyhub_albums', JSON.stringify(this.albumsData));
    }
}

// Initialize DOM Renderer when page loads
document.addEventListener('DOMContentLoaded', () => {
    const renderer = new DOMRenderer();
    renderer.init();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
    }
`;
document.head.appendChild(style);
