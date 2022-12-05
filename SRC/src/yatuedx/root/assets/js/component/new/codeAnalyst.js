import {languageConstants} 					from '../../core/sysConst.js'
import {StringUtil, RegexUtil}				from '../../core/util.js'

const TOKEN_TYPE_UNKNOWN = -1;
const TOKEN_TYPE_SYMBOL = 100;
const TOKEN_TYPE_SPACE = 99;
const TOKEN_TYPE_ANY = 0;
const TOKEN_TYPE_KEY = 1;
const TOKEN_TYPE_SEPARATOR = 2;
const TOKEN_TYPE_OPERATOR = 3;
const TOKEN_TYPE_NAME = 4;
const TOKEN_TYPE_STRING = 5;
const TOKEN_TYPE_NUMBER = 6;
const TOKEN_TYPE_EXPRESSION = 7;
const TOKEN_TYPE_COMMENT = 8;

const IF_KEY = 1;
const ELSE_KEY = 2;
const NEW_KEY = 3;
const CONST_KEY = 4;
const LET_KEY = 5;
const VAR_KEY = 6;
const CLASS_KEY = 7;
const CASE_KEY = 8;
const FUNC_KEY = 9;
const RETURN_KEY = 10;
const CUSTOMER_PRINT = 11;

const TOKEN_SPACE = " ";
const TOKEN_CR = "\n";
const TOKEN_TAB = "\t";
const SPACE_TOKEN_NAME = 'SPC';
const TAB_TOKEN_NAME = 'TAB';
const CR_TOKEN_NAME = 'CRT';

const OP_TYPE_LOGIC_OPERATOR = 0;
const OP_TYPE_MATH_OPERATOR = 1;
const OP_TYPE_FUNC_OPERATOR = 2;
const OP_TYPE_ASSIGNMENT_OPERATOR = 3;
const OP_TYPE_MATH_ASSIGNMENT_OPERATOR = 4;
const OP_TYPE_LAMBDA = 5;
const OP_TYPE_OBJECT_PROPERTY_ACCESSOR = 6;

const OP_MODE_BINARY 	 	= 1
const OP_MODE_UNARY_FRONT 	= 2
const OP_MODE_UNARY_REAR 	= 3
const OP_MODE_UNARY_BOTH 	= 4
const OP_MODE_UNARY_FRONT_AND_BINARY = 5


const BRACKET_TYPE_CURLY = 1;
const BRACKET_TYPE_SQUARE = 2;
const BRACKET_TYPE_ROUND = 3;
const ACTION_OPEN = 1;
const ACTION_CLOSE = 2;

const KEY_SUB_TYPE_VAR_DECL = 1;

const QUOTE_TYPE_DOUBLE = 1;
const QUOTE_TYPE_SINGLE = 2;
const QUOTE_TYPE_BACKTICK = 3;

const CM_LINE = 1;
const CM_BLOCK_BEGIN = 2;
const CM_BLOCK_END = 3;

const VAR_VALUE_CONST = 0;
const VAR_VALUE_EXP = 1;
const VAR_VALUE_FUNCC = 1;
const VAR_VALUE_OBJ = 3;

const SEMICOLON = 1;
const COMMA = 2;
const COLON = 3;

const VAR_TYPE_UNKNOWN = 0;
const VAR_TYPE_CONST = 1;
const VAR_TYPE_LET = 2;
const VAR_TYPE_VAR = 3;
const VAR_TYPE_WINDOW = 4;
const VAR_TYPE_FUNC_PARAMETER = 5;
const VAR_TYPE_TEMP = 6;  // For expression parsing stack only
const VAR_TYPE_FUNCTION = 7;

const VAR_DATA_UNKNOWN = 0;
const VAR_DATA_NUMBER = 1;
const VAR_DATA_STRING = 2;
const VAR_DATA_BOOLEAN = 3;
const VAR_DATA_ARRAY = 4;
const VAR_DATA_CLASS_OBJ = 5;
const VAR_DATA_FUNC = 6;
const VAR_DATA_NUMBER_OR_STRING = 7;

