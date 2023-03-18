const sysConstants = Object.freeze({
	// system resources
	YATU_CRED_STORE_KEY: "yatu_cred_8838",
	YATU_AUTH_URL: "https://rtc.4thspace.cn/bfwk-privilege-management",
	YATU_SOCKET_URL: "wss://rtc.4thspace.cn/websocket",
	
	// token valid time winodw
	YATU_TOKEN_VALID_IN_MIN: 10,
	
	// default board rows
	YATU_DEFAULT_BOARD_ROWS: 10,
	
	// default max loop count
	YATU_DEFAULT_MAX_LOOPS_WITH_IO: 1000,
	YATU_DEFAULT_MAX_LOOPS_WITHOUT_IO: 100000,
	
	// code buffer refresh time (ms)
	YATU_CODE_BUFFER_REFRESH_FREQUENCY: 5000,
	
	// role names
	YATU_ROLE_TEACHER: 'teacher',
	YATU_ROLE_ADMIN: 'admin',
	
	// URL param name:
	UPN_GROUP: 		'group',
	UPN_TEACHER: 	'teacher',
	UPN_EMAIL:		'email',
	UPN_NAME: 		'name',
	UPN_SERIES:		'series',
	UPN_SUBJECT:	'subject',
	UPN_MODE:		'mode',
	
	// UI STATES
	STATE_LANG_EN: 0,
	STATE_LANG_CN: 1,
	
	// UI Text Id
	SIGNIN_NAME_NEEDED: "login_page_name_not_empty",
	SIGNIN_PW_NEEDED: "login_page_pw_not_be_empty",
	SERVER_UNEXPECTED_ERR: "yatu_unexpected",
});

const sysConstStrings = Object.freeze({
	EMPTY: '',
	UNKNOWN: 'UNKNOWN',
	SWITCH_TO_LEARNING: 'Current mode: exercise',
	SWITCH_TO_EXERCISE: 'Current mode: learning',
	
	ATTR_MODE: 'mode',
	TAB_STRING: '\t',
	
	TAG_PARSER_ADDED_COMMENT: 'sys_inserted_comment',
	
	// output text during code running:
	
});

const languageConstants = Object.freeze({
	// UI STATES
	STATE_LANG_EN: 0,
	STATE_LANG_CN: 1,
	TAB_SPACE: 4,
	
	// UI Text Id
	SIGNIN: "p_inx_signin_btn_nm",				// index  sign in button text
	ACCOUNT: "p_inx_signin_btn_nm2",			// index  ACCOUNT button text
	HOME_LINK: "p_indx_link_home",				// index home link
	PAGE_LINK: "p_indx_link_pages",				// INDEX pages link
	SIGNIN_NAME_INVALID_CHAR: "p_login_fld_nm_char", // login page error: name invalid
	SIGNIN_NAME_NEEDED: "p_login_fld_nm",		// login page error: name expected
	SIGNIN_PW_NEEDED: "p_login_fld_pw",			// login page error: pw expected
	SIGNIN_PW_NOT_IDENTICAL: "p_login_fld_pw_not_identical",			// login page error: pw expected
	SIGNUP_EMAIL_NEEDED: "p_signup_fld_em",		// login page error: pw expected
	SIGNUP_TNA_NEEDED: "tna_needed",		// login page error: pw expected

	SERVER_UNEXPECTED_ERR: "ge_une",			// generic error: unexpected service error
	SERVER_ERROR_WITH_RESPONSE: "ge_une_res",  	// generic error: unexpected service error
});

const groupTypeConstants = Object.freeze({
	// known group types:
	GPT_EDU_JSP: 10,
});

const regexConstants = Object.freeze({
	// email regex :
	REG_FOR_EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
});

const uiConstants = Object.freeze({
	// vedio id template :
	VIDEO_ID_TEMPLATE: "yt_video_",
	VIDEO_AREA_ID: "yt_video_area",
});
	
export {sysConstants, sysConstStrings, groupTypeConstants, languageConstants, regexConstants, uiConstants};
