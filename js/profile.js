// Profile Management
document.addEventListener("DOMContentLoaded", function() {
    // Check if user is logged in
    const currentUser = userManager.getCurrentUser();
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }

    // Load user profile
    loadUserProfile(currentUser);
    
    // Setup event listeners
    setupEventListeners();
});

function loadUserProfile(user) {
    // Update header info
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-avatar').src = user.profile.avatar;
    
    // Update join date
    const joinDate = new Date(user.createdAt).toLocaleDateString('vi-VN');
    document.getElementById('join-date').textContent = joinDate;
    
    // Update role
    document.getElementById('user-role').textContent = user.role === 'admin' ? 'Quản trị viên' : 'Thành viên';
    
    // Update form fields
    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-bio').value = user.profile.bio || '';
    
    // Update statistics
    updateStatistics(user);
    
    // Update favorite genres
    updateFavoriteGenres(user.profile.favoriteGenres);
    
    // Update playlists
    updatePlaylists(user.profile.playlists);
}

function updateStatistics(user) {
    // Update playlist count
    document.getElementById('playlist-count').textContent = user.profile.playlists.length;
    
    // Update favorite count (simulated)
    document.getElementById('favorite-count').textContent = Math.floor(Math.random() * 50) + 10;
    
    // Update listening time (simulated)
    const hours = Math.floor(Math.random() * 100) + 20;
    document.getElementById('listening-time').textContent = `${hours}h`;
    
    // Update last login
    if (user.lastLogin) {
        const lastLogin = new Date(user.lastLogin);
        const now = new Date();
        const diffTime = Math.abs(now - lastLogin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            document.getElementById('last-login').textContent = 'Hôm qua';
        } else if (diffDays < 7) {
            document.getElementById('last-login').textContent = `${diffDays} ngày trước`;
        } else {
            document.getElementById('last-login').textContent = lastLogin.toLocaleDateString('vi-VN');
        }
    } else {
        document.getElementById('last-login').textContent = 'Lần đầu';
    }
}

function updateFavoriteGenres(genres) {
    const container = document.getElementById('favorite-genres');
    container.innerHTML = '';
    
    if (genres.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic">Chưa có thể loại yêu thích nào</p>';
        return;
    }
    
    genres.forEach(genre => {
        const genreTag = document.createElement('span');
        genreTag.className = 'bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium';
        genreTag.textContent = genre;
        container.appendChild(genreTag);
    });
}

function updatePlaylists(playlists) {
    const container = document.getElementById('user-playlists');
    container.innerHTML = '';
    
    if (playlists.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic col-span-full">Chưa có playlist nào</p>';
        return;
    }
    
    playlists.forEach(playlist => {
        const playlistCard = document.createElement('div');
        playlistCard.className = 'bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition';
        playlistCard.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <i class="fas fa-music text-white"></i>
                </div>
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-800">${playlist.name}</h3>
                    <p class="text-sm text-gray-600">${playlist.songCount} bài hát</p>
                </div>
            </div>
        `;
        container.appendChild(playlistCard);
    });
}

function setupEventListeners() {
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            userManager.logout();
            showSuccessMessage('Đã đăng xuất thành công!');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    });
    
    // Edit profile button
    document.getElementById('edit-profile-btn').addEventListener('click', function() {
        toggleEditMode();
    });
}

function toggleEditMode() {
    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const bioInput = document.getElementById('edit-bio');
    const editBtn = document.getElementById('edit-profile-btn');
    
    if (nameInput.readOnly) {
        // Enable edit mode
        nameInput.readOnly = false;
        emailInput.readOnly = false;
        bioInput.readOnly = false;
        
        editBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Lưu thay đổi';
        editBtn.className = 'bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition';
        
        // Add save functionality
        editBtn.onclick = saveProfile;
    } else {
        // Disable edit mode
        nameInput.readOnly = true;
        emailInput.readOnly = true;
        bioInput.readOnly = true;
        
        editBtn.innerHTML = '<i class="fas fa-edit mr-2"></i>Chỉnh sửa thông tin';
        editBtn.className = 'bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition';
        
        // Reset onclick
        editBtn.onclick = toggleEditMode;
    }
}

async function saveProfile() {
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const bio = document.getElementById('edit-bio').value;
    
    try {
        // Validate inputs
        if (!name || !email) {
            throw new Error('Vui lòng điền đầy đủ thông tin!');
        }
        
        if (!userManager.validateEmail(email)) {
            throw new Error('Email không hợp lệ!');
        }
        
        // Check if email is already used by another user
        const existingUser = userManager.users.find(u => u.email === email && u.id !== userManager.currentUser.id);
        if (existingUser) {
            throw new Error('Email đã được sử dụng bởi tài khoản khác!');
        }
        
        // Update user data
        const currentUser = userManager.getCurrentUser();
        currentUser.name = name;
        currentUser.email = email;
        currentUser.profile.bio = bio;
        
        // Update in users array
        const userIndex = userManager.users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            userManager.users[userIndex] = currentUser;
        }
        
        // Save changes
        await userManager.saveUsers();
        
        // Update session storage
        sessionStorage.setItem('melodyhub_current_user', JSON.stringify(currentUser));
        
        // Update display
        loadUserProfile(currentUser);
        
        showSuccessMessage('Đã cập nhật thông tin thành công!');
        
        // Exit edit mode
        toggleEditMode();
        
    } catch (error) {
        showErrorMessage(error.message);
    }
}

// Add some sample data for demonstration
function addSampleData() {
    const currentUser = userManager.getCurrentUser();
    if (currentUser) {
        // Add sample favorite genres
        if (currentUser.profile.favoriteGenres.length === 0) {
            currentUser.profile.favoriteGenres = ['Pop', 'Rock', 'Jazz', 'Hip-Hop'];
        }
        
        // Add sample playlists
        if (currentUser.profile.playlists.length === 0) {
            currentUser.profile.playlists = [
                { name: 'Nhạc yêu thích', songCount: 25 },
                { name: 'Chill Music', songCount: 15 },
                { name: 'Workout Playlist', songCount: 30 }
            ];
        }
        
        // Save updated user
        userManager.saveUsers();
        
        // Reload profile
        loadUserProfile(currentUser);
    }
}

// Initialize sample data on first load
setTimeout(addSampleData, 1000);
