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
const TOKEN_TYPE_NUMBER = 7;
const TOKEN_TYPE_EXPRESSION = 8;
const TOKEN_TYPE_COMMENT = 9;

const IF_KEY = 1;
const ELSE_KEY = 2;
const NEW_KEY = 3;
const CONST_KEY = 4;
const LET_KEY = 5;
const VAR_KEY = 6;
const CLASS_KEY = 7;
const CASE_KEY = 8;
const FUNC_KEY = 9;
const CUSTOMER_PRINT = 9;

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
const OP_TYPE_LAMBDA = 4;
const OP_TYPE_OBJECT_PROPERTY_ACCESSOR = 5;

const DOUBLE_EQUAL = 1;
const TRIPLE_EQUAL = 2;
const GREATER_THAN = 3;
const LESS_THAN = 4;

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
	['return', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_EXPRESSION }],
	['break', 		{type: TOKEN_TYPE_KEY, followedBy: [';'] }],
	['continue', 	{type: TOKEN_TYPE_KEY, followedBy: [';'] }],
	['forEach', 	{type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['this', 		{type: TOKEN_TYPE_KEY, followedBy: ['.', ';'] }],
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
	['+=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_ASSIGNMENT_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['-=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_ASSIGNMENT_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['*=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_ASSIGNMENT_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['/=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_ASSIGNMENT_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],

	['==', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION, op: DOUBLE_EQUAL}],
	['===', 		{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION, op: TRIPLE_EQUAL }],
	['>', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION, op: GREATER_THAN }],
	['<', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION, op: LESS_THAN }],
	['>=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['<=', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['&&', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['||', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_LOGIC_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	
	['+', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['-', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['++', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['--', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['*', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['/', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['%', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['**', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['&', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	['|', 			{type: TOKEN_TYPE_OPERATOR, opType: OP_TYPE_MATH_OPERATOR, followedByType: TOKEN_TYPE_EXPRESSION }],
	
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
	
	static isObjectAccessor(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return tokenInfo && tokenInfo.opType && tokenInfo.opType == OP_TYPE_OBJECT_PROPERTY_ACCESSOR;
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
	
	static isBeginRoundBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.bracketType === BRACKET_TYPE_ROUND &&
				tokenInfo.bracketAction === ACTION_OPEN;
	}
	
	static isEndRoundBracket(c) {
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
	get isSeperater () { return Token.getSeperaterType(this.#name) != TOKEN_TYPE_UNKNOWN }
	get isBeginBracket () { return Token.isBeginBracket(this.#name) }
	get isBeginCurlyBracket() { return Token.isBeginCurlyBracket(this.#name) }
	get isEndCurlyBracket() { return Token.isEndCurlyBracket(this.#name) }
	get isBeginRoundBracket() { return Token.isBeginRoundBracket(this.#name) }
	get isEndRoundBracket() { return Token.isEndRoundBracket(this.#name) }
	get isBeginSquareBracket() { return Token.isBeginSquareBracket(this.#name) }
	get isEndSquareBracket() { return Token.isEndSquareBracket(this.#name) }
	get isQuote() { return Token.isQuote(this.#name) }
	get isDoubleQuote() { return Token.isDoubleQuote(this.#name) }
	get isSingleQuote() { return Token.isSingleQuote(this.#name) }
	get isBacktickQuote() { return Token.isBacktickQuote(this.#name) }	
	get getCombinableInfo() { return Token.getCombinableInfo(this.#name) }
	get isName() { return this.type === TOKEN_TYPE_NAME }
	get isComment() { return Token.isComment(this.#name) }
	get isPunctuation() { return typeof this.punctuationType !== 'undefined'; }
	get isVarDeclaration() { return Token.isVarDeclaration(this.#name); }
	get isConstVarDeclaration() { return Token.isConstVarDeclaration(this.#name); }
	get isLetVarDeclaration() { return Token.isLetVarDeclaration(this.#name); }
	get isVarVarDeclaration() { return Token.isVarVarDeclaration(this.#name); }
	get isAssignment() { return Token.isAssignment(this.#name); }
	get isObjectAccessor() {return Token.isObjectAccessor(this.#name);}
}

class Variable {
	#token
	#value
	#type
	#isLocal
	#isConst
	
	constructor(token, value, type, isLocal, isConst) {
		this.#token = token;
		this.#value = value;
		this.#type = type;
		this.#isLocal = isLocal;
		this.#isConst = isConst;
	}
	
	get token() { return this.#token; }
	get value() { return this.#value; }
	get type() { return this.#type; }
	get isLocal() { return this.#isLocal; }
	get isConst() { return this.#isConst; }
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
		
	};
	
	static createState(newState, pos, beginToken, scope, analyst, extraParam) {
		switch(newState) {
			case StateMachine.STATE_NAMES.CodeBlockState:
				return new CodeBlockState(pos, beginToken, scope, analyst);
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
		throw new Error('nextState: sub-class-should-overload-this method'); 
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
		
		// IF statement encountered:
		if (tokenInfo && tokenInfo.keyType === IF_KEY) {
			const nextState = StateMachine.createState(StateMachine.STATE_NAMES.IfState, 
														pos, nextToken, this.scope, 
														this.codeAnalyst);
			return new StateAction(nextState, null, false);
		}		
		
		// assignment encounteed
		if (nextToken.isAssignment ) {
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
}

class IfExpressionState extends ParsingState {
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
	}
	
	advance(nextToken, pos) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(nextToken.name);
		
		// expression ends?
		if (nextToken.isEndRoundBracket ) {
			return new StateAction(null, null, true);
		}
		
		// to be decided
		// if we come here, we are still in the same code block, keep probing ahead
		return new StateAction(null, null, false);			
	}
	
}

class ExpressionState extends ParsingState {
	constructor(beginPos, beginToken, scope, codeAnalyst) {
		super(beginPos, beginToken, scope, codeAnalyst);
	}
	
	advance(nextToken, pos) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(nextToken.name);
		
		// expression ends?
		if (nextToken.isPunctuation || nextToken.isCR || nextToken.isEndRoundBracket ) {
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
		if (beginPos === 0) {
			// INVALID ASSIGNMENT 
			this.error = new TokenError("Invalid symbol found", beginToken);
		} else {
			const varToken = codeAnalyst.meaningfulTokens[beginPos - 1];
			if (!varToken.isName) {
				this.error = new TokenError("Invalid variable name found", varToken);
			} else if (!declarative) {
				const v = scope.findVariable(varToken.name, false);
				if (!v) {
					this.error = new TokenError("Variable not declared", varToken);
				} else if (v.isConst) {
					this.error = new TokenError("Const variable can not be changed", varToken);
				}
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
		
		// go to expression state		
		const nextState = StateMachine.createState(StateMachine.STATE_NAMES.ExpressionState, 
															pos, nextToken, 
															this.scope, 
															this.codeAnalyst);
		return new StateAction(nextState, null, true);			
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
			const newVar = new Variable(nextToken, null, null, 
										this.beginToken.isVarDeclaration, 
										this.beginToken.isConstVarDeclaration);
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
		if (nextToken.isBeginRoundBracket && this.stage == 0) {
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
	
	//onst BRACKET_TYPE_CURLY = 1;
	//const BRACKET_TYPE_SQUARE = 2;
	// const BRACKET_TYPE_ROUND = 3;
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
	
	/* the next name is variable */
	#lookForNextNameAsVarDeclaration(indx, actionToken) {
		let keepGoing = true;
		if (indx < this.meaningfulTokens.length - 1) {
			const token = this.meaningfulTokens[indx];
			const valueToken = this.meaningfulTokens[indx+1];
			
			if (!token.isName) {
				// error: 
				this.errors.push(new TokenError("Invalid variable name found", token));
			}
			else {
				// the variable has been declared or assigned earlier, can we proceed?
				const x = this.variables.get(token.name);
				if (x) {
					// const variables cannot be re-assigned
					if (x.isConst && actionToken.isAssignment) {
						this.errors.push(new TokenError(`Const variable "${token.name}" cannot be changed.`, token));
						keepGoing = false;
					} 
					// local variable cannot be re-declared in the same scope (to do: check scope)
					else if (x.isLocal && actionToken.isVarDeclaration) {
						this.errors.push(new TokenError(`Variable "${token.name}" has already been declared.`, token));
						keepGoing = false;
					}
				}
				else {
					// todo: add variable scope later
					this.variables.set(token.name, new Variable(token, valueToken, null, actionToken.isVarDeclaration, actionToken.isConstVarDeclaration));
				}
			}
		}
		else {
			// error:
			this.errors.push(new TokenError("Invalid variable declaration syntax", this.tokens[i-1]));
			keepGoing = false;
		}
		
		return keepGoing;
	}
	
	// find the end of this statement
	#toNextStatement(i) {
		while (i < this.meaningfulTokens.length) {
			const token = this.meaningfulTokens[i];
			if (token.isPunctuation	|| token.isCR) {
				return i + 1;
			}
			
			// adding variables?
			
			++i;
		}
		
		// error:
		return i;
	}
	
	
	variableToken(name) { this.variables.get(token.name); }
	
}

export {CodeAnalyst}


	




