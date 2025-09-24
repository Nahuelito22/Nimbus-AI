document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerLink = document.getElementById('register-link');
    const authSection = document.getElementById('auth-section');
    const userDashboard = document.getElementById('user-dashboard');
    const adminDashboard = document.getElementById('admin-dashboard');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Simular login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        // Cambiar llamdo de api en app real
        console.log('Login attempt:', { email, password, role });
        
        // Simular exito login
        authSection.classList.add('hidden');
        
        if (role === 'admin') {
            adminDashboard.classList.remove('hidden');
        } else {
            userDashboard.classList.remove('hidden');
        }
    });
    
    // Simular logout
    logoutBtn.addEventListener('click', function() {
        userDashboard.classList.add('hidden');
        adminDashboard.classList.add('hidden');
        authSection.classList.remove('hidden');
        
        // Resetear formulario
        loginForm.reset();
    });
    
    // Simular registro
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Funcionalidad de registro se implementará próximamente');
    });
});