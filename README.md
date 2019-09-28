# GA-Cognizant-Project-1

## PivotalTracker Link:
* https://www.pivotaltracker.com/n/projects/2400238

## Wireframe Link:
* https://www.draw.io/#G12hJSVltfAPCdSeFsMOJnSxcZLXYeLWj8

## Fetch Post Route
* https://stackoverflow.com/questions/50046841/proper-way-to-make-api-fetch-post-with-async-await

## Unit Tests
* https://stackoverflow.com/questions/41467126/testing-fetch-with-mocha-and-chai

## Technologies Used
### HTML
* Used for main content being displayed to user

### CSS
* Used to style HTML elements

### JavaScript
* Used for DOM manipulation, making requests to API Server using fetch, and integrating Bootstrap content

### Bootstrap
* Used for additional styling and displaying content in Card and Collapsible Menu formats

### jQuery
* Used for Collapsible Menu functionality in Bootstrap

## General Approach
* Our general approach was to go through and plan out what the user flow would be, and build each piece of functionality as needed. We would first want the user to be able to log in or sign up for a new account, then take them to the home page where they can see all posts. From there they should be able to perform several actions, including view and update their profile, add posts, comment on a post, and delete posts and comments they created. Once they have finished their session, they should be able to log out of their account, and be taken back to the login page.

* One of the major hurdles we faced was adding the functionality for a user to be able to delete content they created. We figured out we needed to pass the user token into the header property of the delete request to properly have the content delete from the server. Once we figured that out, we were able to use similar routes for the put requests to update the user's content.



