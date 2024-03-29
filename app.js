document.addEventListener('DOMContentLoaded', (event) => {
	event.preventDefault();
	// check if user is logged in
	const checkIfAlreadyLoggedIn = () => {
		if (localStorage.getItem('token')) {
			document.querySelector('#username-display').innerHTML = `
            <span class='green'>🅗</span>
            <span class='blue'>🅔</span>
            <span class='grey'>🅛</span>
            <span class='grey'>🅛</span>
            <span class='green'>🅞</span> 
            ,  ${localStorage.username}!`;
		}
	};

	checkIfAlreadyLoggedIn();

	// notifications div
	const notificationsDiv = document.querySelector('#notifications-div');

	// site logo image
	const mainLogo = document.querySelector('#site-logo');

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

// button to view profile
const viewProfileBtn = document.querySelector('#view-profile');

viewProfileBtn.addEventListener('click', async () => {
    if (viewProfileBtn.className === 'btn btn-primary clicked') {
        viewProfileBtn.className = 'btn btn-primary';
        return;
    } else {
        viewProfileBtn.className = 'btn btn-primary clicked';
        let alternateEmail = document.querySelector('#profile-alt-email');
        let phoneNumber = document.querySelector('#profile-phone');
        let address = document.querySelector('#profile-address');

        let response = await fetch('http://thesi.generalassemb.ly:8080/profile', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.token,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            let responseData = await response.json();
            alternateEmail.innerText = `Alternate Email: ${responseData.additionalEmail}`;
            phoneNumber.innerText = `Phone Number: ${responseData.mobile}`;
            address.innerText = `Address: ${responseData.address}`;
        } else {
            notifier('Error: no profile found.', 'red');
        }
    }
});

	// method to show a notification based on user action
	const notifier = (message, messageColor) => {
		notificationsDiv.innerText = message;
		notificationsDiv.className = 'collapse.show';
		notificationsDiv.style.color = messageColor;

		const hideMessage = () => {
			notificationsDiv.innerText = '';
			notificationsDiv.className = 'collapse';
		};

		window.setTimeout(() => hideMessage(), 2000);
	};

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

		notifier('Successfully logged out', 'blue');
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
		if (
			document.querySelector('#signup-email').value === '' ||
			document.querySelector('#signup-password').value === '' ||
			document.querySelector('#signup-username').value === ''
		) {
			return notifier('Error: All fields required for signup', 'red');
		}
		let data = {
			email: document.querySelector('#signup-email').value,
			password: document.querySelector('#signup-password').value,
			username: document.querySelector('#signup-username').value
		};

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

		//create profile fetch to use the token

		let profileResponse = await fetch('http://thesi.generalassemb.ly:8080/profile', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + localStorage.token,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				additionalEmail: '',
				mobile: '',
				address: ''
			})
		});

		let profileUpdate = await profileResponse.json();

		// confirm the signup was successful, then take user to posts page

		if (localStorage.getItem('token')) {
			checkIfAlreadyLoggedIn();
			clearLoginAndSignupFields();
			confirmCredentials();
			//addCommentContentIfLoggedIn(document.querySelector('#comments-container'));
		} else {
			alert('Username already exists. Please try again.');
		}
	};

	let additionalEmailInput = document.querySelector('#exampleInputEmail');
	let mobile = document.querySelector(`#exampleInputPhoneNumber`);
	let address = document.querySelector(`#exampleInputAddress`);

	let updateProfileButton = document.getElementById('updateProfile');
	updateProfileButton.addEventListener('click', async () => {
		let response = await fetch(`http://thesi.generalassemb.ly:8080/profile`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + localStorage.token,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				additionalEmail: additionalEmailInput.value,
				mobile: mobile.value,
				address: address.value
			})
		});
	});

	// login existing user
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

		// confirm the login was successful, then take user to posts page
		if (response.status === 200) {
			let responseData = await response.json();

			localStorage.setItem('token', responseData.token);
			localStorage.setItem('username', responseData.username);
			let userName = localStorage.username;
			userName.id = 'user-name';

			checkIfAlreadyLoggedIn();
			clearLoginAndSignupFields();
			confirmCredentials();
		} else {
			notifier('Login failed. Please try again.', 'red');
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

	// check if user is logged in to add comments
	const newCommentHandler = async (id, comment) => {
		if (comment.value === '') {
			return notifier("Error: Your comment was blank. Don't be shy!", 'red');
		}
		if (localStorage.getItem('token')) {
			let response = await fetch(`http://thesi.generalassemb.ly:8080/comment/${id}`, {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + localStorage.token,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: comment.value
				})
			});

			if (response.status === 200) {
				comment.value = '';
				notifier('Successfully added comment!', 'green');
				getAllPosts();
			} else {
				notifier("Sorry, we couldn't add your comment. Please try again", 'red');
			}
		} else {
			return notifier('You must be signed in to add a comment', 'red');
		}
	};

	// show all comments for a post
	const showPostComments = async (divToAppendTo, postId) => {
		let commentBtn = document.querySelector(`#post-${postId}`);
		if (commentBtn.innerText === 'Show Comments') {
			commentBtn.innerText = 'Hide Comments';
			let postComments = await getComments(postId);
			let commentsContainer = document.createElement('div');
			commentsContainer.className = 'container';
			commentsContainer.id = 'comments-wrapper';

			// tweak this to map out the comments if there are multiple for each post - use bootstrap classes to make it easier
			commentsContainer.innerHTML =
				postComments.length > 0
					? postComments
							.map((item) => `<p id="comments-container">Made by, ${item.user.username}: ${item.text}</p>`)
							.join('')
					: localStorage === ''
						? 'You must login to add a comment'
						: 'No comments yet - be the first to comment!';

			divToAppendTo.appendChild(commentsContainer);
		} else {
			commentBtn.innerText = 'Show Comments';
			divToAppendTo.innerHTML = '';
		}
	};

	// get all the posts
	const getAllPosts = () => {
		mainDiv.innerHTML = '';
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
					mainDiv.appendChild(postContainer);

					let div = document.createElement('div');
					postContainer.appendChild(div);
					div.innerText = res[i].title;
					div.style.color = '#009933';
					div.style.fontSize = '33px';
					div.style.fontWeight = '900';
					div.style.fontFamily = 'Halvetica';
					div.style.letterSpacing = '2px';

					let divThree = document.createElement('div');
					postContainer.appendChild(divThree);
					divThree.innerText = `Made by: ${res[i].user.username}`;
					divThree.style.fontSize = '15px';
					divThree.style.fontStyle = 'Halvetica';

					let divFour = document.createElement('div');
					postContainer.appendChild(divFour);
					divFour.innerText = res[i].description;
					divFour.style.fontSize = '20px';
					divFour.style.marginBottom = '10px';
					divFour.style.fontWeight = '900';

					// input field to add comment
					let addCommentInput = document.createElement('input');
					postContainer.appendChild(addCommentInput);
					addCommentInput.style.width = '250px';
					addCommentInput.style.height = '30px';
					addCommentInput.style.marginRight = '15px';
					addCommentInput.style.marginBottom = '20px';

					// add comment button
					let addCommentButton = document.createElement('button');
					addCommentButton.className = 'btn btn-primary';
					addCommentButton.innerText = 'Add comment';
					postContainer.appendChild(addCommentButton);
					addCommentButton.style.marginRight = '30px';

					addCommentButton.addEventListener('click', () => newCommentHandler(res[i].id, addCommentInput));

					// show all comments button
					let showCommentsButton = document.createElement('button');
					showCommentsButton.className = 'btn btn-primary';
					showCommentsButton.id = 'post-' + res[i].id;

					showCommentsButton.innerText = 'Show Comments';
					postContainer.appendChild(showCommentsButton);

					let commentsContainer = document.createElement('div');
					commentsContainer.id = 'comments-container';
					postContainer.appendChild(commentsContainer);

					// display a single post if it's clicked on
					showCommentsButton.addEventListener('click', () => showPostComments(commentsContainer, res[i].id));

					let id = res[i].id;
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

		if (postTitle.innerText === '' || postContent === '') {
			return alert('Error: Please make sure you add both a title and a body to your post');
		}

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

		if (response.status === 200) {
			newPostTitle.value = '';
			newPostContent.value = '';
			notifier('Post added successfully!', 'green');
			getAllPosts();
		} else {
			notifier('Error adding post, please try again', 'red');
		}

		let data = await response.json();

		return data;
	});

	const showUserPosts = (profileBtn) => {
		if (userCommentsBtn.innerText !== 'My Comments') {
			userCommentsBtn.innerText = 'My Comments';
		}
		mainDiv.innerHTML = '';

		if (profileBtn.innerText === 'Profile Content') {
			profileButton.innerText = 'Go Back Home';

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
						let postContainer = document.createElement('div');
						postContainer.id = 'post-container';
						postContainer.className = 'container';
						mainDiv.appendChild(postContainer);

						let divTitle = document.createElement('div');
						postContainer.appendChild(divTitle);
						divTitle.innerText = res[i].title;
						divTitle.style.fontFamily = 'Halvetica';
						divTitle.style.color = '#009933';
						divTitle.style.fontSize = '30px';
						divTitle.style.fontWeight = '900';

						let divThree = document.createElement('div');
						postContainer.appendChild(divThree);
						divThree.innerText = res[i].description;
						divThree.style.fontSize = '20px';
						divThree.style.fontFamily = 'Noto Sans TC';

						let div = document.createElement('div');
						div.innerText = `Made by: ${res[i].user.username}`;
						postContainer.appendChild(div);

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
							}).then((res) => res.json());
							console
								.log(res)
								.then((res) => {
									return res;
								})
								.catch((err) => console.error(err));

							let data = res.json();
							return data;
						});
						postContainer.appendChild(deletePostButton);
					}
				});
		} else {
			profileBtn.innerText = 'Profile Content';
			return getAllPosts();
		}
	};

	// profile content
	const profileButton = document.querySelector('#profile-button');
	profileButton.addEventListener('click', () => showUserPosts(profileButton));

	// delete a comment
	const deleteComment = async (comment_id) => {
		let response = await fetch(`http://thesi.generalassemb.ly:8080/comment/${comment_id}`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + localStorage.token,
				'Content-Type': 'application/json'
			}
		});

		if (response.status === 200) {
			alert('Comment deleted successfully!');
		}
	};

	// get all comments by user
	const getUserComments = async (showCommentsBtn) => {
		if (profileButton.innerText !== 'Profile Content') {
			profileButton.innerText = 'Profile Content';
		}
		// clear the main content container
		mainDiv.innerHTML = '';

		// show either the user's comments or the home page with all posts
		if (showCommentsBtn.innerText === 'My Comments') {
			showCommentsBtn.innerText = 'Go Back Home';

			// get all of this user's comments from the server
			let response = await fetch(`http://thesi.generalassemb.ly:8080/user/comment`, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + localStorage.token,
					'Content-Type': 'application/json'
				}
			});
			let data = await response.json();

			// create a container for each comment, including the post it was posted on
			for (let i = 0; i < data.length; i++) {
				let post_id = data[i].id;

				let commentsContainer = document.createElement('div');

				commentsContainer.id = 'post-container';
				commentsContainer.className = 'container';
				mainDiv.appendChild(commentsContainer);
				//console.log(postContainer)

				let divTitle = document.createElement('div');
				commentsContainer.appendChild(divTitle);
				divTitle.innerText = `Original Post Title: ${data[i].post.title}`;
				divTitle.style.fontFamily = 'Halvetica';
				divTitle.style.color = '#009933';
				divTitle.style.fontSize = '30px';
				divTitle.style.fontWeight = '900';

				let divThree = document.createElement('div');
				commentsContainer.appendChild(divThree);
				divThree.innerText = `Original Post Description: ${data[i].post.description}`;

				// user's comment
				let commentDiv = document.createElement('div');
				commentsContainer.appendChild(commentDiv);
				commentDiv.innerText = `${data[i].user.username}: ${data[i].text}`;

				let deleteCommentButton = document.createElement('button');
				deleteCommentButton.className = 'btn btn-primary';
				deleteCommentButton.innerText = 'delete comment';
				deleteCommentButton.addEventListener('click', () => deleteComment(data[i].id));
				commentsContainer.appendChild(deleteCommentButton);
			}
		} else {
			showCommentsBtn.innerText = 'My Comments';
			return getAllPosts();
		}
	};

	// reference to the 'My Comments' button
	const userCommentsBtn = document.querySelector('#comments-button');
	// show the comments a user made
	userCommentsBtn.addEventListener('click', () => getUserComments(userCommentsBtn));

	// return user to home page and show all posts (only show home button when user is logged in)
	// idea: make a div below the nav that would show content depending on what button the user presses?
	const showHomeContent = () => {
		mainDiv.innerHTML = '';
		getAllPosts();
	};
});
