import {LoginPageHandler} 	from './login_handler.js';

let loginPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "login page ready!" );
	loginPageHandler = new LoginPageHandler();
});