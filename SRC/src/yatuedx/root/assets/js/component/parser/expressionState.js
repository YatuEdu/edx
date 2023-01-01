import {TokenConst, Token, TokenError}		from './token.js'
import {StateAction, ParsingState}			from './parsingState.js'
import {Operator}							from './operator.js'
import {Operand, TempOperand, OpenRoundBrachetOperand, CloseRoundBrachetOperand, CodeOperand} from './oprand.js'
import {FunctionCallState}					from './functionCallState.js'
import {ArraySubscriptionState}				from './arraySubscriptionState.js'
import {ArrayDefState}						from './arrayDefState.js'
import {ObjectDefState}						from './objectDefState.js'

class ExpressionState extends ParsingState {
	#operandStack;		// Variable stack
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
				this.#resolve();
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
			
			// add end round bracket?
			if (nextToken.isCloseRoundBracket) {
				newElement = this.#addCloseRoundBracket(nextToken);
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
		
		// no expression element found
		if (!changeState && !nextState) {
			if (!this.stateEnded && !newElement) {
				this.error = new TokenError("Invalid expression element found", nextToken);
			}
		}
		
		// can the new element follow the last element?
		if (newElement) {
			if (this.#lastElement && !this.#lastElement.canBeFollowedBy(newElement)) {
				this.error = new TokenError("Invalid token found", nextToken);
			}			
			this.#lastElement = newElement;
			newElement = null;
		}
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		
		if (this.stateEnded) {
			changeState = true;
			// also set parent state to finish if any
			if (this.parentState) {
				this.parentState.isTheLastToken(nextToken);
			}
		}
		
		return new StateAction(nextState, this.error, changeState);			
	}
	
	// parsing ended, resolve all operands in the stack
	complete() {
		this.#resolve();
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
	
	#addCloseRoundBracket(token) {
		// we are ended	or errored
		if (this.#totalOpenRoundBracket < this.#totalCloseRoundBracket +1) {
			this.stateEnded = true;
			return null;
		}
		const newOperand = new CloseRoundBrachetOperand(token); 
		this.#operandStack.push(newOperand);
		++this.#totalCloseRoundBracket;
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
		
		// if it is a varaible and not defined, error:
		if (newOperand.isVariable) {
			const v = this.scope.findVariable(token.name, false);
			if (!v) {
				this.error = new TokenError("Undefined valrable operator found", token);
				return newOperand;
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
	
	#addOperator(token) {
		if (this.#currentOperator) {
			this.error = new TokenError("Ophaned operator found", token);
			return;
		}
		
		const newOp = new Operator(token);
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
		/*
		if (lastOperand.binaryOperatorLeft && newOp.priority <= lastOperand.binaryOperatorLeft.priority) {
			const tempOperand = this.#resolveBinary(newOp);
			if (!tempOperand) {
				// error occurred
				return;
			}
			if (tempOperand.binaryOperator !== newOp) {
				// new operator has not been absorbed yet
				this.#currentOperator = newOp;
			}			
		}
		*/
		
		return newOp;
	}
	
	#addTempOprand(name, newOp) {
		const temp = new TempOperand(name, "tbd");
		const lastOperand = this.#peek();
		if (lastOperand) {
			temp.binaryOperatorLeft = lastOperand.binaryOperatorRight; 
			if (newOp) {
				temp.binaryOperatorRight = newOp;
			}
		}
		this.#operandStack.push(temp);
		return temp;
	}
	
	// resolve two operand as a result of a binary operation
	#resolveBinary(newOp) {
		if (this.#operandStack.length < 2) {
			this.error = new TokenError("Invalid operator found", newOp.token);
			return;
		}
		
		const oprandR = this.#operandStack.pop();
		const oprandL = this.#operandStack.pop();
		if (oprandL.binaryOperator != oprandR.binaryOperator) {
			this.error = new TokenError("Invalid expression state encounteed", newOp.token);
			return;
		}
		this.#addTempOprand("T"+ this.#numberOfTemp++, newOp) 
	}
	
	// resolve the left operand in the stack
	#resolve() {
		if (this.#currentOperator) {
			this.error = new TokenError("Ophaned operator found", this.#currentOperator);
			return;
		}
		let roundBracketNum = 0;
		let firstToken = null;
		let oprandR = null;
		let operandL = null;
		while(this.#operandStack.length > 0) {
			let currentOperand = this.#operandStack.pop();
			if (!oprandR) {
				oprandR = currentOperand;
			} else {
				operandL = currentOperand;
			}
			
			if (!firstToken) {
				firstToken = currentOperand.token;
			}
			// resolve ")"
			if (currentOperand.isCloseRoundBracket) {
				++roundBracketNum;
				continue;
			}
			// resolve "("
			if (currentOperand.isOpenRoundBracket) {
				--roundBracketNum;
				continue;
			}
			
		}
		if (roundBracketNum !== 0) {
			this.error = new TokenError("Unmatched '()' found", firstToken);
		}
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