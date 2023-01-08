import {RegexUtil}				from '../../core/util.js'

const TOKEN_TYPE_UNKNOWN_ = -1;
const TOKEN_TYPE_SYMBOL = 100;
const TOKEN_TYPE_SPACE_ = 99;
const TOKEN_TYPE_ANY = 0;
const TOKEN_TYPE_KEY = 1;
const TOKEN_TYPE_SEPARATOR = 2;
const TOKEN_TYPE_OPERATOR_ = 3;
const TOKEN_TYPE_NAME_ = 4;
const TOKEN_TYPE_STRING_ = 5;
const TOKEN_TYPE_NUMBER_ = 6;
const TOKEN_TYPE_EXPRESSION = 7;
const TOKEN_TYPE_COMMENT = 8;
const TOKEN_TYPE_KNOWN_PROP_ = 9;

const TOKEN_SPACE_ = " ";
const TOKEN_CR_ = "\n";
const TOKEN_TAB_ = "\t";
const SPACE_TOKEN_NAME_ = 'SPC';
const TAB_TOKEN_NAME_ = 'TAB';
const CR_TOKEN_NAME_ = 'CRT';

const OP_TYPE_LOGIC_OPERATOR = 0;
const OP_TYPE_MATH_OPERATOR = 1;
const OP_TYPE_FUNC_OPERATOR = 2;
const OP_TYPE_ASSIGNMENT_OPERATOR = 3;
const OP_TYPE_MATH_ASSIGNMENT_OPERATOR = 4;
const OP_TYPE_LAMBDA = 5;
const OP_TYPE_OBJECT_PROPERTY_ACCESSOR = 6;

const OP_MODE_BINARY_ 	 	= 1
const OP_MODE_UNARY_FRONT_ 	= 2
const OP_MODE_UNARY_REAR_ 	= 3
const OP_MODE_UNARY_BOTH_ 	= 4
const OP_MODE_UNARY_FRONT_AND_BINARY_ = 5


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

const SEMICOLON = 1;
const COMMA = 2;
const COLON = 3;

const DATA_TYPE_INT_ = 1;
const DATA_TYPE_STRING_ = 2;
const DATA_TYPE_BOOL_ = 3;

class TokenConst {
	static get IF_KEY() {return 1}
	static get ELSE_KEY() {return 2}
	static get NEW_KEY() {return 3}
	static get CONST_KEY() {return 4}
	static get LET_KEY() {return 5}
	static get VAR_KEY() {return 6}
	static get CLASS_KEY() {return 7}
	static get CASE_KEY() {return 8}
	static get FUNC_KEY() {return 9}
	static get RETURN_KEY() {return 10}
	static get FOR_KEY() {return 11}
	static get KNOWN_FUNCTION_NAME() {return 20}	

	static get VAR_TYPE_UNKNOWN() { return 0}
	static get VAR_TYPE_CONST() { return 1}
	static get VAR_TYPE_LET() { return 2}
	static get VAR_TYPE_VAR() { return 3}
	static get VAR_TYPE_WINDOW() { return 4}
	static get VAR_TYPE_FUNC_PARAMETER() { return 5}
	static get VAR_TYPE_TEMP() { return 6; }
	static get VAR_TYPE_FUNCTION() { return 7};

	static get VAR_DATA_UNKNOWN() { return 0}
	static get VAR_DATA_NUMBER() { return 1}
	static get VAR_DATA_STRING() { return 2}
	static get VAR_DATA_BOOLEAN() { return 3}
	static get VAR_DATA_ARRAY() { return 4}
	static get VAR_DATA_CLASS_OBJ() { return 5}
	static get VAR_DATA_FUNC() { return 6}
	static get VAR_DATA_NUMBER_OR_STRING() { return 7}
}

