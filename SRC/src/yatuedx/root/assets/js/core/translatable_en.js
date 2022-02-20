import {languageConstants} from './sysConst.js'

const translationMapEn = 
	new Map([
			 [languageConstants.SIGNIN, 'Log In / Sign Up'],
			 [languageConstants.ACCOUNT, 'My Account'],
			 [languageConstants.HOME_LINK, "Home (en)"],
			 [languageConstants.PAGE_LINK, "Pages (en)"],				
			 [languageConstants.SIGNIN_NAME_NEEDED, 'Name cannot be empty'],
			 [languageConstants.SIGNIN_NAME_INVALID_CHAR, 'Login name can only contan alphanumeric, underscore, and space.'], 			 
			 [languageConstants.SIGNUP_EMAIL_NEEDED, 'Email cannot be empty'],
			 [languageConstants.SIGNIN_PW_NEEDED, 'Password cannot be empty'], 
			 [languageConstants.SERVER_UNEXPECTED_ERR, 'Yatu service encounted an error. We are sorry for your inconvinience.  Please try later!'],
			 [languageConstants.SERVER_ERROR_WITH_RESPONSE, 'An error has occured from Yatu: #1'],
			 
	]);

const sysErrorMapEn = 
	new Map([
			 [40004,	'This email address has already been registered'],
			 [40005,	'This login name has been used by another user'],
	]);
export {translationMapEn, sysErrorMapEn};