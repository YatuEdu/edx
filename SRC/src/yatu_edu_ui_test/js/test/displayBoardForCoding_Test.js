import {DisplayBoardForCoding} 	from '../component/displayBoardForCoding.js';

const TAB_STRING = "\t";
const LINE_TEST =
[
	'const i   = 0;',
	'  const X   = "    " ;',
	'if  (i>0) { ',
	'&emsp;  print(0);',
	'}',
	' else  {',
	'&emsp;print(1);',
	' } ',
];

class DisplayBoardForCodingTest { 
	#formatter;
	
	constructor() {
		this.init();
	}
	
	/**
		Initialize the EVENT handler for the UI
	**/
	init() {
		$('#yt_test_board').click(this.handleTest.bind(this));	
		$("#yt_input_area").keydown(this.handleTab);
		$("#yt_bt_highlight_line").click(this.handleHighlight)
	}
	
	/*
	*/
	handleTest() {
		const bdr = new DisplayBoardForCoding();
		const text = $("#yt_input_area").val();
		// separate text by line
		const lines = text.split("\n");
		const html = bdr.refresh(lines);
		$('#yt_board_area').html(html);
	}
	
	/*
		Handle command to highlight a piece of code by highlighting the entire td
	*/
	handleHighlight(e) {
		const instr = $('#yt_tx_line_no').val().split(',');
		const tdId = `#code_line_${instr[0]}`;
		const addOrRemove = instr[1];
		const td = $(tdId);
		if (addOrRemove == 'a') {			
			td.addClass('displayCodeHi');
			td.removeClass('displayCode');
		} else {
			td.addClass('displayCode');
			td.removeClass('displayCodeHi');
		}
	}
	
	/**
		Hnandle tab by insertng \t
	**/
	handleTab(e) {
		if(e.which===9){ 
			const start = this.selectionStart;
			const end = this.selectionEnd;
			const val = this.value;
			const selected = val.substring(start, end);
			const re = /^/gm;
			this.value = val.substring(0, start) + selected.replace(re, TAB_STRING) + val.substring(end);
			//Keep the cursor in the right index
			this.selectionStart=start+1;
			this.selectionEnd=start+1; 
			e.stopPropagation();
			e.preventDefault(); 			
		}
	}
	
}

export { DisplayBoardForCodingTest };