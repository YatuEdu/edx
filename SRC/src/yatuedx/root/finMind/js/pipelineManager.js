import {ApplicationQAndAManager}			from './applicationQAndAManager.js'

/**
	Manager for pipeline question down-loading, dynamic HTML generation,
	event handling, and question-answer saving.
	There are two derivation classes: 
		- ApplicationPipeLineManager
		- WizardPipeLineManager
**/
class PipelineManager {
	_qAndAManager;
	_store;
	
	constructor(store) {
		this._qAndAManager = new ApplicationQAndAManager();
		this._store = store;
    }

	/**
		Get current blockId
	**/
	get blockId() {
		return this._qAndAManager.blockId;
	}		
	
	/**
		Dynamically generated html input controls hooking up event handler
	**/
	hookUpEvents() {
		// Obtain the list for every newly appended input elements
		const inputElements = this._qAndAManager.currentQuestions;
		
		// now set the input value (or selection) if any
		inputElements.forEach(e => e.setDisplayValue());
		
		// now hook up all the input elements event handlers for 
		inputElements.forEach(e => e.onChangeEvent());
	}
	
	/**
		Get the next block of questions from finMind and 
		dispolay it dynamically as HTML text
	**/
	async populateNextQuestionBlock(token, param) {	
		// get next block from finMind
		const resp = await this.v_getNextQuestionBlock(token, param);
				
		// fill question html
		if (resp && resp.err) {
			alert(resp.err);
			return '';
		} else {
			return this.prv_composeUserQustionHtml(resp.data);
		}
	}
	
	/**
		Validate and then save all the answered questions to finMind service
	**/
	async validateAndSaveCurrentBlock(token) {
		const currentBlockId = this._qAndAManager.blockId;
		if (currentBlockId <= 0) {
			return true;
		}
		
		// first validate the current questions
		const currentQuestions = this._qAndAManager.currentQuestions;
		const found = currentQuestions.find(e => e.onValidating() === false);
		if (found) {
			alert(`Question '${found.question}' needs to be answered`);
			return false;
		}
		
		// now save the questions to DB
		const resp = await this.v_save(token);
		if (resp && resp.err) {
			alert(resp.err);
			return false;
		} else {
			return true;
		}
	}
	
	/**
		To save all the answered questions to finMind service.
		This method shall be overriden by the child classes.
	**/
	async v_save(t) {
		throw new Error('save: sub-class-should-overload-this');
	}
	
	/**
		Get the next block of questions from finMind and dispolay it
	**/
	async v_getNextQuestionBlock(t) {		
		throw new Error('save: sub-class-should-overload-this');
	}
	
	/**
		private method
		
		Form question/answer UI by dynamically generate HTML block based
		on the questions obtained from server.
	**/
	prv_composeUserQustionHtml(qList) {
		// mrege with session-stored wizard list if any
		const qMap = this.prot_deserialize();
		if (qMap != null && qMap.size > 0) {
			this.prv_mergeQlist(qList, qMap);
		}
		return this._qAndAManager.getUserQustionHtml(qList);
	}
	
	/**
		private method
		
		Set question's answer from a previously answered question map.
		The masp is created from session storage.
	**/	
	prv_mergeQlist(qList, qMap) {
		qList.forEach(q => {
			if (qMap.has(q.attr_id) ) {
				this.prv_copyQinfo(q, qMap.get(q.attr_id));
			}
		});
	}
	
	/**
		private method
		
		Deep copy the answer from one qInfo to another qinfo 
	**/	
	prv_copyQinfo(qTarget, qSource) {
		if (typeof qSource.iv1 !== 'undefined' ) {
			qTarget.iv1 = qSource.iv1;
		}
		if (typeof qSource.iv2 !== 'undefined' ) {
			qTarget.iv2 = qSource.iv2;
		}
		if (typeof qSource.sv1 !== 'undefined' ) {
			qTarget.sv1 = qSource.sv1;
		}
		if (typeof qSource.sv2 !== 'undefined' ) {
			qTarget.sv2 = qSource.sv2;
		}
		if (typeof qSource.dv1 !== 'undefined' ) {
			qTarget.dv1 = qSource.dv1;
		}
		if (typeof qSource.dv2 !== 'undefined' ) {
			qTarget.dv2 = qSource.dv2;
		}
	}
	
	/**
		Protected method
		
		Serialize all questions ans answsers in one XML node.
	**/
	prot_formQuestionsXml() {
		const questions = this._qAndAManager.currentQuestions;
		let xml = '<block>';
		questions.forEach(q => xml += q.serverXML);
		xml += '</block>';
		return xml;
	}
	
	/**
		Protected method
		
		Serialze the question map object (containing previously answered questions) 
	**/
	prot_seriaslize(qMap) {
		this._store.setItem(JSON.stringify(qMap, 
										  (key, value) => { // serilization with replacer
											if(value instanceof Map) {
												return {
												  dataType: 'Map',
												  value: Array.from(value.entries())
												};
											} else {
												return value;
											}
		}));
	}
	
	/**
		Protected method
		
		Retrieve serialized map object (containing previously answered questions) and
		desiarized into a Map object
	**/
	prot_deserialize() {
		let qMap = null;
		const storeMapStr = this._store.getItem();
		if (storeMapStr) {
			qMap = JSON.parse  (storeMapStr, 
								    (key, value) => { // desrialization with receiver func
										if(typeof value === 'object' && value !== null) {
											if (value.dataType === 'Map') {
											  return new Map(value.value);
											}
										}
										return value;
									}
								);
		}
		else {
			qMap = new Map;
		}
		return qMap;
	}
}

export {PipelineManager};

	
