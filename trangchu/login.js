document.addEventListener("DOMContentLoaded", function () {
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

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

  // Xử lý submit form
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Kiểm tra đơn giản
    if (email && password) {
      alert("Đăng nhập thành công!");
      // Thực tế sẽ gọi API đăng nhập ở đây
    } else {
      alert("Vui lòng điền đầy đủ thông tin!");
    }
  });

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;

    // Kiểm tra đơn giản
    if (!name || !email || !password || !confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    alert("Đăng ký thành công!");
    // Thực tế sẽ gọi API đăng ký ở đây
  });
});