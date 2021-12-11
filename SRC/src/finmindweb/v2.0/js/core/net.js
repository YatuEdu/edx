import {sysConstants} from './sysConst.js'

const API_FOR_BENEFICIARY_INFO = 2021819;
const API_FOR_CONTINGENT_BENEFICIARY_INFO = 2021821;
const API_FOR_FILE_UPLOAD = 2021818; 
const API_FOR_MESSAGE_RETRIEVAL = 2021823;
const API_FOR_MESSAGE_SENDING = 2021824;
const API_FOR_PIPELINE_BLOCKS = 2021829;
const API_FOR_GETTING_QA_IN_BLOCK = 2021830;
const API_FOR_SIGN_IN_WITH_EMAIL = 2021830;
const API_FOR_SIGN_IN_WITH_NAME = 202102;

const FILE_UPLOAD_OP = 1;
const FILE_LIST_OP = 2;
const FILE_DOWNLOAD_OP = 3;
const FILE_DELETE_OP = 4;

const EMPTY_FILE_NAME = '';

class Net {
	/**
		FinMind API for user-login
	**/
	static async login(userName, userPassword) {
		const req = Net.composeRequestDataForLogin_private(userName, userPassword);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	static async loginWithEmail(email, userPassword) {
		const req = Net.composeRequestDataForLoginWithEmail_private(email, userPassword);
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
		FinMind API for getting app beneficiary 
	**/	
	static async getBeneficiaryInfo(appId, token) {
		const req = Net.composeRequestDataForAppBeneficiaryInfo_private(appId, token, API_FOR_BENEFICIARY_INFO);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for getting app CONTINGENT beneficiary INFO
	**/	
	static async getContingentBeneficiaryInfo(appId, token) {
		const req = Net.composeRequestDataForAppBeneficiaryInfo_private(appId, token, API_FOR_CONTINGENT_BENEFICIARY_INFO);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for getting app existing isurance
	**/	
	static async getEixstingInsuranceInfo(appId, token) {
		const req = Net.composeRequestDataForAppEixstingInsuranceInfo_private(appId, token);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for getting all block ids for all the answered questions 
		for an application for a given user
	**/	
	static async getAppPipelineBlocks(appId, token) {
		const req = Net.composeRequestDataForAppPipelineBlocks_private(appId, token);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for getting all the answered questions 
		for a given pipeline block of an application for a given user
	**/	
	static async getQAForBlockOfApp(appId, blockId, token) {
		const req = Net.composeRequestDataForGettingQAForABlock_private(appId, blockId, token);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
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
		FinMind API for getting a QUOTE premium 
	**/	
	static async getPremiumQuote(xml, token) {
		const req = Net.composeRequestDataForGetPremiumQuote_private(xml, token);
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
	 *  API for file uploading
	 *	operation:
	 *     1 upload
	 *     2 list
	 *     3 download
	 *     4 delete
	 */
	static async fileUpload(t, uploadFileName, pipleLineKey, appKey, conversationKey) {
		const req = Net.composeRequestDataForFileOperation_private(
						t, uploadFileName, 
						pipleLineKey, appKey,
						conversationKey, 
						FILE_UPLOAD_OP);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
	 *  API for file listing
	 *	operation:
	 *     1 upload
	 *     2 list
	 *     3 download
	 *     4 delete
	 */
	static async getUploadedFiles(t, pipleLineKey, appKey, conversationKey) {
		const req = Net.composeRequestDataForFileOperation_private(
						t, EMPTY_FILE_NAME, 
						pipleLineKey, appKey, 
						conversationKey, 
						FILE_LIST_OP);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
	 *  API for file removal
	 *	operation:
	 *     1 upload
	 *     2 list
	 *     3 download
	 *     4 delete
	 */
	static async deleteUploadedFiles(t, uploadFileName, pipleLineKey, appKey, conversationKey) {
		const req = Net.composeRequestDataForFileOperation_private(
						t, uploadFileName, 
						pipleLineKey, appKey, 
						conversationKey, 
						FILE_DELETE_OP);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
	 *  API for file downloading
	 *	operation:
	 *     1 upload
	 *     2 list
	 *     3 download
	 *     4 delete
	 */
	static async downloadUploadedFiles(t, uploadFileName, pipleLineKey, appKey, conversationKey) {
		const req = Net.composeRequestDataForFileOperation_private(
						t, uploadFileName, 
						pipleLineKey, appKey, 
						conversationKey, 
						FILE_DOWNLOAD_OP);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
		
	/**
		FinMind API for getting all messages 
	**/	
	static async getMessages(appId, token) {
		const req = Net.composeRequestDataForGetMessages_private(appId, token, API_FOR_MESSAGE_RETRIEVAL);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}
	
	/**
		FinMind API for sending a message 
	**/	
	static async sendMessages(appId, type, msg, token) {
		const req = Net.composeRequestDataForSendingMessages_private(appId, token, type, msg, API_FOR_MESSAGE_SENDING);
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
		return Net.composePostRequestFromData_private(requestData);
	}
	
	static composeRequestDataForGetMessages_private(applicationId, t, apiId) {
		const requestData = {
			header: {
				token: t,
				api_id: apiId
			},
			data: {
				appId: applicationId
			}
		};
		return Net.composePostRequestFromData_private(requestData);
	}
	
	static composeRequestDataForSendingMessages_private(applicationId, t, type, msgText, apiId) {
		const requestData = {
			header: {
				token: t,
				api_id: apiId
			},
			data: {
				appId: applicationId,
				msgType: type,
				msg: msgText
			}
		};
		return Net.composePostRequestFromData_private(requestData);
	}
	
	static composeRequestDataForFileOperation_private(t, uploadFileName, pipleLineKey, appKey, conversationKey, op) {
		const requestData = {
			header: {
				token: t,
				api_id: API_FOR_FILE_UPLOAD
			},
			data: {
				pipelineKey: pipleLineKey,
				applicationKey: appKey,
				conversationKey: conversationKey,
				fileName: uploadFileName,
				operationType: op
			}
		};
		
		return Net.composePostRequestFromData_private(requestData);
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
		return Net.composePostRequestFromData_private(requestData);
	}
	
	/**
		compose finMind API request for app-beneficiary
	**/
	static composeRequestDataForAppBeneficiaryInfo_private(appId, token, apiId) {
		const requestData = {
			header: {
				token: token,
				api_id: apiId
			},
			data: {					
				appId: appId,
			}
		};
		return Net.composePostRequestFromData_private(requestData);
	}
	
	static composeRequestDataForAppPipelineBlocks_private(appId, token) {
		const requestData = {
			header: {
				token: token,
				api_id: API_FOR_PIPELINE_BLOCKS
			},
			data: {					
				appId: appId,
			}
		};
		return Net.composePostRequestFromData_private(requestData);
	}
	
	/*
		Compose request for API: API_FOR_GETTING_QA_IN_BLOCK to get all questions/answers
		for a given block.
	*/
	static composeRequestDataForGettingQAForABlock_private(appId, blockId, token) {
		const requestData = {
			header: {
				token: token,
				api_id: API_FOR_GETTING_QA_IN_BLOCK
			},
			data: {					
				appId: appId,
				currentBlockId: blockId
			}
		};
		return Net.composePostRequestFromData_private(requestData);
	}
	
	
	/**
		compose finMind API request for app-existing insurance
	**/
	static composeRequestDataForAppEixstingInsuranceInfo_private(appId, token) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021822
			},
			data: {					
				appId: appId,
			}
		};
		return Net.composePostRequestFromData_private(requestData);
	}
	
	/*
		finMind API request forming for Login API
	*/
	static composeRequestDataForLogin_private(userName, userPassword) {
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
	
	/*
		finMind API request format for Login (with email) API
	*/
	static composeRequestDataForLoginWithEmail_private(email, userPassword) {
		const loginData = {
			header: {
				token: "",
				api_id: API_FOR_SIGN_IN_WITH_EMAIL
			},
			data: {					
				name: email,
				pwh: sha256(sha256(userPassword))
			}
		};
		return Net.composePostRequestFromData_private(loginData);
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
		return Net.composePostRequestFromData_private(loginData);
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
		return Net.composePostRequestFromData_private(loginData);
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
			
		return Net.composePostRequestFromData_private(queryData);
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
		return Net.composePostRequestFromData_private(requestData);
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
		return Net.composePostRequestFromData_private(requestData);
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
		return Net.composePostRequestFromData_private(requestData);
	}
	
	static composeRequestDataForGetPremiumQuote_private(xml, token) {
		const requestData = {
			header: {
				token: "",
				api_id: 2021809
			},
			data: {
				quote: xml,
				/* quote":"<quoteRequest><gender>MALE</gender>
				<birthday>2001-06-04</birthday>
				<haveCriticalIllness>true</haveCriticalIllness>
				<haveChronicIllness>true</haveChronicIllness
				><haveGeneticillnessInFamily>true</haveGeneticillnessInFamily>
				<smoke>NEVER</smoke>
				<marijuana>RARELY</marijuana>
				<drug>NEVER</drug>
				<militaryService>false</militaryService>
				<highRiskActivity>false</highRiskActivity>
				<checkedOptions>LIVING_BENEFIT</checkedOptions>
				<checkedOptions>ACCIDENTAL_DEATH_RIDER</checkedOptions>
				<checkedOptions>CHRONICLE_ILLNESS_RIDER</checkedOptions>
				<coverageAmount>200000</coverageAmount>
				coverageTime>10</coverageTime>
				</quoteRequest> 
				*/
			}
		};
		
		return Net.composePostRequestFromData_private(requestData);
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
		return Net.composePostRequestFromData_private(requestData);
	}
	
	/**
		forming request data for finMind API calls
	**/
	static composePostRequestFromData_private(data) {
		return {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
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

	
