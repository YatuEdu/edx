import {TokenConst, Token, TokenError}		from './token.js'
import {StateAction, ParsingState}			from './parsingState.js'
import {Operator, DotOperator}				from './operator.js'
import {Operand, TempOperand, OpenRoundBrachetOperand, CloseRoundBrachetOperand, CodeOperand, ThisOperand} from './oprand.js'
import {FunctionCallState}					from './functionCallState.js'
import {ArraySubscriptionState}				from './arraySubscriptionState.js'
import {ArrayDefState}						from './arrayDefState.js'
import {ObjectDefState}						from './objectDefState.js'
import {ObjectMethodCallState}				from './objectMethodCallState.js'
import {NewInstanceCallState}				from './newInstanceCallState.js'

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
			// is NEW CLASS INSTANCE call syntax? For example, x = new X();

			if (nextToken.isNew) {
				// treat function call as a value
				newElement = this.#addTempOprand("new_clss_instc");
								
				// go to function calling state
				nextState = new NewInstanceCallState(pos, nextToken, this.scope, this.codeAnalyst, false);
				break;
			}
			

			// is function call syntax?
			const funcCall = this.isFunctionCall(pos);
			if (funcCall.isFunctionCall) {
				// treat function call as a value
				newElement = this.#addTempOprand(funcCall.functionName);
				
				// go to function calling state
				nextState = new FunctionCallState(pos, nextToken, this.scope, this.codeAnalyst, false);
				break;
			}
			
			// is object method call syntax:
			const methodCall = this.isObjectMethodCall(pos);
			if (methodCall) {
				// treat function call as a value
				newElement = this.#addTempOprand(methodCall);
				
				// go to method call state
				nextState = new ObjectMethodCallState(pos, nextToken, this.scope, this.codeAnalyst, false);
				break;
			}
			
			// array subscription syntax?
			if (this.isSubscript(pos)){
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
			
			// add new operand? variable and "this" object are operands
			if (Operand.isOperand(nextToken) || nextToken.isThis) {
				newElement = this.#addOperand(nextToken);
				break;
			}
			
			// add a new operator?
			if (Operator.isOperator(nextToken)) {
				newElement = this.#addOperator(nextToken, pos);
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
					//this.error = new TokenError("Invalid expression element found", nextToken);
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
			// left over operator?
			if (this.#currentOperator) {
				this.error = new TokenError("Invalid operator found", this.#currentOperator.token);
			}
			this.#handleSubExpressionClose(null);
		}
		if (this.error) {
				this.codeAnalyst.errors.push(this.error);
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
	#expressionEnded(token, pos) {
		let newExprStarted = false;
		if (token.isCR) {
			// reached the end?
			if (pos + 1 === this.codeAnalyst.meaningfulTokens.length) {
				return true;
			}
			
			// last token is block-ending, then this expression ends as well 
			const lastToken = this.codeAnalyst.meaningfulTokens[pos-1];
			if (lastToken.isExpressionEnd) {
				return true;
			}
			
			// last token is not operator and next token is a name, the expression ends 
			const nextToken = this.codeAnalyst.meaningfulTokens[pos+1];
			if (lastToken.isOperator) {
				if (lastToken.hasBlockTag(TokenConst.BLOCK_TAG_UNARY_REAR_OP) && !nextToken.isOperator) {
					return true;
				}
				return false;
			}
			
			if (!nextToken.isOperator) {
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
		const lastOperand = this.#peek();
		let newOperand = null;
		if (token.isThis) {
			newOperand = new ThisOperand(token); 
		} else {
			newOperand = new CodeOperand(token); 
		}
		
		// eat unary operator if applicable:
		if (this.#currentOperator) {
			if (this.#currentOperator.isUnaryFront) {
				// unary op cannot be appiled by const
				if (newOperand.isConst && !this.#currentOperator.token.opCanApplyToConst) { // || this.#isConstVar(newOperand)) {
					this.error = new TokenError(TokenError.ERROR_CANNOT_APPLY_TO_CONST, this.#currentOperator.token);
					return;
				}
				
				// the unary front operator can be eaten by this operand
				this.#currentOperator = null;
			} else {
				this.error = new TokenError(TokenError.ERROR_INVALID_OP, this.#currentOperator.token);
				return;
			}
		}
	
		// operand must be defined prior
		if (newOperand.isVariable) {
			const v = this.scope.findVariable(newOperand.name, false);
			if (!v) {
				let undefinedVar = true;
				if (lastOperand instanceof ThisOperand ) {
					if (!newOperand.name.startsWith('#')) {
						// for non-private variable, no -need to define it first.  this does not apply to
						// # decorated private member variables:
						undefinedVar = false;
					}
				} 
				if (undefinedVar) {
					this.error = new TokenError(TokenError.ERROR_UNDEFINED_VARIABLE_FOUND, newOperand.token);
					return null;
				}
			}
		}

		// associate the binary op with the last oprand:
		if (lastOperand) {
			if (lastOperand.binaryOperatorRight) {
				newOperand.binaryOperatorLeft = lastOperand.binaryOperatorRight;
			} 
		}
		
		this.#operandStack.push(newOperand);
		return newOperand;
	}
	
	#isConstVar(operand) {
		const v = this.scope.findVariable(operand.name, false);
		if (v && v.isConst) {
			return true;
		}
		return false;
	}
	
	#addOperator(token, pos) {
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
		
		// for unary front operator
		if (this.#shouldBeUnaryFrontOperator(lastOperand, newOp, pos)) {
			if (!this.error) {
				// leave front operator un-associated until next token
				this.#currentOperator = newOp;
				token.blockTag = TokenConst.BLOCK_TAG_UNARY_FRONT_OP;
			} 
			
			return newOp;
		}
		
		// / for unary rear operator
		if (this.#shouldBeUnaryRearOperator(lastOperand, newOp, pos)) {
			if (!this.error) {
				if (lastOperand.isConst || this.#isConstVar(lastOperand)) {
					// todo: is there a rear operator that work on constant?
					this.error = new TokenError(TokenError.ERROR_CANNOT_APPLY_TO_CONST, token);
				}
			}
			//eat unary rear operator	
			token.blockTag = TokenConst.BLOCK_TAG_UNARY_REAR_OP;
			return newOp;
		}
		
		// binary operator
		if (lastOperand && !lastOperand.binaryOperatorRight) {
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
			this.error = new TokenError(TokenError.ERROR_INVALID_OP, newOp.token);
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
				this.error = new TokenError(TokenError.ERROR_UNDEFINED_VARIABLE_FOUND, oprandL.token);
				return null;
			}
		}
		// operator right needs to be defined unless the operator is "."
		if (oprandR.isVariable && !(oprandR.binaryOperatorLeft instanceof DotOperator)) {
			const v = this.scope.findVariable(oprandR.name, false);
			if (!v) {
				this.error = new TokenError(TokenError.ERROR_UNDEFINED_VARIABLE_FOUND, oprandR.token);
				return null;
			}
		}
		
		return this.#addTempOprand("T"+ this.#numberOfTemp++, newOp) 
	}
	
	/**
		PREDICATE for telling if the given operator (newOp) is a unary front operator.
		The complexity comes from operators such as ++ can be either front or rear operator,
		and operator such as + and - can be both unary font or binary operator.
	 **/
	#shouldBeUnaryFrontOperator(lastOperand, newOp, pos) {
		let shouldBe = false;
		if (newOp.isUnaryFrontOnly) {
			shouldBe = true;
		}
		const noLeftOperand = !lastOperand || lastOperand.binaryOperatorRight;
		
		if (shouldBe) {
			// error found
			if (!noLeftOperand) {
				this.error = new TokenError("Invalid expression state encounteed", newOp.token);
				return false;
			}
			
			return true;
		}
		return noLeftOperand && newOp.isUnaryFront 
				&& this.codeAnalyst.meaningfulTokens.length > pos + 1 
					&& Operand.isOperand(this.codeAnalyst.meaningfulTokens[pos + 1]);
	}
	
	/**
		PREDICATE for telling if the given operator (newOp) is a unary rear operator.
		The complexity comes from operators such as ++ can be either front or rear operator,
	 **/
	#shouldBeUnaryRearOperator(lastOperand, newOp, pos) {
		let shouldBe = false;
		if (newOp.isUnaryRearOnly) {
			shouldBe = true;
		}
		const hasLeftOperand = lastOperand && !lastOperand.binaryOperatorRight;
	
		if (shouldBe) {
			// error found
			if (!hasLeftOperand) {
				this.error = new TokenError("Invalid expression state encounteed", newOp.token);
				return false;
			}
			
			return true;
		}
		
		
		if (hasLeftOperand && newOp.isUnaryRear) {
			// reached end
			if (this.codeAnalyst.meaningfulTokens.length <= pos + 1 ||
				this.codeAnalyst.meaningfulTokens[pos + 1].isSeperater ||
				this.codeAnalyst.meaningfulTokens[pos + 1].isCR) {
				return true;
			}
			
			// next token is operator so this one must be rear operator
			if (Operator.isOperator(this.codeAnalyst.meaningfulTokens[pos + 1])) {
				return true;
			}
		}
		
		return false;
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
			// getting the last operand
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
						this.error = new TokenError(TokenError.ERROR_UNMATCH_OPERATOR, oprand.token);
						break;
					}
				}	
			} else {
				// The right most (the last one) operand should not have a right operator in it
				if (oprand && oprand.binaryOperatorRight ) {
					this.error = new TokenError(TokenError.ERROR_INVALID_OP, oprand.binaryOperatorRight.token);
					break;
				}
			}
			
			// oprandRight needs to be defined unless the operator is "."
			if (oprand && oprand.isVariable && !(oprand.binaryOperatorLeft instanceof DotOperator)) {
				const v = this.scope.findVariable(oprand.name, false);
				if (!v) {
					this.error = new TokenError(TokenError.ERROR_UNDEFINED_VARIABLE_FOUND, oprand.token);
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
