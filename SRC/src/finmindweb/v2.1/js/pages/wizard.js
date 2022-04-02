import {sysConstants} 				from '../core/sysConst.js'
import {credMan}      				from '../core/credManFinMind.js'
import {Net}          				from '../core/net.js';
import {SessionStoreAccess}			from '../core/sessionStorage.js'
import {ApplicationPipelineManager} from '../core/applicationPipelineManager.js';
import {WizardPipelineManager} 		from '../core/wizardPipelineManager.js';
import {HomeAndWizardHeader} 		from './header.js';
import {URL_LIST_HTML} 				from './urlList.js';

const page_template = `
<div id="wizard-steps" class="progress">
	<div class="progress-bar bg-success" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar bg-primary" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar" role="progressbar" style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
	<div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
</div>

<div class="nav-back container mt-4 mt-md-5">
	<a href="#" id="fm_wz_prev_block_button" class="text-body text-opacity-50 text-decoration-none">Back</a>
</div>

<div class="container mt-6 pt-4">
	<div class="row justify-content-center">
		<div class="col-12 col-lg-5 text-center">
			<h2 id="fm_wz_block_name" class="pb-4 border-bottom">
				<span  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Insured: A person covered by insurance.">
					<i class="ico-question"></i>
				</span>
			</h2>
		</div>
	</div>
	<div class="row justify-content-center mt-5">
		<div class="col-12 col-lg-5">
			<div id="user_question_block"></div>
			<div  id="note_block">
			</div>
			<div class="d-flex justify-content-center mt-5">
				<button id="fm_wz_next_block_button" class="btn btn-primary btn-xl w-100" type="submit">
					Continue
				</button>
			</div>
		</div>
	</div>
</div>
`;

const note_template = `
<label for="" class="form-label fs-6p">{note}</label>
`;

/**
	This class manages both login and sigup workflow
**/
class QuestionAnswerRecorder extends HomeAndWizardHeader {
	#applicationMan;
	
	
    constructor(credMan) {
		super(credMan); 
		this.#applicationMan = null;
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
	async startAplicationPipeline() {
		const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_WIZARD_STORE_KEY);

		//TODO: GET prod ID for wizard
		const pid = 89898991;
		this.#applicationMan =  new WizardPipelineManager(sessionStore, pid);
		
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
			const {name, description, html, note} = this.#applicationMan.previousBlock();
			if (html) {
				$('#fm_wz_block_name').text(name);
				$('#fm_wz_block_description').html(description);
				$('#user_question_block').html(html);
				if (note) {
					$('#note_block').html(note_template.replace('{note}', "Note: "+note));
				} else {
					$('#note_block').html('');
				}
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
				if (!qHtml.data) {
					window.location.href = `./${URL_LIST_HTML.NO_PRODUCT_FOUND}`; 
				}
				else if (qHtml.data.isPermanantLife) {
					// go to permanant life inssurance page
					window.location.href = `./${URL_LIST_HTML.CONTACT_US}`; 
				}
				else {
					// save quote to local storage
					const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_BEST_PREMIUM_STORE_KEY);
					sessionStore.storeObj(qHtml.data);
					
					// go to quote premium page
					window.location.href = `./${URL_LIST_HTML.PRODUCT_LIST}`; 
				}
				return;
			}
			else {
				// first set the block header and subtitle
				const blockInfo = await Net.getBlockInfo(this.#applicationMan.blockId);
				$('#fm_wz_block_name').text(blockInfo.blockName);
				$('#fm_wz_block_description').html(blockInfo.blockDescription);
				this.#applicationMan.setBlockInfo(blockInfo.blockName, blockInfo.blockDescription, blockInfo.blockNote);
				
				// then set the html for all the questions of the block
				$('#user_question_block').html(qHtml);
				if (blockInfo.blockNote!=null) {
					$('#note_block').html(note_template.replace('{note}', "Note: "+blockInfo.blockNote));
				} else {
					$('#note_block').html('');
				}

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
	$("#pageContainer").html(page_template);
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	});
	questionAnswerRecorder = new QuestionAnswerRecorder(credMan);
});