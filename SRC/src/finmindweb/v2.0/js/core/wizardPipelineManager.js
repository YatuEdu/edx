import {PipelineManager}			from './pipelineManager.js'
import {Net}          				from './net.js';
import {MetaDataManager}			from './metaDataManager.js'
import {StringUtil}					from './util.js'

const calcAmount = (amountString) => {
	const amntMap = MetaDataManager.amountConvertionMap;
	return amntMap.get(amountString);
}

const calcTime = (timeString) =>  {
	const years = timeString.split(' ')[0];
	return parseInt(years);
}


const QUOTE_API_ATTR_LIST = [
	{
		attr: 'app_gender',
		field: 'sv1',
	},
	{
		attr: 'app_dob',
		field: 'sv1',
	},
	{
		attr: 'app_health_illness_critical',
		field: 'sv1',
	},	
	{
		attr: 'app_health_illness_chronic',
		field: 'sv1',
	}, 
	{
		attr: 'app_health_illness_genetic',
		field: 'sv1',
	},
	{
		attr: 'app_habit_smoking',
		field: 'sv1',
	},
	{
		attr: 'app_habit_marijuana',
		field: 'sv1',
	},
	{
		attr: 'app_habit_hard_drugs',
		field: 'sv1',
	},
	{
		attr: 'app_coverage_amount',
		field: 'sv1',
		calculate: calcAmount, 
	},
	{
		decideToUseApi: true,
		attr: 'app_coverage_time',
		field: 'sv1',
		calculate:  calcTime, // time
	},
];


const QUOTE_API_MESSAGE_TEMPLATE = `
	<quoteRequest>
		<gender>[attr_0]</gender>
		<birthday>[attr_1]</birthday>
		<haveCriticalIllness>[attr_2]</haveCriticalIllness>
		<haveChronicIllness>[attr_3]</haveChronicIllness>
		<haveGeneticillnessInFamily>[attr_4]</haveGeneticillnessInFamily>
		<smoke>[attr_5]</smoke>
		<marijuana>[attr_6]</marijuana>
		<drug>[attr_7]</drug>
		<militaryService>false</militaryService>
		<highRiskActivity>false</highRiskActivity>
		<checkedOptions>LIVING_BENEFIT</checkedOptions>
		<checkedOptions>ACCIDENTAL_DEATH_RIDER</checkedOptions>
		<checkedOptions>CHRONICLE_ILLNESS_RIDER</checkedOptions>
		<coverageAmount>[attr_8]</coverageAmount>
		<coverageTime>[attr_9]</coverageTime>
</quoteRequest>`;

/**
	Manager for Wizard PipeLine 
**/
class WizardPipelineManager extends PipelineManager {
	#productId;
	
	constructor(store, prodId) {
		super(store);
		this.#productId = prodId;
		
		// deserialize from session storage
    } 
	
	/**
		Get the next block of questions from finMind
	**/
	async v_getNextQuestionBlock(token, blckId) {	
		if (typeof blckId !== 'undefined' ) {
			const resp = await Net.getWizardQuestions(this.#productId, blckId);
			
			// if no data returns, meaning we have reached the end og the block,
			// now call API to get quote
			if (resp.data[0].block_id <= 0) {
				resp.data = await this.getQuote();
				resp.quote = true;
			}
			return resp;
		}
		return null;
	}
	
	/*
		Save the answered questions to session storage.
	*/
	async v_save(t) {		
		// save to session store
		
		// 1) get the current data from session store
		const qMap = this.prot_deserialize();
		
		// 2) save current questions to session store
		const inputElements = this._qAndAManager.currentQuestions;
		inputElements.forEach(q => {
			q.serialize();
			const qObj = q.qInfo;
			qMap.set(qObj.attr_id, qObj);
		});
		
		// Seriaslize the map to string and save it to session store
		this.prot_seriaslize(qMap);
		
		return true;
	}
	
	/*
		Use the info we got so far to retieve quote from finMid
	*/
	async getQuote() {
		// 1) get the current data from session store
		const qMap = this.prot_deserialize();
		
		const qArray = Array.from(qMap, ([name, value]) => ({ name, value }));
		let useTermAPI = true;
		let xml = QUOTE_API_MESSAGE_TEMPLATE;
		for (let i = 0; i < QUOTE_API_ATTR_LIST.length; i++ ) {
			const replaceMent = `[attr_${i}]`;
			const replaceMentAttr = QUOTE_API_ATTR_LIST[i].attr;
			const replaceMentFiled = QUOTE_API_ATTR_LIST[i].field;
			const decideToUseApi = QUOTE_API_ATTR_LIST[i].decideToUseApi;
			const calculate = QUOTE_API_ATTR_LIST[i].calculate;
			const replacementObj = qArray.find(e => e.value.attr_name === replaceMentAttr);
			let replaceMentValue = replacementObj.value[replaceMentFiled];
			if (calculate) {
				// need re-calculate (for amount and time)?
				replaceMentValue = calculate(replaceMentValue);
			}
			
			// decide to use API  or go to another page?
			if (decideToUseApi) {
				if (isNaN(replaceMentValue)) {
					useTermAPI = false;
					break;
				}
			}
			if (StringUtil.isString(replaceMentValue) ) {
				// the API only likes upper case value
				replaceMentValue = replaceMentValue.toUpperCase();
			}
			xml = xml.replace(replaceMent, replaceMentValue);
		}
		
		// form quote api
		if (useTermAPI) {
			const resp = await Net.getBestPremium(xml);
				
			// now call API to get quote
			if (!resp.err) {
				return resp.data[0];
			}
		}
		else {
			// use permanant life 
			const ret = {isPermanantLife: true};
			return ret;
		}
		
		return resp.data[0];
	}
}

export {WizardPipelineManager};

