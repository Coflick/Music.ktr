// User Management System
class UserManager {
  constructor() {
    this.users = [];
    this.currentUser = null;
    this.loadUsers();
  }

  // Load users from JSON file
  async loadUsers() {
    try {
      const response = await fetch('../json/users.json');
      const data = await response.json();
      this.users = data.users || [];
      this.currentUser = data.currentUser;
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu người dùng:', error);
      this.users = [];
    }
  }

  // Save users to JSON file (simulated)
  async saveUsers() {
    try {
      const data = {
        users: this.users,
        currentUser: this.currentUser,
        totalUsers: this.users.length
      };
      
      // In a real application, you would send this to a server
      // For now, we'll store in localStorage as backup
      localStorage.setItem('melodyhub_users', JSON.stringify(data));
      
      // Update the JSON file (this would be handled by a backend in production)
      console.log('Đã lưu dữ liệu người dùng:', data);
      return true;
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      return false;
    }
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    return password.length >= 6;
  }

  // Check if email already exists
  emailExists(email) {
    return this.users.some(user => user.email === email);
  }

  // Register new user
  async register(userData) {
    const { name, email, password } = userData;

    // Validation
    if (!name || !email || !password) {
      throw new Error('Vui lòng điền đầy đủ thông tin!');
    }

    if (!this.validateEmail(email)) {
      throw new Error('Email không hợp lệ!');
    }

    if (!this.validatePassword(password)) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự!');
    }

    if (this.emailExists(email)) {
      throw new Error('Email đã được sử dụng!');
    }

    // Create new user
    const newUser = {
      id: this.users.length + 1,
      name: name,
      email: email,
      password: password, // In production, this should be hashed
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      profile: {
        avatar: 'https://via.placeholder.com/150',
        bio: '',
        favoriteGenres: [],
        playlists: []
      }
    };

    this.users.push(newUser);
    await this.saveUsers();
    
    return newUser;
  }

  // Login user
  async login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng!');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.currentUser = user;
    await this.saveUsers();

    // Store in sessionStorage
    sessionStorage.setItem('melodyhub_current_user', JSON.stringify(user));
    
    return user;
  }

  // Logout user
  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('melodyhub_current_user');
    this.saveUsers();
  }

  // Get current user
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    // Try to get from sessionStorage
    const stored = sessionStorage.getItem('melodyhub_current_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }
}

// Initialize User Manager
const userManager = new UserManager();

document.addEventListener("DOMContentLoaded", function () {
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // Check if user is already logged in
  const currentUser = userManager.getCurrentUser();
  if (currentUser) {
    showSuccessMessage(`Chào mừng trở lại, ${currentUser.name}!`);
    // Redirect to home page after 2 seconds
    setTimeout(() => {
      window.location.href = 'giaodien.html';
    }, 2000);
  }

  // Xử lý chuyển tab
  loginTab.addEventListener("click", function () {
    loginTab.classList.add("tab-active");
    loginTab.classList.remove("text-gray-600");
    registerTab.classList.remove("tab-active");
    registerTab.classList.add("text-gray-600");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  });

  registerTab.addEventListener("click", function () {
    registerTab.classList.add("tab-active");
    registerTab.classList.remove("text-gray-600");
    loginTab.classList.remove("tab-active");
    loginTab.classList.add("text-gray-600");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  // Xử lý submit form đăng nhập
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const rememberMe = document.getElementById("remember-me").checked;

    try {
      const user = await userManager.login(email, password);
      
      if (rememberMe) {
        localStorage.setItem('melodyhub_remember', 'true');
        localStorage.setItem('melodyhub_email', email);
      }
      
      showSuccessMessage(`Đăng nhập thành công! Chào mừng ${user.name}!`);
      
      // Redirect to home page
      setTimeout(() => {
        window.location.href = 'giaodien.html';
      }, 1500);
      
    } catch (error) {
      showErrorMessage(error.message);
    }
  });

  // Xử lý submit form đăng ký
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;
    const terms = document.getElementById("terms").checked;

    try {
      // Validation
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Vui lòng điền đầy đủ thông tin!");
      }

      if (password !== confirmPassword) {
        throw new Error("Mật khẩu xác nhận không khớp!");
      }

      if (!terms) {
        throw new Error("Vui lòng đồng ý với điều khoản sử dụng!");
      }

      // Register user
      const user = await userManager.register({ name, email, password });
      
      showSuccessMessage(`Đăng ký thành công! Chào mừng ${user.name}!`);
      
      // Auto login after registration
      setTimeout(() => {
        window.location.href = 'giaodien.html';
      }, 1500);
      
    } catch (error) {
      showErrorMessage(error.message);
    }
  });

  // Load remembered email
  const remembered = localStorage.getItem('melodyhub_remember');
  if (remembered === 'true') {
    const email = localStorage.getItem('melodyhub_email');
    if (email) {
      document.getElementById('login-email').value = email;
      document.getElementById('remember-me').checked = true;
    }
  }
});

// Utility functions for showing messages
function showSuccessMessage(message) {
  showMessage(message, 'success');
}

function showErrorMessage(message) {
  showMessage(message, 'error');
}

function showMessage(message, type) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.message-toast');
  existingMessages.forEach(msg => msg.remove());

  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `message-toast ${type}`;
  messageEl.innerHTML = `
    <div class="message-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;

  // Add styles
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(messageEl);

  // Auto remove after 5 seconds
  setTimeout(() => {
    messageEl.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => messageEl.remove(), 300);
  }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .message-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
document.head.appendChild(style);