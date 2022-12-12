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
	
export { Scope }
