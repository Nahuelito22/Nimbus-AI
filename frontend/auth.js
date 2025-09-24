document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerLink = document.getElementById('register-link');
    const authSection = document.getElementById('auth-section');
    const userDashboard = document.getElementById('user-dashboard');
    const adminDashboard = document.getElementById('admin-dashboard');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Simulate login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        // In a real app, this would be an API call
        console.log('Login attempt:', { email, password, role });
        
        // Simulate successful login
        authSection.classList.add('hidden');
        
        if (role === 'admin') {
            adminDashboard.classList.remove('hidden');
        } else {
            userDashboard.classList.remove('hidden');
        }
    });
    
    // Simulate logout
    logoutBtn.addEventListener('click', function() {
        userDashboard.classList.add('hidden');
        adminDashboard.classList.add('hidden');
        authSection.classList.remove('hidden');
        
        // Reset form
        loginForm.reset();
    });
    
    // Simulate register (just show alert for now)
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Funcionalidad de registro se implementará próximamente');
    });
});