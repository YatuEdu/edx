	
import {UserQuestionBase} from './q_base.js';

const replacementForClass = '{clss}';
const replacementForValue = '{vl}';
const replacementForLabel = '{lb}';

const q_template_date = `
<div class="mb-4">
	<label for="IssueDate" class="form-label">{lb}</label>
	<input type="date" min="{min}" max="{max}" name="dob" value="{vl}" class="form-control form-control-lg {clss}">
</div>
`;

const q_template_date_ro = `
<div class="mb-4">
	<label for="IssueDate" class="form-label">{lb}</label>
	<span class="form-control form-control-lg">{vl}</span>
</div>
`;

const ourDateFormat = 'MM/DD/YYYY';
const dateFormat = [
    moment.ISO_8601,
    ourDateFormat
];

class UserDateQuestion extends UserQuestionBase {  
 
	_dateStr;
	_minDate;
	_maxDate;
	
    constructor(qInfo, minDate, maxDate){
        super(qInfo);
        this._minDate = minDate;
        this._maxDate = maxDate;
		this.validateAndSave(qInfo.sv1);		
    }  
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidating() {
		return this.onValidatingInternal(this._dateStr);
	}
	
	// Method for validating the result value upon moving away 
	// from the page.
	onValidatingInternal(dateString) {
		return moment(dateString, dateFormat, true).isValid();
	}

	// Method for hooking up event handler to handle text change event
	onChangeEvent() {
		const self = this;
		// check validness
		$(`.${this.uiClass}`).blur(function() {
			const dateString =  $(this).val();
			if (!self.validateAndSave(dateString)) {
				// REVERT
				$(this).val('');
			}
		});
	}

	validateAndSave(dateStr) {
		if (this.onValidatingInternal(dateStr)) {
			this.setValue(dateStr);
			return true;
		}
		else {
			this.setValue('');
			return false;
		}
	}

	setValue(obj) {
		this._dateStr = obj;
	}
	
	// This method can be called when we need to serialize the question / answer
	// to JSON format (usually for session store)
	serialize() {
		this.qInfo.sv1 = this._dateStr;
	}
	
	// Over-ride: get value object 
	get value() {
		return this._dateStr;
	}
	
	// get low value class 
	get uiClass() {
		return `date_for_${this.id}`;
	}
	
	get dateFromat() {
		if (!this._dateStr) {
			return "";
		}
		
		// Note that HTML date format is yyyy-mm-dd while
		// in finMind server we store the date format as mm/dd/yyyy
		return moment(this._dateStr).format('YYYY-MM-DD');
	}
	
	// get display html for the date control UI
	get displayHtml() {
		let htmlDateFormat = this.dateFromat;
		
		const htmlStr = q_template_date
							.replace(replacementForClass, this.uiClass)
							.replace(replacementForValue, htmlDateFormat)
							.replace(replacementForLabel, this.label)
							.replace("{min}", this._minDate)
							.replace("{max}", this._maxDate);
		return htmlStr; 
	}
	
	// get read-only display html for the date control UI
	get displayHtmlReadOnly() {
		return	q_template_date_ro
									.replace(replacementForLabel, this.label)
									.replace(replacementForValue,this.dateFromat);
	}
	
	// get the question in xml format for saving to API server
	get serverXML() {
		let ret ='';
		if (this.onValidating()) {
			ret =  
`<qa>
	<id>${this.id}</id>
	<strv>${this._dateStr}</strv>
</qa>`;
		}
		return ret;
	}
}  

export { UserDateQuestion };