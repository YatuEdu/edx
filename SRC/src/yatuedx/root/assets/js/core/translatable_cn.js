import {languageConstants} from './sysConst.js'

const translationMapCn = 
	new Map([
			 [languageConstants.SIGNIN, '登录'],
			 [languageConstants.ACCOUNT, '我的账户'],
			 [languageConstants.HOME_LINK, "主页"],
			 [languageConstants.PAGE_LINK, "其他页面"],				
			 [languageConstants.SIGNIN_NAME_NEEDED, '用户名不能为空'], 
			 [languageConstants.SIGNIN_PW_NEEDED, '密码不能为空'], 
			 [languageConstants.SERVER_UNEXPECTED_ERR, 'Yatu服务发生意外故障，我们非常抱歉， 请您稍后重试。'],
			 [languageConstants.SERVER_ERROR_WITH_RESPONSE, 'Yatu服务发生意外故障: #1'],
	]);

export {translationMapCn};
