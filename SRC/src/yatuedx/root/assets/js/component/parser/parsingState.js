class StateAction {
	#newState
	#error
	#stateEnded
	#advanceToNextToken
	
	constructor(newState, error, stateEnded, advanceToNextToken) {
		this.#newState = newState;
		this.#error = error;
		this.#stateEnded = stateEnded;
		
		// when starting a new state, we need to know if the 1st token starts
		// from the current position or from the next position
		if (typeof advanceToNextToken !== 'undefined') {
			this.#advanceToNextToken = advanceToNextToken;
		} else {
			this.#advanceToNextToken = true;
		}
	}
	
	get newState() { return this.#newState; }
	get error() { return this.#error; }
	get stateEnded() { return this.#stateEnded; }
	get advanceToNextToken() { return this.#advanceToNextToken; }
}

class ParsingState {
	#beginPos
	#beginToken
	#stage
	#codeAnalyst
	#errroExit
	#scope
	#error
	#stateEnded
	#parentState
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		this.#beginPos = beginPos;
		this.#beginToken = beginToken;
		this.#codeAnalyst = codeAnalyst;
		this.#scope = scope;
		this.#stateEnded = false;
		this.#parentState = null;
	}
	
	/**
		This happens when one state ended and we got this state from the state stack.
		We resume the current state using the popped state and set its stage to the next one:
	 **/
	nextStage(addStage) {
		this.stage += addStage;
	}
	
	/* overloadables */
		
	advance(nextToken, pos) {
		throw new Error('advance: sub-class-should-overload-this method'); 
	}
	
	isTheLastToken(token) {
		// default doing nothing
	}
	
	/*
		Does CR mean anything for this state?  By default CR does not affect the syntax at all.
	 */
	ignoreCR() {
		return true;
	}
	
	complete() {
		// state ended:
	}
	
	/**
		Tell if es6 class definition is seen at the current position
	 **/
	isEs6Class(pos) {
		// At least 4 tokens, for example: class a {} 
		if (this.codeAnalyst.meaningfulTokens.length < pos + 4) {
			return false;
		}

		let objName = this.codeAnalyst.meaningfulTokens[pos];
		if (!objName.isClass){
			return false;
		}

		return true;
	}

	/*
		find function definition body starting position (right after "{")
	 */
	findAheadFuncDefBody(pos) {
		// At least 4 tokens, for example: foo () {}
		if (this.codeAnalyst.meaningfulTokens.length < pos + 4) {
			return null;
		}

		const objName = this.codeAnalyst.meaningfulTokens[pos];
		if (!objName.isOpenRoundBracket) {
			return null;
		}

		let len = this.codeAnalyst.meaningfulTokens.length;
		
		// find '{}'
		let foundBegin = false;
		for(let i = pos + 1; i < len-1; i++) {
			const token = this.codeAnalyst.meaningfulTokens[i];
			if (!foundBegin) {
				if (token.isOpenCurlyBracket) {
					foundBegin = true;
				}
			} else {
				if (token.isName) {
					return i;
				}
				if (token.isCloseCurlyBracket) {
					return null;
				}
			}
		}

		return null;
	}

	/**
		Tell if object Subscript syntax is seen: x[a]
	 **/
	isSubscript(pos) {
		// At least 4 tokens, for example: a[i]
		if (this.codeAnalyst.meaningfulTokens.length < pos + 4) {
			return false;
		}
		
		const objName = this.codeAnalyst.meaningfulTokens[pos];
		if (!objName.isName){
			return false;
		}
		const openSqure = this.codeAnalyst.meaningfulTokens[pos+1];
		if (!openSqure.isOpenSquareBracket){
			return false;
		}
		return true;
	}
	
	/**
		Tell if object Subscript syntax is seen: x[a] = 0;
	 **/
	isSubscriptAssignment(pos) {
		// At least 6 tokens, for example: a[i] = 0
		let len = this.codeAnalyst.meaningfulTokens.length;
		if (len < pos + 6) {
			return false;
		}
		
		const objName = this.codeAnalyst.meaningfulTokens[pos];
		if (!objName.isName){
			return false;
		}
		

		const openSqure = this.codeAnalyst.meaningfulTokens[pos+1];
		if (!openSqure.isOpenSquareBracket){
			return false;
		}
		
		// find ] = 
		let i = pos + 2;
		let found = false;
		while(i < len-1) {
			let token = this.codeAnalyst.meaningfulTokens[i];
			let token2 = this.codeAnalyst.meaningfulTokens[i+1];
			if (token.isCloseSquareBracket && token2.isAssignment) {
				found = true;
				break;
			}
			++i;
		}
		return found;
	}
	
	
	/**
		Tell if a function call statement is at position 'pos"
	 **/
	isFunctionCall(pos) {
		// At least 3 tokens, for example: foo()
		if (this.codeAnalyst.meaningfulTokens.length < pos + 3) {
			return false;
		}
		
		const funcName = this.codeAnalyst.meaningfulTokens[pos];
		if (!funcName.isName && !funcName.isKnownFunctionName) {
			return false;
		}
		
		const open = this.codeAnalyst.meaningfulTokens[pos+1];
		if (!open.isOpenRoundBracket) {
			return false;
		}
		
		// find pattern as: x,y,)
		let reachedEnd = false;
		let i = pos + 2;
		let state = 0;
		const exprList = [];
		let expre = [];
		while (i < this.codeAnalyst.meaningfulTokens.length) {
			const token = this.codeAnalyst.meaningfulTokens[i];
			if (token.isCloseRoundBracket) {
				reachedEnd = true;
				break;
			}
			if (token.isComma) {
				exprList.push(expre);
				expre = [];
			} else {
				expre.push(token);
			}
			++i;
		}
		
		return {isFunctionCall: reachedEnd, functionName: funcName, expresionList: exprList};	
	}
	
	isFunctionDefinition(pos) {
		const token = this.codeAnalyst.meaningfulTokens[pos];
		if (!token.isFunction) {
			return false;
		}
		
		// At least 6 tokens, for example: function foo(){}
		if (this.codeAnalyst.meaningfulTokens.length < pos + 6) {
			this.error = new TokenError("Invalid function definition syntax", nextToken);
			this.codeAnalyst.push(error);			
			return false;
		}
		
		return true;
	}
	
	isObjectMethodCall(pos) {
		// signature a.b() 
		if (this.codeAnalyst.meaningfulTokens.length < pos + 5) {
			return false;
		}
		const currentToken = this.codeAnalyst.meaningfulTokens[pos];
		if ((currentToken.isName || currentToken.isKnownObjectName)
		    && this.codeAnalyst.meaningfulTokens[pos + 1].isObjectAccessor 
			&& this.codeAnalyst.meaningfulTokens[pos + 2].isName
			&& this.codeAnalyst.meaningfulTokens[pos + 3].isOpenRoundBracket) {
			// method call name
			return currentToken.name + '_' + this.codeAnalyst.meaningfulTokens[pos + 2].name;
		}
		
		return "";
	}
	
	isEpressionStatement(pos) {
		while (pos < this.codeAnalyst.meaningfulTokens.length) {
			const token = this.codeAnalyst.meaningfulTokens[pos++];
			if (token.isName || token.isOp || token.isConst) {
				return true;
			}
		}
		return false;
	}
	
	isObjectProperty(pos) {
	}
	
	isForLoop(pos) {
		const token = this.codeAnalyst.meaningfulTokens[pos];
		return token.isForLoop;
	}	
	
	/**
		Look forward or backforward for a token name match
	 **/
	matchTokenName(pos, name) {
		return 	pos >= 0 
				&& this.codeAnalyst.meaningfulTokens.length > pos 
				&& this.codeAnalyst.meaningfulTokens[pos].name === name;
	}
	
	/**
		Look forward or backforward for a token
	 **/
	getTokenByPosition(pos) {
		if (pos >= 0 && this.codeAnalyst.meaningfulTokens.length > pos) {
			return this.codeAnalyst.meaningfulTokens[pos];
		}
		return null;
	}
	
	/* getters and setter */
	
	get beginPos() { return this.#beginPos; }
	get stage() { return this.#stage; }
	set stage(s) { this.#stage = s; }
	get scope() { return this.#scope; }
	get beginToken() { return this.#beginToken; }
	get codeAnalyst() { return this.#codeAnalyst; }
	get error() { return this.#error; }
	set error(e) { this.#error = e; }
	get stateEnded() { return this.#stateEnded }
	set stateEnded(e) { this.#stateEnded = e }
	get parentState() { return this.#parentState}
	set parentState(ps) { this.#parentState =  ps}
	
}

export {StateAction, ParsingState}