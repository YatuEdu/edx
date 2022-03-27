import {sysConstants, languageConstants} 	from '../core/sysConst.js'
import {credMan} 							from '../core/credMan.js'
import {uiMan} 								from '../core/uiManager.js'
import {IndexPageHandler} 					from './index.js'
import {Net}                             	from '../core/net.js';
import {PageUtil, TimeUtil}					from '../core/util.js';

const GO_TO_CLASS_REGISTER_PAGE = "yt_lnk_topic_id_main";
const BTN_CLASS_FOR_REGISTER="yt_btn_clss_register_class";
const ATTR_FOR_REGISTER_BUTTON="data-series";
const REPLACEMENT_BEGIN_DAY = "{bdate}";
const REPLACEMENT_END_DAY = "{edate}";
const REPLACEMENT_MONTH = "{mon}";
const REPLACEMENT_DAY = "{day}";
const REPLACEMENT_YEAR = "{yr}";
const REPLACEMENT_FROM_TIME = "{from}";
const REPLACEMENT_TO_TIME = "{to}";
const REPLACEMENT_SEATS = "{seats}";
const REPLACEMENT_ID = "{id}";
const REPLACEMENT_BTN = "{btn}";
const REPLACEMENT_ATTR = "{attr}";
const CLASS_DATE_TEMPLATE = `
<div id="serirs_id_{id}" class="row">
<div class="col-lg-4 col-md-4 col-sm-4">
 <h5>{bdate} ~ {edate}</h5>
</div>
<div class="col-lg-4 col-md-4 col-sm-4">
 <h5>{from} ~ {to} Pacific time</h5>
</div>
<div class="col-lg-4 col-md-4 col-sm-4">
 <h5>{seats} seats open</h5>
 <button {attr}="{id}" class="{btn} btn btn-danger">Register</button>
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
		
		const {subject, columnHtml} = this.formatClassSeries(ret.data);
		$("#yt_title_class").html(subject);
		$("#yt_div_class_series").append(columnHtml);
		// handle registration events
		const btnClass = `.${BTN_CLASS_FOR_REGISTER}`;
		$("#yt_div_class_series").append(columnHtml);
		$(btnClass).click(this.handleRegistration.bind(this));
	}
	
	formatClassSeries(seriesArray) {
		let columnHtml = '';
		let subject = '';
		seriesArray.forEach(s => {
			subject = s.subject;
			const date1 =TimeUtil.sqlDateToJsDate(s.start_date);
			const bd = date1.toDateString();
			const date2 =TimeUtil.sqlDateToJsDate(s.end_date);
			const ed = date2.toDateString();
			columnHtml += CLASS_DATE_TEMPLATE
						.replace(new RegExp(REPLACEMENT_ID, 'g'), s.id)
						.replace(REPLACEMENT_BEGIN_DAY, bd)
						.replace(REPLACEMENT_END_DAY, ed)
						.replace(REPLACEMENT_FROM_TIME, s.start_time)
						.replace(REPLACEMENT_TO_TIME, s.end_time)
						.replace(REPLACEMENT_SEATS, s.seats_open)
						.replace(REPLACEMENT_BTN, BTN_CLASS_FOR_REGISTER)
						.replace(REPLACEMENT_ATTR,ATTR_FOR_REGISTER_BUTTON);
		});
		return {subject, columnHtml};
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
	
	async handleRegistration(e) {
		e.preventDefault();
		const seriesId = e.target.getAttribute(ATTR_FOR_REGISTER_BUTTON);
		
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