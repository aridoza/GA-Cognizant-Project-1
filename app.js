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

        //console.log(data);

        let response = await fetch('http://thesi.generalassemb.ly:8080/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        let responseData = await response.json();


        sessionStorage.setItem('token', responseData.token);
        //console.log(sessionStorage);

        //console.log(responseData);
        
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

        //console.log(data);

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

        //console.log(sessionStorage.token);

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


const getPosts = () => {
    fetch(`http://thesi.generalassemb.ly:8080/post/list`)
            .then(res => {
                return res.json()   
            }) 
            .then(res=>{
                //console.log(res)
            for (let i=0; i< res.length; i++){
                let div=document.createElement('div')
                div.id = `post${res[i].id}`;
                document.body.appendChild(div)
                div.innerText=res[i].title
    
                let divTwo=document.createElement('div')
                document.body.appendChild(divTwo)
                divTwo.innerText=res[i].description
    
                let divThree=document.createElement('div')
                document.body.appendChild(divThree)
                divThree.innerText=res[i].user.username

                let commentsDiv = document.createElement('div');
                document.body.appendChild(commentsDiv);

                let commentText = getComments(res[i].id);
                commentsDiv.innerText = commentText;

                //commentsDiv.innerText = getComments(res[i].id);
    
                let commentInput = document.createElement('input');
                document.body.appendChild(commentInput);
                commentInput.placeholder = "enter a comment...";
    
                let addCommentButton = document.createElement('button');
                addCommentButton.innerText = 'Add Comment';
                document.body.appendChild(addCommentButton);
                addCommentButton.className = "btn btn-primary";
                addCommentButton.addEventListener('click', () => addComment(res[i].id, commentInput.value));
            }
        });

<<<<<<< HEAD
    }
=======
fetch(`http://thesi.generalassemb.ly:8080/post/list`)
        .then(res => {
            return res.json()
            
        })
        
        .then(res=>{
            //console.log(res)
        for (let i=0; i< res.length; i++){
            
            let div=document.createElement('div')
            document.body.appendChild(div)
            div.innerText=res[i].title
>>>>>>> 6c5b9a5423681447eceab3a11ed2718e57858deb

    getPosts();

<<<<<<< HEAD


const addComment = async (postId, comment) => {
    // add the comment to the post
    let response = await fetch(`http://thesi.generalassemb.ly:8080/comment/${postId}`, {
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "text": comment
        }),
    });
=======

            let divThree=document.createElement('div')
            document.body.appendChild(divThree)
            divThree.innerText=res[i].user.username

            let id=res[i].id

            let commentInput=document.createElement('input')
            document.body.appendChild(commentInput)
            
            let addCommentButton=document.createElement('button')
            document.body.appendChild(addCommentButton)
            addCommentButton.innerText="Add comment"
            
            
            addCommentButton.addEventListener('click', async ()=>{
                //let userToken= sessionStorage.getItem('token')
                //console.log(`http://thesi.generalassemb.ly:8080/comment/${id}`)
                let comment=commentInput.value
                //console.log(comment)
                let response = await fetch(`http://thesi.generalassemb.ly:8080/comment/${id}`, {
    
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "text" : comment
            }),
        
            

        });
        console.log(comment)
        //comment.save()
        
        fetch(`http://thesi.generalassemb.ly:8080/post/${id}/comment`)
        .then(res => {
            return res.json()
            
        })
            .then(res=>{
                console.log(res)
                
                for(let i=0; i<res.length; i++){
                let divComment=document.createElement('div')
                document.body.appendChild(divComment)
                div.innerText=res[i].text
                
                }

})
        
            
            // let data= await response.json();
            // sessionStorage.setItem('token', data.userToken);

    })
            

            

        

>>>>>>> 6c5b9a5423681447eceab3a11ed2718e57858deb

    let responseData = await response.json();

    console.log(responseData);
    
    return getPosts();

};

// get comments by post Id
const getComments = async (postId) => {
    let response = await fetch(`http://thesi.generalassemb.ly:8080/post/${postId}/comment`);

    let data = await response.json();

    // if (data.length > 0) {
    //     console.log(data);
    //     return data.text;
    // }

    //console.log(data);

    return 'Hello';
}
