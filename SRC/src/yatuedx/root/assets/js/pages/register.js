import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credMan.js'
import {uiMan} from '../core/uiManager.js';
import {LoginPageHandler} from './login_handler.js';

let loginPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
	loginPageHandler = new LoginPageHandler(credMan, true);
});