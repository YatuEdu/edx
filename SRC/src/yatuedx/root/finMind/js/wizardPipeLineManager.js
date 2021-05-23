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
	async v_getNextQuestionBlock(token, param) {	
		if (typeof this.blockId !== 'undefined' ) {
			return await Net.getWizardQuestions(this.#productId, this.blockId);
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
}

export {WizardPipelineManager};

