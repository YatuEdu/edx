import {PipelineManager}			from './pipelineManager.js'
import {Net}          				from './net.js';
import {credMan}      				from './credManFinMind.js'

/**
	Manager for Application PipeLine
**/
class ApplicationPipelineManager extends PipelineManager {
	
	constructor(store, appId) {
		super(store, appId);
		
		// get current answered blocks first if any
		// 获取目前已经回答的问题， 如果用户上次没有回答完， 这次不用从头开始。
		this.initalizeState();  
    } 
	
	/**
		Retrieve all question blocks answered from FinMind backend for 
		the current user
	**/
	async initalizeState() {
		const t = this.credMan.credential.token;
		const blocks = await Net.getAppPipelineBlocks(this._appId, t);
		
		// get all the answers from blocks and save them to QA Manger
		if (blocks && blocks.data.length > 0) {
			for(let i = 0; i < blocks.data.length; i++) {
				const blockId =  blocks.data[i].block_id;
				
				// get qestion / answer for this block
				const qaLst =  await Net.getQAForBlockOfApp(this._appId, blockId, t);
				this._qAndAManager = new ApplicationQAndAManager(this._appId);
				this._qAndAManager.setUserQuestionsFromServerData(qaLst.data);
				this._qAndAManagerHistoryList.push(this._qAndAManager);
			}
		}
		
		// this._qAndAManager 是最后一个block
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
