import {StateAction, ParsingState}		from './parsingState.js'
import {ExpressionState}				from './expressionState.js'
import {TokenError}						from './token.js'

class ArrayDefState extends ParsingState {
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = ArrayDefState.BEGIN_STATE;
	}
	
	static get BEGIN_STATE() {return 0; }
	static get EXPR_STATE() {return 1; }
	
	advance(nextToken, pos) {
		let bodyStarted = false;
		let nextState = null;
		let stateEnded = false;
		let skipNextToken = false;
		do {
			if (this.stage === ArrayDefState.BEGIN_STATE || this.stage === ArrayDefState.EXPR_STATE) {
				nextState = new ExpressionState(pos, nextToken, this.scope, this.codeAnalyst);
				this.stage = ArrayDefState.EXPR_STATE;
				break;
			}	
		} while (false);
		
		if (nextState) {
			nextState.parentState = this;
		}
		return new StateAction(nextState, this.error, stateEnded, skipNextToken);
	}
	
	isTheLastToken(token) {
		let hasError = false;
		if (token.isComma) {
			this.stage = ArrayDefState.EXPR_STATE;
		} 
		else if (token.isCloseSquareBracket) {
			this.stateEnded = true;
			
		} else {
			this.error = new TokenError("Invalid array syntax", token);	
			this.codeAnalyst.errors.push(this.error);
		}

		return this.stateEnded;	
	}
}

export {ArrayDefState}

