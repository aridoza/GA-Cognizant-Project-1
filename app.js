document.addEventListener('DOMContentLoaded', () => {
    // check if user is logged in
    const checkIfAlreadyLoggedIn = () => {
        if (localStorage.getItem('token')){
            document.querySelector('#username-display').innerText = `Hello, ${localStorage.username}!`;
        }
    };

    checkIfAlreadyLoggedIn();

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

    // Home button
    const homeBtn = document.createElement('button');


    // All posts Div
    const postsDiv = document.querySelector('#all-posts');

    // Main div below nav
    let mainDiv = document.querySelector('#main-content');

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
        document.querySelector('#username-display').innerText = `Logged out`;
        // clear the token from sessionStorage
        localStorage.removeItem('token');

        // remove all the posts and show user the login/signup forms
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

    // check if there is a localStorage token, if so show the home page
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
        localStorage.setItem('username', responseData.username);
        
        //console.log(localStorage);

        //console.log(responseData);
        
        // confirm the signup was successful, then take user to posts page
        if (localStorage.getItem('token')) {
            checkIfAlreadyLoggedIn();
            clearLoginAndSignupFields();
            confirmCredentials();
            addCommentContentIfLoggedIn(document.querySelector('#comments-container'));
        } else {
            alert('Username already exists. Please try again.')
        }
    };


    // login existing user
    const login = async () => {
        let data = {
            email: document.querySelector('#login-email').value,
            password: document.querySelector('#login-password').value,
        };

        //console.log(data);

        let response = await fetch('http://thesi.generalassemb.ly:8080/login', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        let responseData = await response.json();

        localStorage.setItem('token', responseData.token);
        localStorage.setItem('username', responseData.username);

        //console.log(sessionStorage.token);

        // confirm the login was successful, then take user to posts page
        if (localStorage.getItem('token')) {
            checkIfAlreadyLoggedIn();
            clearLoginAndSignupFields();
            confirmCredentials();
        } else {
            alert('Login failed. Please try again.')
        }
    }

    // create a new user, store token in localStorage, and show the home page
    signupBtn.addEventListener('click', () => addNewUser());

    // log user in
    loginBtn.addEventListener('click', () => login());

    // log user out
    logoutBtn.addEventListener('click', () => logout());

    
    // get comments by post Id
    const getComments = async (postId) => {
        let response = await fetch(`http://thesi.generalassemb.ly:8080/post/${postId}/comment`);
        
        let data = await response.json();
        return data;
    };

    // check if user is logged in to add comments
    const newCommentHandler = async (id, comment) => {
        if (localStorage.getItem('token')){
            let response = await fetch(`http://thesi.generalassemb.ly:8080/comment/${id}`, {
                
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + localStorage.token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "text" : comment
                }),   
                
            });
    
            getComments(id);
        } else {
            return alert('You must be signed in to add a comment');
        }
    }
    
    // show all comments for a post
    const showPostComments = async (divToAppendTo, postId) => {
        let commentBtnId = document.querySelector(`#post-${postId}`)
        commentBtnId.style.display = 'none';
        let showBtn = document.querySelector(`post-${postId}`);
        let postComments = await getComments(postId);
        let commentsContainer = document.createElement('div');
        commentsContainer.className = 'container';

        
        
        // tweak this to map out the comments if there are multiple for each post - use bootstrap classes to make it easier
        commentsContainer.innerText = postComments.length > 0 
        ? postComments.map(item => `${item.user.username}: ${item.text}`) 
        : localStorage === '' ? 'You must login to add a comment' : 'No comments yet - be the first to comment!';
        
        let hideCommentsButton = document.createElement('button');
        hideCommentsButton.className = 'btn btn-primary';
        hideCommentsButton.innerText = 'Hide Comments';
        commentsContainer.appendChild(hideCommentsButton);
        hideCommentsButton.addEventListener('click', () => {
            commentBtnId.style.display = 'inline-block';
            divToAppendTo.innerHTML = '';
        })
        

        divToAppendTo.appendChild(commentsContainer);
    };


            // get all the posts
            const getAllPosts = () => {
                fetch(`http://thesi.generalassemb.ly:8080/post/list`)
                .then(res => {
                    return res.json()              
                })
                .then(res=>{
                    
                    //console.log(res)
                    for (let i=res.length-1; i >= 0; i--){
                        // use the post id to get all the comments
                        let postContainer = document.createElement('div');
                        postContainer.id = 'post-container';
                        postContainer.className = 'container';
                        mainDiv.appendChild(postContainer);
                        
                        let div=document.createElement('div')
                        postContainer.appendChild(div)
                        div.innerText=res[i].title
                        
                        let divThree=document.createElement('div')
                        postContainer.appendChild(divThree)
                        divThree.innerText=res[i].user.username

                        // input field to add comment
                        let addCommentInput = document.createElement('input');
                        postContainer.appendChild(addCommentInput);

                        // add comment button
                        let addCommentButton=document.createElement('button');
                        addCommentButton.className = 'btn btn-primary';
                        addCommentButton.innerText="Add comment";
                        postContainer.appendChild(addCommentButton);

                        addCommentButton.addEventListener('click', () => newCommentHandler(res[i].id, addCommentInput.value));

                        // show all comments button
                        let showCommentsButton = document.createElement('button');
                        showCommentsButton.className = 'btn btn-primary';
                        showCommentsButton.id = 'post-' + res[i].id;

                        showCommentsButton.innerText = 'Show Comments';
                        postContainer.appendChild(showCommentsButton);

                        let commentsContainer = document.createElement('div');
                        commentsContainer.id = 'comments-container';
                        postContainer.appendChild(commentsContainer);

                        // store the comments to display later
                        // let comments = getComments(res[i].id)
                            //console.log(comments);
                            
                            // display a single post if it's clicked on
                            showCommentsButton.addEventListener('click', () => showPostComments(commentsContainer, res[i].id));
                            
                            
                            let id=res[i].id
    
                            // wrap this in a conditional to only display if the user is logged in (localStorage)
                            // if not, show the comments but have a message like 'you must be logged in to add a comment'
    
                            // comments container below post
                            // let commentsContainer = document.createElement('div');
                            // commentsContainer.className = 'container';
                            // commentsContainer.id = 'comments-container';
    
                            // localStorage.token !== '' 
                            //     ? console.log('not logged in')
                            //     : console.log('logged in '); 

                            
                        };
                    })
                
            }

            getAllPosts();

    const newPostTitle = document.querySelector('#new-post-title');
    const newPostContent = document.querySelector('#new-post-content');
    const newPostButton = document.querySelector('#new-post-button');
                
    newPostButton.addEventListener('click', async () => {
        let postTitle = newPostTitle.value;
        let postContent = newPostContent.value;

        let response = await fetch('http://thesi.generalassemb.ly:8080/post', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.token,
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
        //.catch(err => console.log('Error creating new post: ', err));

        return data;
    })   
    
    
    // work on posting a comment, then delete comment

    // show comments on a post
    
    // profile content
    const profileButton = document.querySelector('#profile-button');
	profileButton.addEventListener('click', function(event) {
        event.preventDefault();
        mainDiv.innerHTML = '';

        

		fetch(`http://thesi.generalassemb.ly:8080/user/post`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + localStorage.token,
				'Content-Type': 'application/json'
			}
		})
			.then((res) => {
				return res.json();
			})
			.then((res) => {


				for (let i = res.length - 1; i >= 0; i--) {
					//let userPostsDiv = document.getElementById('user-posts');

					let postContainer = document.createElement('div');
					postContainer.id = 'post-container';
					postContainer.className = 'container';
					mainDiv.appendChild(postContainer);
					//console.log(postContainer)

					let divTitle = document.createElement('div');
					postContainer.appendChild(divTitle);
					divTitle.innerText = res[i].title;

					let divThree = document.createElement('div');
					postContainer.appendChild(divThree);
					divThree.innerText = res[i].description;

					let div = document.createElement('div');
					div.innerText = res[i].user.username;
					mainDiv.appendChild(div);

					let deletePostButton = document.createElement('button');
					deletePostButton.innerText = 'delete post';
                    
                    let post_id=res[i].id
                    
                    deletePostButton.addEventListener('click', async () => {
                    console.log(post_id)
						let response = await fetch(`http://thesi.generalassemb.ly:8080/post/${post_id}`, {
							method: 'delete',
							headers: {
								Authorization: 'Bearer ' + localStorage.token,
								'Content-Type': 'application/json'
                            }
                            
                        })
                        console.log(response);
                        
					});
                    postContainer.appendChild(deletePostButton);
                     

				}
			});
    });
    
    // delete a comment
    const deleteComment = async (comment_id) => {
        let response = await fetch(`http://thesi.generalassemb.ly:8080/comment/${comment_id}`, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.token,
                'Content-Type': 'application/json'
            }     
        })

        if (response.status === 200) {
            alert('Comment deleted successfully!');
        }
    }

    const userCommentsBtn = document.querySelector('#comments-button');
    // show the comments a user made 
    userCommentsBtn.addEventListener('click', async () => {
        let response = await fetch(`http://thesi.generalassemb.ly:8080/user/comment`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.token,
                'Content-Type': 'application/json',
            },
        });
        let data = await response.json();

        mainDiv.innerHTML = '';

        for (let i = 0; i < data.length; i++) {
            let commentsContainer = document.createElement('div');
            commentsContainer.id = 'post-container';
            commentsContainer.className = 'container';
            mainDiv.appendChild(commentsContainer);
            //console.log(postContainer)

            let divTitle = document.createElement('div');
            commentsContainer.appendChild(divTitle);
            divTitle.innerText = `Original Post Title: ${data[i].post.title}`;

            let divThree = document.createElement('div');
            commentsContainer.appendChild(divThree);
            divThree.innerText = `Original Post Description: ${data[i].post.description}`;

            // user's comment
            let commentDiv = document.createElement('div');
            commentsContainer.appendChild(commentDiv);
            commentDiv.innerText = `${data[i].user.username}: ${data[i].text}`;

            let div = document.createElement('div');
            div.innerText = data[i].user.username;
            mainDiv.appendChild(div);

            let deleteCommentButton = document.createElement('button');
            deleteCommentButton.className = 'btn btn-primary';
            deleteCommentButton.innerText = 'delete comment';
            deleteCommentButton.addEventListener('click', () => deleteComment(data[i].id));
            commentsContainer.appendChild(deleteCommentButton);
                
            let post_id=data[i].id
        }
    });

    // return user to home page and show all posts (only show home button when user is logged in)
    // idea: make a div below the nav that would show content depending on what button the user presses?
    const showHomeContent = () => {
        mainDiv.innerHTML = '';
        getAllPosts();
    }

                
});


