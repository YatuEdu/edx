import {sysConstants, languageConstants} 	from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {uiMan} 								from '../core/uiManager.js'
import {IndexPageHandler} 					from './index.js'
import {Net}                             	from '../core/net.js';
import {PageUtil, TimeUtil}					from '../core/util.js';

const GO_TO_CLASS_REGISTER_PAGE = "yt_lnk_topic_id_main";
const REPLACEMENT_WEEK_DAY = "{wkd}";
const REPLACEMENT_MONTH = "{mon}";
const REPLACEMENT_DAY = "{day}";
const REPLACEMENT_YEAR = "{yr}";
const REPLACEMENT_FROM_TIME = "{from}";
const REPLACEMENT_TO_TIME = "{to}";
const REPLACEMENT_SEATS = "{seats}";
const REPLACEMENT_ID = "{id}";

const CLASS_DATE_TEMPLATE = `
<div id="serirs_id_{id}" class="row">
<div class="col-lg-4 col-md-4 col-sm-4">
 <h5>{wkd},{mon} {day} {yr}</h5>
</div>
<div class="col-lg-4 col-md-4 col-sm-4">
 <h5>{from} ~ {to}</h5>
</div>
<div class="col-lg-4 col-md-4 col-sm-4">
 <h5>{seats}</h5>
</div>
</div>
`;

/**
	This class manages both login and sigup workflow
**/
class ClassRegisterPageHandler extends IndexPageHandler {
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
		const t = credMan.credential.token;
		
		// get serieId
		const paramMap = PageUtil.getUrlParameterMap();
		const sbjId = paramMap.get(sysConstants.UPN_SUBJECT);
		const ret = await Net.subjectClassSeries(t, sbjId);
		const columnHtml = this.formatClassSeries(ret.data);
		$("#yt_div_class_series").append(columnHtml);
	}
	
	formatClassSeries(seriesArray) {
		let html = '';
		seriesArray.forEach(s => {
			const date1 =TimeUtil.sqlDateToJsDate(s.start_date);
			const wd = date1.getDay();
			html += CLASS_DATE_TEMPLATE
						.replace(REPLACEMENT_ID, s.id)
						.replace(REPLACEMENT_WEEK_DAY, date1);
		});
		return html;
	}
	
	async registerClass(e) {
		e.preventDefault();
		
		
		if (!this.#loggedIn) {
			// go to login pageX 
			window.location.href = `./login.html?series=${seriesId}`;
		}
		else {
			// go to class register page
			const seriesId = $( "#yt_lnk_topic_id_main").attr("data-series-id");
			window.location.href = `./class-register.html?series=${seriesId}`;
		}	
	}
	
	// going to sign up directly
	/*
	redirectToSignup(e) {
		e.preventDefault();
		
		let emailId = $( "#yt_inpt_email").val();
		if (!emailId) {
			emailId = "enter_email";
		}
		let userName = $( "#yt_inpt_name").val();
		if (!userName) {
			userName = "enter_your_name";
		}
		// go to register page
		window.location.href = `./register.html?email=${emailId}&name=${userName}`;
	}
	
	// going to account page
	handleAccount(e) {
		e.preventDefault();
		
		// todo: go to account page
		window.location.href = "./group-man.html";
	}\
	*/
}

let classRegisterPageHandler = null;

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "classRegisterPageHandler page ready!" );
	classRegisterPageHandler = new ClassRegisterPageHandler(credMan);
});