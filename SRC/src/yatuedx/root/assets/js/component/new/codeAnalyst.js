import {languageConstants} 					from '../../core/sysConst.js'
import {StringUtil}							from '../../core/util.js'

const TOKEN_TYPE_UNKNOWN = -1;
const TOKEN_TYPE_SYMBOL = 100;
const TOKEN_TYPE_SPACE = 99;
const TOKEN_TYPE_ANY = 0;
const TOKEN_TYPE_KEY = 1;
const TOKEN_TYPE_SEPARATOR = 2;
const TOKEN_TYPE_LOGIC_OPERATOR = 3;
const TOKEN_TYPE_MATH_OPERATOR = 4;
const TOKEN_TYPE_FUNC_OPERATOR = 5;
const TOKEN_TYPE_ASSIGNMENT_OPERATOR = 6;
const TOKEN_TYPE_NAME = 7;
const TOKEN_TYPE_STRING = 8;
const TOKEN_TYPE_STRING_QUOTE = 9;
const TOKEN_TYPE_NUMBER = 10;
const TOKEN_TYPE_EXPRESSION = 11;

const TOKEN_SPACE = " ";
const TOKEN_CR = "\n";
const TOKEN_TAB = "\t";

const BRACKET_TYPE_CURLY = 1;
const BRACKET_TYPE_SQUARE = 2;
const BRACKET_TYPE_ROUND = 3;
const ACTION_OPEN = 1;
const ACTION_CLOSE = 2;

