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
		}
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
			username: document.querySelector('#signup-username').value
		};

		//console.log(data);

		let response = await fetch('http://thesi.generalassemb.ly:8080/signup', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		let responseData = await response.json();

		localStorage.setItem('token', responseData.token);
		localStorage.setItem('username', responseData.username);

		//console.log(localStorage);

		//console.log(responseData);

		// confirm the signup was successful, then take user to posts page
		if (responseData.token) {
			document.querySelector('#username-display').innerText = `Hello, ${localStorage.username}`;
			clearLoginAndSignupFields();
			confirmCredentials();
			addCommentContentIfLoggedIn(document.querySelector('#comments-container'));
		} else {
			alert('Username already exists. Please try again.');
		}
	};

	const login = async () => {
		let data = {
			email: document.querySelector('#login-email').value,
			password: document.querySelector('#login-password').value
		};

		//console.log(data);

		let response = await fetch('http://thesi.generalassemb.ly:8080/login', {
			method: 'POST',
			headers: {
				'Access-Control-Allow-Origin': '*',
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		let responseData = await response.json();

		localStorage.setItem('token', responseData.token);
		localStorage.setItem('username', responseData.username);

		//console.log(sessionStorage.token);

		// confirm the login was successful, then take user to posts page
		if (responseData.token) {
			document.querySelector('#username-display').innerText = `Hello, ${localStorage.username}`;
			clearLoginAndSignupFields();
			confirmCredentials();
			addCommentContentIfLoggedIn(document.querySelector('#comments-container'));
		} else {
			alert('Login failed. Please try again.');
		}
	};

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

	// show the add comment input and the 'add comment' button - only show when user is logged in
	const addCommentContentIfLoggedIn = (divToAppendTo) => {
		// comment input field
		let commentInput = document.createElement('input');
		divToAppendTo.appendChild(commentInput);

		// add comment button
		let addCommentButton = document.createElement('button');
		addCommentButton.className = 'btn btn-primary';
		addCommentButton.innerText = 'Add comment';
		divToAppendTo.appendChild(addCommentButton);

		addCommentButton.addEventListener('click', async () => {
			//let userToken= localStorage.getItem('token')
			//console.log(`http://thesi.generalassemb.ly:8080/comment/${id}`)
			let comment = commentInput.value;
			//console.log(comment)
			let response = await fetch(`http://thesi.generalassemb.ly:8080/comment/${id}`, {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + localStorage.token,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: comment
				})
			});
			console.log(comment);
			//comment.save()

			getComments(id);
		});
	};

	// get all the posts
	const getAllPosts = () => {
		fetch(`http://thesi.generalassemb.ly:8080/post/list`)
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				//console.log(res)
				for (let i = res.length - 1; i >= 0; i--) {
					// use the post id to get all the comments
					let postContainer = document.createElement('div');
					postContainer.id = 'post-container';
					postContainer.className = 'container';
					document.body.appendChild(postContainer);

					let div = document.createElement('div');
					postContainer.appendChild(div);
					div.innerText = res[i].title;

					let divThree = document.createElement('div');
					postContainer.appendChild(divThree);
					divThree.innerText = res[i].user.username;

					let id = res[i].id;

					// wrap this in a conditional to only display if the user is logged in (localStorage)
					// if not, show the comments but have a message like 'you must be logged in to add a comment'

					// comments container below post
					let commentsContainer = document.createElement('div');
					commentsContainer.className = 'container';
					commentsContainer.id = 'comments-container';

					// localStorage.token !== ''
					//     ? console.log('not logged in')
					//     : console.log('logged in ');

					let comment = getComments(res[i].id).then((comment) => {
						console.log('');
						let commentDiv = document.createElement('div');
						// tweak this to map out the comments if there are multiple for each post - use bootstrap classes to make it easier
						commentDiv.innerText =
							comment.length > 0
								? comment.map((item) => `${item.user.username}: ${item.text}`)
								: localStorage === '' ? 'You must login to add a comment' : 'Be the first to comment!';
						commentsContainer.appendChild(commentDiv);

						postContainer.appendChild(commentsContainer);
					});
				}
			});
	};

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
				Authorization: 'Bearer ' + localStorage.token,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: postTitle,
				description: postContent
			})
		}).catch((err) => console.log('Error creating new post: ', err));
		let data = await response.json();
		//.catch(err => console.log('Error creating new post: ', err));

		return data;
	});

	// work on posting a comment, then delete comment

	// show comments on a post

	// add profile button
	const profileButton = document.querySelector('#profile-button');
	profileButton.addEventListener('click', function(event) {
		event.preventDefault();

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
				console.log(res);

				for (let i = res.length - 1; i >= 0; i--) {
					let userPostsDiv = document.getElementById('user-posts');

					let postContainer = document.createElement('div');
					postContainer.id = 'post-container';
					postContainer.className = 'container';
					userPostsDiv.appendChild(postContainer);

					let divTitle = document.createElement('div');
					postContainer.appendChild(divTitle);
					divTitle.innerText = res[i].title;

					let divThree = document.createElement('div');
					postContainer.appendChild(divThree);
					divThree.innerText = res[i].description;

					let div = document.createElement('div');
					div.innerText = res[i].user.username;
					document.body.appendChild(div);

					let deletePostButton = document.createElement('button');
					deletePostButton.innerText = 'delete post';
					postContainer.appendChild(deletePostButton);

					let post_id = res[i].id;

					deletePostButton.addEventListener('click', function() {
						console.log(post_id);
						fetch(`http://thesi.generalassemb.ly:8080/post/${post_id}`, {
							method: 'DELETE',
							headers: {
								Authorization: 'Bearer ' + localStorage.token,
								'Content-Type': 'application/json'
							}
						})
							.then((res) => res.json())
							console.log(res)

							.then((res) => {
								//console.log('Deleted:', res.message);
								return res;
							})
							.catch((err) => console.error(err));

						let data = res.json();
						return data;
						
					});
				}
			});
	});
});
