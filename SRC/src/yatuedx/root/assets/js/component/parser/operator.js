import {TokenConst, Token}					from './token.js'
import {ExpressionElement}					from './expressionElement.js'
import {Operand, CloseRoundBrachetOperand} 	from './oprand.js'

class Operator extends ExpressionElement {
	#tokenInfo

	constructor(token) {
		super(token);
		this.#tokenInfo = Token.getTokenInfo(token.name);
		if (Token.TOKEN_TYPE_OPERATOR !== this.#tokenInfo.type) {
			throw new Error("Invalid operator generated: " + token.name);
		}
	}
	
	static isOperator(token) { return Token.TOKEN_TYPE_OPERATOR === token.type}
	
	// overrides
	
	// a binary operator can only be followed by an operand
	// a front unary operator can only be followed by a none "()" operand
	//a rear unary operator can only be follwed by another operator or nothing
	canBeFollowedBy(another) { 
		return 	this.isBinary && (another instanceof Operand || another.isUnaryFront) && !(another instanceof CloseRoundBrachetOperand) ||
		        this.isUnaryFront && (another instanceof Operand) && !(another.token.isRoundBracket) || 
				this.isUnaryRear  && (another instanceof Operator)
	}
	
	get isUnaryFront() { 
		return  this.tokenInfo.opMode === Token.OP_MODE_UNARY_FRONT_AND_BINARY ||
				this.tokenInfo.opMode === Token.OP_MODE_UNARY_FRONT ||
				this.tokenInfo.opMode === Token.OP_MODE_UNARY_BOTH
	}
	
	get isUnaryFrontOnly() { 
		return  this.tokenInfo.opMode === Token.OP_MODE_UNARY_FRONT;
	}
	
	get isUnaryRear() { 
		return  this.tokenInfo.opMode === Token.OP_MODE_UNARY_REAR ||
				this.tokenInfo.opMode === Token.OP_MODE_UNARY_BOTH
	}
	
	get isUnaryRearOnLy() { 
		return  this.tokenInfo.opMode === Token.OP_MODE_UNARY_REAR;
	}
	
	get isBinary() { 
		return  this.tokenInfo.opMode === Token.OP_MODE_UNARY_FRONT_AND_BINARY ||
				this.tokenInfo.opMode === Token.OP_MODE_BINARY
	}
	
	get isBinaryOnly() { 
		return this.tokenInfo.opMode === Token.OP_MODE_BINARY
	}
	
	get priority() { return this.#tokenInfo.priority; }
	get tokenInfo() { return this.#tokenInfo; }
}

// "." operator can be followed by some known properties (such as length) 
// and known function names such as 'forEach'
class DotOperator extends Operator {

	constructor(token) {
		super(token);
	}
	
	// a binary operator can only be followed by an operand
	// a front unary operator can only be followed by a none "()" operand
	//a rear unary operator can only be follwed by another operator or nothing
	canBeFollowedBy(another) { 
		return another instanceof Operand;
	}
}

export {Operator, DotOperator}
