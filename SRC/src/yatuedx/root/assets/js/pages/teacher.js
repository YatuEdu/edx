import {sysConstants, languageConstants} 	from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {uiMan} 								from '../core/uiManager.js'
import {IndexPageHandler} 					from './index.js'

const GO_TO_CLASS_REGISTER_PAGE = "yt_lnk_topic_id_main";
/**
	This class manages both login and sigup workflow
**/
class TeacherPageHandler extends IndexPageHandler {
	#loggedIn;
	#userName;
	
    constructor(credMan) {
		super();
	}
	
	// hook up events
	async init() {
		// sign up Link
		super.init();
		
		// decide if I am logged in or not
		this.#loggedIn = await credMan.hasLoggedIn();
		$( "#yt_lnk_topic_id_main" ).click(this.registerClass.bind(this));
	}
	
	async registerClass(e) {
		e.preventDefault();
		
		// obtain class series id
		const subjectId = $( "#yt_lnk_topic_id_main").attr("data-subject-id");
		if (!this.#loggedIn) {
			// go to login pageX 
			window.location.href = `./login.html?subject=${subjectId}`;
		}
		else {
			// go to class registration page
			window.location.href = `./class-register.html?subject=${subjectId}`;
		}	
	}
}

let teacherPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "index page ready!" );
	teacherPageHandler = new TeacherPageHandler(credMan);
});