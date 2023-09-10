import {ComponentBase}		from '../componentBase.js';
import {PageUtil}			from '../../core/util.js'

const REPLACEMENT_INPUT_ID = "{codebrdid}";
const REPLACEMENT_OUTPUT_CONTAINER_ID = "{otptcntnrid}";
const REPLACEMENT_BTN_SHOW_OR_HIDE_ID = "{shwhdbtnid}";
const REPLACEMENT_BTN_ENLARGE_SHRINK_ID = "{enlgeshrkbtnid}";
const REPLACEMENT_CSS_CONTAINER = "{cssctnr}";
const REPLACEMENT_CSS_CODE_LINE_NUMBER = "{codelnnum}";
const REPLACEMENT_CSS_CODE_LINE_BODY = "{bdy}";
const REPLACEMENT_TITLE_TEXT = "{title}";
const REPLACEMENT_LINE = "{ln}";
const REPLACMENT_CODE_LINE_TA = "{codelnnumtaid}";
const REPLACMENT_DIAGNOSTIC_DIALOG_BOX_ID = "{diagnoseboxid}";
const REPLACMENT_DIAGNOSTIC_MESSAGE = "{msg}";
const REPLACMENT_DIAGNOSTIC_EXCEPTION = "{exmsg}";
const REPLACMENT_DIAGNOSTIC_ERROR_LINE = "{errln}";
const REPLACMENT_DIAGNOSTIC_ERROR_LINE_DATA_ATTR = "{errlineno}";
const REPLACMENT_DIAGNOSTIC_ERROR_ENTRY_CLASS = "{msgentryclss}";
const REPLACMENT_DIAGNOSTIC_MSG_DIV = "{diagnosediv}";
const REPLACMENT_DIAGNOSTIC_EX_DIV= "{exdivid}";
const CSS_CONTAINER = "code-console-container";
const CSS_CONTAINER_MAX = "code-console-container-max";

const TITLE_ENLARGE = "Enlarge";
const TITLE_SHRINK = "Shrink";
const LINE_HEIGHT = 17;
const DATA_ATTR_LINE = "error-line";

const DIAGNOSTIC_MESSAGE_TEMPLATE = 
`<a class="nav-link {msgentryclss}" data-{errlineno}="{errln}" href="#">{msg}</a>`;

const CONTAINER_HTML_TMPLATE = 
`<div class="{cssctnr} code-console-container-dimention ta-container-zorder-left">
	<button id="{enlgeshrkbtnid}" title="" class="show-hide-button">+</button>
	<textarea class="{codelnnum} blob-num"
	  spellcheck="false"
	  rows="46"></textarea>
	<textarea class="input-board-float"
	  id="{codebrdid}" 
	  spellcheck="false"
	  placeholder="Type your code here...."
	  rows="46"></textarea>
	<div id="{otptcntnrid}" class="output-board-float-container ta-container-zorder-left" style="display:none">
		<button title="Close" id="{shwhdbtnid}" class="show-hide-button">-</button>							
		<textarea class="output-board"
			  id="{otptbrdid}"
			  spellcheck="false" 
			  placeholder="Output Console"
			  rows="20"></textarea>
	</div>
	<div id="{diagnoseboxid}" title="Error Messages">
		<h5>Code Issues</h5>
		<div id="{diagnosediv}"></div>
		<h5>Runtime Error</h5>
		<div id="{exdivid}"></div>
	</div>
</div>`;

const CONTROL_NAME = "Code_Input_Output_Text_Console";

class CodeInputConsole extends ComponentBase {
	#parentView
	#outputId
	#baseIdTag

