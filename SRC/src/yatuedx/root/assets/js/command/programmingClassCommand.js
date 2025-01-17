// PTC = prgramming-teaching command 
// PTCP = prgramming-teaching command parameter
// GM = general message
const PTCC_COMMANDS = { 
	GM_HELLO_FROM_PEER:					1,
	GM_HELLO_FROM_SYSTEM:				2,
	
	PTC_DISPLAY_BOARD_REFRESH:				100,
	PTC_DISPLAY_BOARD_ERASE:				101,
	PTC_DISPLAY_BOARD_HIGH_LIGHT:			102,
	PTC_DISPLAY_BOARD_VERTICALLY_SCROLL:	103,
	PTC_DISPLAY_BOARD_UPDATE:				104,
	PTC_DISPLAY_BOARD_CODE_FORMAT:			105,
	PTC_DISPLAY_BOARD_RE_SYNC:				106,
	
	PTC_CODE_RUN:							200,
	PTC_CODE_ERASE:							201,
	PTC_CODE_COMPILATION_RESULT:			202,
	PTC_CODE_SYNC:							203,

	PTC_CLASSROOM_SWITCH_MODE:			300,
	PTC_CLASSROOM_END:					301,
	PTC_STUDENT_ARRIVAL:				302,
	PTC_STUDENT_LEAVE:					303,
	PTC_USER_LIST:						304,
	PTC_PRIVATE_MSG:					305,
	PTC_PUBLIC_MSG:						306
};


export { PTCC_COMMANDS };