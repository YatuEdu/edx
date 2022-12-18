import {TokenConst, Token, TokenError}		from './token.js'
import {StateAction, ParsingState}			from './parsingState.js'
import {Variable}							from './variable.js'
import {Scope}								from './scope.js'
import {ExpressionElement}					from './expressionElement.js'
import {Operator}							from './operator.js'
import {Operand, TempOperand, OpenRoundBrachetOperand, CloseRoundBrachetOperand, CodeOperand} from './oprand.js'

class StateMachine {
	static STATE_NAMES = {
		CodeBlockState: "CodeBlockState",
		ExpressionState: "ExpressionState",
		AssignmentState: "AssignmentState",
		VarDeclarationState: "VarDeclarationState",
		IfState: "IfState",
		FunctionDefState: "FunctionDefState",
		FunctionCallState: "FunctionCallState",
	};
	
	static createState(newState, pos, beginToken, scope, analyst, extraParam) {
		switch(newState) {
			case StateMachine.STATE_NAMES.CodeBlockState:
				return new CodeBlockState(pos, beginToken, scope, analyst);
			case StateMachine.STATE_NAMES.FunctionDefState:
				return new FunctionDefState(pos, beginToken, scope, analyst);
			case StateMachine.STATE_NAMES.FunctionCallState:
				return new FunctionCallState(pos, beginToken, scope, analyst);
			case StateMachine.STATE_NAMES.ExpressionState:
				return new ExpressionState(pos, beginToken, scope, analyst);
			case StateMachine.STATE_NAMES.AssignmentState:
				return new AssignmentState(pos, beginToken, scope, analyst, extraParam);
			case StateMachine.STATE_NAMES.VarDeclarationState:
				return new VarDeclarationState(pos, beginToken, scope, analyst);
			case StateMachine.STATE_NAMES.IfState:
				return new IfState(pos, beginToken, scope, analyst);				
		}
	}
}