	constructor(parentView, parentDivId, baseIdTag,  outputId) {
		super("id", CONTROL_NAME, parentDivId);
		this.#parentView = parentView
		this.#outputId = outputId;
		this.#baseIdTag = baseIdTag;
		
		const componentHtml = CONTAINER_HTML_TMPLATE
								.replace(REPLACEMENT_CSS_CONTAINER, CSS_CONTAINER)
								.replace(REPLACEMENT_INPUT_ID, this.inputId)
								//.replace(REPLACEMENT_OUTPUT_ID, this.outputId)
								.replace(REPLACEMENT_OUTPUT_CONTAINER_ID, this.outputContainerId)
								.replace(REPLACEMENT_BTN_SHOW_OR_HIDE_ID, this.showOrHideBtnId)
								.replace(REPLACEMENT_BTN_ENLARGE_SHRINK_ID, this.enlargeOrShrinkBtnId)
								.replace(REPLACEMENT_TITLE_TEXT, TITLE_ENLARGE)
								.replace(REPLACEMENT_CSS_CODE_LINE_NUMBER, this.codeLineTaCss)
								.replace(REPLACMENT_DIAGNOSTIC_DIALOG_BOX_ID, this.diagnoticDialogId)
								.replace(REPLACMENT_DIAGNOSTIC_MSG_DIV, this.diagnoticMsgDivId)
								.replace(REPLACMENT_DIAGNOSTIC_EX_DIV, this.diagnoticExceptionDivId);
								
		// mount the component to UI
		super.mount(componentHtml, ComponentBase.MOUNT_TYPE_INSERT);

		// initialize dialog boxes for this component
		$(this.diagnoticDialogIdSelector).dialog({
				autoOpen : false, 
				modal : true, 
                maxHeight: 800,
                width: "auto",
				show : "blind", 
				hide : "blind", 
		});
		
		// hook up event handleer
		//$(this.showOrHideBtnIdSelector).click(this.handleHideOutput.bind(this)); todo: remove
		$(this.enlargeOrShrinkBtnIdSelector).click(this.enlargeOrShrinkCodeConsole);
		$(this.inputIdSelector).bind('input propertychange', this.handleCodeInput.bind(this)); // handle all text input event
		$(this.inputIdSelector).change(this.handleCodeInput.bind(this)); // handle text change programmingly
		$(this.inputIdSelector).scroll(this.handleScroll.bind(this));
	}
	
	/* event handler */
	
	/**
			handle input key up and add line number automatically
	 **/ 
	handleCodeInput(e) {
		this.#generateLineNo();
	}
	
	handleScroll(e) {
		// regenerate line number to adjust to the top
		this.#generateLineNo();
	}
	 
	/**
		toggle input cosole between max size and normal size
	 **/
	enlargeOrShrinkCodeConsole(e) {
		e.preventDefault();
		
		// find the target container to toggle
		const par = $(event.target).parent();
		if ($(par).hasClass( CSS_CONTAINER)) {
			$(par).removeClass(CSS_CONTAINER);
			$(par).addClass(CSS_CONTAINER_MAX);
			// change button text to "-"
			$(event.target).html('-');
			$(event.target).prop("title", TITLE_SHRINK);
		}
		else {
			$(par).removeClass(CSS_CONTAINER_MAX);
			$(par).addClass(CSS_CONTAINER);
			// change button text to "+"
			$(event.target).html('+');
			$(event.target).prop("title", TITLE_ENLARGE);
		}
	}
	
	/* public methods */
	
	showOutput() {
		$(this.outputContainerIdSelector).show();
	}
	
	hideOutput() {
		$(this.outputContainerIdSelector).hide();
	}

	eraseInputBoard() {
		this.code = ''
	}
	
	showDiagnoticMessage(error) {
		// format diagnostical dialog box:
		let errorMsgHtml = "";
		const errMsgSet = new Set();
		error.analyticalInfo.forEach(e => {
			// only add error that has not been seen before
			if (!errMsgSet.has(e.errorDisplay)) {
				errMsgSet.add(e.errorDisplay);
				errorMsgHtml += DIAGNOSTIC_MESSAGE_TEMPLATE
									.replace(REPLACMENT_DIAGNOSTIC_ERROR_LINE, e.token.lineNo)
									.replace(REPLACMENT_DIAGNOSTIC_ERROR_LINE_DATA_ATTR, DATA_ATTR_LINE)
									.replace(REPLACMENT_DIAGNOSTIC_ERROR_ENTRY_CLASS, this.errorEntryClass)
									.replace(REPLACMENT_DIAGNOSTIC_MESSAGE, e.errorDisplay);
			}
		});
		$(this.diagnoticMsgDivIdSelector).html(errorMsgHtml);
		if (error.exception) {
			const exHtml = DIAGNOSTIC_MESSAGE_TEMPLATE
									.replace(REPLACMENT_DIAGNOSTIC_ERROR_LINE, error.exception.line)
									.replace(REPLACMENT_DIAGNOSTIC_ERROR_LINE_DATA_ATTR, DATA_ATTR_LINE)
									.replace(REPLACMENT_DIAGNOSTIC_ERROR_ENTRY_CLASS, error.exception.message)
									.replace(REPLACMENT_DIAGNOSTIC_MESSAGE, error.exception.message);
			$(this.diagnoticExceptionDivIdSelector).html(exHtml);
		}
		
		// hook up click handler for each message:
		$(this.errorEntryClassSelector).click(this.handleErrorSelect.bind(this));
		
		// dispaly diagnostical dialog box:
		$(this.diagnoticDialogIdSelector).dialog("open");
	}
	
