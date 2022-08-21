const STUDENT_BOARD_TEMPLATE = `
<label>{lb}</lable>
<div>
<button class="btn btn-outline-primary translatable student-input-board-button-notext" id="{stdtgid}" title="Show Console" >Code</button>
<div id="{console_ctnr_id}" style="display:none" class="student-input-board-container-noshow">
	<textarea id="{taid}" class="student-input-board-extend" spellcheck="false"></textarea>
    <button class="btn btn-outline-primary translatable student-input-board-button-run_code" id="{stdtgid2}" >Run Code</button>
</div>
</div>
<div>
<button class="btn btn-outline-primary translatable student-input-board-button-notext" id="{stdt_msg_btn_id}" title="Show Messge Board" >Message</button>
<div id="{msg_ctnr_id}" style="display:none" class="student-msg-board-container-noshow">
	<textarea id="{std_msg_ta_id}" class="student-input-board-extend" spellcheck="false"></textarea>
    <button class="btn btn-outline-primary translatable student-input-board-button-run_code" id="{msg_send_btn_id}" >Send</button>
</div>
</div>
`;

const temp = '';

export {STUDENT_BOARD_TEMPLATE}
		  