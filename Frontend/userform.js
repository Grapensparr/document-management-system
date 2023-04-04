const userForm = document.getElementById('userForm');
const lineBreak = document.createElement('br');

export function printLoginForm() {
    const LoginUsername = document.createElement('input');
    LoginUsername.placeholder = 'Username';
    const loginPassword = document.createElement('input');
    loginPassword.placeholder = 'Password';
    const loginUserBtn = document.createElement('button');
    loginUserBtn.innerText = 'Log in';
    const registerUserBtn = document.createElement('button');
    registerUserBtn.innerText = 'Not yet a user? Click here to register now!';

    userForm.innerHTML = '';
    userForm.append(LoginUsername, loginPassword, loginUserBtn, lineBreak, registerUserBtn);

    loginUserBtn.addEventListener('click', () => {
        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: LoginUsername.value,
                password: loginPassword.value
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.userId) {
                console.log(`User with ID ${data.userId} and username ${data.userName} has signed in`);
                localStorage.setItem('loggedInUser', data.userName);
                userForm.innerHTML = '';
                printLogoutBtn();
            } else {
                console.log('Invalid username or password');
            }
        })
        .catch(err => {
            console.error(err);
        });
    });

    registerUserBtn.addEventListener('click', () => {
        printRegistrationForm();
    });
}

export function printRegistrationForm() {
    const newUsername = document.createElement('input');
    newUsername.placeholder = 'Name';
    const newPassword = document.createElement('input');
    newPassword.placeholder = 'Password';
    const registerUserBtn = document.createElement('button');
    registerUserBtn.innerText = 'Register';
    const loginUserBtn = document.createElement('button');
    loginUserBtn.innerText = 'Already a user? Click here to log in now!';

    userForm.innerHTML = '';
    userForm.append(newUsername, newPassword, registerUserBtn, lineBreak, loginUserBtn);

    registerUserBtn.addEventListener('click', () => {
        fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newUsername: newUsername.value,
                newPassword: newPassword.value
            })
        })
        .then(res => res.json())
        .then(userId => {
            console.log(`User with ID ${userId} created successfully`);
            newUsername.value = '';
            newPassword.value = '';
        })
        .catch(err => {
            console.error(err);
        });
    });

    loginUserBtn.addEventListener('click', () => {
        printLoginForm();
    });
}

export function printLogoutBtn() {
    const logoutBtn = document.createElement('button');
    logoutBtn.innerText = 'Log out';
    userForm.appendChild(logoutBtn);

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        printLoginForm();
    });
}