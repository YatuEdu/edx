import {credMan} 		from '../core/credMan.js'
import {AuthPage} 		from '../core/authPage.js'

// PTC = prgramming-teaching command 
// PTCP = prgramming-teaching command parameter
// GM = general message
const PTCC_COMMANDS = { 
	GM_HELLO_FROM_PEER:					1,
	GM_HELLO_FROM_SYSTEM:				2,
	
	PTCP_CLASSROOM_MODE_READONLY: 		0,
	PTCP_CLASSROOM_MODE_READWRITE: 		1,

	PTC_DISPLAY_BOARD_REFRESH:			100,
	PTC_DISPLAY_BOARD_ERASE:			101,
	PTC_DISPLAY_BOARD_HIGH_LIGHT:		102,
	PTC_DISPLAY_BOARD_UPDATE:			103,

	PTC_CODE_RUN:						200,
	PTC_CODE_ERASE:						201,
	PTC_CODE_COMPILATION_RESULT:		202,
	PTC_CODE_SYNC:						203,

	PTC_CLASSROOM_SWITCH_MODE:			300,
	PTC_CLASSROOM_END:					301,
};


export { PTCC_COMMANDS };