const STANDARD_TOKEN_MAP = new Map([
	['if', 			{type: TOKEN_TYPE_KEY, followedBy: ['('] } ],
	['else', 		{type: TOKEN_TYPE_KEY, followedBy: ['{', 'if'] } ],
	['case', 		{type: TOKEN_TYPE_KEY, followedBy: ['('] } ],
	['switch', 		{type: TOKEN_TYPE_KEY, followedBy: ['{'] } ],
	['while', 		{type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['do', 			{type: TOKEN_TYPE_KEY, followedBy: ['{'] }],
	['for', 		{type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['function', 	{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_NAME }],
	['class', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_NAME }],
	['constructor', {type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['get', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_NAME }],
	['set', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_NAME }],
	['const', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_NAME }],
	['let', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_NAME }],
	['var', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_NAME }],
	['return', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_EXPRESSION }],
	['break', 		{type: TOKEN_TYPE_KEY, followedBy: [';'] }],
	['continue', 	{type: TOKEN_TYPE_KEY, followedBy: [';'] }],
	['forEach', 	{type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['this', 		{type: TOKEN_TYPE_KEY, followedBy: ['.', ';'] }],
	['$', 			{type: TOKEN_TYPE_KEY, followedBy: ['{',], includedInside: ["`"] }],
	
	['"', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_STRING }],
	["'", 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_STRING }],
	["`", 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_STRING }],
	
	['{', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_CURLY, action: ACTION_OPEN   }],
	['}', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_CURLY, action: ACTION_CLOSE  }],
	['(', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_ROUND, action: ACTION_OPEN   }],
	[')', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_ROUND, action: ACTION_CLOSE  }],
	['[', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_SQUARE, action: ACTION_OPEN  }],
	[']', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_SQUARE, action: ACTION_CLOSE }],
	[',', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY }],
	[';', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY }],
	
	['=', 			{type: TOKEN_TYPE_ASSIGNMENT_OPERATOR, followedByType: TOKEN_TYPE_ANY }],	
	['==', 			{type: TOKEN_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['===', 		{type: TOKEN_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['>', 			{type: TOKEN_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['<', 			{type: TOKEN_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['>=', 			{type: TOKEN_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['<=', 			{type: TOKEN_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['&&', 			{type: TOKEN_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['||', 			{type: TOKEN_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	
	['+', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['-', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['++', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['--', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['+=', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['-=', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['*', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['*=', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['/', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['/=', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['%', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['**', 			{type: TOKEN_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['&', 			{type: TOKEN_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['|', 			{type: TOKEN_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	
	['=>', 			{type: TOKEN_TYPE_FUNC_OPERATOR, followedByType: TOKEN_TYPE_ANY }],
	['.', 			{type: TOKEN_TYPE_FUNC_OPERATOR, followedByType: TOKEN_TYPE_NAME }],
	
]);

const COMBINATION_TOKEN_MAP = new Map([
	['=', 			{canBeFollowedBy: [{token: "=", from: 1, to: 2}, {token: ">", from: 1}] }],	
	['>', 			{canBeFollowedBy: [{token: "=", from: 1}] }],
	['<', 			{canBeFollowedBy: [{token: "=", from: 1}] }],
	['*', 			{canBeFollowedBy: [{token: "*", from: 1}, {token: "=", from: 1} ] }],
	['+', 			{canBeFollowedBy: [{token: "=", from: 1}, {token: "+", from: 1} ] }],
	['-', 			{canBeFollowedBy: [{token: "=", from: 1}, {token: "-", from: 1} ] }],
	['&', 			{canBeFollowedBy: [{token: "=", from: 1}, {token: "&", from: 1} ] }],
	['|', 			{canBeFollowedBy: [{token: "=", from: 1}, {token: "|", from: 1} ] }],
]);

const SPACE_TOKEN_NAME = 'SPC';
const TAB_TOKEN_NAME = 'TAB';
const CR_TOKEN_NAME = 'CRT';

class Token {
	#name
	#lineNo
	#beginPos;
	#type
	#canBeExpression
	
	constructor(name, type, lineNo, beginPos) {
		this.#name = name;
		this.#type = type;
		this.#lineNo = lineNo
		this.#beginPos = beginPos;
	}
	
	get displayStr() {
		return `Token: ${this.name} type_${this.type} at line_${this.lineNo} position_${this.beginPos}`;
	}
	
	get name() { return this.#name; }
	get type() { return this.#type; }
	get lineNo() { return this.#lineNo; }
	get beginPos() { return this.#beginPos; }
	get canBeExpression () { 
		return this.type == TOKEN_TYPE_NAME ||
			   this.type == TOKEN_TYPE_STRING ||
			   this.type == TOKEN_TYPE_NUMBER;
	}
}

class CodeBlock {
	#beginLine
	#endLine
	#beginPosition
	#endPosition
	#statements
	#codeBlocks
	
	constructor() {
		
	}
	
	/* getters and setters */
	
	get beginLine() { return this.#beginLine; }
	set beginLine(b) { this.#beginLine = b; }
	
	get endLine() { return this.#endLine; }
	set endLine(e) { this.#endLine = e; }
	
	get statements() { return this.#statements; }
	set statements(s) { this.#statements = s; }
}

class TokenError {
	#token
	#msg
	
	constructor(msg, token) {
		this.#msg = msg;
		this.#token = token;
	}
	
	get msg() { return this.#msg; }
	get token() { return this.#token; }
	
	get errorDisplay() {
		return `Error: ${this.msg} at line: ${this.token.lineNo}, position: ${this.token.beginPos}, found token '${this.token.name}'`;
	}
}

class CodeAnalyst {
	#beginLine;
	#endLine
	#codeBlocks
	#tokens
	#codeStr;
	
	constructor(codeStr) {
		this.#codeStr = codeStr
		this.#tokens = this.#tokenize(codeStr);
	}
	
	/* public methods */
	
	/* display tokens for debugging purpose */
	displayAll() {
		this.tokens.forEach(t => print(t.displayStr));
	}
	
	/* 
		Diagnotic methods for shallow error discovery. For this method we only display errors
		such as no closing { or ( or [
	*/
	shallowInspect() {
		const errors = []
		const bracketStack = [];
		for (let i = 0; i < this.tokens.length; i++) {
			const tokenInfo = STANDARD_TOKEN_MAP.get(this.tokens[i].name);
			const followedByInfo = this.#canBeFollowed(i);
			if (followedByInfo.result === false) {
				const invalidGrammer = new TokenError("Invalid symbol found", followedByInfo.token);
				errors.push(invalidGrammer);
			}
			
			// INSPECT BRACKET matches
			if (tokenInfo && tokenInfo.bracketType) {
				const unmatchError = this.#checkBracketMatches(this.tokens[i], bracketStack);
				if (unmatchError) {
					const bracketMismatchError = new TokenError(unmatchError, this.tokens[i]);
					errors.push(bracketMismatchError);
				}
			}
		}
		
		// see if we still have unmatched open brackets:
		bracketStack.forEach(bt => {
			const bracketMismatchError = new TokenError("Bracket is not closed", bt);
			errors.push(bracketMismatchError);
		});
		
		return errors;
	}
	
	/* tokenize code string, this is the preparation ofr further code analysis. */
	#tokenize(codeStr) {
		let currentLine = 1;
		let currentPos = 0;
		let currentStrPos = 0;
		let tokenBegin = -1;
		let tokenEnd = -1;
		const errors = [];
		const tokens = [];
		while(currentStrPos < codeStr.length) {
			// skip space, cr, and tab
			const currentChar = codeStr.charAt(currentStrPos);
			let hasSpace = false;
			let spaceName = null;
			if (this.#isSpace(currentChar)) { 
				spaceName = SPACE_TOKEN_NAME;
				if (currentChar === TOKEN_TAB)  {
					spaceName = TAB_TOKEN_NAME
				} 
				else if (currentChar === TOKEN_CR)  {
					spaceName = CR_TOKEN_NAME
				}
				
				if (tokenBegin != -1) {
					// last token ends here
					tokenEnd = currentStrPos;
				}
				hasSpace = true;
			}
			
			// found a seperator?
			const seperater = this.#isSeperater(currentChar);
			if (seperater != TOKEN_TYPE_UNKNOWN) {
				// a seperator also marks the end of a token (if any)
				tokenEnd = currentStrPos;	
			}					
			
			// found a new token?
			let tokenEded = false;
			if (tokenBegin != -1 && tokenEnd != -1 ) {
				// new token name
				const token = this.#newToken(codeStr, tokenBegin, tokenEnd, currentLine);
				tokens.push(token);
				tokenEded = true;
			} 
			
			// add seperator or space token
			if (seperater != TOKEN_TYPE_UNKNOWN || hasSpace) {
				if (hasSpace) {
					// new space token
					const token = new Token(spaceName, TOKEN_TYPE_SPACE, currentLine, currentPos);
					tokens.push(token);
					console.log(`found new SPACE token: ${spaceName}`);
				} 
				else {
					const token = new Token(currentChar, seperater, currentLine, currentPos);
					tokens.push(token);
					console.log(`found new separater token: ${currentChar}`);
				}
				
				// make sure normal token ends here
				tokenBegin = -1;
				tokenEnd = -1;
			} 
			// not space or seperator
			else {
				if (tokenBegin === -1) {
					// a new beginning
					tokenBegin = currentStrPos;
					tokenEnd = -1;
				} 
				else if (tokenEded) {
					// ended a new token, reset and start all-over
					tokenBegin = -1;
					tokenEnd = -1;
				}
			}
			
			// start a new line, lineNo inc.
			if (currentChar === TOKEN_CR) { 
				currentPos = 0;
				// advance to the next y-position
				++currentLine;
			} 
			else {
				// advance to the next x-position
				++currentPos;
			}
			
			// advance to the next token
			++currentStrPos;
		}
		
		console.log(`number of Line: ${currentLine}, number of tokens: ${tokens.length}`);
		return tokens;
	}
	
	#newToken(codeStr, begin, end, line) {
		// new token name
		const name = codeStr.substring(begin, end);
		console.log(`found new token: ${name}`);
		let type = STANDARD_TOKEN_MAP.get(name);
		let tt = null;
		if (type) {
			tt = type.type;
		} else {
			tt = TOKEN_TYPE_NAME;
		}
		
		const token = new Token(name, tt, line, begin);
		return token;
	}
	
	#isSpace(c) {
		if (c === TOKEN_CR || c === TOKEN_TAB || c === TOKEN_SPACE ) {
			return true;
		}
		return false;
	}
	
	#isSeperater(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		if (tokenInfo && (
			tokenInfo.type === TOKEN_TYPE_SEPARATOR ||
			tokenInfo.type === TOKEN_TYPE_ASSIGNMENT_OPERATOR || 
			tokenInfo.type === TOKEN_TYPE_STRING_QUOTE ||
			tokenInfo.type === TOKEN_TYPE_LOGIC_OPERATOR ||
			tokenInfo.type === TOKEN_TYPE_MATH_OPERATOR ||
			tokenInfo.type === TOKEN_TYPE_FUNC_OPERATOR)) {
				return tokenInfo.type;
			}
		return TOKEN_TYPE_UNKNOWN;
	}
	
	/**
		test if token at index and be followed by next non-space token
	 **/
	#canBeFollowed(index, tokenInfo) {
		const thisToken = this.tokens[index];
		const returnObj = {result: true, token: null};
		// find the next none-space token
		let nextToken = null; 
		let nextPos = index+1;
		if (tokenInfo) {
			while(nextPos < this.tokens.length) {
				nextToken = this.tokens[nextPos];
				if (nextToken.type != TOKEN_TYPE_SPACE) {
					break;
				}
				++nextPos;
			}
		}
		
		if (nextToken) {
			const followedBy = tokenInfo.followedBy;
			if (followedBy) {
				// not in followed by list
				if (followedBy.indexOf(nextToken.name) === -1) {
					returnObj.result = false;
					returnObj.token = nextToken;
				}
			}
		}
		
		return  returnObj;
	}
	
	/**
		Check if brackets open/close matches
	 **/
	#checkBracketMatches(token, bracketStack) {
		const thisTokenInfo = STANDARD_TOKEN_MAP.get(token.name);
		let errMsg = "";
		const bracketName = this.#bracketTypeToName(thisTokenInfo.bracketType);
		let hasErro = false;
		if (thisTokenInfo.action === ACTION_CLOSE) {
			if (bracketStack.length === 0 ) {
				hasErro = true;
			}
			else {
				// must matches the last open brachet
				const lastToken = bracketStack.pop();
				const lastTokenInfo = STANDARD_TOKEN_MAP.get(lastToken.name);
				if (thisTokenInfo.bracketType != lastTokenInfo.bracketType) {
					hasErro = true;
				}
			}
		}
		else {
			bracketStack.push(token);
		}
		
		if (hasErro) {
			errMsg = `This ${bracketName} does not have an open matching bracket.`;
		}
		
		return errMsg;		
	}
	
	//onst BRACKET_TYPE_CURLY = 1;
	//const BRACKET_TYPE_SQUARE = 2;
	// const BRACKET_TYPE_ROUND = 3;
	#bracketTypeToName(type) {
		switch(type) {
			case BRACKET_TYPE_CURLY:
				return "Curly-bracket";
			case BRACKET_TYPE_SQUARE:
				return "Squarely-bracket";
			case BRACKET_TYPE_ROUND:
				return "Round-bracket";
		}
	}
	
	/* geters and setters */
	
	get tokens() { return this.#tokens; }
}

export {CodeAnalyst}


	




