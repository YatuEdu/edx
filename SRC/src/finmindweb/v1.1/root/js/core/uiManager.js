import {sysConstants, languageConstants} from './sysConst.js'
import {translationMapEn} from './translatable_en.js';
import {translationMapCn} from './translatable_cn.js';

class UIManager {
	#lang = sysConstants.STATE_LANG_EN;
	#translationMapArray; 

	/**
		public methods
	**/
    constructor() {
		// load Translation tables
		this.#translationMapArray = [translationMapEn, translationMapCn];
	}
	
	// get current ui language
	get currentLang() {
		return this.#lang;
	}
	
	// set current ui language
	set currentLang(lang) {
		if (lang >= languageConstants.STATE_LANG_EN && lang <= languageConstants.STATE_LANG_CN )
		{
			this.#lang = lang;
		}
		else {
			throw "Unknown lang";
		}
	}
	
	// get a translatable text by current locale
	getText(textId) {
		return this.#translationMapArray[this.#lang].get(textId);
	}
	
	// get a translatable text by current locale and replacement argument
	getTextWithParams(textId, ...theArgs) {
		let text = this.#translationMapArray[this.#lang].get(textId);
		for (let i = 0; i < theArgs.length; i++) {
			text = text.replace(`#${i+1}`, theArgs[i]);
		};
		return text;
	}
}

const uiMan = new UIManager();
export { uiMan };