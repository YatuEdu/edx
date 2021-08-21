import {sysConstants} from '../core/sysConst.js'
import {LoginPageHandler} from './login_handler.js';
import {credMan} from '../core/credManFinMind.js'

let loginPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "login page ready!" );
	loginPageHandler = new LoginPageHandler(credMan);
});