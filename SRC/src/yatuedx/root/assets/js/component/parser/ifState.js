import {StateAction, ParsingState}		from './parsingState.js'
import {CodeBlockState}					from './codeBlockState.js'
import {ExpressionState}				from './expressionState.js'
import {TokenError}						from './token.js'

class IfState extends ParsingState {
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
	}
	
	advance(nextToken, pos) {
		let nextState = null;
		let stateEnded = false;
		let skipThisToken = false;
		do {
			if (!this.stage) {
				this.stage = 0;
				break;
			}
			
			if (nextToken.isOpenRoundBracket && this.stage == 0) {
				this.stage = 1;
				// entering expression state, push this state to stack
				nextState = new ExpressionState(pos, nextToken, this.scope, this.codeAnalyst);
				break;
			}		
			
			if (this.stage == 1) {
				this.stage = -1
				// IF-state ended nicely, enter a new code block:
				nextState = new CodeBlockState(pos, 					// current token position
											nextToken, 				// starting token
											new Scope(this.scope), 	// new scope spawned from the current one
											this.codeAnalyst);		
				stateEnded = true;
				break;
			}
			
			// if without {}, enter unknown state
			if (this.stage == 2) {
				this.stage = 3;
				// IF-state ended nicely
				stateEnded = true;
				break;
			}
			
			// if we come here, we run into unknown token
			this.error = new TokenError("Invalid state in 'if' statement.", nextToken);
		} while (false);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		return new StateAction(nextState, this.error, stateEnded);
	}
}

export {IfState}