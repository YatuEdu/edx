import {TokenConst, Token, TokenError}		from './token.js'
import {StateAction, ParsingState}			from './parsingState.js'
import {Operator, DotOperator}				from './operator.js'
import {Operand, TempOperand, OpenRoundBrachetOperand, CloseRoundBrachetOperand, CodeOperand} from './oprand.js'
import {FunctionCallState}					from './functionCallState.js'
import {ArraySubscriptionState}				from './arraySubscriptionState.js'
import {ArrayDefState}						from './arrayDefState.js'
import {ObjectDefState}						from './objectDefState.js'

const ERROR_UNDEFINED_VARIABLE_FOUND = "Undefined valrable found";

class ExpressionState extends ParsingState {
	#operandStack;	
	#currentOperator;
	#lastElement
	#numberOfTemp 
	#totalOpenRoundBracket
	#totalCloseRoundBracket
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.#operandStack = [];
		this.#numberOfTemp = 0;
		this.#totalOpenRoundBracket = 0;
		this.#totalCloseRoundBracket = 0;
	}
	
	advance(nextToken, pos) {
		const tokenInfo = Token.getTokenInfo(nextToken.name);
		
		// expression ends?
		let changeState = false;
		let newElement = null;
		let nextState = null;
		do {
			// is function call syntax?
			const funcCall = this.isFunctionCall(pos);
			if (funcCall.isFunctionCall) {
				// treat function call as a value
				newElement = this.#addTempOprand(funcCall.functionName);
				
				// go to function calling state
				nextState = new FunctionCallState(pos, nextToken, this.scope, this.codeAnalyst, false);
				break;
			}
			
			// array subscription syntax?
			if (Operand.isOperand(nextToken) && this.matchTokenName(pos+1, "[")){
				// treat function call as a value
				newElement = this.#addTempOprand("arraryElement");
				
				// go to array state
				nextState = new ArraySubscriptionState(pos, nextToken, this.scope, this.codeAnalyst, false);
				break;
			}
			
			// is array assignment syntax?
			if (this.matchTokenName(pos, "[")){
				// treat function call as a value
				newElement = this.#addTempOprand("arrary");
				
				// go to array state
				nextState = new ArrayDefState(pos, nextToken, this.scope, this.codeAnalyst, false);
				break;
			}
			
			// object syntax
			if (this.matchTokenName(pos, "{")){
				// treat function call as a value
				newElement = this.#addTempOprand("obj-literal");
				
				// go to array state
				nextState = new ObjectDefState(pos, nextToken, this.scope, this.codeAnalyst, false);
				break;
			}
		
			// expression ended?
			if (nextToken.isExpressionEnd || this.#expressionEnded(nextToken, pos)) {
				this.#handleSubExpressionClose(nextToken);
				this.stateEnded = true;
				changeState = true;
				break;
			}
			
			// skip CR for the next token
			if (nextToken.isCR) {
				break;
			}
			
			// add begin round bracket?
			if (nextToken.isOpenRoundBracket) {
				newElement = this.#addOpenRoundBracket(nextToken);
				break;
			}
			
			// resolve round bracket into one temporary operand
			if (nextToken.isCloseRoundBracket) {
				newElement = this.#handleSubExpressionClose(nextToken);
				if (this.stateEnded) {
					changeState = true;
				}
				break;
			}
			
			// add new operand?
			if (Operand.isOperand(nextToken)) {
				newElement = this.#addOperand(nextToken);
				break;
			}
			
			// add a new operator?
			if (Operator.isOperator(nextToken)) {
				newElement = this.#addOperator(nextToken);
				break;
			}
						
		} while(false);
		
		do {
			if (this.error) {
				break;
			}
			
			// no expression element found
			if (!changeState && !nextState) {
				if (!this.stateEnded && !newElement) {
					this.error = new TokenError("Invalid expression element found", nextToken);
					break;
				}
			}
			
			// can the new element follow the last element?
			if (newElement) {
				if (this.#lastElement && !this.#lastElement.canBeFollowedBy(newElement)) {
					this.error = new TokenError("Invalid token found", nextToken);
					break;
				}			
				this.#lastElement = newElement;
				newElement = null;
			}
				
			if (this.stateEnded) {
				changeState = true;
				// also set parent state to finish if any
				if (this.parentState) {
					this.parentState.isTheLastToken(nextToken);
				}
			}
		} while(false);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		return new StateAction(nextState, this.error, changeState);			
	}
	
	// parsing ended, resolve all operands in the stack

	complete() {
		if (!this.error) {
			this.#handleSubExpressionClose(null);
			if (this.error) {
				this.codeAnalyst.errors.push(this.error);
			}
		}
	}

	/*
		Does CR mean anything for this state?  By default CR does not affect the syntax at all.
	 */
	ignoreCR() {
		return false;
	}
	
	// if we started a new line, we might start a new expression or continue the current one.
	// it is complicated. For now we look for "=" only.
	// todo: make it perfect
	#expressionEnded(nextToken, pos) {
		let newExprStarted = false;
		if (nextToken.isCR) {
			// reached the end?
			if (pos + 1 === this.codeAnalyst.meaningfulTokens.length) {
				return true;
			}
		
			// search for "=" on the same line
			for (let i = pos + 1; i < this.codeAnalyst.meaningfulTokens.length; i++) {
				const currentToken = this.codeAnalyst.meaningfulTokens[i];
				// found another CR, expression not ended yet
				if (currentToken.isCR) {
					break;
				}
				
				// found assignment on the new line, meaning the old expression ended at the CR
				if (currentToken.isAssignment) {
					newExprStarted = true;
					break;
				}
			}
		}
		
		return newExprStarted;
	}
	
	#addOpenRoundBracket(token) {
		
		const lastOperand = this.#peek();
		const newOperand = new OpenRoundBrachetOperand(token); 
	
		// associate the binary op with the last oprand:
		if (lastOperand) {
			if (lastOperand.binaryOperatorRight) {
				newOperand.binaryOperatorLeft = lastOperand.binaryOperatorRight;
			}
		}
		
		this.#operandStack.push(newOperand);
		++this.#totalOpenRoundBracket;
		return newOperand;
	}
	
	#addOperand(token) {
		// eat unary operator if applicable:
		if (this.#currentOperator) {
			if (this.#currentOperator.isUnaryFront) {
				// the unary front operator can be eaten by this operand
				this.#currentOperator = null;
			} else {
				this.error = new TokenError("Invalid operator found", this.#currentOperator.token);
				return;
			}
		}
		const lastOperand = this.#peek();
		const newOperand = new CodeOperand(token); 
	
		// associate the binary op with the last oprand:
		if (lastOperand) {
			if (lastOperand.binaryOperatorRight) {
				newOperand.binaryOperatorLeft = lastOperand.binaryOperatorRight;
			} 
		}
		
		this.#operandStack.push(newOperand);
		return newOperand;
	}
	
	#addOperator(token) {
		if (this.#currentOperator) {
			this.error = new TokenError("Ophaned operator found", token);
			return;
		}
		
		let newOp = null;
		if (token.isObjectAccessor) {
			newOp = new DotOperator(token);
		} else {
			newOp = new Operator(token);
		}
		
		const lastOperand = this.#peek();
		
		// wait for the next operand 
		if (!lastOperand) {
			if (newOp.isUnaryFront) {
				this.#currentOperator = newOp;
				return newOp;
			}
			
			// ophan operator found
			this.error = new TokenError("Ophan operator found", token);
			return;
		}
		
		// eat unary rear operator if applicable, or error
		if (!lastOperand.binaryOperatorRight) {
			if (newOp.isUnaryRear) {
				// todo: is there a rear operator that work on constant?
				if (lastOperand.isConst) {
					this.error = new TokenError("Invalid operator found", token);
				}
				return newOp;
			}
			
			// associate with the last operand
			lastOperand.binaryOperatorRight = newOp;
		} else {
			// extra operator found
			this.error = new TokenError("Invalid extra operator found", token);
			return;
		}
		
		// compare with the last operator, if lower priority, resove the last operator firstChild
		if (lastOperand.binaryOperatorLeft && newOp.priority <= lastOperand.binaryOperatorLeft.priority) {
			const tempOperand = this.#resolveBinary(newOp);
			if (!tempOperand) {
				// error occurred
				return;
			}
			if (tempOperand.binaryOperatorRight !== newOp) {
				// new operator has not been absorbed yet
				//this.#currentOperator = newOp;
				this.error = new TokenError("Invalid extra operator found", token);
				return;
			}			
		}
		
		return newOp;
	}
	
	#addTempOprand(name, newOp) {
		const temp = new TempOperand(name, "tbd");
		const lastOperand = this.#peek();
		if (lastOperand) {
			temp.binaryOperatorLeft = lastOperand.binaryOperatorRight; 
		}
		if (newOp) {
			temp.binaryOperatorRight = newOp;
		}
		this.#operandStack.push(temp);
		return temp;
	}
	
	// resolve two operand as a result of a binary operation
	#resolveBinary(newOp) {
		if (newOp && this.#operandStack.length < 2) {
			this.error = new TokenError("Invalid operator found", newOp.token);
			return;
		}
		
		const oprandR = this.#operandStack.pop();
		const oprandL = this.#operandStack.pop();
		if (oprandL.binaryOperatorRight != oprandR.binaryOperatorLeft) {
			this.error = new TokenError("Invalid expression state encounteed", newOp.token);
			return;
		}
		
		// operator left variable needs to be defined
		if (oprandL.isVariable) {
			const v = this.scope.findVariable(oprandL.name, false);
			if (!v) {
				this.error = new TokenError(ERROR_UNDEFINED_VARIABLE_FOUND, oprandL.token);
				return null;
			}
		}
		// operator right needs to be defined unless the operator is "."
		if (oprandR.isVariable && !(oprandR.binaryOperatorLeft instanceof DotOperator)) {
			const v = this.scope.findVariable(oprandR.name, false);
			if (!v) {
				this.error = new TokenError(ERROR_UNDEFINED_VARIABLE_FOUND, oprandR.token);
				return null;
			}
		}
		
		return this.#addTempOprand("T"+ this.#numberOfTemp++, newOp) 
	}
	
	/**
		Handling Expression closing (or partialy closing).
		This METHOD handles two scenarios: 
		1) resolving partial expression ending marked by ")"
		2) resolving entire expression ending marked by ';" or other ending methods
	 
		Each of the two scenarios requires slightly different handling, thus makes this 
		methd not single purpose.  We will modify it later with better patterns.
	**/
	#handleSubExpressionClose(token) {
		if (!token) {
			// create an ending token:
			token = Token.createExpressionEndToken();
		}
		
		// we are ended	or errored
		if (token.isCloseRoundBracket && this.#totalOpenRoundBracket === 0) {
			// We encountered a ")" which has no "(", we think this is from a parent state, so we end here
			this.stateEnded = true;
			return null;
		}
		
		// resolve all operands til the open round bracket
		let oprandRight = null;
		let lastLeftOperator = null;
		let oprand = null;
		do {
			oprand = this.#operandStack.pop();
			
			// we have an error because we would have seen "(" first
			if (token.isCloseRoundBracket) {
				if (!oprand) {
					this.error = new TokenError("Invalid ')' found", token);
					break;
				}
				
				// we are done
				if (oprand.token && oprand.token.isOpenRoundBracket) {
					lastLeftOperator = oprand.binaryOperatorLeft;
					break;
				}
			} 
			
			// un-used operator found
			if (oprandRight) {
				// combine this operand (left) with the last operand (right)
				if (oprand) {
					if (oprandRight.binaryOperatorLeft !== oprand.binaryOperatorRight) {
						this.error = new TokenError("Unmatched operator found", oprand.token);
						break;
					}
				}	
			} else {
				// The right most operand should not have a right operator in it
				if (oprand && oprand.binaryOperatorRight ) {
					this.error = new TokenError("Invalid operator found", oprand.binaryOperatorRight.token);
					break;
				}
			}
			
			// oprandRight needs to be defined unless the operator is "."
			if (oprand && oprand.isVariable && !(oprand.binaryOperatorLeft instanceof DotOperator)) {
				const v = this.scope.findVariable(oprand.name, false);
				if (!v) {
					this.error = new TokenError(ERROR_UNDEFINED_VARIABLE_FOUND, oprand.token);
					break;
				}
			}
			oprandRight = oprand;
		} while (oprand);
		
		// resolve (x y z) to one temp operand
		if (token.isCloseRoundBracket && !this.error) {
			const temp = new TempOperand("resolved_sub_exp", "tbd");
			temp.binaryOperatorLeft = lastLeftOperator; 
			this.#operandStack.push(temp);
			--this.#totalOpenRoundBracket;
			return new CloseRoundBrachetOperand(token);
		}
		
		// entire expression ended
		return null;
	}
	
	#peek() {
		const len = this.#operandStack.length;
		if(len > 0) {
			return this.#operandStack[len-1];
		}
		
		return null;
	}
}

export {ExpressionState} 
//, IfState, VarDeclarationState, AssignmentState, ExpressionState, FunctionDefState, FunctionCallState}