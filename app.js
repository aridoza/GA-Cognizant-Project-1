document.addEventListener('DOMContentLoaded', () => {
    // Login Container
    const loginDiv = document.querySelector('#login-div');

    // Signup Container
    const signupDiv = document.querySelector('#signup-div');

    // Login button
    const loginBtn = document.querySelector('#login-btn');

    // Logout button
    const logoutBtn = document.querySelector('#logout-btn');

    // Signup button
    const signupBtn = document.querySelector('#signup-btn');

    // Show login button
    const showSignupBtn = document.querySelector('#show-signup');


    // Show signup button
    const showLoginBtn = document.querySelector('#show-login');

    // All posts Div
    const postsDiv = document.querySelector('#all-posts');

    // show all posts
    const showPosts = () => {
        postsDiv.style.display = 'inline-block';
    };

    // hide login/signup content
    const hideLoginAndSignup = () => {
        document.querySelector('#login-signup-container').style.display = 'none';
    };

    // sign user out and clear the session token
    const logout = () => {
        // clear the token from sessionStorage
        sessionStorage.removeItem('token');

        document.querySelector('#all-posts').style.display = 'none';
        document.querySelector('#login-signup-container').style.display = 'inline-block';
    };


    // show the signup form when the user clicks 'sign up' from the login form
    showSignupBtn.addEventListener('click', () => {
        loginDiv.style.display = 'none';
        signupDiv.style.display = 'inline-block';
    });

    // show the login form when the user clicks 'login' from the sign-up form
    showLoginBtn.addEventListener('click', () => {
        signupDiv.style.display = 'none';
        loginDiv.style.display = 'inline-block';
    });

    // check if there is a sessionStorage token, if so show the home page
    const confirmCredentials = () => {
        if (sessionStorage.token) {
            hideLoginAndSignup();
            showPosts();
        };
    };

    // clear all login/signup fields 
    const clearLoginAndSignupFields = () => {
        // signup fields
        document.querySelector('#signup-email').value = '';
        document.querySelector('#signup-password').value = '';
        document.querySelector('#signup-username').value = '';

        // login fields
        document.querySelector('#login-email').value = '';
        document.querySelector('#login-password').value = '';
    };

    // Make a post request to the API when the user signs up for a new account
    const addNewUser = async () => {
        let data = {
            email: document.querySelector('#signup-email').value,
            password: document.querySelector('#signup-password').value,
            username: document.querySelector('#signup-username').value,
        };

        console.log(data);

        let response = await fetch('http://thesi.generalassemb.ly:8080/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        let responseData = await response.json();


        // change to localStorage to store token in browser, user won't have to log back in each time if on same browser
        sessionStorage.setItem('token', responseData.token);
        console.log(sessionStorage);

        console.log(responseData);
        
        // confirm the signup was successful, then take user to posts page
        if (responseData.token) {
            clearLoginAndSignupFields();
            confirmCredentials();
        } else {
            alert('Username already exists. Please try again.')
        }
    };

    const login = async () => {
        let data = {
            email: document.querySelector('#login-email').value,
            password: document.querySelector('#login-password').value,
        };

        console.log(data);

        let response = await fetch('http://thesi.generalassemb.ly:8080/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        let responseData = await response.json();
        sessionStorage.setItem('token', responseData.token);

        console.log(sessionStorage.token);

        // confirm the login was successful, then take user to posts page
        if (responseData.token) {
            clearLoginAndSignupFields();
            confirmCredentials();
        } else {
            alert('Login failed. Please try again.')
        }
    }

    // create a new user, store token in sessionStorage, and show the home page
    signupBtn.addEventListener('click', () => addNewUser());

    // log user in
    loginBtn.addEventListener('click', () => login());

    // log user out
    logoutBtn.addEventListener('click', () => logout());

});