import {PageUtil}				from '../core/util.js';

/**
	every component needs to derive from it
**/
class ComponentBase {
	#id;
	#name;
	#parentId;
	#visible;  
	#css;

	static get MOUNT_TYPE_APPEND() { return 1}
	static get MOUNT_TYPE_PREPEND() { return 2}
	static get MOUNT_TYPE_INSERT() { return 3}
	
	
	
	/**
		public methods
	**/
	
	//*********************************************************************************************
	//
	// class constructor
	// parameters:
	//	id   		- html element id for this component
	//	parentId 	- container id
	//**********************************************************************************************
    constructor(id, name, parentId, html, css, mountMethod, visible) {
		this.#id = id;
		this.#name = name;
		this.#parentId = parentId;
		this.#visible = visible;
		this.#css = css;
		
		if (css) {
			// load my own css file
			PageUtil.loadJsCssfile(css);
		}
		
		// mount upon contruction
		if (html) {
			this.mount(html, mountMethod);
		}
	}
	
	//*********************************************************************************************
	//
	// mounting the component to its container by appending or inserting, or replacing
	//
	// parameters:
	//	html   		- html text, usually assembled on the fly by its child
	//	method 		- method to create the component
	//					- 0 or undefined: inner text
	//					- 1: appendChild
	//					- 2: insertBefore
	//
	//**********************************************************************************************
	mount(html, method) {
		switch(method) {
	
			case ComponentBase.OUNT_TYPE_APPEND:
				$(this.parentSelector).append(html);
				break;
				
			case ComponentBase.MOUNT_TYPE_PREPEND:
				$(this.parentSelector).prepend(html);
				break;
			
			case ComponentBase.MOUNT_TYPE_INSERT:
				$(this.parentSelector).html(html);
				break;
				
			default:
				throw new Error('Unknown compnent mounting type')
		}
	}
		
	// Show the control
	show() {
		this.showOrHide(true);
	}
	
	// Hide the control
	hide() {
		this.showOrHide(false);
	}
	
	// Show or Hide the control 
	showOrHide(display) {
		const selector = this.selector;;
		if (display) {
			$(selector).show();
			this.#visible = true;
		}
		else {
			$(selector).hide();
			this.#visible = false;
		}
	}
	
	/**
		protected methods for child class
	**/
	
	// component id
	get id() {
		this.#id;
	}
	
	// jQuery selector
	get selector() {
		return `#${this.#id}`;
	}
	
	// parent id
	get parentId() {
		this.#parentId;
	}
	
	// jQuery selector for parent div
	get parentSelector() {
		return `#${this.#parentId}`;
	}
	
	// is it visible or not?
	get visible() {
		return this.#visible;
	}
	
	// get current css
	get css() {
		return this.#css;
	}
	
	// set current css
	set css(newCss) {
		this.#css = newCss;
	}
	
	/**
		virtual protected methods
	**/
	click(e) {
		throw new Error('Sub-class-should-override-this');
	}
	
}

export { ComponentBase };
