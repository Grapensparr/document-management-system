import { printMenuOptions } from "./menu.js";

const userForm = document.getElementById('userForm');
userForm.classList.add('userform');
const lineBreak = document.createElement('br');

export function printLoginForm() {
    const LoginUsername = document.createElement('input');
    LoginUsername.placeholder = 'Username';
    const loginPassword = document.createElement('input');
    loginPassword.placeholder = 'Password';
    const loginUserBtn = document.createElement('button');
    loginUserBtn.innerText = 'Log in';
    loginUserBtn.classList.add('userformBtn');
    const registerUserBtn = document.createElement('button');
    registerUserBtn.innerText = 'Not yet a user? Click here to register now!';
    registerUserBtn.classList.add('userformBtn');

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
                printMenuOptions();
            } else {
                console.log(data.error);
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
    newUsername.placeholder = 'Username';
    const newPassword = document.createElement('input');
    newPassword.placeholder = 'Password';
    const registerUserBtn = document.createElement('button');
    registerUserBtn.classList.add('userformBtn');
    registerUserBtn.innerText = 'Register';
    const loginUserBtn = document.createElement('button');
    loginUserBtn.classList.add('userformBtn');
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
        .then(res => {
            if (res.status === 409) {
                return res.json().then(data => {
                    console.log(data.error);
                    throw new Error(data.error);
                });
            }
            return res.json();
        })
        .then(data => {
            console.log(`User with ID ${data.userId} created successfully`);
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
    const main = document.getElementById('main');
    const logoutBtn = document.createElement('button');
    logoutBtn.classList.add('userformBtn');
    logoutBtn.innerText = 'Log out';
    logoutBtn.classList.add('rightAlligned');
    userForm.appendChild(logoutBtn);

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('selectedOption');
        logoutBtn.classList.remove('rightAliigned');
        main.innerHTML = '';
        printLoginForm();
    });
}