const sysConstants = {
	FINMIND_CRED_STORE_KEY: "finmind_cred_8838",
	FINMIND_WIZARD_STORE_KEY: "finmind_wizard_8838",
	
	// TODO: REMOVE THIS AFTER FinMind is moved to AWS
	FINMIND_PORT: "http://8.135.100.85:6012/bfwk-finmind",
	
	// tokn valid minutes
	FINMIND_TOKEN_VALID_IN_MIN: 59,
	
	// Max upload file sizeToContent
	MAX_FILE_SIZE:	40 * 1024 * 1024,
};

const stringConstants = {

};

export {sysConstants, stringConstants};
