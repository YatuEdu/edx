import {StateAction, ParsingState}			from './parsingState.js'
import {TokenError, TokenConst}				from './token.js'
import {ExpressionState}					from './expressionState.js'

const errorMsg = "Invalid object definition syntax";

class ObjectDefState extends ParsingState {
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = ObjectDefState.PROP_NAME_STATE;
	}
	
	static get PROP_NAME_STATE() {return 1; }
	static get PROP_POST_NAME_STATE() {return 2; }
	static get PROP_VALUE_STATE() {return 3; }
	static get PROP_LAST_STATE() {return 4; }
	
	advance(nextToken, pos) {
		let bodyStarted = false;
		let nextState = null;
		let stateEnded = false;
		let advanceToNextToken = true;
		do {
			if (this.stage === ObjectDefState.PROP_NAME_STATE) {
				if (nextToken.isName || nextToken.isConst) {
					this.stage = ObjectDefState.PROP_POST_NAME_STATE;
					break;
				}
				
				this.error = new TokenError(errorMsg, nextToken);
				break;
			}				
			
			if (this.stage === ObjectDefState.PROP_POST_NAME_STATE) {
				if (nextToken.isColon) {
					this.stage = ObjectDefState.PROP_VALUE_STATE;
					nextState = new ExpressionState(pos, nextToken, this.scope, this.codeAnalyst);
					break;
				}
				
				this.error = new TokenError(errorMsg, nextToken);
				break;
			}

			if (this.stage === ObjectDefState.PROP_LAST_STATE) {
				if (nextToken.isCloseCurlyBracket) {
					stateEnded = true;
					break;
				}
				
				this.error = new TokenError(errorMsg, nextToken);
				break;
			}
	
		} while (false);
		
		if (nextState) {
			nextState.parentState = this;
		}

		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		return new StateAction(nextState, this.error, stateEnded, advanceToNextToken);
	}
	
	
	isTheLastToken(token) {
		if (token.isCloseCurlyBracket) {
			this.stateEnded = true;
		} else if (token.isComma) {
			this.stage = ObjectDefState.PROP_NAME_STATE;	
			// Tag the comma
			token.blockTag = TokenConst.BLOCK_TAG_OBJECT_COMMA;
		} else if (token.isCR) {
			this.stage = ObjectDefState.PROP_LAST_STATE;
		} else {
			this.error = new TokenError(errorMsg, token);	
			this.codeAnalyst.errors.push(this.error);
		}

		return this.stateEnded;	
	}
}

export {ObjectDefState}