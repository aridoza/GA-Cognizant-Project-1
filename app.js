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
        localStorage.removeItem('token');

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
        if (localStorage.getItem('token')) {
            hideLoginAndSignup();
            showPosts();
        };
    };

    confirmCredentials();

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


        localStorage.setItem('token', responseData.token);
        
        //console.log(localStorage);

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

        localStorage.setItem('token', responseData.token);

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

    
    // get comments by post Id
    const getComments = async (postId) => {
        let response = await fetch(`http://thesi.generalassemb.ly:8080/post/${postId}/comment`);
        
        let data = await response.json();
        
        //return data.text;
        
        
        // need the post.title
        // post.description
        // post.user.username
        // comments
        // if (data.length > 0) {
            //     console.log(data);
            //     return data.map(comment => comment.text);
            // } else {
                //     return 'No comments yet!';
                // }
                
                return data;
                
                //console.log(data);
                
                //return 'Hello';
            }
            
            
            // get all the posts
            fetch(`http://thesi.generalassemb.ly:8080/post/list`)
            .then(res => {
                return res.json()
                
            })
            
            .then(res=>{
                //console.log(res)
                for (let i=res.length-1; i >= 0; i--){
                    // use the post id to get all the comments
                    let postContainer = document.createElement('div');
                    postContainer.className = 'container';
                    document.body.appendChild(postContainer);
                    
                    let div=document.createElement('div')
                    postContainer.appendChild(div)
                    div.innerText=res[i].title
                    
                    let divThree=document.createElement('div')
                    postContainer.appendChild(divThree)
                    divThree.innerText=res[i].user.username
                    
                    
                    let id=res[i].id
                    
                    // comment input field
                    let commentInput=document.createElement('input')
                    postContainer.appendChild(commentInput)
                    
                    // add comment button
                    let addCommentButton=document.createElement('button')
                    postContainer.appendChild(addCommentButton)
                    addCommentButton.innerText="Add comment"



                    // below should be added to get post by user s id call as well as deletePost
                    let deleteCommentButton=document.createElement('button')
                    postContainer.appendChild(deleteCommentButton)
                    deleteCommentButton.innerText="Delete comment"




                    
                    let comment = getComments(res[i].id)
                    .then(comment => {
                        
                        //console.log(comment);
                        // main div
                        
                        
                        
                        
                        
                        let commentDiv = document.createElement('div');
                        commentDiv.innerText = comment.length > 0 ? comment[0].text : 'Be the first to comment!';
                        postContainer.appendChild(commentDiv);
                    })
                    
                    
                    
                    addCommentButton.addEventListener('click', async ()=>{
                        let comment=commentInput.value
                        let response = await fetch(`http://thesi.generalassemb.ly:8080/comment/${id}`, {
                            
                            method: 'POST',
                            headers: {
                                //'Authorization': 'Bearer ' + sessionStorage.token,
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "text" : comment
                            }),
                            
                            
                            
                        });
                        console.log(comment)
                        //comment.save()

                    deleteCommentButton.addEventListener('click', async()=>{
                        let comment=commentInput.value
                        let response = await fetch(`http://thesi.generalassemb.ly:8080/comment/${id}`,{
                            method: 'DELETE',
                            headers: {
                                //'Authorization': 'Bearer ' + sessionStorage.token,
                            
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "text" : comment
                            }),
                        })
                        
                    })

                    // display all comments by post ID
                        
                        fetch(`http://thesi.generalassemb.ly:8080/post/${id}/comment`)
                        .then(res => {
                            return res.json()
                            
                        })
                        .then(res=>{
                            console.log(res)
                            
                            // for(let i=0; i<res.length; i++){
                                // let divComment=document.createElement('div')
                                // document.body.appendChild(divComment)
                                // div.innerText=res[i].text
                                
                                // }
                                
                            })
                            
                            
                            // let data= await response.json();
                            // sessionStorage.setItem('token', data.userToken);
                            
                        })
                        
                        
                        
                        
                        
                        
                        
                        // let responseData = await response.json();
                        
                        // console.log(responseData);
                        
                        // return getPosts();
                        
                    };
                })

    const newPostTitle = document.querySelector('#new-post-title');
    const newPostContent = document.querySelector('#new-post-content');
    const newPostButton = document.querySelector('#new-post-button');
                
    newPostButton.addEventListener('click', async () => {
        let postTitle = newPostTitle.value;
        let postContent = newPostContent.value;

        let response = await fetch('http://thesi.generalassemb.ly:8080/post', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.token,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "title": postTitle,
                "description": postContent,
            }),
        })
        .catch(err => console.log('Error creating new post: ', err));
        let data = await response.json();
        
    
        //return data;
    })          
                
});


//post post delete post