const STANDARD_TOKEN_MAP = new Map([
	['if', 			{type: TOKEN_TYPE_KEY, keyType: IF_KEY, followedBy: ['('] } ],
	['else', 		{type: TOKEN_TYPE_KEY, keyType: ELSE_KEY, followedBy: ['{', 'if'] } ],
	['new', 		{type: TOKEN_TYPE_KEY, keyType: NEW_KEY, followedBy: ['{',], includedInside: ["`"] }],
	['case', 		{type: TOKEN_TYPE_KEY, keyType: CASE_KEY, followedBy: ['('] } ],
	['switch', 		{type: TOKEN_TYPE_KEY, followedBy: ['{'] } ],
	['while', 		{type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['do', 			{type: TOKEN_TYPE_KEY, followedBy: ['{'] }],
	['for', 		{type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['function', 	{type: TOKEN_TYPE_KEY, keyType: FUNC_KEY, followedByType: TOKEN_TYPE_NAME }],
	['class', 		{type: TOKEN_TYPE_KEY, keyType: CLASS_KEY, followedByType: TOKEN_TYPE_NAME }],
	['print', 		{type: TOKEN_TYPE_KEY, keyType: CUSTOMER_PRINT, followedByType: TOKEN_TYPE_NAME }],
	['constructor', {type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['get', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_NAME }],
	['set', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_NAME }],
	['const', 		{type: TOKEN_TYPE_KEY, subType: KEY_SUB_TYPE_VAR_DECL, keyType: CONST_KEY, followedByType: TOKEN_TYPE_NAME, }],
	['let', 		{type: TOKEN_TYPE_KEY, subType: KEY_SUB_TYPE_VAR_DECL, keyType: LET_KEY, followedByType: TOKEN_TYPE_NAME,   }],
	['var', 		{type: TOKEN_TYPE_KEY, subType: KEY_SUB_TYPE_VAR_DECL, keyType: VAR_KEY, followedByType: TOKEN_TYPE_NAME,   }],
	['return', 		{type: TOKEN_TYPE_KEY, keyType: RETURN_KEY}],
	['break', 		{type: TOKEN_TYPE_KEY, followedBy: [';'] }],
	['continue', 	{type: TOKEN_TYPE_KEY, followedBy: [';'] }],
	['forEach', 	{type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['this', 		{type: TOKEN_TYPE_KEY, followedBy: ['.', ';'] }],
	['$', 			{type: TOKEN_TYPE_KEY, followedBy: ['{',], includedInside: ["`"] }],
	['$', 			{type: TOKEN_TYPE_KEY, followedBy: ['{',], includedInside: ["`"] }],

	['"', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_STRING, quoteType: QUOTE_TYPE_DOUBLE }],
	["'", 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_STRING, quoteType: QUOTE_TYPE_SINGLE}],
	["`", 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_STRING, quoteType: QUOTE_TYPE_BACKTICK }],
	
	['{', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_CURLY, bracketAction: ACTION_OPEN   }],
	['}', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_CURLY, bracketAction: ACTION_CLOSE  }],
	['(', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_ROUND, bracketAction: ACTION_OPEN   }],
	[')', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_ROUND, bracketAction: ACTION_CLOSE  }],
	['[', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_SQUARE, bracketAction: ACTION_OPEN  }],
	[']', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_SQUARE, bracketAction: ACTION_CLOSE }],
	
	[',', 			{type: TOKEN_TYPE_SEPARATOR, punctuationType: COMMA, followedByType: TOKEN_TYPE_ANY }],
	[';', 			{type: TOKEN_TYPE_SEPARATOR, punctuationType: SEMICOLON, followedByType: TOKEN_TYPE_ANY }],
	[':', 			{type: TOKEN_TYPE_SEPARATOR, punctuationType: COLON, followedByType: TOKEN_TYPE_ANY }],
	
	['=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_ASSIGNMENT_OPERATOR, followedByType: TOKEN_TYPE_ANY}],	
	
	['+=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_ASSIGNMENT_OPERATOR, opMode: OP_MODE_BINARY, priority: 0 }],
	['-=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_ASSIGNMENT_OPERATOR, opMode: OP_MODE_BINARY, priority: 0 }],
	['*=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_ASSIGNMENT_OPERATOR, opMode: OP_MODE_BINARY, priority: 0 }],
	['/=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_ASSIGNMENT_OPERATOR, opMode: OP_MODE_BINARY, priority: 0 }],

	['&&', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY, priority: 1.5 }],
	['||', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY, priority: 1 }],

	
	['==', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY, priority: 2}],
	['===', 		{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY, priority: 2}],
	['>', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY, priority: 2}],
	['<', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY, priority: 2}],
	['>=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY, priority: 2}],
	['<=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY, priority: 2}],
	['!=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY, priority: 2}],
	['!==', 		{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY, priority: 2}],
	
	['!', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY, priority: 1 }],
	['&', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY, priority: 3}],
	['|', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY, priority: 3}],
	
	['+', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, 
					 opMode: OP_MODE_UNARY_FRONT_AND_BINARY, priority: 3, 
					 frontOperandType: VAR_DATA_NUMBER, binaryOperandType: VAR_DATA_NUMBER_OR_STRING  }],
	['-', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, 
					opMode: OP_MODE_UNARY_FRONT_AND_BINARY, priority: 3, 
					frontOperandType: VAR_DATA_NUMBER, binaryOperandType: VAR_DATA_NUMBER}],
	
	['*', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY, priority: 4 }],
	['/', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY, priority: 4 }],
	['%', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY, priority: 4 }],
	
	['**', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY, priority: 5 }],
	
	["instanceof",  {type: TOKEN_TYPE_OPERATOR, opMode: OP_MODE_BINARY, priority: 6 }], 
	['typeof', 		{type: TOKEN_TYPE_OPERATOR, opMode: OP_MODE_UNARY_FRONT, priority: 6 }],
	['++', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_UNARY_BOTH, priority: 6 }],
	['--', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY, priority: 6 }],	
	
	['=>', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LAMBDA, followedByType: TOKEN_TYPE_ANY }],
	['.', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_OBJECT_PROPERTY_ACCESSOR, followedByType: TOKEN_TYPE_NAME }],
	
	['//', 			{type: TOKEN_TYPE_COMMENT, cmType: CM_LINE }],
	['/*', 			{type: TOKEN_TYPE_COMMENT, cmType: CM_BLOCK_BEGIN }],
	['*/', 			{type: TOKEN_TYPE_COMMENT, cmType: CM_BLOCK_END }],
]);

const COMBINATION_TOKEN_MAP = new Map([
	['=', 			{canBeFollowedBy: ["=", ">"]} ],
	['==', 			{canBeFollowedBy: ["=", ">"]} ],	
	['>', 			{canBeFollowedBy: ["="] }],
	['<', 			{canBeFollowedBy: ["="] }],
	['*', 			{canBeFollowedBy: ["*", "=", "/"] }],
	['+', 			{canBeFollowedBy: ["=", "+"] }],
	['-', 			{canBeFollowedBy: ["=", "-"] }],
	['&', 			{canBeFollowedBy: ["=", "&"] }],
	['|', 			{canBeFollowedBy: ["=", "|"] }],
	['/', 			{canBeFollowedBy: ["=", "/", "*"]} ]
]);

class Token {
	#name
	#lineNo
	#beginPos;
	#type
	#canBeExpression
	
	constructor(name, type, lineNo, beginPos) {
		this.#name = name;
		this.#type = type;
		this.#lineNo = lineNo
		this.#beginPos = beginPos;
		// fuether decide the type of the name 
		this.typeDivide();
	}
	
	static isSpace(c) {
		return c === TOKEN_CR || c === TOKEN_TAB || c === TOKEN_SPACE;
	}
	
	static getCombinableInfo(c) {
		return COMBINATION_TOKEN_MAP.get(c);
	}
	
	static isExpressionEnd(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return (tokenInfo && tokenInfo.punctuationType && tokenInfo.punctuationType === SEMICOLON);

	}
	
	static isObjectAccessor(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return tokenInfo && tokenInfo.opType && tokenInfo.opType == OP_TYPE_OBJECT_PROPERTY_ACCESSOR;
	}
	
	static isComma(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return tokenInfo && tokenInfo.punctuationType && tokenInfo.punctuationType == COMMA;
	}
	
	static isComment(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return tokenInfo && tokenInfo.type === TOKEN_TYPE_COMMENT;
	}
	
