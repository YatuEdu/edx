import {StateAction, ParsingState}		from './parsingState.js'
import {TokenError, Token}				from './token.js'
import {ExpressionState}				from './expressionState.js'

class FunctionCallState extends ParsingState {
	#parameterExpressions
	#functionaName
	
	constructor(beginPos, beginToken, scope, codeAnalyst, functionInfo) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = 0;
	}
	
	advance(token, pos) {
		const tokenInfo = Token.getTokenInfo(token.name);
		let nextState = null;
		let stateEnded = false;
		let skipThisToken = true;
		do {
			if (this.stage === 0) {
				// check "("
				if (!token.isOpenRoundBracket) {
					this.error = new TokenError("Invalid function call syntax", token);
					break;
				}
				
				// enter expression stage
				this.stage = 1;
				break;
			}
			
			if (this.stage === 1) {
				if (token.isCloseRoundBracket) {
					stateEnded = true;
					// also set parent state to finished if any
					if (this.parentState) {
						this.parentState.isTheLastToken(token);
					}
				} else {
					// enter expression stage (again or first time)
					nextState = new ExpressionState(pos, token, this.scope, this.codeAnalyst);
					nextState.parentState = this;
					
					// Important!! 
					// Since we always starts the expression with the current token, 
					// we set startFromNextToken to false.  
					skipThisToken = false;
				}
				break;
			}
		} while(false);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		
		return new StateAction(nextState, this.error, stateEnded, skipThisToken);
	}
	
	isTheLastToken(token) {
		if (this.stage === 1 && token.isCloseRoundBracket) {
			this.stateEnded = true;
			
		} 
		return this.stateEnded;	
	}
}

export {FunctionCallState}
