import {sysConstants, languageConstants} from './sysConst.js'
import {uiMan} from './uiManager.js';

const API_FOR_TOKEN_CHECKING = 200000;
const API_FOR_SIGN_IN_WITH_NAME = 202102;
const API_FOR_REGISTER = 202101; 
const API_FOR_GET_ALL_MY_GROUPS = 202107;
const API_FOR_GET_TURN_AUTH = 202130;

const API_FOR_JOINING_GROUP_SESSION = 202111;
const API_FOR_MY_GROUPS = 202115;
const API_FOR_SUBJECT_SERIES = 202116;
const API_FOR_CLASS_SERIES_SCHEDULE = 202118;
const API_GET_NOTES_FOR_SERIES = 202119;
const API_ADD_NOTES = 202120;
const API_REGISTER_FOR_CLASS = 202121;
const API_USER_UPDATE_NOTES=202124;
const API_USER_GET_NOTES=202125;
const API_SEND_CODE_TO_EMAIL=202122;
const API_VALIDATE_EMAIL=202123; 
const API_ADD_CODE = 202126;
const API_LIST_CODE_HEADERS = 202128;
const API_GET_CODE_TEXT = 202129;
const API_DELETE_CODE = 202127;

const API_MEMBER_LIST_LIVE_SESSIONS = 202145; 
const API_OWNER_LIST_CLASSES = 202146;
const API_OWNER_START_CLASS = 202148;
const API_OWNER_STOP_CLASS = 202149;

