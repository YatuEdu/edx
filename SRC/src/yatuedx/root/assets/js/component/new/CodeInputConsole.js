import {ComponentBase}		from '../ComponentBase.js';

const REPLACEMENT_INPUT_ID = "{codebrdid}";
const REPLACEMENT_OUTPUT_ID = "{otptbrdid}";
const REPLACEMENT_OUTPUT_CONTAINER_ID = "{otptcntnrid}";
const REPLACEMENT_BTN_SHOW_OR_HIDE_ID = "{shwhdbtnid}";
const REPLACEMENT_BTN_ENLARGE_SHRINK_ID = "{enlgeshrkbtnid}";
const REPLACEMENT_CSS_CONTAINER = "{cssctnr}";
<<<<<<< HEAD
const REPLACEMENT_CSS_CODE_LINE_NUMBER = "{codelnnum}";
const REPLACEMENT_CSS_CODE_LINE_BODY = "{bdy}";
const REPLACEMENT_TITLE_TEXT = "{title}";
const REPLACEMENT_LINE = "{ln}";
const REPLACMENT_CODE_LINE_TA = "{codelnnumtaid}";
=======
const REPLACEMENT_CSS_CODE_LINE_TABLE = "{csstbl}";
const REPLACEMENT_TITLE_TEXT = "{title}";
>>>>>>> 6c0852ee7cffe41aae5e9b5470823230d1acbb27

const CSS_CONTAINER = "code-console-container";
const CSS_CONTAINER_MAX = "code-console-container-max";

const TITLE_ENLARGE = "Enlarge";
const TITLE_SHRINK = "Shrink";
<<<<<<< HEAD
const LINE_HEIGHT = 17;
=======

const TABLE_TEMPLATE =
`
<table class="{csstbl}">
  <tbody>
  {bdy}
  </tboday>
</table>`;

const LINE_TEMPLATE =
`
<tr>
  <td class="blob-num js-line-number js-code-nav-line-number">{ln}</td>
</tr>
`;
>>>>>>> 6c0852ee7cffe41aae5e9b5470823230d1acbb27

const CONTAINER_HTML_TMPLATE = `
<div class="{cssctnr} code-console-container-dimention ta-container-zorder-left">
	<button id="{enlgeshrkbtnid}" title="" class="show-hide-button">+</button>
<<<<<<< HEAD
	<textarea class="{codelnnum} blob-num"
	  spellcheck="false"
	  rows="32"></textarea>
	<textarea class="input-board-float"
	  id="{codebrdid}" 
	  spellcheck="false"
	  placeholder="Type your code here...."
	  rows="32"></textarea>
=======
	<textarea class="input-board"
	  id="{codebrdid}" 
	  spellcheck="false"
	  placeholder="Type your code here...."
	  rows="20"></textarea>
>>>>>>> 6c0852ee7cffe41aae5e9b5470823230d1acbb27
	<div id="{otptcntnrid}" class="output-board-float-container ta-container-zorder-left" style="display:none">
		<button title="Close" id="{shwhdbtnid}" class="show-hide-button">-</button>							
		<textarea class="output-board"
			  id="{otptbrdid}"
			  spellcheck="false" 
			  placeholder="Output Console"
			  rows="20"></textarea>
	</div>
<<<<<<< HEAD
	
</div>`;
	
class CodeInputConsole extends ComponentBase {
	#inputId;
	
	constructor(id, name, parentId, inputId, outputId) {
		super(id, name, parentId);
		this.#inputId = inputId;
		
=======
</div>`;
	
class CodeInputConsole extends ComponentBase {
	constructor(id, name, parentId, inputId, outputId) {
		super(id, name, parentId);
>>>>>>> 6c0852ee7cffe41aae5e9b5470823230d1acbb27
		const componentHtml = CONTAINER_HTML_TMPLATE
								.replace(REPLACEMENT_CSS_CONTAINER, CSS_CONTAINER)
								.replace(REPLACEMENT_INPUT_ID, inputId)
								.replace(REPLACEMENT_OUTPUT_ID, outputId)
								.replace(REPLACEMENT_OUTPUT_CONTAINER_ID, this.outputContainerId)
								.replace(REPLACEMENT_BTN_SHOW_OR_HIDE_ID, this.showOrHideBtnId)
								.replace(REPLACEMENT_BTN_ENLARGE_SHRINK_ID, this.enlargeOrShrinkBtnId)
<<<<<<< HEAD
								.replace(REPLACEMENT_TITLE_TEXT, TITLE_ENLARGE)
								.replace(REPLACEMENT_CSS_CODE_LINE_NUMBER, this.codeLineTaCss);
								
		// mount the component to UI
		super.mount(componentHtml);

=======
								.replace(REPLACEMENT_TITLE_TEXT, TITLE_ENLARGE);
								
		// mount the component to UI
		super.mount(componentHtml);
>>>>>>> 6c0852ee7cffe41aae5e9b5470823230d1acbb27
		
		// hook up event handleer
		$(this.showOrHideBtnIdSelector).click(this.handleHideOutput.bind(this));
		$(this.enlargeOrShrinkBtnIdSelector).click(this.enlargeOrShrinkCodeConsole);
		$(this.outputContainerIdSelector).click(this.handleHideOutput.bind(this));
<<<<<<< HEAD
		$(this.inputIdSelector).bind('input propertychange', this.handleCodeInput.bind(this)); // handle all text input event
		$(this.inputIdSelector).change(this.handleCodeInput.bind(this)); // handle text change programmingly
		$(this.inputIdSelector).scroll(this.handleScroll.bind(this));
=======
>>>>>>> 6c0852ee7cffe41aae5e9b5470823230d1acbb27
	}
	
	/* event handler */
	
	/**
<<<<<<< HEAD
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
=======
>>>>>>> 6c0852ee7cffe41aae5e9b5470823230d1acbb27
		hide the output console to save space
	 **/
	handleHideOutput(e) {
		$(this.outputContainerIdSelector).hide();
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
	
<<<<<<< HEAD
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
	
	
	/* getters */
	
	// input tex area id
	get inputId() {
		return this.#inputId;
	}
	
	// selector for input tex area id
	get inputIdSelector() {
		return  `#${this.inputId}`;
	}
	
=======
	/* getters */
	
>>>>>>> 6c0852ee7cffe41aae5e9b5470823230d1acbb27
	// id for output container
	get outputContainerId() {
		return "yt_ctnr_result_output";
	}
	
	// code insert button selector
	get outputContainerIdSelector() {
		return `#${this.outputContainerId}`;
	}
	
	// enlarge the console or shrink it
	get enlargeOrShrinkBtnId() {
		return "yt_tbn_enlarge_or_shrink";
	}
	
	// enlarge-shrink button selector
	get enlargeOrShrinkBtnIdSelector() {
		return `#${this.enlargeOrShrinkBtnId}`;
	}
	
	// id for "-" button of the output console
	get showOrHideBtnId() {
		return 'yt_tbn_show_or_hide';
	}
	
	// "-" button selector
	get showOrHideBtnIdSelector() {
		return `#${this.showOrHideBtnId}`;
	}
	
<<<<<<< HEAD
	get codeLineTaCss() {
		return "yt-ta-code-line-numbers";
	}
	
	get codeLineTaCssSelector() {
		return `.${this.codeLineTaCss}`;
	}
	
	
=======
>>>>>>> 6c0852ee7cffe41aae5e9b5470823230d1acbb27
}

export {CodeInputConsole}