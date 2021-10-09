import {PipelineManager}			from './pipelineManager.js'
import {Net}          				from './net.js';

/**
	Manager for Application PipeLine
**/
class ApplicationPipelineManager extends PipelineManager {
	
	constructor(store, appId) {
		super(store, appId);
    } 
	
	/**
		Get the next block of questions from finMind and dispolay it
	**/
	async v_getNextQuestionBlock(token, param) {		
		return await Net.getBlockQuestions(this._appId, token);
	}
	
	/**
		To save all the answered questions to finMind service
	**/
	async v_save(t) {
		const qXML = this.prot_formQuestionsXml();
		return await Net.saveBlockQuestions(
							this._appId, 
							this._qAndAManager.blockId, 
							qXML,						
							t);
	}
}

export {ApplicationPipelineManager};
