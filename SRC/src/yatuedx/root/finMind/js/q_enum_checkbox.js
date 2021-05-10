import {UserQuestionBase} from './q_base.js';

const replacementForClass = '{clss}';
const replacementQuestion = '{qst}';
const replacementForName = '{nm}';
const replacementForIndex = '{indx}';
const replacementForValue = '{vlu}';
const replacementForCheckBoxGroup = '{cbg}';

const q_template_enum_single = `
	<input 	type="checkbox" 
			name="{nm}" 
			class="{clss}"
			data-indx="{indx}"
			value="{vlu}">{vlu}<br>`;
		
const q_template_enum_multiple = `
<form>      
    <fieldset>          
        {cbg}  
    </fieldset>      
</form>
`;
	
class UserEnumQuestionCheckbox extends UserQuestionBase {  
    _enumValues; 
	_value;
	
    constructor(id, txt, type, enumValues){  
          
        super(id, txt, type);  
          
        this._enumValues = enumValues;  
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		return true;
	}
	
	// Method for hooking up event handler to handle RADIO 
	// selectioon change event
	onChangeEvent() {
		const classSelector = `.${this.groupClass}`;
		const self = this;
		
		$(classSelector).change(function(){
			// get all the indexs of the selected items
			const checkboxes = $(classSelector); 
			const selected = [];			
			for(var i = 0; i < checkboxes.length; i++) {
				if(checkboxes[i].checked){
					const inx = $(checkboxes[i]).attr("data-indx");
					selected.push(inx);
				}
			}
			self.setValue(selected);			
		});
	}
	
	// Setting the enum value from the UI when handling the
	// selection change event
	setValue(obj) {
		if (!Array.isArray(obj)) {
			throw new Error('invalid value for question ' + super._qid);
		}
		this._value = obj;
	}
	
	// get radio class 
	get groupClass() {
		return `enum_multi_for_${this._qid}`;
	}
	
	// get radio (group) nsme 
	get groupName() {
		return `name_for_${this._qid}`;
	}
	
	// get display html for the entire enum group in form of checkboxes
	get displayHtml() {
		const clssStr= this.groupClass;
		const name = this.groupName;	
		let htmlStrGroup = "";
		for(let i = 0; i < this._enumValues.length; i++) {
			const theValue = this._enumValues[i];
			htmlStrGroup += q_template_enum_single
									.replace(replacementForClass, clssStr)
									.replace(replacementForName, name)
									.replace(replacementForIndex, i)
									.replace(new RegExp(replacementForValue, 'g'),theValue);	
		}
		let htmlStr = q_template_enum_multiple
									.replace(replacementQuestion, this._qText)
									.replace(replacementForCheckBoxGroup,htmlStrGroup); 
		return htmlStr; 
	}
	
	// get question in xml format for saving to API server
	get serverXML() {
		let ret = `
		<qa>
			<id>${this.id}</id>
			{body}
		</qa>`;
		let body = '';
		this._value.forEach(i => body += `<indx>${i}</indx>`);
		ret = ret.replace('{body}', body);
		return ret;
	}
}  

export { UserEnumQuestionCheckbox };