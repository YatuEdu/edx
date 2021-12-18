const sysConstants = {
	YATU_CRED_STORE_KEY: "yatu_cred_8838",
	YATU_AUTH_URL: "https://rtc.4thspace.cn/bfwk-privilege-management",
	
	// UI STATES
	STATE_LANG_EN: 0,
	STATE_LANG_CN: 1,
	
	// UI Text Id
	SIGNIN_NAME_NEEDED: "login_page_name_not_empty",
	SIGNIN_PW_NEEDED: "login_page_pw_not_be_empty",
	SERVER_UNEXPECTED_ERR: "yatu_unexpected",
};

const languageConstants = {
	// UI STATES
	STATE_LANG_EN: 0,
	STATE_LANG_CN: 1,
	
	// UI Text Id
	SIGNIN_NAME_NEEDED: "p_login_f_nm",			// login page error: name expected
	SIGNIN_PW_NEEDED: "p_login_f_pw",			// login page error: pw expected
	SERVER_UNEXPECTED_ERR: "ge_une",			// generic error: unexpected service error
	SERVER_ERROR_WITH_RESPONSE: "ge_une_res",  	// generic error: unexpected service error
};

export {sysConstants, languageConstants};
