/**
 *  Login script for the Google Accounts page at https://accounts.google.com/*
 *  Last Updated: January 2016
 *  Author: Devesh Dayal
 */

var enterPasswordMiddle = function() {
  var second_form = $('.form-panel.second');
  var password_input = second_form.find('#Passwd');
  var submit_login = second_form.find('#signIn');

  // populate the password box
  password_input.val(window.login.password);
  // submit
  submit_login.trigger('click');
}

var enterPasswordOnly = function() {
  var password_input = $('#Passwd');
  var submit_login = $('#signIn');
  // populate the password box
  password_input.val(window.login.password);
  // submit
  submit_login.trigger('click');
}

var enterEmail = function() {
  var form_container = $('#gaia_firstform');
  var first_next = form_container.find('#next');
  var email_input = form_container.find('#Email');

  // populate the username box
  email_input.val(window.login.username);
  // move to next input
  first_next.trigger('click');
}

var is_email_hidden = $('#Email-hidden');
var is_email_prefilled = $('#Email');
if (is_email_hidden.length > 0) {
  console.log('Username entered by user, only password needed');
  enterPasswordMiddle();
} else if (is_email_prefilled.val().length > 0 && is_email_prefilled.hasClass('hidden')) {
  console.log('Username prefilled automatically, only password needed');
  enterPasswordOnly();
} else {
  console.log('Both username and password needed');
  enterEmail();
  // wait for next input to show up
  setTimeout(enterPasswordMiddle, 1000);
}