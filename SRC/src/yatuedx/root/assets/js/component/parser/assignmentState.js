import {StateAction, ParsingState}		from './parsingState.js'
import {ExpressionState}				from './expressionState.js'
import {TokenConst, TokenError}			from './token.js'

class AssignmentState extends ParsingState {
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		
		super(beginPos, beginToken, scope, codeAnalyst);
		if (!beginToken.isName) {
			this.error = new TokenError("Invalid variable name found", beginToken);
			
		} else {
			// assignment to const is not allowed
			const v = scope.findVariable(beginToken.name, false);
			if (v && v.isConst) {
				this.error = new TokenError("Const variable can not be changed", beginToken);
			}
		}
		
		if (this.error) {
			codeAnalyst.errors.push(this.error);
		}
		this.stage = 0;
	}
	
	advance(nextToken, pos) {
		if (this.error) {
			return new StateAction(null, this.error, true)
		}
		
		
		let nextState = null;
		let advanceToNext = false;
		do {
			if (0 === this.stage) {
				if (!nextToken.isAssignment) {
					this.error = new TokenError("Invalid assignment state", nextToken);
					codeAnalyst.errors.push(this.error);
				}
				this.stage = 1;
				// start the expression
				nextState = new ExpressionState(pos, nextToken, this.scope, this.codeAnalyst);
				advanceToNext = true;
				break;
			}
			
			if (1 === this.stage) {
				// expression state ended, we can add the new variable now if not already added
				const v = this.scope.findVariable(this.beginToken.name, false);
				if (!v) {
					// Implicit variable declaration as global (windows) variable
					const newVar = new Variable(this.beginToken, TokenConst.VAR_TYPE_WINDOW);
					this.scope.addWindowsVariable(this.beginToken.name, newVar); 
				}
				this.stage = 2;
				break;
			}
			
			if (2 === this.stage) {
				this.stateEnded = true;
				break;
			}
		
		}
		while(false);
		
		// go to expression state		 
		return new StateAction(nextState, this.error, this.stateEnded, advanceToNext);			
	}
}

export {AssignmentState}