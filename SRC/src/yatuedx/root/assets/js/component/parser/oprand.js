import {TokenConst, Token}		from './token.js'
import {ExpressionElement}		from './expressionElement.js'
import {Operator} 				from './operator.js'


class Operand extends ExpressionElement {
	#binaryOperatorRight
	#binaryOperatorLeft
	
	constructor(token) {
		super(token);
	}
	
	// public methods:
	
	static isOperand(token) {
		return  Token.TOKEN_TYPE_NAME === token.type ||
				Token.TOKEN_TYPE_NUMBER === token.type ||
				Token.TOKEN_TYPE_STRING == token.type ||
				token.isKnownProperty ||
				token.isKnownObjectValue;
	}
	
	// overrides
	
	// accessor
	
	get isVariable() { return false }
	get isConst() { return false }	get isOpenRoundBracket() { return false; }
	get isCloseRoundBracket() { return false; }
	get binaryOperatorRight() { return this.#binaryOperatorRight;}
	set binaryOperatorRight(op) { this.#binaryOperatorRight = op;}
	get binaryOperatorLeft() { return this.#binaryOperatorLeft;}
	set binaryOperatorLeft(op) { this.#binaryOperatorLeft = op;}
}

class TempOperand extends Operand {
	#name
	#type 
	
	constructor(name, type) {
		super(null);
		this.#name = name;
		this.#type = type;
	}
	
	get name() { return this.#name }
}

class OpenRoundBrachetOperand extends Operand {
	constructor(token) {
		super(token);
	}
	
	// '(' can be followed by '(', front operator, or other operand
	canBeFollowedBy(another) { 
		return 	(another instanceof OpenRoundBrachetOperand) ||
				(another instanceof Operand && !(another instanceof CloseRoundBrachetOperand) ) || 
				(another instanceof Operator && another.isUnaryFront);
	}
}

class CloseRoundBrachetOperand extends Operand {
	constructor(token) {
		super(token);
	}
	
	// ')' can be followed by ')', or any binary operators
	canBeFollowedBy(another) { 
		return 	(another instanceof CloseRoundBrachetOperand) ||
				(another instanceof Operator && another.isBinary);
	}
}

class CodeOperand extends Operand {
		
	constructor(token) {
		super(token);
		if (!Operand.isOperand(token) && !token.isRoundBracket) {
			throw new Error("Invalid operand encountered: " + token.name);
		}
	}
	
	// an oprand cannot be followed by another operand unlss its ")"
	canBeFollowedBy(another) { 
		return 	!(another instanceof Operand) ||
				 (another instanceof CloseRoundBrachetOperand);
	}
	
	get isOpenRoundBracket() { return this.token.isOpenRoundBracket; }
	get isCloseRoundBracket() { return  this.token.isCloseRoundBracket; }
	get isVariable() { return  this.token.type === Token.TOKEN_TYPE_NAME; }
	get isConst() { 
		return  this.token.type === Token.TOKEN_TYPE_NUMBER ||
				this.token.type === Token.TOKEN_TYPE_STRING 
	}
}

export {Operand, TempOperand, OpenRoundBrachetOperand, CloseRoundBrachetOperand, CodeOperand}