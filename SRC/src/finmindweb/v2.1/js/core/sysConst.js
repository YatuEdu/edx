const sysConstants = {
	FINMIND_CRED_STORE_KEY: 		"finmind_cred_8838",
	FINMIND_WIZARD_STORE_KEY: 		"finmind_wizard_8838",
	FINMIND_BEST_PREMIUM_STORE_KEY: "finmind_bstprm_8838",
	FINMIND_BENEFICIARY_STORE_KEY: 	"finmind_beneficiary_8838",
	FINMIND_EXISTING_STORAGE_KEY: 	"finmind_existing_storage_8838",
    FINMIND_INQUIRIES_VIEW_KEY:     "finmind_inquiries_view_8838",
	FINMIND_POLICY_DETAIL:     "finmind_policy_detail_8838",

	// TODO: REMOVE THIS AFTER FinMind is moved to AWS
	FINMIND_PORT: "http://8.135.100.85:6012/bfwk-finmind",
	
	// tokn valid minutes
	FINMIND_TOKEN_VALID_IN_MIN: 0,
	
	// Max upload file sizeToContent
	MAX_FILE_SIZE:	40 * 1024 * 1024,
};

const stringConstants = {

};

export {sysConstants, stringConstants};
