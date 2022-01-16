import {sysConstants} 				from '../core/sysConst.js'
import {credMan}      				from '../core/credManFinMind.js'
import {SessionStoreAccess}			from '../core/sessionStorage.js'
import {HomeAndWizardHeader} 		from './header.js';

const TABLE_BODY_ID = 'fm_tb_recommended_products';

const REPLACEMENT_FOR_PRODUCT_NAME = "{pn}";
const REPLACEMENT_FOR_MONTHLY_PREMIUM = "{mp}";
const REPLACEMENT_FOR_ID = "{id}";

const TEMPLATE_PROD = `
<tr>
	<td class="text-primary">{pn}</td>
	<td>For most people that want to do</td>
	<td class="advantages"><a href="">Advantages</a>,<a href="">Advantages</a></td>
	<td class="price text-black">${mp}/Month</td>
	<td class="text-end">
		<input id={id} type="radio" class="btn-check" name="product-select" autocomplete="off">
		<label class="btn btn-outline-primary fs-7" for="product-1">Select</label>
	</td>
</tr>
`;

/**
	This class manages both login and sigup workflow
**/
class ProductRecommand extends HomeAndWizardHeader {
	
    constructor(credMan) {
		super(credMan); 
		this.init();
	}
	
	// hook up events
	async init() {
	
		// when 'Start' button is clicked
		$('#fm_start_pipeline').click(this.handleNextQuestionBlock.bind(this));
		
		$('#fm_wz_next_block_button').click(this.handleNextQuestionBlock.bind(this));
		
		// when 'Next button' is clicked
		$('#fm_wz_next_block_button2').click(this.handleNextQuestionBlock.bind(this));
		
		// when more button is clicked,
		$('#fm_wz_next_block_button2').click(this.handleDuplicateBlock.bind(this));
		
		// when 'Back' or '<' button is clicked
		$('#fm_wz_prev_block_button').click(this.handlePrevQuestionBlock.bind(this));
		$('#fm_wz_prev_block_button2').click(this.handlePrevQuestionBlock.bind(this));
		
		// start the wizard or applicaiton pipeline work flow
		// decide if I am logged in or not
		const loggedIn = await this.credMan.hasLoggedIn();
		await this.startAplicationPipeline(loggedIn);
	}
	
	/**
		Start the application wizard (or pipeline) by getting data for initial block.
	**/
	async startAplicationPipeline(loggedIn) {
		const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_WIZARD_STORE_KEY);
		// if not logged in, start wizard pipeline
		if (!loggedIn) {
			//TODO: GET prod ID for wizard
			const pid = 89898991;
			this.#applicationMan =  new WizardPipelineManager(sessionStore, pid); 
		}
		else {
			// Start a new application for product 1:
			// TODO: get product id somewhere
			const productId = 1024;
			const appId = await this.startApplicationForProduct(productId); //4008; //
			if (appId && appId > 0) {
				// create 'ApplicationPipelineManager' for application pipeline management
				this.#applicationMan =  new ApplicationPipelineManager(sessionStore, appId);
				
			} else {
				alert('cannot start application');
				return;
			}
		}
		
		// immediately start the first block
		await this.populateNextQuestionBlock();

	}
	
	// When user clicks 'prev (<)', we need to 
	//   	1) go back to previousoly process block by 1
	//		2) display the ui for previous block
	//
	handlePrevQuestionBlock(e) {
		e.preventDefault();
		this.populatePreviousQuestionBlock();
	}
	
	/**
		start a mre application for product 1
	**/
	async startApplicationForProduct(pid) {
		const res = await Net.startAplication(pid, this.credMan.credential.token);
		if (res.err) {
			alert(res.err);
			return;
		}
		return res.data[0].applicationId;
	}
	
	// When user clicks 'next', we need to call
	//   	handleNextQuestionBlockInternal
	// with 'false' flag
	//
	async handleNextQuestionBlock(e) {
		e.preventDefault();
		await this.handleNextQuestionBlockInternal(false);
	}
	
	// When user clicks 'more', we need to call
	//   	handleNextQuestionBlockInternal
	// with 'true' flag
	//
	async handleDuplicateBlock(e) {
		e.preventDefault();
		await handleNextQuestionBlockInternal(true);
	}
	
	// When user clicks 'next', we need to 
	//   	1) validate the selection and
	//		2) save the questions to server
	//		3) populate the next block questions or conclude
	//
	async handleNextQuestionBlockInternal(duplicateBlock) {
		// validate and save the current block of question answers
		const canMove = 
		   await this.#applicationMan.validateAndSaveCurrentBlock(this.credMan.credential.token, duplicateBlock);
		
		// get next block of questions
		if (canMove) {
			await this.populateNextQuestionBlock();
		}
	}
	
	// Get previous blck of questions from local cache and dispolay it
	populatePreviousQuestionBlock() {
		//const appId =  999; 
		if (this.#applicationMan.canGotoPreviousBlock()) {
			const {name, description, html} = this.#applicationMan.previousBlock();
			if (html) {
				$('#fm_wz_block_name').text(name);
				$('#fm_wz_block_description').html(description);
				$('#user_question_block').html(html);
				this.#applicationMan.hookUpEvents();
				return;
			}
		}
		
		// no more blocks
		/*
		alert ('no more questions to answer');
		$('#user_question_block').html('');
		$('#fm_wz_next_block_button').text('Start');
		*/
	}
	
	// Get next blck of questions from finMind and dispolay it
	async populateNextQuestionBlock() {
		const qHtml = await this.#applicationMan.nextBlock(this.credMan.credential.token);
		if (qHtml) {
			if (qHtml.quote) {
				if (!qHtml.data.insurer) {
					window.location.href = "./wizard-no-prod.html";
				}
				else {
					// save quote to local storage
					const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_BEST_PREMIUM_STORE_KEY);
					sessionStore.storeObj(qHtml.data);
					
					// go to quote premium page
					window.location.href = "./product-list";
				}
				return;
			}
			else {
				// first set the block header and subtitle
				const blockInfo = await Net.getBlockInfo(this.#applicationMan.blockId);
				$('#fm_wz_block_name').text(blockInfo.blockName);
				$('#fm_wz_block_description').html(blockInfo.blockDescription);
				this.#applicationMan.setBlockInfo(blockInfo.blockName, blockInfo.blockDescription);
				
				// then set the html for all the questions of the block
				$('#user_question_block').html(qHtml);
				$('#fm_wz_next_block_button').text('Next');
				
				this.#applicationMan.hookUpEvents();
				return;	
			}
		}
		
		// no more blocks
		alert ('no more questions to answer');
		$('#user_question_block').html('');
		$('#fm_wz_next_block_button').text('Start');
	}
}

let questionAnswerRecorder = null;

$( document ).ready(function() {
    console.log( "wizard page ready!" );
	questionAnswerRecorder = new QuestionAnswerRecorder(credMan);
});