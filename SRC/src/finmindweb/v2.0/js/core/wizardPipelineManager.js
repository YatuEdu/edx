import {PipelineManager}			from './pipelineManager.js'
import {Net}          				from './net.js';

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
			// now call API to get code
			if (resp.data[0].block_id === -1) {
				resp.quote = await this.getQuote();
			}
			return resp;
		}
		return {data: []};
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
	getQuote() {
		// 1) get the current data from session store
		const qMap = this.prot_deserialize();
		
		// form quote api
		
		return "quote: 500k coverage";
		
	}
}

export {WizardPipelineManager};