	/* private methods */
	
	/* regenerate line numbers */
	#generateLineNo(currentTop) {
		const lineNo = $(this.inputIdSelector).val().split('\n').length;
		$(this.codeLineTaCssSelector).val("");
		let lineStr = "";
		const scrollTop = $(this.inputIdSelector).scrollTop();
		const topLine = Math.floor(Math.ceil(scrollTop) / LINE_HEIGHT);
		for (let i = 0; i < lineNo; i++) {
			lineStr += i + topLine + 1 +'\n';
		}
		$(this.codeLineTaCssSelector).val(lineStr);

	}
	
	/* event handler */
	handleErrorSelect(e) {
		e.preventDefault(); 
		// highlight the code line at which selected error is found
		const errLine = parseInt($(e.target).data(DATA_ATTR_LINE));
		$(this.diagnoticDialogIdSelector).dialog("close");
		
		// highline the error line (note that error line is 1-based and we need to minus 1
		// because highlightSelectionLine is 0-based)
		PageUtil.highlightSelectionLine(this.inputId, errLine-1);
	}
	
	/* getters / setters */
	
	// get code from input console
	get code() {
		return $(this.inputIdSelector).val();
	}

	// get code from input console
	set code(str) {
		$(this.inputIdSelector).val(str);	
		$(this.inputIdSelector).trigger('change');
	}

	// input tex area id
	get inputId() {
		return `yt_code_input_console_${this.#baseIdTag}`;
	}
	
	// selector for input text area id
	get inputIdSelector() {
		return  `#${this.inputId}`;
	}

	 /**
		get selected text range from code input area
	 **/
	getSelection() {
		return {
				begin: $(this.inputIdSelector).prop('selectionStart'),
				end:   $(this.inputIdSelector).prop('selectionEnd')
		};
	}

	// output tex area id
	get outputId() {
		return this.#outputId
	}
	
	// selector for input text area id
	get outputIdSelector() {
		return  `#${this.outputId}`;
	}
	
	// id for output container
	get outputContainerId() {
		return `yt_ctnr_result_output_${this.#baseIdTag}`
	}
	
	// code insert button selector
	get outputContainerIdSelector() {
		return `#${this.outputContainerId}`;
	}
	
	// enlarge the console or shrink it
	get enlargeOrShrinkBtnId() {
		return `yt_tbn_enlarge_or_shrink_${this.#baseIdTag}`
	}
	
	// enlarge-shrink button selector
	get enlargeOrShrinkBtnIdSelector() {
		return `#${this.enlargeOrShrinkBtnId}`;
	}
	
	// id for "-" button of the output console
	get showOrHideBtnId() {
		return `yt_tbn_show_or_hide_${this.#baseIdTag}`
	}
	
	// "-" button selector
	get showOrHideBtnIdSelector() {
		return `#${this.showOrHideBtnId}`;
	}
	
	get codeLineTaCss() {
		return "yt-ta-code-line-numbers";
	}
	
	get codeLineTaCssSelector() {
		return `.${this.codeLineTaCss}`;
	}
	
	get diagnoticDialogId() {
		return `yt_dl_diagnostic_${this.#baseIdTag}`
	}
	
	get diagnoticDialogIdSelector() {
		return `#${this.diagnoticDialogId}`;
	}
	
	get errorEntryClass() {
		return "yt-clss-error-entry";
	}
	
	get errorEntryClassSelector() {
		return `.${this.errorEntryClass}`;
	}
	
	get diagnoticMsgDivId() {
		return `yt_div_diagnostic_message_div_${this.#baseIdTag}`
	}
	
	get diagnoticMsgDivIdSelector() {
		return `#${this.diagnoticMsgDivId}`;
	}
	
	get diagnoticExceptionDivId() {
		return `yt_div_diagnostic_exception_div_${this.#baseIdTag}`
	}
	
	get diagnoticExceptionDivIdSelector() {
		return `#${this.diagnoticExceptionDivId}`;
	}
	
}

export {CodeInputConsole}