import {sysConstants, languageConstants} from '../../assets/js/core/sysConst.js'

class Net {
	/**
		FinMind API for user-login
	**/
	static composeRequestDataForLogin(userName, userPassword) {
		const loginData = {
			header: {
				token: "",
				api_id: 201051
			},
			data: {					
				login_name: userName,
				pwhsh: sha256(sha256(userPassword))
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
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
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
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		finMind API for user-question
	**/
	static composeRequestDataForUserQuestionBlock(startBlock, token) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021801
			},
			data: {					
				currentBlockId: startBlock,
			}
		};
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		};
	}
		
	static async getBlockQuestions(startBlock, token) {
		const req = Net.composeRequestDataForUserQuestionBlock(startBlock, token);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
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
				ret.err = "error"; // uiMan.getTextWithParams(languageConstants.SERVER_ERROR_WITH_RESPONSE, data.result.code);
			}
		}
		catch (err) {
			ret.err = err;
		}
		return ret;
	}
}


export { Net };

	
