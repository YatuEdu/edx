import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credential.js'
import {uiMan} from '../core/uiManager.js';
import {LoginPageHandler} from './login_handler.js';

let loginPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "register page ready!" );
	loginPageHandler = new LoginPageHandler(credMan, true);
});