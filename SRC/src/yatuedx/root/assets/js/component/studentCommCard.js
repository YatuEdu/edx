const STUDENT_BOARD_TEMPLATE = `
<div id="{std_area_id}">
 <label>{lb}</label>
 <div>
  <button class="btn translatable btn-mail-box-dimention-teacher" id="{stdtgid}" title="Show Console" >Code</button>
  <div id="{console_ctnr_id}" style="display:none" class="student-input-board-container-extend">
	<textarea id="{taid}" class="student-input-board-extend" spellcheck="false"></textarea>
	<button class="btn student-input-board-button-close student-input-board-button-close-size" title="Close" ></button>
    <button class="btn btn-outline-primary translatable student-input-board-button-run-code" id="{stdtgid2}" >Run Code</button>
  </div>
 </div>
 <div>
  <button class="btn translatable btn-mail-box-dimention-teacher" id="{stdt_msg_btn_id}" title="Show Messge Board" >Message</button>
  <div id="{msg_ctnr_id}" style="display:none" class="student-input-board-container-extend">
	<textarea id="{std_msg_ta_id}" class="student-msg-board-extend" spellcheck="true">Past messages:</textarea>
	<textarea id="{tchr_msg_ta_id}" class="teacher-msg-board-extend" spellcheck="true" placeholder="Enter your message"></textarea>
    <button class="btn btn-outline-primary translatable student-msg-board-button-send-msg" id="{msg_send_btn_id}" >Send</button>
	<button class="btn student-input-board-button-close student-input-board-button-close-size2" title="Close" ></button>
  </div>
 </div>
</div>
`;

const temp = '';

export {STUDENT_BOARD_TEMPLATE}
		  