class Net {
	/**
		Yatu API for user-login
	**/
	static async login(userName, userPassword) {
		const req = Net.composeRequestDataForLogin(userName, userPassword);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for user-sign-up
	**/
	static async signUp(userFirstName, userLastName, userLoginName, email, userPassword) {
		const req = Net.composeRequestDataForSignUp(userFirstName, userLastName, userLoginName, email, userPassword);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for request service to send 6-digit code with email to
		an email address
	**/
	static async sendCodeToEmail(emailAddr) {
		const req = Net.composeRequestDataForSendCodeToEmail(emailAddr);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for user-token validness check.
		Warning: do not call too often
	**/
	static async tokenCheck(token) {
		const req = Net.composeRequestDataForTokenCheck(token);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for email-code verification check.
	**/
	static async emailCodeCheck(email, code) {
		const req = Net.composeRequestDataForEmailCodeCheck(email, code);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for A GROUP MEMBER listing all LIVE SEssions for him at this time
	**/
	static async groupMemberListLiveSessions(token) {
		const req = Net.composeRequestDataForGroupMemberListLiveSessions(token);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for GROUP OWNER to start a live class
	**/	
	static async groupOwnerStartClass(t, clssId, seqId) {
		const req = Net.composeRequestDataForGroupOwnerStartClass(t, clssId, seqId);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}

	/**
		Yatu API for GROUP OWNER to start a live class
	**/	
	static async groupOwnerStopClass(t, sessionId) {
		const req = Net.composeRequestDataForGroupOwnerStopClass(t, sessionId);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for A GROUP OWNER listing all his classes (with sequences)
	**/
	static async groupOwnerListClasses(token) {
		const req = Net.composeRequestDataForGroupOwnerListClasses(token);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for A GROUP MEMBER joining a group session (a class, or a chat)
	**/
	static async groupMemberJoiningSession(token, grpId) {
		const req = Net.composeRequestDataForJoiningGroupSession(token, grpId);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for A user to get a list of all her group info
	**/
	static async groupMemberGetMyGroups(token) {
		const req = Net.composeRequestDataForMyGroups(token);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for retrieving class schedule for a class series
	**/
	static async classSeriesGetSchedule(token, seriesId) {
		const req = Net.composeRequestDataForClassSeriesSchedule(token, seriesId);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}

	/**
		Yatu API for retrieving all historical notes for a class series
	**/
	static async classGetNotes(token, groupId) {
		const req = Net.composeRequestDataForClassNotes(token, groupId);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for member to add code to code-depot
	**/
	static async memberAddCode(token, groupId, codeName, codeText, codeHash) {
		const req = Net.composeRequestDataForMemberAddCode(token, groupId, codeName, codeText, codeHash);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for member to list his code from code-depot
	**/
	static async memberListCode(token, groupId) {
		const req = Net.composeRequestDataForMemberListCode(token, groupId);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}

	/**
		Yatu API for member to get code text from code-depot by name
	**/
	static async memberGetCodeText(token, groupId, codeName) {
		const req = Net.composeRequestDataForMemberGetCodeText(token, groupId, codeName);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for member to delete code from code-depot by name
	**/
	static async memberDeleteCode(token, groupId, codeName) {
		const req = Net.composeRequestDataForMemberDeleteCode(token, groupId, codeName);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}

	/**
		Yatu API for adding notes for a class
	**/
	static async classUpdateNotes(token, groupId, text) {
		const req = Net.composeRequestDataForClassAddNotes(token, groupId, text);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}


	/**
		Yatu API for USER to update her class notes for class
	**/
	static async userUpdateClassNotes(token, groupId, text) {
		const req = Net.composeRequestDataForUserUpdateNotes(token, groupId, text);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}

	/**
		Yatu API for USER to get her class notes frombackend
	**/
	static async userGetClassNotes(token, groupId) {
		const req = Net.composeRequestDataForUserGetNotes(token, groupId);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}

	/**
		Yatu API for adding notes for a class
	**/
	static async registerForClassSeries(token, seriesId) {
		const req = Net.composeRequestDataForClassRegistration(token, seriesId);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}


	/**
		Yatu API for retrieving class schedule for a class series
	**/
	static async subjectClassSeries(token, subjectId) {
		const req = Net.composeRequestDataForSubjectClassSeries(token, subjectId);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}

	/**
		Yatu API for retrieving user's communiction groups
	**/
	static async getAllMyGroups(token, top) {
		const req = Net.compoesRequestForAllMyGroups (token, top);
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/********** Utility methods *******/
	
	/**
		Main method for doing Yatu post API calls
	**/
	static async remoteCall(url, requestOptions) {
		const ret = {data: null, code: 0, err: "" };
		
		try {		
			const response = await fetch(url, requestOptions);			
			if (!response.ok) {
				ret.err = uiMan.getTextWithParams(languageConstants.SERVER_ERROR_WITH_RESPONSE, response.status);
			}
			else {
				const data = await response.json();
				ret.data = data.data;
				ret.code = data.result.code
				if (ret.code !== 0) {
					ret.err = uiMan.getErrMsg(data.result.code);
				}
			}
		}
		catch (e) {
			ret.err = e.message;
		}
		return ret;
	}
	
	/********** Private methods for composing request data for Async public API above *******/
	
	/*
		finMind API request format for Login (with email) API
	*/
	static composeRequestDataForLogin(userName, userPassword) {
		const loginData = {
			header: {
				token: "",
				api_id: API_FOR_SIGN_IN_WITH_NAME
			},
			data: {					
				name: userName,
				pwh: sha256(sha256(userPassword))
			}
		};
		return Net.composePostRequestFromData_private(loginData);
	}
	
	/**
		Forming Yatu API request data for user-sign up and register for Yatu service
	**/
	static composeRequestDataForSignUp(userFirstName, userLastName, userLoginName, email, userPassword) {
		const signupData = {
			header: {
				token: "",
				api_id: API_FOR_REGISTER
			},
			
			data: {					
				name: userLoginName,
				email: email,
				fistName: userFirstName,
				lastName: userLastName,
				pwh: sha256(sha256(userPassword))
			}
		};
		return Net.composePostRequestFromData_private(signupData);
	}
	
	/**
		Forming Yatu API request data for TOKEN validity test
	**/	
	static composeRequestDataForTokenCheck(t) {
		// query for the yatu token's validness
		const tokenCheckReq = {
			header: {
				token: t,
				api_id: API_FOR_TOKEN_CHECKING
			},
		
			data: {}					
		};
			
		return Net.composePostRequestFromData_private(tokenCheckReq);
	}
	
	/**
		Forming Yatu API request data for EMAIL code validity test
	**/	
	static composeRequestDataForSendCodeToEmail(emailAddr) {
		// query for the yatu token's validness
		const emailSendCodeReq = {
			header: {
				token: "",
				api_id: API_SEND_CODE_TO_EMAIL
			},
		
			data: {
				userEmail: emailAddr,
			}					
		};
			
		return Net.composePostRequestFromData_private(emailSendCodeReq);
	}
	
	/**
		Forming Yatu API request data for EMAIL code validity test
	**/	
	static composeRequestDataForEmailCodeCheck(email, code) {
		// query for the yatu token's validness
		const emailCodeCheckReq = {
			header: {
				token: "",
				api_id: API_VALIDATE_EMAIL
			},
		
			data: {
				userEmail: email,
				veriCode: code
			}					
		};
			
		return Net.composePostRequestFromData_private(emailCodeCheckReq);
	}
	
	/**
		Forming Yatu API request data for GROUP MEMBER listing all LIVE SESSION at this time
	**/	
	static composeRequestDataForGroupMemberListLiveSessions(t) {
			// query for the yatu token's validness
		const emailCodeCheckReq = {
			header: {
				token: t,
				api_id: API_MEMBER_LIST_LIVE_SESSIONS
			},
		
			data: {
			}					
		};
			
		return Net.composePostRequestFromData_private(emailCodeCheckReq);
	}
	
	
	/**
		Forming Yatu API request data for GROUP OWNER start a live class
	**/	
	static composeRequestDataForGroupOwnerStartClass(t, clssId, seqId) {
			// query for the yatu token's validness
		const emailCodeCheckReq = {
			header: {
				token: t,
				api_id: API_OWNER_START_CLASS
			},
		
			data: {
				classId: clssId,
				sequenceId: seqId
			}					
		};
			
		return Net.composePostRequestFromData_private(emailCodeCheckReq);
	}

	/**
		Forming Yatu API request data for GROUP OWNER to stop a live class
	**/	
	static composeRequestDataForGroupOwnerStopClass(t, sId) {
		// query for the yatu token's validness
		const emailCodeCheckReq = {
			header: {
				token: t,
				api_id: API_OWNER_STOP_CLASS
			},
		
			data: {
				sessionId: sId,
			}					
		};
			
		return Net.composePostRequestFromData_private(emailCodeCheckReq);
	}
	
	
	/**
		Forming Yatu API request data for GROUP OWNER listing all his classes
	**/	
	static composeRequestDataForGroupOwnerListClasses(t) {
			// query for the yatu token's validness
		const emailCodeCheckReq = {
			header: {
				token: t,
				api_id: API_OWNER_LIST_CLASSES
			},
		
			data: {
			}					
		};
			
		return Net.composePostRequestFromData_private(emailCodeCheckReq);
	}
	
	/**
		Forming Yatu API request data for joining a group
	**/	
	static composeRequestDataForJoiningGroupSession(t, grpId) {
		if (typeof grpId === 'string') {
			grpId =  parseInt(grpId, 10);
		}
		const joiningGroupSessionReq = {
			header: {
				token: t,
				api_id: API_FOR_JOINING_GROUP_SESSION
			},
			data: {
				groupId: grpId
			}
		};
		return Net.composePostRequestFromData_private(joiningGroupSessionReq);
    }
	
	/**
		Forming Yatu API request data for getting all my group info
	**/	
	static composeRequestDataForMyGroups(t) {
		const myGroupsReq = {
			header: {
				token: t,
				api_id: API_FOR_MY_GROUPS
			},
			data: {
			}
		};
		return Net.composePostRequestFromData_private(myGroupsReq);
    }

	/**
		Forming Yatu API request data for getting Class Series Schedule
	**/	
	static composeRequestDataForClassSeriesSchedule(t, sId) {
		const sIdi =  parseInt(sId, 10);
		const myGroupsReq = {
			header: {
				token: t,
				api_id: API_FOR_CLASS_SERIES_SCHEDULE
			},
			data: {
				seriesId: sIdi
			}
		};
		return Net.composePostRequestFromData_private(myGroupsReq);
	}
		
	/**
		Forming Yatu API request data for getting Class Notes
	**/	
	static composeRequestDataForClassNotes(t, gId) {
		const gIdi =  parseInt(gId, 10);
		const myGroupsReq = {
			header: {
				token: t,
				api_id: API_GET_NOTES_FOR_SERIES
			},
			data: {
				groupId: gIdi
			}
		};
		return Net.composePostRequestFromData_private(myGroupsReq);
	}

	/**
		Forming Yatu API request data for adding code to code depot
	**/
	static composeRequestDataForMemberAddCode(t, groupId, codeName, codeText, codeHash) {
		const intGroupId =  parseInt(groupId, 10);
		const apiRequest = {
			header: {
				token: t,
				api_id: API_ADD_CODE
			},
			data: {
				groupId: intGroupId,
				name: codeName,
				code: codeText,
				hash: codeHash
			}
		};
		return Net.composePostRequestFromData_private(apiRequest);
	}	
	
	/**
		Forming Yatu API request data for listing code heasers (name, hash)
	**/
	static composeRequestDataForMemberListCode(t, groupId) {
		const intGroupId =  parseInt(groupId, 10);
		const apiRequest = {
			header: {
				token: t,
				api_id: API_LIST_CODE_HEADERS
			},
			data: {
				groupId: intGroupId
			}
		};
		return Net.composePostRequestFromData_private(apiRequest);
	}

	/**
		Forming Yatu API request data for get code text
	**/
	static composeRequestDataForMemberGetCodeText(t, groupId, codeName) {
		const intGroupId =  parseInt(groupId, 10);
		const apiRequest = {
			header: {
				token: t,
				api_id: API_GET_CODE_TEXT
			},
			data: {
				groupId: intGroupId,
				name: codeName
			}
		};
		return Net.composePostRequestFromData_private(apiRequest);
	}	

	/**
		Forming Yatu API request data for deleting code by name
	**/
	static composeRequestDataForMemberDeleteCode(t, groupId, codeName) {
		const intGroupId =  parseInt(groupId, 10);
		const apiRequest = {
			header: {
				token: t,
				api_id: API_DELETE_CODE
			},
			data: {
				groupId: intGroupId,
				name: codeName
			}
		};
		return Net.composePostRequestFromData_private(apiRequest);
	}			
	
	/**
		Forming Yatu API request data for adding class notes
	**/
	static composeRequestDataForClassAddNotes(t, gId, txt) {
		const gIdi =  parseInt(gId, 10);
		const myGroupsReq = {
			header: {
				token: t,
				api_id: API_ADD_NOTES
			},
			data: {
				groupId: gIdi,
				notes: txt
			}
		};
		return Net.composePostRequestFromData_private(myGroupsReq);
	}	
	
	/**
		Forming Yatu API request data for adding class notes
	**/
	static composeRequestDataForUserUpdateNotes(t, gId, txt) {
		const gIdi =  parseInt(gId, 10);
		const myGroupsReq = {
			header: {
				token: t,
				api_id: API_USER_UPDATE_NOTES
			},
			data: {
				groupId: gIdi,
				notes: txt,
				updateNotes: 1
			}
		};
		return Net.composePostRequestFromData_private(myGroupsReq);
	}	
	
	/**
		Forming Yatu API request data for adding class notes
	**/
	static composeRequestDataForUserGetNotes(t, gId) {
		const gIdi =  parseInt(gId, 10);
		const myGroupsReq = {
			header: {
				token: t,
				api_id: API_USER_GET_NOTES
			},
			data: {
				groupId: gIdi
			}
		};
		return Net.composePostRequestFromData_private(myGroupsReq);
	}	
	
	/**
		Forming Yatu API request data for applying to register for a class offering
	**/
	static composeRequestDataForClassRegistration(t, sId) {
		const sIdi =  parseInt(sId, 10);
		const myGroupsReq = {
			header: {
				token: t,
				api_id: API_REGISTER_FOR_CLASS
			},
			data: {
				seriesId: sIdi
			}
		};
		return Net.composePostRequestFromData_private(myGroupsReq);
	}	
	
	
	/**
		Forming Yatu API request data for getting Class Series FOR A Subject
	**/	
	static composeRequestDataForSubjectClassSeries(t, sbjId) {
		const sbjIdi =  parseInt(sbjId, 10);
		const myGroupsReq = {
			header: {
				token: t,
				api_id: API_FOR_SUBJECT_SERIES
			},
			data: {
				subjectId: sbjIdi,
				startDate: null
			}
		};
		return Net.composePostRequestFromData_private(myGroupsReq);
	}
	
	/**
		forming request data for Yatu API calls
	**/
	static composePostRequestFromData_private(data) {
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		};
	}
	
	/**
		XX Yatu API for logged in user to retirieve his groups
	**/
	static composeRequestDataForGroupGetter(token) {
		// query for my groups
		const queryData = {
			header: {
				token: token,
				api_id: 202104
			},
		
			data: {}					
		};
			
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(queryData),
		};
	}
	
	
	static async getMyGroup(token) {
		const req = Net.composeRequestDataForGroupGetter(token);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for logged in user to get her groups
	**/  
	static compoesRequestForAllMyGroups(token, top) {
		// query for my groups
		const queryData = {
			header: {
				token: token,
				api_id: API_FOR_GET_ALL_MY_GROUPS
			},
		
			data: {
				top: 10
			}					
		};
			
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(queryData),
		};
	}
	
	/**
		Yatu API for logged in user to apply membership for a group
	**/
	static compoesRequestFoGroupApplication(token, groupId) {
		// query for apply for a group
		const queryData = {
			header: {
				token: token,
				api_id: 202105
			},
		
			data: {
				groupId: groupId
			}					
		};
			
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(queryData),
		};
	}
	
	static async applyForAGroup(token, groupId) {
		const req = Net.compoesRequestFoGroupApplication(token, groupId);
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}

	/**
	 Yatu API for logged in user to get her turn server auth(userName&&password)
	 **/
	static composeRequestDataForGetTurnAuth(token) {
		// query for my groups
		const queryData = {
			header: {
				token: token,
				api_id: API_FOR_GET_TURN_AUTH
			},

			data: {
			}
		};

		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(queryData),
		};
	}

	static async getTurnAuth(token) {
		const req = Net.composeRequestDataForGetTurnAuth(token);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
}

export { Net };