class FunctionDefState extends ParsingState {
	#funcName
	#funcArgumentMap
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.#funcArgumentMap = new Map();
		this.stage = 0;
	}
	
	advance(nextToken, pos) {
		let ended = false;
		do {
			if (this.stage === 0) {
				// check function name
				if (!nextToken.isName) {
					this.error = new TokenError("Invalid function name found", nextToken);
					break;
				}
					
				const foo = this.scope.findVariable(nextToken.name, true);
				if (foo) {
					this.error = new TokenError("Function name declared before", nextToken);
					break;
				}
				this.#funcName = nextToken;
				this.stage = 1;
				break;
			}
			
			if (this.stage === 1) {
				// check "("
				if (!nextToken.isOpenRoundBracket) {
					this.error = new TokenError("Invalid function syntax. '(' expected", nextToken);
					break;
				}
					
				this.stage = 2;
				break;
			}
			
			if (this.stage === 2) {
				// check if definition ended
				if (nextToken.isCloseRoundBracket) {
					ended = true;
					break;
				}
				
				// check variable name
				if (!nextToken.isName) {
					this.error = new TokenError("Invalid function argument. A variable name is expected", nextToken);
					break;
				}
				
				// add argument
				this.#addNewArgument(nextToken);
				
				this.stage = 3;
				break;
			}
			
			if (this.stage === 3) {
				// check if definition ended
				if (nextToken.isCloseRoundBracket) {
					ended = true;
					break;
				}
				
				// check coma
				if (!nextToken.isComma) {
					this.error = new TokenError("Invalid function definition syntax.',' is expected", nextToken);
					break;
				}
					
				this.stage = 4;
				break;
			}
			
			if (this.stage === 4) {
				// check if a argument is seen, or error
				if (!nextToken.isName) {
					this.error = new TokenError("Invalid function definition. A variable name is expected", nextToken);
					break;
				}
				
				// add argument
				this.#addNewArgument(nextToken);
					
				// go back to stage 2
				this.stage = 2;
				break;
			}
			
			// unkown state
			this.error = new TokenError("Invalid function definition syntax", nextToken);
			break;
		} while(true);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		
		// ended and add the new function to variable map
		let funcScope = this.scope;
		if (ended && !this.error) {
			const newFunction = new Variable(this.#funcName, TokenConst.VAR_TYPE_FUNCTION);
			this.scope.addWindowsVariable(this.#funcName.name, newFunction); 
			
			// create a new scope for the function
			if (this.#funcArgumentMap.size > 0) {
				funcScope = new Scope(this.scope);
				this.#funcArgumentMap.forEach((v,k) => funcScope.addLocalVariable(k, new Variable(v, TokenConst.VAR_TYPE_FUNC_PARAMETER)));
			}
			// entering function body block state
			const nextState = StateMachine.createState(
									StateMachine.STATE_NAMES.CodeBlockState, 
									pos, 					// current token position
									nextToken, 				// starting token
									funcScope, 				// new scope spawned from the current one
									this.codeAnalyst);		
			return new StateAction(nextState, null, true, true);
		}
		
		return new StateAction(null, this.error, ended);
	}

	// add an argument
	#addNewArgument(token) {
		if (this.#funcArgumentMap.get(token.name)) {
			this.error = new TokenError("Duplicate argument name used", token);
		} else {
			this.#funcArgumentMap.set(token.name, token); 
		}
	}	
}

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
				} else {
					// enter expression stage (again or first time)
					nextState = StateMachine.createState(
								StateMachine.STATE_NAMES.ExpressionState, 
								pos, 					
								token, 				
								this.scope, 				
								this.codeAnalyst);
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

class CodeBlockState extends ParsingState {
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
	}
	
	advance(nextToken, pos) {
		const tokenInfo = Token.getTokenInfo(nextToken.name);
				
		// current code block ended:
		if (nextToken.isCloseCurlyBracket) {
			return new StateAction(null, null, true);
		}
		
		// if it is a function definition statement
		if (this.isFunctionDefinition(pos)) {
			const nextState = StateMachine.createState(StateMachine.STATE_NAMES.FunctionDefState, 
														pos, nextToken, this.scope, 
														this.codeAnalyst, false);
			return new StateAction(nextState, null, false);
		}
		
		// return statement
		if (nextToken.isReturn) {
				// go to expression state		
			const nextState = StateMachine.createState(StateMachine.STATE_NAMES.ExpressionState, 
																pos, nextToken, 
																this.scope, 
																this.codeAnalyst);
			return new StateAction(nextState, null, false);			
		}
		
		// if it is a function call semantics
		const funcCall = this.isFunctionCall(pos);
		if (funcCall.isFunctionCall) {
			const nextState = StateMachine.createState(StateMachine.STATE_NAMES.FunctionCallState, 
														pos, nextToken, this.scope, 
														this.codeAnalyst, false);
			return new StateAction(nextState, null, false);
		}
		
		
		// IF statement encountered:
		if (tokenInfo && tokenInfo.keyType === TokenConst.IF_KEY) {
			const nextState = StateMachine.createState(StateMachine.STATE_NAMES.IfState, 
														pos, nextToken, this.scope, 
														this.codeAnalyst);
			return new StateAction(nextState, null, false);
		}		
		
		// assignment encounteed
		if (this.#matchTokenName(pos+1, '=') ) {
			const nextState = StateMachine.createState(StateMachine.STATE_NAMES.AssignmentState, 
														pos, nextToken, this.scope, 
														this.codeAnalyst, false);
			return new StateAction(nextState, null, false);
		}
		
		// variable declaration encounteed
		if (nextToken.isVarDeclaration ) {
			const nextState = StateMachine.createState(StateMachine.STATE_NAMES.VarDeclarationState, 
														pos, nextToken, this.scope, 
														this.codeAnalyst);
			return new StateAction(nextState, null, false);
									
		}
		
		// if we come here, we are still in the same code block, keep probing ahead
		return new StateAction(null, null, false);
	}
	
	#matchTokenName(pos, name) {
		return this.codeAnalyst.meaningfulTokens.length >= pos + 1 &&
			   this.codeAnalyst.meaningfulTokens[pos].name === name;
	}
}


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
				nextState = StateMachine.createState(StateMachine.STATE_NAMES.FunctionCallState, 
														pos, nextToken, this.scope, 
														this.codeAnalyst, false);
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
		if (this.#currentOperator && !this.#currentOperator.isUnaryFront) {
			this.error = new TokenError("Invalid operator found", this.#currentOperator.token);
			return;
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
				return;
			}
			
			// ophan operator found
			this.error = new TokenError("Ophan operator found", token);
		}
		
		// eat unary rear operator if applicable, or error
		if (!lastOperand.binaryOperatorRight) {
			if (newOp.isUnaryRear) {
				// todo: is there a rear operator that work on constant?
				if (lastOperand.isConst) {
					this.error = new TokenError("Invalid operator found", token);
				}
				return;
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
			this.error = new TokenError("Ophaned operator found", token);
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
				nextState = StateMachine.createState(StateMachine.STATE_NAMES.ExpressionState, 
															pos, nextToken, 
															this.scope, 
															this.codeAnalyst);
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

class VarDeclarationState extends ParsingState {
	#varToken
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.stage = 0
	}
	
	// next token must be a variable name
	advance(token, pos) {
		let nextState = null;
		let skipNextToken = false;
		do {
				
			if (this.stage == 0) {
				this.stage = 1;
				
				// invalid variable name or variable was declared before?
				if (!token.isName) {
					this.error = new TokenError("Invalid variable name found", token)
				} else if (this.scope.findVariable(token.name, true)) {
					this.error = new TokenError(`Variable "${token.name}" has already been declared in the same scope.`, token)
				}
				this.#varToken = token;
				break;
			}
			
			if (this.stage == 1) {
				if (token.isAssignment) {
					// enter expression state
					this.stage = 2;
					nextState = StateMachine.createState(StateMachine.STATE_NAMES.ExpressionState, 
																pos, token, 
																this.scope, 
																this.codeAnalyst);
				} else {
					// error if const var is not assigned
					if (this.beginToken.isConstVarDeclaration) {
						this.error = new TokenError(`Variable "${this.beginToken.name}" needs to be assigned.`, this.beginToken);
						break;
					}
					this.stateEnded = true;
				}
				break;
			}
			
			if (this.stage == 2) {
				// add a new variable
				const newVar = new Variable(this.#varToken, this.#varToken.varType);
				this.scope.variableMap.set(this.#varToken.name, newVar); 
				this.stateEnded = true;
				break;
			}
		} while(false);
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		return new StateAction(nextState, this.error, this.stateEnded);
	} 
	
}

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
				nextState = StateMachine.createState(StateMachine.STATE_NAMES.ExpressionState, 
															pos, nextToken, this.scope, 
															this.codeAnalyst);
				break;
			}		
			
			if (this.stage == 1) {
				this.stage = -1
				// IF-state ended nicely, enter a new code block:
				nextState = StateMachine.createState(
											StateMachine.STATE_NAMES.CodeBlockState, 
											pos, 					// current token position
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

export {StateMachine} 
//, IfState, VarDeclarationState, AssignmentState, ExpressionState, FunctionDefState, FunctionCallState}