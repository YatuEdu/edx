import {sysConstants} from './sysConst.js'

class Net {
	/**
		FinMind API for user-login
	**/
	static async login(userName, userPassword) {
		const req = Net.composeRequestDataForLogin_private(userName, userPassword);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for getting a block of user-questions
	**/	
	static async getBlockQuestions(startBlock, token) {
		const req = Net.composeRequestDataForUserQuestionBlock(startBlock, token);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for saving a block of user-questions-answerws
	**/	
	static async saveBlockQuestions(questions, token) {
		const req = Net.composeRequestDataForSavingUserQuestionBlock_private(questions, token);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		Yatu API for user-token validness check.
		Warning: do not call too often
	**/
	static async tokenCheck(token) {
		const req = Net.composeRequestDataForTokenCheck_private(token);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		finMind API for user-question
	**/
	static composeRequestDataForUserQuestionBlock(appId, token) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021805
			},
			data: {					
				appId: appId,
			}
		};
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		};
	}
	
	/*
		finMind API request forming for Login API
	*/
	static composeRequestDataForLogin_private(userName, userPassword) {
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
	
	/**
		finMind request forming for token validation
	**/
	static composeRequestDataForTokenCheck_private(t) {
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
	
	/**
		finMind request forming for saving user questions API
	**/
	static composeRequestDataForSavingUserQuestionBlock_private(questions, token) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021802
			},
			data: {					
				qa: Net.formQuestionsXml_private(questions),
			}
		};
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		};
	}
	
	/**
		To save a block of questions in XML format to reduce
		service call and DB trafic.
	**/
	static formQuestionsXml_private(questions) {
		let xml = '<block>';
		for(let i = 0; i < questions.length; i++) {
			xml += questions[i].serverXML;
		}
		xml += '</block>';
		return xml;
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

	