const STANDARD_TOKEN_MAP = new Map([
	['if', 			{type: TOKEN_TYPE_KEY, keyType: TokenConst.IF_KEY, followedBy: ['('] } ],
	['else', 		{type: TOKEN_TYPE_KEY, keyType: TokenConst.ELSE_KEY, followedBy: ['{', 'if'] } ],
	['new', 		{type: TOKEN_TYPE_KEY, keyType: TokenConst.NEW_KEY, followedBy: ['{',], includedInside: ["`"] }],
	['case', 		{type: TOKEN_TYPE_KEY, keyType: TokenConst.CASE_KEY, followedBy: ['('] } ],
	['switch', 		{type: TOKEN_TYPE_KEY, followedBy: ['{'] } ],
	['while', 		{type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['do', 			{type: TOKEN_TYPE_KEY, followedBy: ['{'] }],
	['for', 		{type: TOKEN_TYPE_KEY, keyType: TokenConst.FOR_KEY } ],
	['function', 	{type: TOKEN_TYPE_KEY, keyType: TokenConst.FUNC_KEY }],
	['class', 		{type: TOKEN_TYPE_KEY, keyType: TokenConst.CLASS_KEY, followedByType: TOKEN_TYPE_NAME_ }],
	['print', 		{type: TOKEN_TYPE_KEY, keyType: TokenConst.KNOWN_FUNCTION_NAME, followedByType: TOKEN_TYPE_NAME_ }],
	['constructor', {type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['get', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_NAME_ }],
	['set', 		{type: TOKEN_TYPE_KEY, followedByType: TOKEN_TYPE_NAME_ }],
	['const', 		{type: TOKEN_TYPE_KEY, subType: KEY_SUB_TYPE_VAR_DECL, keyType: TokenConst.CONST_KEY, followedByType: TOKEN_TYPE_NAME_, }],
	['let', 		{type: TOKEN_TYPE_KEY, subType: KEY_SUB_TYPE_VAR_DECL, keyType: TokenConst.LET_KEY, followedByType: TOKEN_TYPE_NAME_,   }],
	['var', 		{type: TOKEN_TYPE_KEY, subType: KEY_SUB_TYPE_VAR_DECL, keyType: TokenConst.VAR_KEY, followedByType: TOKEN_TYPE_NAME_,   }],
	['return', 		{type: TOKEN_TYPE_KEY, keyType: TokenConst.RETURN_KEY}],
	['break', 		{type: TOKEN_TYPE_KEY, followedBy: [';'] }],
	['continue', 	{type: TOKEN_TYPE_KEY, followedBy: [';'] }],
	['forEach', 	{type: TOKEN_TYPE_KEY, followedBy: ['('] }],
	['this', 		{type: TOKEN_TYPE_KEY, followedBy: ['.', ';'] }],
	['$', 			{type: TOKEN_TYPE_KEY, followedBy: ['{',], includedInside: ["`"] }],
	['$', 			{type: TOKEN_TYPE_KEY, followedBy: ['{',], includedInside: ["`"] }],

	['"', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_STRING_, quoteType: QUOTE_TYPE_DOUBLE }],
	["'", 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_STRING_, quoteType: QUOTE_TYPE_SINGLE}],
	["`", 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_STRING_, quoteType: QUOTE_TYPE_BACKTICK }],
	
	['{', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_CURLY, bracketAction: ACTION_OPEN   }],
	['}', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_CURLY, bracketAction: ACTION_CLOSE  }],
	['(', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_ROUND, bracketAction: ACTION_OPEN   }],
	[')', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_ROUND, bracketAction: ACTION_CLOSE  }],
	['[', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_SQUARE, bracketAction: ACTION_OPEN  }],
	[']', 			{type: TOKEN_TYPE_SEPARATOR, followedByType: TOKEN_TYPE_ANY, bracketType: BRACKET_TYPE_SQUARE, bracketAction: ACTION_CLOSE }],
	
	[',', 			{type: TOKEN_TYPE_SEPARATOR, punctuationType: COMMA, followedByType: TOKEN_TYPE_ANY }],
	[';', 			{type: TOKEN_TYPE_SEPARATOR, punctuationType: SEMICOLON, followedByType: TOKEN_TYPE_ANY }],
	[':', 			{type: TOKEN_TYPE_SEPARATOR, punctuationType: COLON, followedByType: TOKEN_TYPE_ANY }],
	
	['=', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_ASSIGNMENT_OPERATOR, followedByType: TOKEN_TYPE_ANY}],	
	
	['+=', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_ASSIGNMENT_OPERATOR, opMode: OP_MODE_BINARY_, priority: 0 }],
	['-=', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_ASSIGNMENT_OPERATOR, opMode: OP_MODE_BINARY_, priority: 0 }],
	['*=', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_ASSIGNMENT_OPERATOR, opMode: OP_MODE_BINARY_, priority: 0 }],
	['/=', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_ASSIGNMENT_OPERATOR, opMode: OP_MODE_BINARY_, priority: 0 }],

	['&&', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY_, priority: 1.5 }],
	['||', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY_, priority: 1 }],

	
	['==', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY_, priority: 2}],
	['===', 		{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY_, priority: 2}],
	['>', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY_, priority: 2}],
	['<', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY_, priority: 2}],
	['>=', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY_, priority: 2}],
	['<=', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY_, priority: 2}],
	['!=', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY_, priority: 2}],
	['!==', 		{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY_, priority: 2}],
	
	['!', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LOGIC_OPERATOR, opMode: OP_MODE_BINARY_, priority: 1 }],
	['&', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY_, priority: 3}],
	['|', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY_, priority: 3}],
	
	['+', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_OPERATOR, 
					 opMode: OP_MODE_UNARY_FRONT_AND_BINARY_, priority: 3, 
					 frontOperandType: TokenConst.VAR_DATA_NUMBER, binaryOperandType: TokenConst.VAR_DATA_NUMBER_OR_STRING  }],
	['-', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_OPERATOR, 
					opMode: OP_MODE_UNARY_FRONT_AND_BINARY_, priority: 3, 
					frontOperandType: TokenConst.VAR_DATA_NUMBER, binaryOperandType: TokenConst.VAR_DATA_NUMBER}],
	
	['*', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY_, priority: 4 }],
	['/', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY_, priority: 4 }],
	['%', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY_, priority: 4 }],
	
	['**', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_BINARY_, priority: 5 }],
	
	["instanceof",  {type: TOKEN_TYPE_OPERATOR_, opMode: OP_MODE_BINARY_, priority: 6 }], 
	['typeof', 		{type: TOKEN_TYPE_OPERATOR_, opMode: OP_MODE_UNARY_FRONT_, priority: 6 }],
	['++', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_UNARY_BOTH_, priority: 6 }],
	['--', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_MATH_OPERATOR, opMode: OP_MODE_UNARY_BOTH_, priority: 6 }],	
	
	['=>', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_LAMBDA, followedByType: TOKEN_TYPE_ANY }],
	['.', 			{type: TOKEN_TYPE_OPERATOR_, opType: OP_TYPE_OBJECT_PROPERTY_ACCESSOR, opMode: OP_MODE_BINARY_, priority: 7}],
	
	['//', 			{type: TOKEN_TYPE_COMMENT, cmType: CM_LINE }],
	['/*', 			{type: TOKEN_TYPE_COMMENT, cmType: CM_BLOCK_BEGIN }],
	['*/', 			{type: TOKEN_TYPE_COMMENT, cmType: CM_BLOCK_END }],
	
	['length',		{type: TOKEN_TYPE_KNOWN_PROP_, propDataType: DATA_TYPE_INT_ }],
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
	
	static createExpressionEndToken(pos) {
		return new Token(";", TOKEN_TYPE_SEPARATOR, -1, -1);
	}
	
	static get TOKEN_CR () { return TOKEN_CR_; }
	static get TOKEN_TAB () { return TOKEN_TAB_; }
	static get TAB_TOKEN_NAME() { return TAB_TOKEN_NAME_; }
	static get CR_TOKEN_NAME () { return CR_TOKEN_NAME_; }
	static get TOKEN_TYPE_SPACE() { return TOKEN_TYPE_SPACE_ }
	static get TOKEN_SPACE() { return TOKEN_SPACE_; }
	static get SPACE_TOKEN_NAME() { return SPACE_TOKEN_NAME_; }
	
	static get TOKEN_TYPE_UNKNOWN() { return TOKEN_TYPE_UNKNOWN_}
	static get TOKEN_TYPE_NAME() { return TOKEN_TYPE_NAME_}
	static get TOKEN_TYPE_NUMBER() { return TOKEN_TYPE_NUMBER_ }
	static get TOKEN_TYPE_STRING() { return TOKEN_TYPE_STRING_}
	static get TOKEN_TYPE_OPERATOR() { return TOKEN_TYPE_OPERATOR_ }
	static get TOKEN_TYPE_KNOWN_PROP() { return TOKEN_TYPE_KNOWN_PROP_ }
	
	static get OP_MODE_BINARY() { return OP_MODE_BINARY_}
	static get OP_MODE_UNARY_FRONT() { return OP_MODE_UNARY_FRONT_}
	static get OP_MODE_UNARY_REAR() { return OP_MODE_UNARY_REAR_}
	static get OP_MODE_UNARY_BOTH() { return OP_MODE_UNARY_BOTH_}
	static get OP_MODE_UNARY_FRONT_AND_BINARY() { return OP_MODE_UNARY_FRONT_AND_BINARY_}

	static get VAR_TYPE_WINDOW() { return VAR_TYPE_WINDOW_}
	
	static getTokenInfo(name) { return STANDARD_TOKEN_MAP.get(name) }
	
	static isSpace(c) {
		return c === TOKEN_CR_ || c === TOKEN_TAB_ || c === TOKEN_SPACE_;
	}
	
	static getCombinableInfo(c) {
		return COMBINATION_TOKEN_MAP.get(c);
	}
	
	static isExpressionEnd(c) {
		return Token.isComma(c) || Token.isSemicolon(c) || Token.isCloseCurlyBracket(c) || Token.isCloseSquareBracket(c);
	}
	
	static isKnownFunctionName(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return tokenInfo && tokenInfo.keyType && tokenInfo.keyType == TokenConst.KNOWN_FUNCTION_NAME;
	}
	
	static isKnownProperty(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return tokenInfo && tokenInfo.type && tokenInfo.type == Token.TOKEN_TYPE_KNOWN_PROP;
	}
	
	static isComma(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return tokenInfo && tokenInfo.punctuationType && tokenInfo.punctuationType == COMMA;
	}
	
	static isColon(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return tokenInfo && tokenInfo.punctuationType && tokenInfo.punctuationType == COLON;
	}
	
	static isSemicolon(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return tokenInfo && tokenInfo.punctuationType && tokenInfo.punctuationType == SEMICOLON;
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
			               tokenInfo.type === TOKEN_TYPE_OPERATOR_ ))
		{
			return tokenInfo.type;
		}
		return TOKEN_TYPE_UNKNOWN_;
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
	
	
	static isOpenBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.type === TOKEN_TYPE_SEPARATOR &&
				tokenInfo.bracketAction === ACTION_OPEN;
	}
	
	static isCloseBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.type === TOKEN_TYPE_SEPARATOR &&
				tokenInfo.bracketAction === ACTION_CLOSE;
	}
	
	static isOpenCurlyBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.bracketType === BRACKET_TYPE_CURLY &&
				tokenInfo.bracketAction === ACTION_OPEN;
	}
	
	static isCloseCurlyBracket(c) {
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
	
	static isOpenSquareBracket(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && 
				tokenInfo.bracketType === BRACKET_TYPE_SQUARE &&
				tokenInfo.bracketAction === ACTION_OPEN;
	}
	
	static isCloseSquareBracket(c) {
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
				tokenInfo.keyType === TokenConst.CONST_KEY;
	}
	
	static isLetVarDeclaration(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.subType && tokenInfo.subType === KEY_SUB_TYPE_VAR_DECL &&
				tokenInfo.keyType === TokenConst.LET_KEY;
	}
	
	static isVarVarDeclaration(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.subType && tokenInfo.subType === KEY_SUB_TYPE_VAR_DECL &&
				tokenInfo.keyType === TokenConst.VAR_KEY;
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
		return 	tokenInfo && tokenInfo.keyType && tokenInfo.keyType === TokenConst.FUNC_KEY;
	}
	
	static isForLoop(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return tokenInfo && tokenInfo.keyType && tokenInfo.keyType === TokenConst.FOR_KEY;
	}
	
	static isReturn(c) {
		const tokenInfo = STANDARD_TOKEN_MAP.get(c);
		return 	tokenInfo && tokenInfo.keyType && tokenInfo.keyType === TokenConst.RETURN_KEY;
	}
	
	
	static bracketTypeToName(type) {
		switch(type) {
			case BRACKET_TYPE_CURLY:
				return "Curly-bracket";
			case BRACKET_TYPE_SQUARE:
				return "Squarely-bracket";
			case BRACKET_TYPE_ROUND:
				return "Round-bracket";
		}
	}

	static convertToSpaceChar(name) {
		switch(name) {
			case SPACE_TOKEN_NAME_:
				return TOKEN_SPACE_;	
			case TAB_TOKEN_NAME_:
				return TOKEN_TAB_;
			case CR_TOKEN_NAME_:
				return TOKEN_CR_; 
			default: 
				return "";
		}
	}
	
	/* for a name, decide if it's number or variables */
	typeDivide() {
		if (this.type === TOKEN_TYPE_NAME_ &&
			RegexUtil.isNumberString(this.name))
		{
			this.#type = TOKEN_TYPE_NUMBER_;
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
		return this.type == TOKEN_TYPE_NAME_ ||
			   this.type == TOKEN_TYPE_STRING_ ||
			   this.type == TOKEN_TYPE_NUMBER_;
	}
	get isSpace () { return TOKEN_TYPE_SPACE_ === this.type}
	get isCR() { return TOKEN_TYPE_SPACE_ === this.type && this.value === TOKEN_CR_}
	get isConst() { return  this.type === TOKEN_TYPE_NUMBER_ || this.type === TOKEN_TYPE_STRING_ }
	get isSeperater () { return Token.getSeperaterType(this.#name) != TOKEN_TYPE_UNKNOWN_ }
	get isOpenBracket () { return Token.isOpenBracket(this.#name) }
	get isCloseBracket() { return Token.isCloseBracket(this.#name) }
	get isOpenCurlyBracket() { return Token.isOpenCurlyBracket(this.#name) }
	get isCloseCurlyBracket() { return Token.isCloseCurlyBracket(this.#name) }
	get isOpenRoundBracket() { return Token.isOpenRoundBracket(this.#name) }
	get isCloseRoundBracket() { return Token.isCloseRoundBracket(this.#name) }
	get isRoundBracket() { return Token.isCloseRoundBracket(this.#name) || Token.isOpenRoundBracket(this.#name) }
	get isOpenSquareBracket() { return Token.isOpenSquareBracket(this.#name) }
	get isCloseSquareBracket() { return Token.isCloseSquareBracket(this.#name) }
	get isQuote() { return Token.isQuote(this.#name) }
	get isDoubleQuote() { return Token.isDoubleQuote(this.#name) }
	get isSingleQuote() { return Token.isSingleQuote(this.#name) }
	get isBacktickQuote() { return Token.isBacktickQuote(this.#name) }	
	get getCombinableInfo() { return Token.getCombinableInfo(this.#name) }
	get isName() { return this.type === TOKEN_TYPE_NAME_ }
	get isComma() { return Token.isComma(this.#name) }
	get isColon() { return Token.isColon(this.#name) }
	get isSemicolon() { return Token.isSemicolon(this.#name) }
	get isComment() { return Token.isComment(this.#name) }
	get isExpressionEnd() { return Token.isExpressionEnd(this.#name) }
	get isVarDeclaration() { return Token.isVarDeclaration(this.#name); }
	get isConstVarDeclaration() { return Token.isConstVarDeclaration(this.#name); }
	get isLetVarDeclaration() { return Token.isLetVarDeclaration(this.#name); }
	get isVarVarDeclaration() { return Token.isVarVarDeclaration(this.#name); }
	get varType() {
		if (this.isConstVarDeclaration) {
			return TokenConst.VAR_TYPE_CONST;
		}
		
		if (this.isLetVarDeclaration) {
			return TokenConst.VAR_TYPE_LET;
		}
		
		if (this.isVarVarDeclaration) {
			return TokenConst.VAR_TYPE_VAR;
		}
		
		return TokenConst.VAR_TYPE_UNKNOWN;
	}
	get isFunction() { return Token.isFunction(this.#name); }
	get isForLoop() { return Token.isForLoop(this.#name); }
	get isAssignment() { return Token.isAssignment(this.#name); }
	get isObjectAccessor() {return Token.isObjectAccessor(this.#name);}
	get isReturn() {return Token.isReturn(this.#name)}
	get isKnownFunctionName() { return Token.isKnownFunctionName(this.#name)}
	get isKnownProperty() { return Token.isKnownProperty(this.#name)}
	
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

export {TokenConst, Token, TokenError}