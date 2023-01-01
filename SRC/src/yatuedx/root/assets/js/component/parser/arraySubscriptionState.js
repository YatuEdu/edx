import {StateAction, ParsingState}			from './parsingState.js'
import {TokenError}							from './token.js'
import {ExpressionState}					from './expressionState.js'

class ArraySubscriptionState extends ParsingState {
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = ArraySubscriptionState.BEGIN_STATE;
		if (!beginToken.isName) {
			this.error = new TokenError("Invalid array subscription syntax.", beginToken);
			
		} else {
			// array must be initialized
			const v = scope.findVariable(beginToken.name, false);
			if (!v) {
				this.error = new TokenError(`Array '${beginToken.name}' not defined`, beginToken);
			}
		}
		
		if (this.error) {
			codeAnalyst.errors.push(this.error);
		}
		this.stage = ArraySubscriptionState.BEGIN_STATE;
	}
	
	static get BEGIN_STATE() {return 0; }
	static get EXPR_STATE() {return 1; }
	
	advance(nextToken, pos) {
		let bodyStarted = false;
		let nextState = null;
		let stateEnded = false;
		let skipNextToken = true;
		do {
			if (this.stage === ArraySubscriptionState.BEGIN_STATE) {
				if (!nextToken.isOpenSquareBracket) {
					this.error = new TokenError("Invalid array subscription syntax.", nextToken);
					break;
				}
				
				nextState = new ExpressionState(pos, nextToken, this.scope, this.codeAnalyst);
				this.stage = ArraySubscriptionState.EXPR_STATE;
				break;
			}	
		} while (false);
		
		if (nextState) {
			nextState.parentState = this;
		}
		return new StateAction(nextState, this.error, stateEnded, skipNextToken);
	}
	
	
	isTheLastToken(token) {
		if (token.isCloseSquareBracket) {
			this.stateEnded = true;
		} else {
			this.error = new TokenError("Invalid array syntax", token);	
			this.codeAnalyst.errors.push(this.error);
		}

		return this.stateEnded;	
	}
}

export {ArraySubscriptionState}