const sysConstants = {
	YATU_CRED_STORE_KEY: "yatu_cred_8838",
	YATU_AUTH_URL: "https://rtc.4thspace.cn/bfwk-privilege-management",
	YATU_SOCKET_URL: "wss://rtc.4thspace.cn/websocket",
	
	// TODO: REMOVE THIS AFTER FinMind is moved to AWS
	FINMIND_PORT: "http://8.135.100.85:6010/bfwk-finmind",
	
	// token valid time winodw
	YATU_TOKEN_VALID_IN_MIN: 10,
	
	// default board rows
	YATU_DEFAULT_BOARD_ROWS: 10,
	
	// role names
	YATU_ROLE_TEACHER: 'teacher',
	YATU_ROLE_ADMIN: 'admin',
	
	// URL param name:
	UPN_GROUP: 		'group',
	
	// UI STATES
	STATE_LANG_EN: 0,
	STATE_LANG_CN: 1,
	
	// UI Text Id
	SIGNIN_NAME_NEEDED: "login_page_name_not_empty",
	SIGNIN_PW_NEEDED: "login_page_pw_not_be_empty",
	SERVER_UNEXPECTED_ERR: "yatu_unexpected",
};

const sysConstStrings = {
	EMPTY: '',
	UNKNOWN: 'UNKNOWN',
	SWITCH_TO_LEARNING: 'Change classroom mode to learning (current mode: exercise)',
	SWITCH_TO_EXERCISE: 'Change classroom mode to exercise (current mode: learning)',
	
	ATTR_MODE: 'mode',
	TAB_STRING: '\t',
};

const languageConstants = {
	// UI STATES
	STATE_LANG_EN: 0,
	STATE_LANG_CN: 1,
	
	// UI Text Id
	SIGNIN: "p_inx_signin_btn_nm",				// index  sign in button text
	ACCOUNT: "p_inx_signin_btn_nm2",			// index  ACCOUNT button text
	HOME_LINK: "p_indx_link_home",				// index home link
	PAGE_LINK: "p_indx_link_pages",				// INDEX pages link
	SIGNIN_NAME_NEEDED: "p_login_fld_nm",		// login page error: name expected
	SIGNIN_PW_NEEDED: "p_login_fld_pw",			// login page error: pw expected
	SIGNUP_EMAIL_NEEDED: "p_signup_fld_em",		// login page error: pw expected

	SERVER_UNEXPECTED_ERR: "ge_une",			// generic error: unexpected service error
	SERVER_ERROR_WITH_RESPONSE: "ge_une_res",  	// generic error: unexpected service error
};

const groupTypeConstants = {
	// known group types:
	GPT_EDU_JSP: 10,
};

	
export {sysConstants, sysConstStrings, groupTypeConstants, languageConstants};