	static getSeperaterType(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		if (tokenInfo && ( tokenInfo.type === TOKEN_TYPE_SEPARATOR ||
			               tokenInfo.type === TOKEN_TYPE_OPERATOR ))
		{
			return tokenInfo.type;
		}
		return TOKEN_TYPE_UNKNOWN;
	}
	
	static isQuote(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.quoteType;
	}
	
	static isDoubleQuote(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.quoteType === QUOTE_TYPE_DOUBLE;
	}
	
	static isSingleQuote(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.quoteType === QUOTE_TYPE_SINGLE;
	}
	
	static isBacktickQuote(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.quoteType === QUOTE_TYPE_BACKTICK;
	}
	
	
	static isBeginBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.type === TOKEN_TYPE_SEPARATOR &&
				tokenInfo.bracketAction === ACTION_OPEN;
	}
	
	static isEndBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.type === TOKEN_TYPE_SEPARATOR &&
				tokenInfo.bracketAction === ACTION_CLOSE;
	}
	
	static isBeginCurlyBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.bracketType === BRACKET_TYPE_CURLY &&
				tokenInfo.bracketAction === ACTION_OPEN;
	}
	
	static isEndCurlyBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.bracketType === BRACKET_TYPE_CURLY &&
				tokenInfo.bracketAction === ACTION_CLOSE;
	}
	
	static isOpenRoundBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.bracketType === BRACKET_TYPE_ROUND &&
				tokenInfo.bracketAction === ACTION_OPEN;
	}
	
	static isCloseRoundBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.bracketType === BRACKET_TYPE_ROUND &&
				tokenInfo.bracketAction === ACTION_CLOSE;
	}
	
	static isBeginSquareBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.bracketType === BRACKET_TYPE_SQUARE &&
				tokenInfo.bracketAction === ACTION_OPEN;
	}
	
	static isEndSquareBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.bracketType === BRACKET_TYPE_SQUARE &&
				tokenInfo.bracketAction === ACTION_CLOSE;
	}
	
	static isVarDeclaration(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.subType && tokenInfo.subType === KEY_SUB_TYPE_VAR_DECL;
	}
	
	static isConstVarDeclaration(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.subType && tokenInfo.subType === KEY_SUB_TYPE_VAR_DECL &&
				tokenInfo.keyType === CONST_KEY;
	}
	
	static isLetVarDeclaration(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.subType && tokenInfo.subType === KEY_SUB_TYPE_VAR_DECL &&
				tokenInfo.keyType === LET_KEY;
	}
	
	static isVarVarDeclaration(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.subType && tokenInfo.subType === KEY_SUB_TYPE_VAR_DECL &&
				tokenInfo.keyType === VAR_KEY;
	}

	static isAssignment(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.opType && tokenInfo.opType === OP_TYPE_ASSIGNMENT_OPERATOR;
	}
	
	static isName(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	!tokenInfo && tokenInfo.opType && tokenInfo.opType === OP_TYPE_ASSIGNMENT_OPERATOR;
	}
	
	static isFunction(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.keyType && tokenInfo.keyType === FUNC_KEY;
	}
	
	static isReturn(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.keyType && tokenInfo.keyType === RETURN_KEY;
	}
	

	static convertToSpaceChar(name) {
		switch(name) {
			case SPACE_TOKEN_NAME:
				return TOKEN_SPACE;	
			case TAB_TOKEN_NAME:
				return TOKEN_TAB;
			case CR_TOKEN_NAME:
				return TOKEN_CR; 
			default: 
				return "";
		}
	}
	
	/* for a name, decide if it's number or variables */
	typeDivide() {
		if (this.type === TOKEN_TYPE_NAME &&
			RegexUtil.isNumberString(this.name))
		{
			this.#type = TOKEN_TYPE_NUMBER;
		}		
	}
	
	get displayStr() {
		return `Token: ${this.name} type_${this.type} at line_${this.lineNo} position_${this.beginPos}`;
	}
	
	get name() { return this.#name; }
	get value() { 
		if (this.isSpace) {
			return Token.convertToSpaceChar(this.#name);
		}
		return this.#name;
	}
	
	get type() { return this.#type; }
	get lineNo() { return this.#lineNo; }
	get beginPos() { return this.#beginPos; }
	get canBeExpression () { 
		return this.type == TOKEN_TYPE_NAME ||
			   this.type == TOKEN_TYPE_STRING ||
			   this.type == TOKEN_TYPE_NUMBER;
	}
	get isSpace () { return TOKEN_TYPE_SPACE === this.type}
	get isCR() { return TOKEN_TYPE_SPACE === this.type && this.value === TOKEN_CR}
	get isConst() { return  this.type === TOKEN_TYPE_NUMBER || this.type === TOKEN_TYPE_STRING }
	get isSeperater () { return Token.getSeperaterType(this.#name) != TOKEN_TYPE_UNKNOWN }
	get isBeginBracket () { return Token.isBeginBracket(this.#name) }
	get isBeginCurlyBracket() { return Token.isBeginCurlyBracket(this.#name) }
	get isEndCurlyBracket() { return Token.isEndCurlyBracket(this.#name) }
	get isOpenRoundBracket() { return Token.isOpenRoundBracket(this.#name) }
	get isCloseRoundBracket() { return Token.isCloseRoundBracket(this.#name) }
	get isRoundBracket() { return Token.isCloseRoundBracket(this.#name) || Token.isOpenRoundBracket(this.#name) }
	get isBeginSquareBracket() { return Token.isBeginSquareBracket(this.#name) }
	get isEndSquareBracket() { return Token.isEndSquareBracket(this.#name) }
	get isQuote() { return Token.isQuote(this.#name) }
	get isDoubleQuote() { return Token.isDoubleQuote(this.#name) }
	get isSingleQuote() { return Token.isSingleQuote(this.#name) }
	get isBacktickQuote() { return Token.isBacktickQuote(this.#name) }	
	get getCombinableInfo() { return Token.getCombinableInfo(this.#name) }
	get isName() { return this.type === TOKEN_TYPE_NAME }
	get isComma() { return Token.isComma(this.#name) }
	get isComment() { return Token.isComment(this.#name) }
	get isExpressionEnd() { return Token.isExpressionEnd(this.#name) }
	get isVarDeclaration() { return Token.isVarDeclaration(this.#name); }
	get isConstVarDeclaration() { return Token.isConstVarDeclaration(this.#name); }
	get isLetVarDeclaration() { return Token.isLetVarDeclaration(this.#name); }
	get isVarVarDeclaration() { return Token.isVarVarDeclaration(this.#name); }
	get varType() {
		if (this.isConstVarDeclaration) {
			return VAR_TYPE_CONST;
		}
		
		if (this.isLetVarDeclaration) {
			return VAR_TYPE_LET;
		}
		
		if (this.isVarVarDeclaration) {
			return VAR_TYPE_VAR;
		}
		
		return VAR_TYPE_UNKNOWN;
	}
	get isFunction() { return Token.isFunction(this.#name); }
	get isAssignment() { return Token.isAssignment(this.#name); }
	get isObjectAccessor() {return Token.isObjectAccessor(this.#name);}
	get isReturn() {return Token.isReturn(this.#name)}
}

class Variable {
	#token
	#type
	#dataType
	
	constructor(token, type) {
		this.#token = token;
		this.#type = type;
		this.#dataType = VAR_DATA_UNKNOWN;	
	}
	
	get token() { return this.#token; }
	get type() { return this.#type; }
	get isLocal() { return this.#type === VAR_TYPE_LET; }
	get isConst() { return this.#type === VAR_TYPE_CONST; }
	get isFunctionParameter() { return this.#type === VAR_TYPE_FUNC_PARAMETER; }
	get isFunction() { return this.#type === VAR_TYPE_FUNCTION; }
	get isTemp() { return this.#type === VAR_TYPE_TEMP; }
	get dataType() { return this.#dataType; }
	set dataType(dt) { this.#dataType = dt; }
}



class TokenError {
	#token
	#msg
	
	constructor(msg, token) {
		this.#msg = msg;
		this.#token = token;
	}
	
	get msg() { return this.#msg; }
	get token() { return this.#token; }
	
	get errorDisplay() {
		return `Error: ${this.msg} at line: ${this.token.lineNo}, position: ${this.token.beginPos}, found token <<< ${this.token.name} >>>`;
	}
}

class StateMachine {
	static STATE_NAMES = {
		CodeBlockState: "CodeBlockState",
		IfExpressionState: "IfExpressionState",
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
			case StateMachine.STATE_NAMES.IfExpressionState: 
				return new IfExpressionState(pos, beginToken, scope, analyst);
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

class Scope {
	#variableMap;
	#parentScope;
	
	constructor(parentScope) {
		this.#parentScope = parentScope;
		this.#variableMap = new Map();
	}
	
	/* public methods */
	findVariable(varName, inSameScope) {
		let foundVar = null;
		let scope = this;
		do {
			foundVar = scope.variableMap.get(varName);
			scope = scope.parentScope;
		} while(!inSameScope && scope && !foundVar);
		return foundVar;
			
	}
	
	// set a variable in the root (windows) scope
	addWindowsVariable(name, globalVar) {
		let scope = this;
		while (scope.parentScope) {
			scope = scope.parentScope;
		}
		scope.variableMap.set(name, globalVar);
	}
	
	// set a variable for the scope
	addLocalVariable(name, variable) {
		this.#variableMap.set(name, variable);
	}
	
	
	/* getters and setters */
	get parentScope() { return this.#parentScope; }
	get variableMap() { return this.#variableMap; }
}
	
class StateAction {
	#newState
	#error
	#stateEnded
	
	constructor(newState, error, stateEnded) {
		this.#newState = newState;
		this.#error = error;
		this.#stateEnded = stateEnded;
	}
	
	get newState() { return this.#newState; }
	get error() { return this.#error; }
	set error(err) { this.#error = err; }
	get stateEnded() { return this.#stateEnded; }
}

class ParsingState {
	#beginPos
	#beginToken
	#stage
	#codeAnalyst
	#errroExit
	#scope
	#error;
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		this.#beginPos = beginPos;
		this.#beginToken = beginToken;
		this.#stage = 0;
		this.#codeAnalyst = codeAnalyst;
		this.#scope = scope;
	}
	
	/**
		This happens when one state ended and we got this state from the state stack.
		We resume the current state using the popped state and set its stage to the next one:
	 **/
	nextStage(addStage) {
		this.#stage += addStage;
	}
	
	advance(nextToken, pos) {
		throw new Error('advance: sub-class-should-overload-this method'); 
	}
	
	complete() {
		// state ended:
	}
	
	/**
		Tell if a function call statement is at position 'pos"
	 **/
	isFunctionCall(pos) {
		// At leasr 3 tokens, for example: foo()
		if (this.codeAnalyst.meaningfulTokens.length < pos + 3) {
			return false;
		}
		
		const funcName = this.codeAnalyst.meaningfulTokens[pos];
		if (!funcName.isName) {
			return false;
		}
		
		const open = this.codeAnalyst.meaningfulTokens[pos+1];
		if (!funcName.isOpenRoundBracket) {
			return false;
		}
		
		// find pattern as: x,y,)
		let reachedEnd = false;
		let i = pos + 2;
		let state = 0;
		const exprList = [];
		let expre = [];
		while (i < this.codeAnalyst.meaningfulTokens.length) {
			const token = this.codeAnalyst.meaningfulTokens[i];
			if (token.isCloseRoundBracket) {
				reachedEnd = true;
				break;
			}
			if (token.isComma) {
				exprList.push(expre);
				expre = [];
			} else {
				expre.push(token);
			}
		}
		
		return {isFunctionCall: reachedEnd, expresionList: exprList};	
	}
	
	isFunctionDefinition(pos) {
		const token = this.codeAnalyst.meaningfulTokens[pos];
		if (!token.isFunction) {
			return false;
		}
		
		// At leasr 6 tokens, for example: function foo(){}
		if (this.codeAnalyst.meaningfulTokens.length < pos + 6) {
			this.error = new TokenError("Invalid function definition syntax", nextToken);
			this.codeAnalyst.push(error);			
			return false;
		}
		
		return true;
	}
	
	get beginPos() { return this.#beginPos; }
	get stage() { return this.#stage; }
	set stage(s) { this.#stage = s; }
	get scope() { return this.#scope; }
	get beginToken() { return this.#beginToken; }
	get codeAnalyst() { return this.#codeAnalyst; }
	get error() { return this.#error; }
	set error(e) { this.#error = e; }
	
}

class FunctionDefState extends ParsingState {
	#stage
	#funcName
	#funcArgumentMap
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.#stage = 0;
		this.#funcArgumentMap = new Map();
	}
	
	advance(nextToken, pos) {
		let ended = false;
		do {
			if (this.#stage === 0) {
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
				this.#stage = 1;
				break;
			}
			
			if (this.#stage === 1) {
				// check "("
				if (!nextToken.isOpenRoundBracket) {
					this.error = new TokenError("Invalid function syntax. '(' expected", nextToken);
					break;
				}
					
				this.#stage = 2;
				break;
			}
			
			if (this.#stage === 2) {
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
				
				this.#stage = 3;
				break;
			}
			
			if (this.#stage === 3) {
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
					
				this.#stage = 4;
				break;
			}
			
			if (this.#stage === 4) {
				// check if a argument is seen, or error
				if (!nextToken.isName) {
					this.error = new TokenError("Invalid function definition. A variable name is expected", nextToken);
					break;
				}
				
				// add argument
				this.#addNewArgument(nextToken);
					
				// go back to stage 2
				this.#stage = 2;
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
			const newFunction = new Variable(this.#funcName, VAR_TYPE_FUNCTION);
			this.scope.addWindowsVariable(this.#funcName.name, newFunction); 
			
			// create a new scope for the function
			if (this.#funcArgumentMap.size > 0) {
				funcScope = new Scope(this.scope);
				this.#funcArgumentMap.forEach((v,k) => funcScope.addLocalVariable(k, new Variable(v, VAR_TYPE_FUNC_PARAMETER)));
			}
			// entering function body block state
			const nextState = StateMachine.createState(
									StateMachine.STATE_NAMES.CodeBlockState, 
									pos, 					// current token position
									nextToken, 				// starting token
									funcScope, 				// new scope spawned from the current one
									this.codeAnalyst);		
			return new StateAction(nextState, null, true);
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
	
	constructor(beginPos, beginToken, scope, codeAnalyst, functionInfo) {
		super(beginPos, beginToken, scope, codeAnalyst);
		
		// check if function name is defined before:
		
		if (this.error) {
				codeAnalyst.errors.push(this.error);
		}
	}
	
	advance(nextToken, pos) {
		if (this.error) {
			return new StateAction(null, this.error, true)
		}
		
		const tokenInfo = STANDARD_TOKEN_MAP.get(nextToken.name);
	}	
}

class CodeBlockState extends ParsingState {
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
	}
	
	advance(nextToken, pos) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(nextToken.name);
				
		// current code block ended:
		if (nextToken.isEndCurlyBracket) {
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
		if (tokenInfo && tokenInfo.keyType === IF_KEY) {
			const nextState = StateMachine.createState(StateMachine.STATE_NAMES.IfState, 
														pos, nextToken, this.scope, 
														this.codeAnalyst);
			return new StateAction(nextState, true, null, false);
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

class ExpressionElement {
	#token
	
	constructor(token) {
		this.#token = token;
	}
	
	get token() { return this.#token}
	
	// overridable methods
	
	// this method decides if two expression elements can be adjacent to each other
	// the calling of this method is in form of: a.canBeFollowedBy(b), where a is the first element and
	// b is the element after a.
	canBeFollowedBy(another) { return true }
}

class Operator extends ExpressionElement {
	#tokenInfo

	constructor(token) {
		super(token);
		this.#tokenInfo = STANDARD_TOKEN_MAP.get(token.name);
		if (TOKEN_TYPE_OPERATOR !== this.#tokenInfo.type) {
			throw new Error("Invalid operator generated: " + token.name);
		}
	}
	
	static isOperator(token) { return TOKEN_TYPE_OPERATOR === token.type}
	
	// overrides
	
	// a binary operator can only be followed by an operand
	// a front unary operator can only be followed by a none "()" operand
	//a rear unary operator can only be follwed by another operator or nothing
	canBeFollowedBy(another) { 
		return 	this.isBinary && (another instanceof Operand) && !(another instanceof CloseRoundBrachetOperand) ||
		        this.isUnaryFront && (another instanceof Operand) && !(another.token.isRoundBracket) || 
				this.isUnaryRear  && (another instanceof Operator)
	}
	
	get isUnaryFront() { 
		return  this.#tokenInfo.opMode === OP_MODE_UNARY_FRONT_AND_BINARY ||
				this.#tokenInfo.opMode === OP_MODE_UNARY_FRONT ||
				this.#tokenInfo.opMode === OP_MODE_UNARY_BOTH
	}
	
	
	get isUnaryRear() { 
		return  this.#tokenInfo.opMode === OP_MODE_UNARY_REAR ||
				this.#tokenInfo.opMode === OP_MODE_UNARY_BOTH
	}
	
	get isBinary() { 
		return  this.#tokenInfo.opMode === OP_MODE_UNARY_FRONT_AND_BINARY ||
				this.#tokenInfo.opMode === OP_MODE_BINARY
	}
	
	get priority() { return this.#tokenInfo.priority; }
}
 
class Operand extends ExpressionElement {
	#binaryOperatorRight
	#binaryOperatorLeft
	
	constructor(token) {
		super(token);
	}
	
	// public methods:
	
	static isOperand(token) {
		return  TOKEN_TYPE_NAME === token.type ||
				TOKEN_TYPE_NUMBER === token.type ||
				TOKEN_TYPE_STRING == token.type
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
	get isVariable() { return  this.token.type === TOKEN_TYPE_NAME; }
	get isConst() { 
		return  this.token.type === TOKEN_TYPE_NUMBER ||
				this.token.type === TOKEN_TYPE_STRING 
	}
}

class ExpressionState extends ParsingState {
	#operandStack;		// Variable stack
	#currentOperator;
	#lastElement
	#numberOfTemp 
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
		this.#operandStack = [];
		this.#numberOfTemp = 0;
	}
	
	advance(nextToken, pos) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(nextToken.name);
		
		// expression ends?
		let changeState = false;
		let newElement = null;
		do {
			if (nextToken.isExpressionEnd || this.#expressionEnded(nextToken, pos)) {
				this.#resolve();
				changeState = true;
				break;
			}
			
			// skip CR for the next token
			if (nextToken.isCR) {
				return new StateAction(null, null, false);;
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
		if (!changeState) {
			if (!newElement) {
				this.error = new TokenError("Invalid expression element found", nextToken);
			}
			
			// can the new element follow the last element?
			if (this.#lastElement && !this.#lastElement.canBeFollowedBy(newElement)) {
				this.error = new TokenError("Invalid token found", nextToken);
			}			
			this.#lastElement = newElement;
			newElement = null;
		}
		
		if (this.error) {
			this.codeAnalyst.errors.push(this.error);
		}
		return new StateAction(null, this.error, changeState);			
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
		return newOperand;
	}
	
	#addCloseRoundBracket(token) {	
		const newOperand = new CloseRoundBrachetOperand(token); 
		
		this.#operandStack.push(newOperand);
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
		const temp = new TempOperand("T"+ this.#numberOfTemp++, "tbd");
		const lastOperand = this.#peek();
		if (lastOperand) {
			// associate temp with the last oprand's operator:
			if (lastOperand.binaryOperator.priority <= newOp.priority) {
				temp.binaryOperator = newOp;
			} else {
				temp.binaryOperator = lastOperand.binaryOperator;
			}
		} else {
			// associate the temp with the new operator
			temp.binaryOperator = newOp;
		}
		
		this.#operandStack.push(temp);
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

class IfExpressionState extends ExpressionState {
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
	}
	
	isEnded(nextToken) {
		// expression ends?
		return nextToken.isCloseRoundBracket;
	}
	
	advance(nextToken, pos) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(nextToken.name);
		
		// expression ends?
		if (nextToken.isCloseRoundBracket ) {
			return new StateAction(null, null, true);
		}
		
		// to be decided
		// if we come here, we are still in the same code block, keep probing ahead
		return new StateAction(null, null, false);			
	}
	
}

class AssignmentState extends ParsingState {
	
	constructor(beginPos, beginToken, scope, codeAnalyst, declarative) {
		super(beginPos, beginToken, scope, codeAnalyst);
		
		if (!beginToken.isName) {
			this.error = new TokenError("Invalid variable name found", beginToken);
		} else if (!declarative) {
			const v = scope.findVariable(beginToken.name, false);
			if (!v) {
				// Implicit variable declaration as global (windows) variable
				const newVar = new Variable(beginToken, VAR_TYPE_WINDOW);
				this.scope.addWindowsVariable(beginToken.name, newVar); 
			} else if (v.isConst) {
				this.error = new TokenError("Const variable can not be changed", beginToken);
			}
		}
		
		if (this.error) {
			codeAnalyst.errors.push(this.error);
		}
	}
	
	advance(nextToken, pos) {
		if (this.error) {
			return new StateAction(null, this.error, true)
		}
		
		if (!nextToken.isAssignment) {
			this.error = new TokenError("Invalid assignment state", nextToken);
			codeAnalyst.errors.push(this.error);
		}
		
		// go to expression state		
		const nextState = StateMachine.createState(StateMachine.STATE_NAMES.ExpressionState, 
															pos, nextToken, 
															this.scope, 
															this.codeAnalyst);
		return new StateAction(nextState, this.error, true);			
	}
}

class VarDeclarationState extends ParsingState {
	#varToken
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
	}
	
	// next token must be a variable name
	advance(nextToken, pos) {
		if (this.stage == 0) {
			// declared before?
			let error = null;
			let action = null;
			
			if (!nextToken.isName) {
				error = new TokenError("Invalid variable name found", nextToken)
				action = new StateAction(null, error, true);
			} else if (this.scope.findVariable(nextToken.name, true)) {
				error = new TokenError(`Variable "${nextToken.name}" has already been declared in the same scope.`, nextToken)
				action = new StateAction(null, error, true);
			}
			
			if (error) {
				this.codeAnalyst.errors.push(error);
				return action;
			}
			
			// add a new variable
			const newVar = new Variable(nextToken, this.beginToken.varType);
			this.scope.variableMap.set(nextToken.name, newVar); 
			this.stage = 1;
			return new StateAction(null, null, false);
		}
		
		if (this.stage == 1) {
			if (nextToken.isAssignment) {
				// ended declaration
				this.stage = 2;
				const nextState = StateMachine.createState(StateMachine.STATE_NAMES.ExpressionState, 
															pos, nextToken, 
															this.scope, 
															this.codeAnalyst);
				return new StateAction(nextState, null, true);
			}
			
			// error if const var is not assigned
			if (this.beginToken.isConstVarDeclaration) {
				const error = new TokenError(`Variable "${beginToken.name}" needs to be assigned.`, this.beginToken);
				this.codeAnalyst.errors.push(error);
				return new StateAction(null, error, true);
			}
			
		}
	} 
	
}

class IfState extends ParsingState {
	
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
	}
	
	advance(nextToken, pos) {
		if (nextToken.isOpenRoundBracket && this.stage == 0) {
			this.stage = 1;
			// entering expression state, push this state to stack
			const nextState = StateMachine.createState(StateMachine.STATE_NAMES.IfExpressionState, 
														pos, nextToken, this.scope, 
														this.codeAnalyst);
			return new StateAction(nextState, null, false);
		}		
		
		if (nextToken.isBeginCurlyBracket && this.stage == 1) {
			this.stage = 3;
			// IF-state ended nicely, enter a new code block:
			const nextState = StateMachine.createState(
										StateMachine.STATE_NAMES.CodeBlockState, 
										pos, 					// current token position
										nextToken, 				// starting token
										new Scope(this.scope), 	// new scope spawned from the current one
										this.codeAnalyst);		
			return new StateAction(nextState, null, true);
		}
		
		// if without {}, enter unknow state
		if (this.stage == 2) {
			this.stage = 3;
			// IF-state ended nicely
			return new StateAction(null, null, true);
		}
		
		// if we come here, we run into unknown token
		const error = new TokenError("Invalid state in 'if' statement.", nextToken);
		return new StateAction(null, error, true);
	}
}

class CodeAnalyst {
	#beginLine;
	#endLine;
	#codeBlocks;
	#tokens;
	#meaningfulTokens;
	#codeStr;
	
	// syntax parsing one outcome
	#variables;
	#stringLiterals;
	#numbers;
	#expressions;
	#errors
	
	constructor(codeStr) {
		this.#codeStr = codeStr
		this.#tokenize(codeStr);
		this.#codeBlocks = [];
		this.#errors = [];
		this.#variables = new Map();
	}
	
	/* geters and setters */
	get tokens() { return this.#tokens; }
	get meaningfulTokens() { return this.#meaningfulTokens; }
	get variables() { return this.#variables; }
	get stringLiterals() { return this.#stringLiterals; }
	get numbers() { return this.#numbers; }
	get expressions() { return this.#expressions; }
	get errors () { return this.#errors; }
	get codeBlocks() { return this.#codeBlocks }
	
	/* public methods */
	
	/* display tokens for debugging purpose */
	#displayAll(tokens) {
		tokens.forEach(t => console.log(t.displayStr));
	}
	
	/* 
		Diagnotic methods for shallow error discovery. For this method we only display errors
		such as no closing { or ( or [
	*/
	shallowInspect() {
		const bracketStack = [];
		const quoteStack = [];
		for (let i = 0; i < this.tokens.length; i++) {
			const tokenInfo = STANDARD_TOKEN_MAP.get(this.tokens[i].name);
			const followedByInfo = this.#canBeFollowed(i);
			if (followedByInfo.result === false) {
				const invalidGrammer = new TokenError("Invalid symbol found", followedByInfo.token);
				this.errors.push(invalidGrammer);
			}
			
			// INSPECT BRACKET matches
			if (tokenInfo) {
				if (tokenInfo.bracketType) {
					const unmatchError = this.#checkBracketMatches(this.tokens[i], bracketStack);
					if (unmatchError) {
						const bracketMismatchError = new TokenError(unmatchError, this.tokens[i]);
						this.errors.push(bracketMismatchError);
					}
				} else if (tokenInfo.quoteType) {
					this.#checkQuoteMatches(this.tokens[i], quoteStack);
				}
			}
		}
		
		// see if we still have unmatched open brackets:
		bracketStack.forEach(bt => {
			const bracketMismatchError = new TokenError("Bracket is not closed", bt);
			this.errors.push(bracketMismatchError);
		});
		
		// see if we still have unmatched open quotes:
		quoteStack.forEach(qt => {
			const quoteMismatchError = new TokenError("Quote is not closed", qt);
			this.errors.push(quoteMismatchError);
		});
		
		this.#syntaxParseOne()
		
		return this.errors;
	}
	
	/* 
		Based on the token we found, get the basic coding elements, such as variable names, strings, and other values.
		We should be able to find out futher syntax error as the outcome of the parsing.
	*/
	#syntaxParseOne() {
		this.#stringLiterals = []
		this.#numbers = [];
		this.#expressions = [];
		const stateStack = [];
		let i = 0;
		let currentState = StateMachine.createState(StateMachine.STATE_NAMES.CodeBlockState, 
													i, 					// current token position
													null, 				// starting token
													new Scope(null), 	// root scope
													this);				// analyst
		this.codeBlocks.push(currentState);
		while (i < this.meaningfulTokens.length) {
			const token = this.meaningfulTokens[i];
			
			// get next state
			const action = currentState.advance(token, i);
			const nextState = action.newState;
			
			// error? exit
			if (action.error) {
				break;
			}
			
			if (nextState) { 
				// save if the new state is a block
				if (nextState instanceof CodeBlockState) {
					this.codeBlocks.push(nextState);
				}
				if (!action.stateEnded) {
					// current state has not ended, save it
					stateStack.push(currentState);
				}
				
				// nter the next state
				currentState = nextState;
			} else if (action.stateEnded) {
				currentState = stateStack.pop();
			} 
						
			++i;
		}
		
		// if current state has not ended, end it:
		if (currentState) {
			currentState.complete();
		}
	}
	
	/* tokenize code string, this is the preparation ofr further code analysis. */
	#tokenize(codeStr) {
		let currentLine = 1;
		let currentPos = 0;
		let currentStrPos = 0;
		let tokenBegin = -1;
		let tokenEnd = -1;
		const tokens = [];
		while(currentStrPos < codeStr.length) {
			// skip space, cr, and tab
			const currentChar = codeStr.charAt(currentStrPos);
			let hasSpace = false;
			let spaceName = null;
			if (Token.isSpace(currentChar)) { 
				spaceName = SPACE_TOKEN_NAME;
				if (currentChar === TOKEN_TAB)  {
					spaceName = TAB_TOKEN_NAME
				} 
				else if (currentChar === TOKEN_CR)  {
					spaceName = CR_TOKEN_NAME
				}
				
				if (tokenBegin != -1) {
					// last token ends here
					tokenEnd = currentStrPos;
				}
				hasSpace = true;
			}
			
			// found a seperator?
			const seperater = Token.getSeperaterType(currentChar);
			if (seperater != TOKEN_TYPE_UNKNOWN) {
				// a seperator also marks the end of a token (if any)
				tokenEnd = currentStrPos;	
			}					
			
			// found a new token?
			let tokenEnded = false;
			if (tokenBegin != -1 && tokenEnd != -1 ) {
				// new token name
				const token = this.#newToken(codeStr, tokenBegin, tokenEnd, currentLine);
				tokens.push(token);
				tokenEnded = true;
			} 
			
			// add seperator or space token
			if (seperater != TOKEN_TYPE_UNKNOWN || hasSpace) {
				if (hasSpace) {
					// new space token
					const token = new Token(spaceName, TOKEN_TYPE_SPACE, currentLine, currentPos);
					tokens.push(token);
					console.log(`found new SPACE token: ${spaceName}`);
				} 
				else {
					const token = new Token(currentChar, seperater, currentLine, currentPos);
					tokens.push(token);
					console.log(`found new separater token: ${currentChar}`);
				}
				
				// make sure normal token ends here
				tokenBegin = -1;
				tokenEnd = -1;
			} 
			// not space or seperator
			else {
				if (tokenBegin === -1) {
					// a new beginning
					tokenBegin = currentStrPos;
					tokenEnd = -1;
				} 
				else if (tokenEnded) {
					// ended a new token, reset and start all-over
					tokenBegin = -1;
					tokenEnd = -1;
				}
			}
			
			// start a new line, lineNo inc.
			if (currentChar === TOKEN_CR) { 
				currentPos = 0;
				// advance to the next y-position
				++currentLine;
			} 
			else {
				// advance to the next x-position
				++currentPos;
			}
			
			// advance to the next token
			++currentStrPos;
		}
		
		// in case the last token hs not been closed (this happens when we did not end the program with
		// white space or cr any punctuation:
		if (tokenBegin != -1 ) {
			const token = this.#newToken(codeStr, tokenBegin, codeStr.length, currentLine);
			tokens.push(token);
			tokenBegin = -1;
		} 
		
		this.#tokens = tokens;
		
		console.log(`number of Line: ${currentLine}, number of tokens: ${tokens.length}`);
		// display all tokens
		this.#displayAll(this.#tokens);
		
		// now conbine tokens into meaningful tokens
		this.#combineTokens()
		
		console.log(`number of meaningful tokens: ${this.#meaningfulTokens.length}`);
		// display all tokens
		this.#displayAll(this.#meaningfulTokens);
		
	}
	
	/**
		This methods essentialy does two things:
		1) combine tokens: for example, = and = together becomes ==, etc.
		2) get rid of white spaces, for example. x = y becomes x=y
	 **/
	#combineTokens() {
		const meaningfulTokens = [];
		let combinableToken = null;
		let openQuote = null;
		let currentString = "";
		
		// enumerate tokens
		for(let i = 0; i < this.#tokens.length; i++) {
			const t = this.#tokens[i];
			const isQuote = t.isQuote;
			
			// got quote?
			if (openQuote) {
				if (t.name === openQuote.name) {
					// quote closed, gathered a string
					const strToken =  new Token(currentString, TOKEN_TYPE_STRING, openQuote.lineNo, openQuote.beginPos);
					meaningfulTokens.push(strToken);
					openQuote = null;
				} else {
					// note that here we don't use name but value due to the symbolic nature of space chars
					currentString += t.value;
				}
				continue;
			} else if (isQuote) {
				// got an open quote, wait for close quote
				openQuote = t;
				continue;
			}
			
			// got space? skip
			if (t.isSpace) {
				if (combinableToken) {
					// last combinable token closed
					meaningfulTokens.push(combinableToken);
					combinableToken = null;
				}
				
				// only add CR token since it serves as statement delimitor
				if (t.isCR) {
					meaningfulTokens.push(t);
				}
				continue;
			}
			
			// combine the new token with existing tokens?
			if (combinableToken) {
				const newToken = this.#combineTowTokens(combinableToken, t);
				if (newToken) {
					combinableToken = newToken;
					continue;
					
				} else {
					meaningfulTokens.push(combinableToken);
					combinableToken = null;	
				}						
			}
			
			// t is still not absorbed
			if (t.getCombinableInfo) {
				// if t is a combinable token, save it
				combinableToken = t;
			} else {
				// a non-space, non-combinable token, push it
				meaningfulTokens.push(t);
			}
		}
		
		// left over token?
		if (combinableToken) {
			meaningfulTokens.push(combinableToken);
		}
		
		this.#meaningfulTokens = meaningfulTokens;
	}
	
	/*
		combine a group of tokens and a new token together.
		returns true if the new token is absorbed, false if the new token
		is not absorbed.
	 */
	#combineTowTokens(token1, token2) {
		const combinedTokenStr = token1.name + token2.name;
		const combinedTokenInfo = STANDARD_TOKEN_MAP.get(combinedTokenStr);
		if (combinedTokenInfo) {
			return new Token(combinedTokenStr, combinedTokenInfo.type, token1.lineNo, token1.beginPos);
		}
		
		return null;
	}
	
	#newToken(codeStr, begin, end, line) {
		// new token name
		const name = codeStr.substring(begin, end);
		console.log(`found new token: ${name}`);
		let type = STANDARD_TOKEN_MAP.get(name);
		let tt = null;
		if (type) {
			tt = type.type;
		} else {
			tt = TOKEN_TYPE_NAME;
		}
		
		const token = new Token(name, tt, line, begin);
		return token;
	}
	
	/**
		test if token at index and be followed by next non-space token
	 **/
	#canBeFollowed(index, tokenInfo) {
		const thisToken = this.tokens[index];
		const returnObj = {result: true, token: null};
		// find the next none-space token
		let nextToken = null; 
		let nextPos = index+1;
		if (tokenInfo) {
			while(nextPos < this.tokens.length) {
				nextToken = this.tokens[nextPos];
				if (nextToken.type != TOKEN_TYPE_SPACE) {
					break;
				}
				++nextPos;
			}
		}
		
		if (nextToken) {
			const followedBy = tokenInfo.followedBy;
			if (followedBy) {
				// not in followed by list
				if (followedBy.indexOf(nextToken.name) === -1) {
					returnObj.result = false;
					returnObj.token = nextToken;
				}
			}
		}
		
		return  returnObj;
	}
	
	/**
		Check if brackets open/close matches
	 **/
	#checkBracketMatches(token, bracketStack) {
		const thisTokenInfo = STANDARD_TOKEN_MAP.get(token.name);
		let errMsg = "";
		const bracketName = this.#bracketTypeToName(thisTokenInfo.bracketType);
		let hasErro = false;
		if (thisTokenInfo.bracketAction === ACTION_CLOSE) {
			if (bracketStack.length === 0 ) {
				hasErro = true;
			}
			else {
				// must matches the last open brachet
				const lastToken = bracketStack.pop();
				const lastTokenInfo = STANDARD_TOKEN_MAP.get(lastToken.name);
				if (thisTokenInfo.bracketType != lastTokenInfo.bracketType) {
					hasErro = true;
				}
			}
		}
		else {
			bracketStack.push(token);
		}
		
		if (hasErro) {
			errMsg = `This ${bracketName} does not have an open matching bracket.`;
		}
		
		return errMsg;		
	}
	
	#checkQuoteMatches(token, quoteStack) {
		const thisTokenInfo = STANDARD_TOKEN_MAP.get(token.name);
		const stackLen = quoteStack.length;
		const lastQuote = stackLen > 0 ? quoteStack[stackLen - 1] : null;
		let matched = false;
		if (lastQuote) {
			const lastTokenInfo = STANDARD_TOKEN_MAP.get(lastQuote.name);
			if (lastTokenInfo.quoteType == thisTokenInfo.quoteType) {
				quoteStack.pop();
				matched = true;
			}
		}
		
		if (!matched) {
			quoteStack.push(token);
		}
	}
	
	#bracketTypeToName(type) {
		switch(type) {
			case BRACKET_TYPE_CURLY:
				return "Curly-bracket";
			case BRACKET_TYPE_SQUARE:
				return "Squarely-bracket";
			case BRACKET_TYPE_ROUND:
				return "Round-bracket";
		}
	}
	
	variableToken(name) { this.variables.get(token.name); }
	
}

export {CodeAnalyst}


	




