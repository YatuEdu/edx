import {DisplayBoard} 	from './displayBoard.js';

const REPLACE_FOR_BODY = '{bdy}';
const REPLACE_FOR_LINE = '{ln}';
const REPLACE_FOR_TEXT = '{tx}';
const REPLACE_FOR_CLASS = '{clss}';
const REPLACE_FOR_WORD = '{wd}';

const WORD_SPLIT_SPACE_REGEX = /\S+/g;
const TAB_HTML_STRING = "&emsp;";
const TAB_STRING = "\t";
const SPACE_HTML_STRING = "&nbsp;";
const SPACE = " ";

// state machine:
const UNKNOWN_STATE = "US";
const SPACE_STATE = "SS";
const TEXT_STATE = "TxtS";

const TABLE_TEMPLATE =
`
<table>
  <tbody>
  {bdy}
  </tboday>
</table>`;

const LINE_TEMPLATE =
`
<tr id="line_{ln}">
  <td class="blob-num js-line-number js-code-nav-line-number" data-line-number="{ln}">{ln}</td>
  <td id="code_line_{ln}" class="displayCode">{tx}</td>
</tr>
`;

const WORD_TEMPLATE =
`
<span class="{clss}">{wd}</span>
`;

const KEY_CLASS = 'js-k';
const DELIMITER_CLASS = 'js-d';
const NON_KEY_CLASS = 'js-nk';
const TAB_CLASS = 'tab';
const STR_QUOTE_CLASS = 'JS_SQ';

const MAP_JS_KEYWORD = new Map([
    [ 'if', KEY_CLASS ],
	[ 'else', KEY_CLASS ],
	[ 'function', KEY_CLASS ],
	[ 'const', KEY_CLASS ],
	[ 'let', KEY_CLASS ],
	[ 'for', KEY_CLASS ],
	[ 'while', KEY_CLASS ],
	[ 'do', KEY_CLASS ],
	[ 'switch', KEY_CLASS ],
	[ 'case', KEY_CLASS ],
	[ 'break', KEY_CLASS ],
	[ 'continue', KEY_CLASS ],
	[ 'return', KEY_CLASS ],
	[ 'default', KEY_CLASS ],
	[ '{', DELIMITER_CLASS ],
	[ '}', DELIMITER_CLASS ],
	[ '(', DELIMITER_CLASS ],
	[ ')', DELIMITER_CLASS ],
	[ ';', DELIMITER_CLASS ],
	[ ':', DELIMITER_CLASS ],
	[ "'", STR_QUOTE_CLASS ],
	[ '"', STR_QUOTE_CLASS ],
	[TAB_STRING, TAB_CLASS],
	[TAB_HTML_STRING, TAB_CLASS],// special clase for TAB
]);

class ParserState {
	_stateFactory;
	_tokenBuffer;
	_tokens;
	
	constructor(stateFactory, tokens) {
		this._stateFactory = stateFactory;
		this._tokens =  tokens;
		this._tokenBuffer = [];
	}
	
	/**
		Accept an input and change or remain the current state,
	**/
	accept(ch) {
		// ended
		if (!ch) {
			this.v_exit();
			return null;
		}
		
		return this.v_changeState(ch);
	}
	
	/**
		Exit an input and change or remain the current state,
	**/
	exit() {
		this.v_exit();
	}
	
	v_changeState(ch) {
		throw new Error('v_changeState: sub-class-should-overload-this');
	}
	
	v_exit() {
		// by default, we create a new token upon exiting
		this._tokens.push(this.newToken);
	}
	
	get newToken() {
		return this._tokenBuffer.join('');
	}
	
	addChar(ch) {
		this._tokenBuffer.push(ch);
		return this;
	}
}

class ParserUnknown extends ParserState {
	constructor(stateFactory, tokens) {
		super(stateFactory, tokens); 
	}
	
	/**
		Change to a known state
	**/
	v_changeState(ch) {
		let newState = this;
		if (MAP_JS_KEYWORD.get(ch) === DELIMITER_CLASS) {
			this._tokens.push(ch);
		} else if (MAP_JS_KEYWORD.get(ch) === TAB_CLASS) {
			this._tokens.push(TAB_HTML_STRING);
		} else if (ch === SPACE) {
			this._tokens.push(SPACE_HTML_STRING);
		}
		else {
			newState  = this._stateFactory.create(TEXT_STATE).addChar(ch);
		}
		return newState;
	}
}

class ParserText extends ParserState {
	
	constructor(stateFactory, tokens) {
		super(stateFactory, tokens); 
	}
	
