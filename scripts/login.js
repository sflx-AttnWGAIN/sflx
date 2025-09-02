// Login Page JavaScript for 数赋灵序

document.addEventListener('DOMContentLoaded', function() {
    // 初始化登录页面
    initLoginPage();
});

function initLoginPage() {
    // 获取表单元素
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // 添加表单提交事件监听器
    loginForm.addEventListener('submit', handleLogin);

    // 添加输入框焦点事件
    usernameInput.addEventListener('focus', handleInputFocus);
    usernameInput.addEventListener('blur', handleInputBlur);
    passwordInput.addEventListener('focus', handleInputFocus);
    passwordInput.addEventListener('blur', handleInputBlur);

    // 检查是否有保存的用户名
    checkSavedCredentials();

    // 添加输入验证
    usernameInput.addEventListener('input', validateUsername);
    passwordInput.addEventListener('input', validatePassword);
}

// 处理登录表单提交
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // 验证输入
    if (!validateForm(username, password)) {
        return;
    }

    // 显示加载状态
    showLoadingState();

    // 模拟登录请求
    simulateLogin(username, password, rememberMe);
}

// 验证表单
function validateForm(username, password) {
    let isValid = true;
    const errorMessages = [];

    // 验证用户名
    if (!username) {
        errorMessages.push('请输入用户名或邮箱');
        isValid = false;
    } else if (!isValidEmail(username) && username.length < 3) {
        errorMessages.push('用户名至少需要3个字符');
        isValid = false;
    }

    // 验证密码
    if (!password) {
        errorMessages.push('请输入密码');
        isValid = false;
    } else if (password.length < 6) {
        errorMessages.push('密码至少需要6个字符');
        isValid = false;
    }

    // 显示错误信息
    if (!isValid) {
        showErrorMessages(errorMessages);
    }

    return isValid;
}

// 验证用户名
function validateUsername() {
    const username = this.value.trim();
    const usernameField = this;
    
    if (username && !isValidEmail(username) && username.length < 3) {
        showFieldError(usernameField, '用户名至少需要3个字符');
    } else {
        clearFieldError(usernameField);
    }
}

// 验证密码
function validatePassword() {
    const password = this.value;
    const passwordField = this;
    
    if (password && password.length < 6) {
        showFieldError(passwordField, '密码至少需要6个字符');
    } else {
        clearFieldError(passwordField);
    }
}

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示字段错误
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.3rem;
        animation: fadeIn 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#ef4444';
}

// 清除字段错误
function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '#e5e7eb';
}

// 显示错误信息
function showErrorMessages(messages) {
    // 移除现有的错误信息
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());

    // 创建错误信息容器
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.style.cssText = `
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        animation: fadeIn 0.3s ease;
    `;

    const errorList = document.createElement('ul');
    errorList.style.cssText = `
        margin: 0;
        padding-left: 1.5rem;
    `;

    messages.forEach(message => {
        const errorItem = document.createElement('li');
        errorItem.textContent = message;
        errorList.appendChild(errorItem);
    });

    errorContainer.appendChild(errorList);

    // 插入到表单前面
    const loginForm = document.getElementById('loginForm');
    loginForm.insertBefore(errorContainer, loginForm.firstChild);
}

// 显示加载状态
function showLoadingState() {
    const loginButton = document.querySelector('.btn-login');
    const originalText = loginButton.innerHTML;
    
    loginButton.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        登录中...
    `;
    loginButton.disabled = true;
    
    // 保存原始文本以便恢复
    loginButton.dataset.originalText = originalText;
}

// 隐藏加载状态
function hideLoadingState() {
    const loginButton = document.querySelector('.btn-login');
    const originalText = loginButton.dataset.originalText;
    
    loginButton.innerHTML = originalText;
    loginButton.disabled = false;
}

// 模拟登录请求
function simulateLogin(username, password, rememberMe) {
    // 模拟网络延迟
    setTimeout(() => {
        // 模拟登录验证（这里可以替换为真实的API调用）
        if (username === 'admin' && password === '123456') {
            // 登录成功
            handleLoginSuccess(username, rememberMe);
        } else {
            // 登录失败
            handleLoginError('用户名或密码错误');
        }
    }, 1500);
}

// 处理登录成功
function handleLoginSuccess(username, rememberMe) {
    hideLoadingState();
    
    // 保存用户信息
    if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
    } else {
        localStorage.removeItem('rememberedUsername');
    }
    
    // 保存登录状态
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('currentUser', username);
    
    // 显示成功消息
    showSuccessMessage('登录成功！正在跳转...');
    
    // 跳转到首页
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// 处理登录失败
function handleLoginError(message) {
    hideLoadingState();
    showErrorMessages([message]);
}

// 显示成功消息
function showSuccessMessage(message) {
    // 移除现有的消息
    const existingMessages = document.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => msg.remove());

    // 创建成功消息容器
    const successContainer = document.createElement('div');
    successContainer.className = 'success-message';
    successContainer.style.cssText = `
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #16a34a;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        animation: fadeIn 0.3s ease;
    `;
    successContainer.textContent = message;

    // 插入到表单前面
    const loginForm = document.getElementById('loginForm');
    loginForm.insertBefore(successContainer, loginForm.firstChild);
}

// 切换密码显示/隐藏
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        passwordIcon.className = 'fas fa-eye';
    }
}

// 处理输入框焦点
function handleInputFocus(event) {
    const field = event.target;
    field.style.borderColor = '#667eea';
    field.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
}

// 处理输入框失焦
function handleInputBlur(event) {
    const field = event.target;
    field.style.borderColor = '#e5e7eb';
    field.style.boxShadow = 'none';
}

// 检查保存的凭据
function checkSavedCredentials() {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        document.getElementById('username').value = rememberedUsername;
        document.getElementById('rememberMe').checked = true;
    }
}

// 社交登录处理
document.addEventListener('DOMContentLoaded', function() {
    // Google登录
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            // 这里可以集成Google OAuth
            showErrorMessages(['Google登录功能正在开发中...']);
        });
    }

    // GitHub登录
    const githubBtn = document.querySelector('.btn-github');
    if (githubBtn) {
        githubBtn.addEventListener('click', function() {
            // 这里可以集成GitHub OAuth
            showErrorMessages(['GitHub登录功能正在开发中...']);
        });
    }

    // 忘记密码链接
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(event) {
            event.preventDefault();
            showErrorMessages(['密码重置功能正在开发中...']);
        });
    }

    // 注册链接
    const registerLink = document.querySelector('.register-link');
    if (registerLink) {
        registerLink.addEventListener('click', function(event) {
            event.preventDefault();
            showErrorMessages(['注册功能正在开发中...']);
        });
    }
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .field-error {
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.3rem;
        animation: fadeIn 0.3s ease;
    }
`;
document.head.appendChild(style);




