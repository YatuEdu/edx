import {sysConstants, languageConstants} from './sysConst.js'
import {uiMan} from './uiManager.js';

class Net {
	/**
		Yatu API for user-login
	**/
	static composeRequestDataForLogin(userName, userPassword) {
		const loginData = {
			header: {
				token: "",
				api_id: 202102
			},
			data: {					
				name: userName,
				pwh: sha256(sha256(userPassword))
			}
		};
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(loginData),
		};
	}
		
	static async login(userName, userPassword) {
		const req = Net.composeRequestDataForLogin(userName, userPassword);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for user-sign up and register for Yatu service
	**/
	static composeRequestDataForSignUp(userName, email, userPassword) {
		const loginData = {
			header: {
				token: "",
				api_id: 202101
			},
			
			data: {					
				name: userName,
				email: email,
				fistName: userName,
				lastName: userName,
				pwh: sha256(sha256(userPassword))
			}
		};
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(loginData),
		};
	}
	
	static async signUp(userName, email, userPassword) {
		const req = Net.composeRequestDataForSignUp(userName, email, userPassword);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for user-token validness check.
		Warning: do not call too often
	**/
	static composeRequestDataForTokenCheck(t) {
		// query for the yatu token's validness
		const queryData = {
			header: {
				token: t,
				api_id: 200000
			},
		
			data: {}					
		};
			
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(queryData),
		};
	}
	
	static async tokenCheck(token) {
		const req = Net.composeRequestDataForTokenCheck(token);
		// remote call
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		Yatu API for logged in user to retirieve his groups
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
		Yatu API for logged in user to get new groups
	**/
	static compoesRequestForNewGroups(token, top) {
		// query for my groups
		const queryData = {
			header: {
				token: token,
				api_id: 202107
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
	
	static async getNewGroups(token, top) {
		const req = Net.compoesRequestForNewGroups(token, top);
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
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
	
	static async applyForAGroup(token, top) {
		const req = Net.compoesRequestFoGroupApplication(token, top);
		return await Net.remoteCall(sysConstants.YATU_AUTH_URL, req);
	}
	
	/**
		main method for doing Yatu post API calls
	**/
	static async remoteCall(url, requestOptions) {
		const ret = {data: null, code: 0, err: "" };
		
		try {
			
			const response = await fetch(url, requestOptions);
			
			if (!response.ok) {
				const message = uiMan.getTextWithParams(languageConstants.SERVER_ERROR_WITH_RESPONSE, response.status);
				throw new Error(message);
			}

			const data = await response.json();
			ret.data = data.data;
			ret.code = data.result.code
			if (ret.code !== 0) {
				ret.err = uiMan.getTextWithParams(languageConstants.SERVER_ERROR_WITH_RESPONSE, data.result.code);
			}
		}
		catch (err) {
			ret.err = err;
		}
		
		return ret;
	}
}

export { Net };