	v_changeState(ch) {
		let newState = this;
		if (MAP_JS_KEYWORD.get(ch) === DELIMITER_CLASS) {
			this._tokens.push(this.newToken);
			this._tokens.push(ch);
			newState = this._stateFactory.create(UNKNOWN_STATE);
		} 
		else if (MAP_JS_KEYWORD.get(ch) === TAB_CLASS) {
			this._tokens.push(TAB_HTML_STRING);
			newState = this._stateFactory.create(UNKNOWN_STATE);
		} 
		else if (ch === SPACE) {
			this._tokens.push(this.newToken);
			this._tokens.push(ch);
			newState = this._stateFactory.create(UNKNOWN_STATE);
		}
		else {
			this._tokenBuffer.push(ch);
		}
		return newState;		
	}
}

class StateFactory {
	#tokens;
	
	constructor(tokens) {
		this.#tokens = tokens;
	}
	
	/**
		Create a new state by name
	**/
	create(stateName) {
		let newState = null;
		switch(stateName) {
			case UNKNOWN_STATE:
				newState = new ParserUnknown(this, this.#tokens);
				break;
			case TEXT_STATE:
				newState = new ParserText(this, this.#tokens);
				break;
		}
		
		return newState;
	}
}

class DisplayBoardForCoding extends DisplayBoard { 
	#formatter;
	
	constructor(formatter) {
		super(); 
		this.#formatter = formatter;
		this.init();
	}
	
	/**
		Initialize the EVENT handler for the UI
	**/
	init() {
		$('#yt_test_board').click(this.handleTest.bind(this));	
	}
	
	/*
	*/
	handleTest() {
	}
	
	/*
		Overload method for generating HTML for lines of code
	*/
	v_composeHtml() {
		const linesText = this._textLines;
		let lines = '';
		for(let i = 0; i < linesText.length;  ++i) {
			// wrap word with different color according to its nature
			const wordsHtml = this.prv_getWordWrap(linesText[i]);
			
			// form a code line
			lines += LINE_TEMPLATE
						.replace(new RegExp(REPLACE_FOR_LINE, 'g'), i)
						.replace(REPLACE_FOR_TEXT, wordsHtml);
		}
		return TABLE_TEMPLATE
						.replace(REPLACE_FOR_BODY, lines);
	} 
	
	/*
		private method
	*/
	prv_getWordWrap(wordLine) {		
		if (!wordLine)
			return "";
			
		// tokenize a line of words into a list of lnaguage specifc tokens
		const tokens = this.v_tokenizeString(wordLine);
		
		// wrap each token with proper span tags
		let wrappedLine = [];
		tokens.forEach(token => {	
			let css = MAP_JS_KEYWORD.get(token);
			if (!css) {
				css = NON_KEY_CLASS;
			}
			else if (css === TAB_CLASS) {
				// tab needs no span 
				css = '';
			}
			
			// span wrapping
			if (css) {
				wrappedLine += 
					WORD_TEMPLATE
						.replace(REPLACE_FOR_CLASS, css)
						.replace(REPLACE_FOR_WORD, token);
			}
			// no span wrapping
			else {
				wrappedLine += token;
			}
		});

		return wrappedLine; 
	}
	
	/*
		tokenize string for JScript, using a specified state-machine:
			StateFactory
	*/
	v_tokenizeString(wordLine) {
		const tokens = [];
		const tokennizationSM = new StateFactory(tokens);
		let state = tokennizationSM.create(UNKNOWN_STATE);
		for(let i = 0; i < wordLine.length; i++) {
			state = state.accept(wordLine[i]);
		}
		state.exit();
		return tokens;
	}
	
	/*
		Append one or space html elements to represent spacesHtml
	*/
	prv_getSpacesHtml(foundSpaces) {
		let spacesHtml = "";
		for(let i = 0; i < foundSpaces; i++) {
			spacesHtml += SPACE_HTML_STRING;
		}
		return spacesHtml;
	}
	
	/*
		Append one or space html elements to represent spacesHtml
	*/
	prv_founbdToken(begin, end) {
		return begin != -1 && end != -1 && end > begin
	}
	
	// Rid of extra Space
	//const wrods = wordLine.match(WORD_SPLIT_SPACE_REGEX);
	//wrods.forEach(word => {
			
	/*
		replace \t with const  = '&emsp;";
	*/
	prv_replaceTabs(lines) {
		const newLines = [];
		// replace all \t with &emsp;
		lines.forEach(l => newLines.push(l.replace(RegExp(TAB_STRING, 'g'), TAB_HTML_STRING)));
		return 	newLines;
	}
}

export { DisplayBoardForCoding };