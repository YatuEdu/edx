import {sysConstants, languageConstants} from './sysConst.js'
import {uiMan} from './uiManager.js';

async function remoteCall(url, requestOptions) {
	const ret = {data: null, err: "" };
	
	try {
		
		const response = await fetch(url, requestOptions);
		
		if (!response.ok) {
			const message = uiMan.getTextWithParams(languageConstants.SERVER_ERROR_WITH_RESPONSE, response.status);
			throw new Error(message);
		}

		const data = await response.json();
		ret.data = data.data;

		if (data.result.code !== 0) {
			ret.err = uiMan.getTextWithParams(languageConstants.SERVER_ERROR_WITH_RESPONSE, data.result.code);
		}
	}
	catch (err) {
		ret.err = err;
	}
	
	return ret;
}

export { remoteCall };