import {PipelineManager}			from './pipelineManager.js'
import {Net}          				from './net.js';
import {credMan}      				from './credManFinMind.js'
import {ApplicationQAndAManager} from "./applicationQAndAManager.js";

/**
	Manager for Application PipeLine
**/
class ApplicationPipelineManager extends PipelineManager {
	
	constructor(store, appId) {
		super(store, appId);
		
		// get current answered blocks first if any
		// 获取目前已经回答的问题， 如果用户上次没有回答完， 这次不用从头开始。
		// this.initalizeState();
    } 
	
	/**
		Retrieve all question blocks answered from FinMind backend for 
		the current user
	**/
	async initalizeState() {
		const t = credMan.credential.token;
		const blocks = await Net.getAppPipelineBlocks(this._appId, t);
		
		// get all the answers from blocks and save them to QA Manger
		if (blocks && blocks.data.length > 0) {
			let qaLst;
			for(let i = 0; i < blocks.data.length; i++) {
				const blockId =  blocks.data[i].block_id;
				
				// get qestion / answer for this block
				qaLst =  await Net.getQAForBlockOfApp(this._appId, blockId, t);
				this._qAndAManager = new ApplicationQAndAManager(this._appId);
				await this._qAndAManager.setUserQuestionsFromServerData(qaLst.data);
				this._qAndAManagerHistoryList.push(this._qAndAManager);
			}

			let name = this._qAndAManager.blockName;
			let description = this._qAndAManager.blockDescription;
			let html = this._qAndAManager.getUserQustionHtmlInternal();
			if (html) {
				$('#fm_wz_block_name').text(name);
				$('#fm_wz_block_description').html(description);
				$('#user_question_block').html(html);
				this.hookUpEvents();
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
