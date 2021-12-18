import {DisplayBoard} 	from './displayBoard.js';

const REPLACE_FOR_BODY = '{bdy}';
const REPLACE_FOR_LINE = '{ln}';
const REPLACE_FOR_TEXT = '{tx}';

const TABLE_TEMPLATE =
`
<table>
  <tbody>
  {bdy}
  </tboday>
</table>`;

const LINE_TEMPLATE =
`
<tr id="line_{ln}">
  <td class="blob-num js-line-number js-code-nav-line-number" data-line-number="{ln}">{ln}</td>
  <td><span>{tx}</span></td>
</tr>
`;

class DisplayBoardForCoding extends DisplayBoard { 
	#formatter;
	
	constructor(formatter) {
		this.#formatter = formatter;
	}
	
	/*
		Overload method for generating HTML for lines of code
	*/
	v_composeHtml() {
		let lines = '';
		for(let i = 0; i < #textLines.length;  ++i) {
			lines += LINE_TEMPLATE
						.replace(new RegExp(REPLACE_FOR_LINE, 'g'), i)
						.replace(REPLACE_FOR_TEXT, #textLines[i]);
		}
		return TABLE_TEMPLATE
						.replace(REPLACE_FOR_BODY, lines);
	} 
}

export { DisplayBoardForCoding };