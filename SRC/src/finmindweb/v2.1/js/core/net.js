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
const API_FOR_BEST_PREMIUM_QUOTE = 2021809;

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
	static async signUp(userFirstName, userMiddleName, userLastName, email, userPassword, validCode) {
		const req = Net.composeRequestDataForSignUp_private(userFirstName, userMiddleName, userLastName, email, userPassword, validCode);
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
						blockDescription: res.data[0].description,
						blockNote:		  res.data[0].note
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
						FILE_UPLOAD_OP, 0);
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
						FILE_LIST_OP,
						0);
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
						FILE_DOWNLOAD_OP,
						0);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}


	/**
		FinMind API for Best premium
	**/
	static async getBestPremium(quoteXML) {
		const req = Net.composeRequestDataForBestPremium_private(quoteXML, API_FOR_BEST_PREMIUM_QUOTE);
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
	 FinMind API for user to get own applications
	 **/
	static async getApplications(token, pageSize, pageNo, searchBy) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021836
			},
			data: {
				pageSize: pageSize,
				pageNo: pageNo,
				searchBy: searchBy
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for agent to get applications
	 **/
	static async getApplications(token, appStatus, pageSize, pageNo, searchBy, orderBy) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021836
			},
			data: {
				appStatus: appStatus,
				pageSize: pageSize,
				pageNo: pageNo,
				searchBy: searchBy,
				orderBy: orderBy
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for agent to get clients
	 **/
	static async getClients(token, pageSize, pageNo, searchBy) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021837
			},
			data: {
				pageSize: pageSize,
				pageNo: pageNo,
				name: searchBy
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for user to get applications
	 **/
	static async getMyApplications(token, pageSize, pageNo, searchBy) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021835
			},
			data: {
				"name": searchBy,
				"pageSize": pageSize,
				"pageNo": pageNo
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for user to get profile
	 **/
	static async getMyProfile(token) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021838
			},
			data: {
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for user to save profile
	 **/
	static async updateMyProfile(token, email, phone_number, first_name, middle_name, last_name, birthday, gender, address1, address2, city, state, zip_code, license_issue_state, license_expire_date, license_number) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021839
			},
			data: {
				email: email,
				phone_number: phone_number,
				first_name: first_name,
				middle_name: middle_name,
				last_name: last_name,
				birthday: birthday,
				gender: gender,
				address1: address1,
				address2: address2,
				city: city,
				state: state,
				zip_code: zip_code,
				license_issue_state: license_issue_state,
				license_expire_date: license_expire_date,
				license_number: license_number
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for user to get application info
	 **/
	static async getApplicationInfo(appId, token) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021840
			},
			data: {
				appId: appId
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for agent to get clients
	 **/
	static async getPeoples(token, pageSize, pageNo, searchBy) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021842
			},
			data: {
				pageSize: pageSize,
				pageNo: pageNo,
				name: searchBy
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for agent to get applications
	 **/
	static async getAllApplications(token, appStatus, pageSize, pageNo, searchBy, orderBy) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021841
			},
			data: {
				appStatus: appStatus,
				pageSize: pageSize,
				pageNo: pageNo,
				searchBy: searchBy,
				orderBy: orderBy
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for agent to update application's status
	 **/
	static async updateApplicationStatus(token, appId, status) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021873
			},
			data: {
				appId: appId,
				status: status
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for agent to get applications
	 **/
	static async agentClientUpdate(token, clientId, quickNote) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021843
			},
			data: {
				clientId: clientId,
				quickNote: quickNote
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for before upload file
	 **/
	static async beforeUploadFile(token, uploadFileName) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021818
			},
			data: {
				pipelineKey: "",
				applicationKey: "",
				conversationKey: "",
				fileName: uploadFileName,
				operationType: 1,
				userOpSelfFile: 1,
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

    /**
     FinMind API for list upload file
     **/
    static async listUploadFile(token, uploadFileName) {
        const requestData = {
            header: {
                token: token,
                api_id: 2021818
            },
            data: {
                pipelineKey: "",
                applicationKey: "",
                conversationKey: "",
                fileName: uploadFileName,
                operationType: 2,
                userOpSelfFile: 1,
            }
        };
        const req =  Net.composePostRequestFromData_private(requestData);
        // remote call
        return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
    }

	/**
	 FinMind API for download file
	 **/
	static async downloadFile(token, fileName) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021818
			},
			data: {
				pipelineKey: "",
				applicationKey: "",
				conversationKey: "",
				fileName: fileName,
				operationType: 3,
				userOpSelfFile: 1,
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for delete file
	 **/
	static async deleteFile(token, fileName) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021818
			},
			data: {
				pipelineKey: "",
				applicationKey: "",
				conversationKey: "",
				fileName: fileName,
				operationType: 4,
				userOpSelfFile: 1,
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for delete file
	 **/
	static async getProductList(token, fileName) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021844
			},
			data: {
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for create insurance policy
	 **/
	static async insurancePolicyAdd(token, productId, clientId, insuredName, coverageAmount, effectiveDate, status) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021846
			},
			data: {
				productId: productId,
				clientId: clientId,
				insuredName: insuredName,
				coverageAmount: coverageAmount,
				effectiveDate: effectiveDate,
				status: status
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for create insurance policy
	 **/
	static async insurancePolicyUpdate(token, id, productId, clientId, insuredName, coverageAmount, effectiveDate, status) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021847
			},
			data: {
				id: id,
				productId: productId,
				clientId: clientId,
				insuredName: insuredName,
				coverageAmount: coverageAmount,
				effectiveDate: effectiveDate,
				status: status
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for create insurance policy
	 **/
	static async agentInsurancePolicyList(token, pageSize, pageNo, name) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021845
			},
			data: {
				name: name,
				pageSize: pageSize,
				pageNo: pageNo
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for add insurance policy file
	 **/
	static async insurancePolicyFileAdd(token, policyId, fileName, fileSize, fileNameUn) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021848
			},
			data: {
				policyId: policyId,
				fileName: fileName,
				fileSize: fileSize,
				fileNameUn: fileNameUn
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list insurance policy file
	 **/
	static async insurancePolicyFileList(token, policyId) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021852
			},
			data: {
				policyId: policyId
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for delete insurance policy file
	 **/
	static async insurancePolicyFileDelete(token, policyId, fileId) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021849
			},
			data: {
				policyId: policyId,
				fileId: fileId
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for delete insurance policy file
	 **/
	static async findClient(token, email) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021851
			},
			data: {
				email: email
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for client to list insurance policy
	 **/
	static async clientInsurancePolicyList(token, pageSize, pageNo, name) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021854
			},
			data: {
				name: name,
				pageSize: pageSize,
				pageNo: pageNo
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for admin to list insurance policy
	 **/
	static async adminInsurancePolicyList(token, pageSize, pageNo, name) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021853
			},
			data: {
				name: name,
				pageSize: pageSize,
				pageNo: pageNo
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for admin to list insurance policy
	 **/
	static async userInqueryAdd(token, insuredName, relationship, coverageAmount, coverageTime,
								intendedInsurer, quoteDetails, owner, resolution) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021858
			},
			data: {
				insuredName: insuredName,
				relationship:relationship,
				coverageAmount:coverageAmount,
				coverageTime:coverageTime,
				intendedInsurer:intendedInsurer,
				quoteDetails:quoteDetails,
				owner:owner,
				resolution:resolution
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for agent to list insurance policy
	 **/
	static async userInqueriesList(token, pageSize, pageNo, name) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021855
			},
			data: {
				name: name,
				pageSize: pageSize,
				pageNo: pageNo
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

    /**
     FinMind API for admin to list insurance policy
     **/
    static async adminInquiriesList(token, pageSize, pageNo, name) {
        const requestData = {
            header: {
                token: token,
                api_id: 2021857
            },
            data: {
                name: name,
                pageSize: pageSize,
                pageNo: pageNo
            }
        };
        const req =  Net.composePostRequestFromData_private(requestData);
        // remote call
        return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
    }

    /**
     FinMind API for admin to assign inquiries to agent
     **/
    static async adminInquiriesAssignTo(token, inquiryId, owner) {
        const requestData = {
            header: {
                token: token,
                api_id: 2021859
            },
            data: {
                name: name,
                inqueryId: inquiryId,
                owner: owner
            }
        };
        const req =  Net.composePostRequestFromData_private(requestData);
        // remote call
        return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
    }

	/**
	 FinMind API for list insurance policy file
	 **/
	static async insurancePolicyCashValueList(token, policyId, pageSize, pageNo) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021871
			},
			data: {
				policyId: policyId,
				pageSize: pageSize,
				pageNo: pageNo
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list insurance policy file
	 **/
	static async insurancePolicyDeathBenefitList(token, policyId, pageSize, pageNo) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021872
			},
			data: {
				policyId: policyId,
				pageSize: pageSize,
				pageNo: pageNo
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list insurance policy file
	 **/
	static async insurancePolicyCashValueRemove(token, policyId, year) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021861
			},
			data: {
				policyId: policyId,
				year: year
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list insurance policy file
	 **/
	static async insurancePolicyDeathBenefitRemove(token, policyId, year) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021865
			},
			data: {
				policyId: policyId,
				year: year
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list insurance policy file
	 **/
	static async insurancePolicyCashValueRemoveAll(token, policyId) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021862
			},
			data: {
				policyId: policyId
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list insurance policy file
	 **/
	static async insurancePolicyDeathBenefitRemoveAll(token, policyId) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021866
			},
			data: {
				policyId: policyId
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

    /**
     FinMind API for add insurance policy cash value
     **/
    static async insurancePolicyCashValueAdd(token, policyId, year, cashValue) {
        const requestData = {
            header: {
                token: token,
                api_id: 2021860
            },
            data: {
                policyId: policyId,
                year: year,
                cashValue: cashValue
            }
        };
        const req =  Net.composePostRequestFromData_private(requestData);
        // remote call
        return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
    }

	/**
	 FinMind API for add insurance policy cash value
	 **/
	static async insurancePolicyDeathBenefitAdd(token, policyId, year, deathBenefit) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021864
			},
			data: {
				policyId: policyId,
				year: year,
				deathBenefit: deathBenefit
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list insurance policy file
	 **/
	static async insurancePolicyReminderList(token, policyId, pageSize, pageNo) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021870
			},
			data: {
				policyId: policyId,
				pageSize: pageSize,
				pageNo: pageNo
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list insurance policy file
	 **/
	static async insurancePolicyReminderAdd(token, policyId, remind_content, date, email, status) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021867
			},
			data: {
				policyId: policyId,
				remind_content: remind_content,
				date: date,
				email: email,
				status: status
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list insurance policy file
	 **/
	static async insurancePolicyReminderEdit(token, reminderId, policyId, remind_content, date, email, status) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021868
			},
			data: {
				reminderId: reminderId,
				policyId: policyId,
				remind_content: remind_content,
				date: date,
				email: email,
				status: status
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list insurance policy file
	 **/
	static async insurancePolicyReminderRemove(token, reminderId) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021869
			},
			data: {
				reminderId: reminderId,
				policyId: 1,
				remind_content: '',
				date: '2022-06-01',
				email: '',
				status: ''
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list statistics completed applications
	 **/
	static async statisticsCompletedApplications(token, from, to) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021875
			},
			data: {
				from: from,
				to: to
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list statistics created applications
	 **/
	static async statisticsCreatedApplications(token, from, to) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021876
			},
			data: {
				from: from,
				to: to
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list total amount money
	 **/
	static async statisticsTotalAmountMoney(token, from, to) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021877
			},
			data: {
				from: from,
				to: to
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for list statistics created applications
	 **/
	static async userInsurancePolicyGetAll(token) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021874
			},
			data: {
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for admin to add commercial loan
	 **/
	static async adminCommercialLoanAdd(token, title, description, fileName, fileSize, fileNameUn) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021878
			},
			data: {
				title: title,
				description: description,
				fileName: fileName,
				fileSize: fileSize,
				fileNameUn: fileNameUn
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for admin to edit commercial loan
	 **/
	static async adminCommercialLoanEdit(token, id, title, description, fileName, fileSize, fileNameUn) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021879
			},
			data: {
				id: id,
				title: title,
				description: description,
				fileName: fileName,
				fileSize: fileSize,
				fileNameUn: fileNameUn
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for admin to edit commercial loan
	 **/
	static async adminCommercialLoanList(token, name, pageSize, pageNo) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021880
			},
			data: {
				name: name,
				pageSize: pageSize,
				pageNo: pageNo
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for admin to edit commercial loan
	 **/
	static async adminCommercialLoanRemove(token, id) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021881
			},
			data: {
				id: id
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for user to find agent by email
	 **/
	static async userFindAgent(token, email) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021882
			},
			data: {
				email: email
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for user to find agent by email
	 **/
	static async userInviteAgent(token, appId, email) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021883
			},
			data: {
				appId: appId,
				email: email
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for agent to accept user's invite
	 **/
	static async agentAcceptApp(token, appId, isAccept) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021884
			},
			data: {
				appId: appId,
				isAccept: isAccept
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for user to notify agent
	 **/
	static async userNotifyAgent(token, appId) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021886
			},
			data: {
				appId: appId
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for agent to notify user
	 **/
	static async agentNotifyCustomer(token, appId) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021885
			},
			data: {
				appId: appId
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

    /**
     FinMind API for agent to notify user
     **/
    static async agentRegisterWithEmailAndPw(name, email, validCode, fistName, middleName, lastName, pwh, phone, address1,
                                             address2, city, state, zipCode, licenseHome, licenseNumber, birthday) {
        const requestData = {
            header: {
                api_id: 2021887
            },
            data: {
                name: name,
                email: email,
                validCode: validCode,
                fistName: fistName,
                middleName: middleName,
                lastName: lastName,
                pwh: pwh,
                phone: phone,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zipCode: zipCode,
                licenseHome: licenseHome,
                licenseNumber: licenseNumber,
                birthday: birthday
            }
        };
        const req =  Net.composePostRequestFromData_private(requestData);
        // remote call
        return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
    }

	/**
	 FinMind API for user to change password with old password
	 **/
	static async userChangePwWithOldPw(token, oldPwHsh, newPwHsh) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021832
			},
			data: {
				oldPwHsh: oldPwHsh,
				newPwHsh: newPwHsh
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for user to send code to email when forget passwrod
	 **/
	static async resetPwSendEmail(userEmail) {
		const requestData = {
			header: {
				api_id: 2021833
			},
			data: {
				userEmail: userEmail
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for user to reset password
	 **/
	static async resetPwConfirm(userEmail, code, newPWHash) {
		const requestData = {
			header: {
				api_id: 2021834
			},
			data: {
				userEmail: userEmail,
				code: code,
				newPWHash: newPWHash
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

	/**
	 FinMind API for admin to edit people
	 **/
	static async adminEditPeople(token, id, licenseStatus) {
		const requestData = {
			header: {
				token: token,
				api_id: 2021888
			},
			data: {
				id: id,
				licenseStatus: licenseStatus
			}
		};
		const req =  Net.composePostRequestFromData_private(requestData);
		// remote call
		return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
	}

    /**
     FinMind API for admin to edit people
     **/
    static async registerSendEmail(userEmail) {
        const requestData = {
            header: {
                api_id: 2021890
            },
            data: {
                userEmail: userEmail
            }
        };
        const req =  Net.composePostRequestFromData_private(requestData);
        // remote call
        return await Net.remoteCall(sysConstants.FINMIND_PORT, req);
    }

    /**
     FinMind API for admin to edit people
     **/
    static async anonymousCommercialLoanList() {
        const requestData = {
            header: {
                api_id: 2021889
            },
            data: {
            }
        };
        const req =  Net.composePostRequestFromData_private(requestData);
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

	/**
		compose finMind API request for Best Premium
	**/
	static composeRequestDataForBestPremium_private(quoteXML, apiId) {
		const requestData = {
			header: {
				token: '',
				api_id: apiId
			},
			data: {
				quote: quoteXML
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

	static composeRequestDataForFileOperation_private(t, uploadFileName, pipleLineKey, appKey, conversationKey, op, userOpSelfFile) {
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
				operationType: op,
				userOpSelfFile: userOpSelfFile
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
	static composeRequestDataForSignUp_private(userFirstName, userMiddleName, userLastName, email, userPassword, validCode) {
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
				pwh: sha256(sha256(userPassword)),
                validCode: validCode
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

			const res = await response.json();
			ret.data = res.data;
			ret.errCode = res.result.code
			if (ret.errCode !== 0) {
				ret.err = {code: ret.errCode, msg: res.result.msg};
			}
		}
		catch (ex) {
			ret.err = {code: 1099, msg: ex.message};
		}
		return ret;
	}
}


export { Net };


