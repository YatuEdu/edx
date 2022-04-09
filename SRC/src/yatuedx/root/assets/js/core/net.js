import {sysConstants, languageConstants} from './sysConst.js'
import {uiMan} from './uiManager.js';

const API_FOR_TOKEN_CHECKING = 200000;
const API_FOR_SIGN_IN_WITH_NAME = 202102;
const API_FOR_REGISTER = 202101; 
const API_FOR_GET_ALL_MY_GROUPS = 202107;

const API_FOR_JOINING_GROUP_SESSION = 202111;
const API_FOR_MY_GROUPS = 202115;
const API_FOR_SUBJECT_SERIES = 202116;
const API_FOR_CLASS_SERIES_SCHEDULE = 202118;
const API_GET_NOTES_FOR_SERIES = 202119;
const API_ADD_NOTES = 202120;
const API_REGISTER_FOR_CLASS = 202121;

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
	static async signUp(userName, email, userPassword) {
		const req = Net.composeRequestDataForSignUp(userName, email, userPassword);
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
		Yatu API for adding notes for a class
	**/
	static async classAddNotes(token, groupId, text) {
		const req = Net.composeRequestDataForClassAddNotes(token, groupId, text);
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
	static composeRequestDataForSignUp(userName, email, userPassword) {
		const signupData = {
			header: {
				token: "",
				api_id: API_FOR_REGISTER
			},
			
			data: {					
				name: userName,
				email: email,
				fistName: userName,
				lastName: userName,
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
}

export { Net };