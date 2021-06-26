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
		FinMind API for registering a new user
	**/	
	static async signUp(userFirstName, userMiddleName, userLastName, email, userPassword) {
		const req = Net.composeRequestDataForSignUp_private(userFirstName, userMiddleName, userLastName, email, userPassword);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for user sign-out
	**/
	static async signOut(token) {
		const req = Net.composeRequestDataForSignOut_private(token);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for starting an application for a product id
	**/	
	static async startAplication(prodId, token) {
		const req = Net.composeRequestDataForStartAplication_private(prodId, token);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for getting a block of user-questions
	**/	
	static async getBlockQuestions(appId, token) {
		const req = Net.composeRequestDataForUserQuestionBlock_private(appId, token);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for getting basic info for a block
	**/	
	static async getBlockInfo(blockId) {
		const req = Net.composeRequestDataForBlockInfo_private(blockId);
		// remote call
		const res = await Net.remoteCall(sysConstants.FINMIND_PORT, req);
		if (res.error) {
			return {error: res.error};
		}
		else {
			return {
						blockName:        res.data[0].name,
						blockDescription: res.data[0].description
			       };
		}
	}
	
	/**
		FinMind API for saving a block of user-questions-answerws
	**/	
	static async saveBlockQuestions(appId, blckId, questions, token) {
		const req = Net.composeRequestDataForSavingUserQuestionBlock_private(appId, blckId, questions, token);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for getting the next block of user-questions for anonymous user
	**/	
	static async getWizardQuestions(prodId, blckId) {
		const req = Net.composeRequestDataForNextWizardBlock_private(prodId, blckId);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for updating block branching information
	**/	
	static async agentUpdateBlockBranchingConditions(token, blockId, xml) {
		const req = Net.composeRequestDataForUpdateBlockBranchingConditions_private(token, blockId, xml);
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
		compose finMind API request for starting to apply for a product
	**/
	static composeRequestDataForStartAplication_private(prodId, token){
		const requestData = {
			header: {
				token: token,
				api_id: 2021807
			},
			data: {					
				prodId: prodId,
				applicantRelationShip: 0
			}
		};
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		};
	}
	
	/**
		compose finMind API request for user-question
	**/
	static composeRequestDataForUserQuestionBlock_private(appId, token) {
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
		Yatu API for user-sign up and register for Yatu service
	**/
	static composeRequestDataForSignUp_private(userFirstName, userMiddleName, userLastName, email, userPassword) {
		const loginData = {
			header: {
				token: "",
				api_id: 202101
			},
			
			data: {					
				name: email,
				email: email,
				fistName: userFirstName,
				middleName: userMiddleName,
				lastName: userLastName,
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
		Yatu API request for user sign-out
	**/
	static composeRequestDataForSignOut_private(token) {
		const loginData = {
			header: {
				token: token,
				api_id: 200001
			},
			
			data: {					
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
		finMind request forming for block info retriever API
	**/
	static composeRequestDataForBlockInfo_private(blckId) {
		const requestData = {
			header: {
				token: "",
				api_id: 2021817
			},
			data: {
				blockId: blckId,
			}
		};
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		};
	}
	
	/**
		finMind request forming for saving user questions API
	**/
	static composeRequestDataForSavingUserQuestionBlock_private(aid, bid, questionsXml, token) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021806
			},
			data: {
				appId: aid,
				blockId: bid,
				qAndA: questionsXml,
			}
		};
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		};
	}
	
	/**
		finMind request forming for API of obtaining next block of wizard questions
	**/
	static composeRequestDataForNextWizardBlock_private(prodId, blckId) {
		const requestData = {
			header: {
				token: "",
				api_id: 202183
			},
			data: {
				productId: prodId,
				currentBlockId: blckId,
			}
		};
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		};
	}
	
	/**
		finMind request forming for API of updating block branching information
	**/
	static composeRequestDataForUpdateBlockBranchingConditions_private(token, blockId, xml) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021815
			},
			data: {
				blockId: blockId,
				conditionXML: xml,
			}
		};
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		};
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

	
