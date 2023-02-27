import {TokenConst, Token, TokenError}		from './token.js'
import {StateAction, ParsingState}			from './parsingState.js'
import {FunctionCallState}					from './functionCallState.js'

class ObjectMethodCallState extends ParsingState {
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		
		// is the object known?
		if (!beginToken.isKnownObjectName) {
			const v = this.scope.findVariable(beginToken.name, false);
			if (!v) {
				this.error = new TokenError(TokenError.ERROR_UNDEFINED_VARIABLE_FOUND, beginToken);
				return;
			}
		}
		
		this.stage = ObjectMethodCallState.BEGIN_STATE;
	}
	
	static get BEGIN_STATE() {return 0; }
	static get METHOD_ACCESS_STATE() {return 1; }
	static get METHOD_CALLING_STATE() {return 2; }
	
	advance(nextToken, pos) {
		let nextState = null;
		let stateEnded = false;
		let skipNextToken = true;
		do {
			if (this.stage === ObjectMethodCallState.BEGIN_STATE) {
				this.stage = ObjectMethodCallState.METHOD_ACCESS_STATE;
				
				// must be a "dot"
				if (!nextToken.isObjectAccessor) {
					this.error = new TokenError(TokenError.ERROR_EXPECTING_TOKEN_PREFIX + '.', nextToken);
				}
				
				break;
			}
			
			if (this.stage === ObjectMethodCallState.METHOD_ACCESS_STATE) {
				this.stage = ObjectMethodCallState.METHOD_CALLING_STATE;
				
				// must be a NAME
				if (!nextToken.isName) {
					this.error = new TokenError(TokenError.ERROR_EXPECTING_TOKEN_PREFIX + '.', nextToken);
					break;
				}
				
				// redirect to function call state:
				nextState = new FunctionCallState(pos, nextToken, this.scope, this.codeAnalyst, false);
				break;
			}
			
			
		} while (false);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		
		if (nextState) {
			nextState.parentState = this;
		}
		return new StateAction(nextState, this.error, stateEnded, skipNextToken);
	}
	
	isTheLastToken(token) {
		if (this.stage === ObjectMethodCallState.METHOD_CALLING_STATE && token.isCloseRoundBracket) {
			this.stateEnded = true;
		} 
		return this.stateEnded;	
	}
}

export {ObjectMethodCallState}
