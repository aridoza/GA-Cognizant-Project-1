mocha.setup('bdd');
const assert = chai.assert;
const expect = chai.expect;

describe('Get all posts', () => {
    it ('Should get more than zero posts', async () => {
        let response = await fetch('http://thesi.generalassemb.ly:8080/post/list');
        let responseData = await response.json();
        //console.log(responseData);
        assert.isAbove(responseData.length, 0);
    });
    it ('Should return all comments made by a user', async (done) => {
        let response = await fetch('http://thesi.generalassemb.ly:8080/user/comment', {
            headers: {
                Authorization: 'Bearer ' + localStorage.token,
                'Content-Type': 'application/json',
            },
        });
        let responseData = await response.json();
        console.log(responseData);
        assert.equal(response.status, 200);
        //done();
    });
});

// try using this branch to store user token in a separate 
// file, then grab it here to test the routes that need it


mocha.run();