import {StringUtil, RegexUtil}				from '../../core/util.js'
import {Token, TokenError}					from '../parser/token.js'
import {Scope}								from '../parser/scope.js'
import {CodeBlockState}						from '../parser/CodeBlockState.js'

class CodeAnalyst {
	#beginLine;
	#endLine;
	#tokens;
	#meaningfulTokens;
	#codeStr;
	
	// syntax parsing one outcome
	#variables;
	#calledFunctions;
	#numbers;
	#expressions;
	#errors
	
	constructor(codeStr) {
		this.#codeStr = codeStr
		this.#tokenize(codeStr);
		this.#errors = [];
		this.#variables = new Map();
	}
	
	/* geters and setters */
	get tokens() { return this.#tokens; }
	get meaningfulTokens() { return this.#meaningfulTokens; }
	get variables() { return this.#variables; }
	get calledFunctions() { return this.#calledFunctions; }
	get numbers() { return this.#numbers; }
	get expressions() { return this.#expressions; }
	get errors () { return this.#errors; }
	
	/* public methods */
	
	
	/* 
		Diagnotic methods for shallow error discovery. For this method we only display errors
		such as no closing { or ( or [
	*/
	shallowInspect() {
		this.bracketMatchInspection();
		if (this.errors.length === 0) {		
			this.#syntaxParseOne();
		}
		
		return this.errors;
	}
	
	bracketMatchInspection() {
		const bracketStack = [];
		const quoteStack = [];
		for (let i = 0; i < this.tokens.length; i++) {
			const tokenInfo = Token.getTokenInfo(this.tokens[i].name);
			const followedByInfo = this.#canBeFollowed(i);
			if (followedByInfo.result === false) {
				const invalidGrammer = new TokenError("Invalid symbol found", followedByInfo.token);
				this.errors.push(invalidGrammer);
			}
			
			// INSPECT BRACKET matches
			if (tokenInfo) {
				if (tokenInfo.bracketType) {
					const unmatchError = this.#checkBracketMatches(this.tokens[i], bracketStack);
					if (unmatchError) {
						const bracketMismatchError = new TokenError(unmatchError, this.tokens[i]);
						this.errors.push(bracketMismatchError);
					}
				} else if (tokenInfo.quoteType) {
					this.#checkQuoteMatches(this.tokens[i], quoteStack);
				}
			}
		}
		
		// see if we still have unmatched open brackets:
		bracketStack.forEach(bt => {
			const bracketMismatchError = new TokenError("Bracket is not closed", bt);
			this.errors.push(bracketMismatchError);
		});
		
		// see if we still have unmatched open quotes:
		quoteStack.forEach(qt => {
			const quoteMismatchError = new TokenError("Quote is not closed", qt);
			this.errors.push(quoteMismatchError);
		});
	}
	
	/**
		Formattting code according to JS coding style.
	 **/
	formatCode() {
		this.bracketMatchInspection();
		// if error, advice to fix error first
		if (this.errors.length > 0) {
			return {err: true, newSrc: this.errors[0].errorDisplay()};
		}
		
		let newSrc = '';
		let nestLevel = 0;
		const newTokens = [];
		for (let i = 0; i < this.meaningfulTokens.length; i++) {
			const current = this.meaningfulTokens[i];
			const before = this.meaningfulTokens[i-1];
			const after = this.meaningfulTokens[i+1];
			
			// make "{" followed by line break
			if (current.isOpenCurlyBracket) {
				// add nest level
				++nestLevel;
				
				// start a new line if not 
				newSrc += ' ' + current.name;
				if (after && !after.isCR) {
					newSrc += this.addRcAndTabs(nestLevel);
				}			
				
				continue;
			}
			
			// make "}" line break with tabs
			if (current.isCloseCurlyBracket) {
				// reduce nest level
				--nestLevel;
				
				// start a new line if not 
				if (!before.isCR) {
					newSrc += this.addRcAndTabs(nestLevel);
				}
				newSrc += current.name;
				
				// "}" must be FLOOWED BY NEW CR and tabs
				if (after && !after.isCR) {
					newSrc += this.addRcAndTabs(nestLevel);
				}
				continue;
			}
			
			// add tabs according to nest level
			if (current.isCR ) { 
				newSrc += Token.TOKEN_CR 
				// add tabs after CR
				if (after && !after.isCloseCurlyBracket) {
					newSrc += this.addTabs(nestLevel);
				} else if (after && after.isCloseCurlyBracket) {
					newSrc += this.addTabs(nestLevel-1)
				}
				continue;
			}	
			
			// operator needs to be spaced
			if (current.type === Token.TOKEN_TYPE_OPERATOR) {
				newSrc += " " + current.name + " ";
				continue;
			}
			
			// key words needs to be space FOLLOWED
			if (current.type === Token.TOKEN_TYPE_KEY) {
				newSrc += current.name + " ";
				continue;
			}
			
			// quote a string (todo: need to know the quote type, for now use single quote:
			if (current.type === Token.TOKEN_TYPE_STRING) {
				newSrc += "'" + current.name + "'";
				continue;
			}
			
			// add REGULAR text
			newSrc += current.name;
			if (current.shouldStartNewLine && after && !after.isCR) {
				// add new line and tabs
				newSrc += this.addRcAndTabs(nestLevel);
			}
			
		}
		return {err: false, newSrc: newSrc};
	}
	
	/* private methods */
		
	/* add CR and preceded by tabs */
	addRcAndTabs(n) {
		return Token.TOKEN_CR + this.addTabs(n);
	}
	
	/* add (n) tabs before a token */
	addTabs(n) {
		let tabs = '';
		for (let i = 0; i < n; i++) {
			tabs += Token.TOKEN_TAB;
		}
		return tabs;
	}
	
	/* display tokens for debugging purpose */
	#displayAll(tokens) {
		tokens.forEach(t => console.log(t.displayStr));
	}
	
	/* 
		Based on the token we found, get the basic coding elements, such as variable names, strings, and other values.
		We should be able to find out futher syntax error as the outcome of the parsing.
	*/
	#syntaxParseOne() {
		this.#calledFunctions = []
		this.#numbers = [];
		this.#expressions = [];
		const stateStack = [];
		let i = 0;
		let currentState = new CodeBlockState(i, null, new Scope(null), this);
		while (i < this.meaningfulTokens.length) {
			const token = this.meaningfulTokens[i];
			
			// get next state
			const action = currentState.advance(token, i);
			let newState = action.newState;
			
			// error? exit
			if (action.error) {
				break;
			}
			
			// set the next state
			if (newState) { 
				if (!action.stateEnded) {
					// current state has not ended, save it
					stateStack.push(currentState);
				}			
				// enter the next state
				currentState = newState;
			} else if (action.stateEnded) {
				// pop up old state, get the one that has not ended yet:
				do {
					currentState = stateStack.pop();
				} while(currentState && currentState.stateEnded);
			} 

			// advance to the next token if we need to
			if (action.advanceToNextToken) {
				++i;
			}				
		}
		
		// if current state has not ended, end it:
		if (currentState) {
			currentState.complete();
		}
	}
	
	/* tokenize code string, this is the preparation ofr further code analysis. */
	#tokenize(codeStr) {
		let currentLine = 1;
		let currentPos = 0;
		let currentStrPos = 0;
		let tokenBegin = -1;
		let tokenEnd = -1;
		const tokens = [];
		while(currentStrPos < codeStr.length) {
			// skip space, cr, and tab
			const currentChar = codeStr.charAt(currentStrPos);
			let hasSpace = false;
			let spaceName = null;
			if (Token.isSpace(currentChar)) { 
				spaceName = Token.SPACE_TOKEN_NAME;
				if (currentChar === Token.TOKEN_TAB)  {
					spaceName = Token.TAB_TOKEN_NAME
				} 
				else if (currentChar === Token.TOKEN_CR)  {
					spaceName = Token.CR_TOKEN_NAME
				}
				
				if (tokenBegin != -1) {
					// last token ends here
					tokenEnd = currentStrPos;
				}
				hasSpace = true;
			}
			
			// found a seperator?
			const seperater = Token.getSeperaterType(currentChar);
			if (seperater != Token.TOKEN_TYPE_UNKNOWN) {
				// a seperator also marks the end of a token (if any)
				tokenEnd = currentStrPos;	
			}					
			
			// found a new token?
			let tokenEnded = false;
			if (tokenBegin != -1 && tokenEnd != -1 ) {
				// new token name
				const token = this.#newToken(codeStr, tokenBegin, tokenEnd, currentLine);
				tokens.push(token);
				tokenEnded = true;
			} 
			
			// add seperator or space token
			if (seperater != Token.TOKEN_TYPE_UNKNOWN || hasSpace) {
				if (hasSpace) {
					// new space token
					const token = new Token(spaceName, Token.TOKEN_TYPE_SPACE, currentLine, currentPos);
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
				else if (tokenEnded) {
					// ended a new token, reset and start all-over
					tokenBegin = -1;
					tokenEnd = -1;
				}
			}
			
			// start a new line, lineNo inc.
			if (currentChar === Token.TOKEN_CR) { 
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
		
		// in case the last token hs not been closed (this happens when we did not end the program with
		// white space or cr any punctuation:
		if (tokenBegin != -1 ) {
			const token = this.#newToken(codeStr, tokenBegin, codeStr.length, currentLine);
			tokens.push(token);
			tokenBegin = -1;
		} 
		
		this.#tokens = tokens;
		
		console.log(`number of Line: ${currentLine}, number of tokens: ${tokens.length}`);
		// display all tokens
		this.#displayAll(this.#tokens);
		
		// now conbine tokens into meaningful tokens
		this.#combineTokens()
		
		console.log(`number of meaningful tokens: ${this.#meaningfulTokens.length}`);
		// display all tokens
		this.#displayAll(this.#meaningfulTokens);
		
	}
	
	/**
		This methods essentialy does two things:
		1) combine tokens: for example, = and = together becomes ==, etc.
		2) get rid of white spaces, for example. x = y becomes x=y
	 **/
	#combineTokens() {
		const meaningfulTokens = [];
		let combinableToken = null;
		let openQuote = null;
		let currentString = "";
		
		// enumerate tokens
		for(let i = 0; i < this.#tokens.length; i++) {
			const t = this.#tokens[i];
			const isQuote = t.isQuote;
			
			// got quote?
			if (openQuote) {
				if (t.name === openQuote.name) {
					// quote closed, gathered a string
					const strToken =  new Token(currentString, Token.TOKEN_TYPE_STRING, openQuote.lineNo, openQuote.beginPos);
					meaningfulTokens.push(strToken);
					openQuote = null;
					currentString = "";
				} else {
					// note that here we don't use name but value due to the symbolic nature of space chars
					currentString += t.value;
				}
				continue;
			} else if (isQuote) {
				// got an open quote, wait for close quote
				openQuote = t;
				continue;
			}
			
			// got space? skip
			if (t.isSpace) {
				if (combinableToken) {
					// last combinable token closed
					meaningfulTokens.push(combinableToken);
					combinableToken = null;
				}
				
				// only add CR token since it serves as statement delimitor
				if (t.isCR) {
					meaningfulTokens.push(t);
				}
				continue;
			}
			
			// combine the new token with existing tokens?
			if (combinableToken) {
				const newToken = this.#combineTowTokens(combinableToken, t);
				if (newToken) {
					combinableToken = newToken;
					continue;
					
				} else {
					meaningfulTokens.push(combinableToken);
					combinableToken = null;	
				}						
			}
			
			// t is still not absorbed
			if (t.getCombinableInfo) {
				// if t is a combinable token, save it
				combinableToken = t;
			} else {
				// a non-space, non-combinable token, push it
				meaningfulTokens.push(t);
			}
		}
		
		// left over token?
		if (combinableToken) {
			meaningfulTokens.push(combinableToken);
		}
		
		this.#meaningfulTokens = meaningfulTokens;
	}
	
	/*
		combine a group of tokens and a new token together.
		returns true if the new token is absorbed, false if the new token
		is not absorbed.
	 */
	#combineTowTokens(token1, token2) {
		const combinedTokenStr = token1.name + token2.name;
		const combinedTokenInfo = Token.getTokenInfo(combinedTokenStr);
		if (combinedTokenInfo) {
			return new Token(combinedTokenStr, combinedTokenInfo.type, token1.lineNo, token1.beginPos);
		}
		
		return null;
	}
	
	#newToken(codeStr, begin, end, line) {
		// new token name
		const name = codeStr.substring(begin, end);
		console.log(`found new token: ${name}`);
		let type = Token.getTokenInfo(name);
		let tt = null;
		if (type) {
			tt = type.type;
		} else {
			tt = Token.TOKEN_TYPE_NAME;
		}
		
		const token = new Token(name, tt, line, begin);
		return token;
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
				if (nextToken.type != Token.TOKEN_TYPE_SPACE) {
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
		const thisTokenInfo = Token.getTokenInfo(token.name);
		let errMsg = "";
		const bracketName =Token.bracketTypeToName(thisTokenInfo.bracketType);
		let hasErro = false;
		if (token.isCloseBracket) {
			if (bracketStack.length === 0 ) {
				hasErro = true;
			}
			else {
				// must matches the last open brachet
				const lastToken = bracketStack.pop();
				const lastTokenInfo = Token.getTokenInfo(lastToken.name);
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
	
	#checkQuoteMatches(token, quoteStack) {
		const thisTokenInfo = Token.getTokenInfo(token.name);
		const stackLen = quoteStack.length;
		const lastQuote = stackLen > 0 ? quoteStack[stackLen - 1] : null;
		let matched = false;
		if (lastQuote) {
			const lastTokenInfo = Token.getTokenInfo(lastQuote.name);
			if (lastTokenInfo.quoteType == thisTokenInfo.quoteType) {
				quoteStack.pop();
				matched = true;
			}
		}
		
		if (!matched) {
			quoteStack.push(token);
		}
	}
	
	variableToken(name) { this.variables.get(token.name); }
	
}

export {CodeAnalyst}


	




