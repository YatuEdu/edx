import {languageConstants} from './sysConst.js'

const translationMapEn = 
	new Map([
			 [languageConstants.SIGNIN, 'Login'],
			 [languageConstants.ACCOUNT, 'My Account'],
			 [languageConstants.HOME_LINK, "Home (en)"],
			 [languageConstants.PAGE_LINK, "Pages (en)"],				
			 [languageConstants.SIGNIN_NAME_NEEDED, 'Name cannot be empty'], 
			 [languageConstants.SIGNIN_PW_NEEDED, 'Password cannot be empty'], 
			 [languageConstants.SERVER_UNEXPECTED_ERR, 'Yatu service encounted an error. We are sorry for your inconvinience.  Please try later!'],
			 [languageConstants.SERVER_ERROR_WITH_RESPONSE, 'An error has occured from Yatu: #1'],
	]);

export {translationMapEn};