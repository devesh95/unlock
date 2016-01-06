/**
 *  Login script for the Facebook homepage at http://www.facebook.com
 *  Last Updated: January 2016
 *  Author: Devesh Dayal
 */

// first check if the page is the main login page
var title = document.title;
var URL = window.location.href.toLowerCase();
if (title.indexOf('Log In or Sign Up') > -1 && URL.indexOf('attempt') == -1) {
    console.log('Running a Facebook login.')
    // find login box
    var form = $('#login_form');
    // get username box
    var username_input = form.find('#email');
    username_input.val(window.login.username);
    // get password box
    var password_input = form.find('#pass');
    password_input.val(window.login.password);
    // submit form
    form.submit();
} else {
    console.log(title);
    console.log(URL);
    console.log('Detected Facebook login, but this is not a login page!');
}