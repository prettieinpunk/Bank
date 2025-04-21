const routes = {
    "/login": { templateId: "login" },
    "/register": { templateId: "register" },
    "/dashboard": { templateId: "dashboard" },
};
// Task 2
function updateRoute() {
    const path = window.location.pathname;
    const route = routes[path];
    if (!route) {
        return navigate("/login");
    }
    const template = document.getElementById(route.templateId);
    const view = template.content.cloneNode(true);
    const app = document.getElementById("app");
    app.innerHTML = "";
    app.appendChild(view);

    // register page flashing colors
    if (path === '/register') {
        document.body.classList.add('register-flash');
    } else {
        document.body.classList.remove('register-flash');
    }
}

// task 4
function navigate(path) {
    window.history.pushState({}, path, path);
    updateRoute();
}
function onLinkClick(event) {
    event.preventDefault();
    navigate(event.target.getAttribute('href'));
}

// task 5: 
window.onpopstate = () => updateRoute();

updateRoute();

// Handle login form submission
async function login(event) {
    event.preventDefault(); /

    const loginForm = document.getElementById('loginForm');
    const username = loginForm.querySelector('#username').value;

    if (!username) {
        alert("Username is required!");
        return;
    }
    console.log(`Logging in with username: ${username}`);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    navigate("/dashboard");
}


async function register(event) {
    event.preventDefault(); 
    const registerForm = document.getElementById('registerForm');
    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData);
    const jsonData = JSON.stringify(data);
    // Basic client-side validation
    if (!data.user || !data.currency) {
        alert("Username and Currency are required!");
        return;
    }
    const result = await createAccount(jsonData);
    if (result.error) {
        return console.log('An error occurred:', result.error);
    }
    console.log('Account created!', result);

    // after registration, go to the login page
    navigate("/login");
}

// send the form data to the server not working for the life of me i tried everything
async function createAccount(account) {
    try {
        const response = await fetch('http://localhost:5000/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: account,
        });

        return await response.json();
    } catch (error) {
        return { error: error.message || 'Unknown error' };
    }
}

//blue to pink light flashing
const style = document.createElement('style');
style.innerHTML = `
@keyframes flash {
    0% {
        background-color: #1a001a;
    }
    50% {
        background-color: #ff66cc; /* Lighter pink */
    }
    100% {
        background-color: #1a001a;
    }
}
@keyframes registerFlash {
    0% {
        background-color: #1a001a;
    }
    50% {
        background-color: #a2c9e8; /* Light blue */
    }
    100% {
        background-color: #ff66cc; /* Lighter pink */
    }
}
.register-flash {
    animation: registerFlash 3s ease-in-out infinite;
}
`;
document.head.appendChild(style);
