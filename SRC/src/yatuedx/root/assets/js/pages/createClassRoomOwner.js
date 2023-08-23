import {AuthPage} 							from '../core/authPage.js'
import {ClassRoomOwner} 				from './classRoomOwner.js';
import {JSClassRoomOwner} 				from './jsClassRoomOwner.js';
import {groupTypeConstants} 	        from '../core/sysConst.js'
import {PageUtil}	                    from '../core/util.js';
import {sysConstants} 	                from '../core/sysConst.js'

const GROUP_TYPE_TO_CLASSROOM_TYPE_MAP = new Map ([
    [groupTypeConstants.GPT_EDU_GENERIC_PRESENTATION, {description: "rich_text_presentation", implementationClass: ClassRoomOwner }],
    [groupTypeConstants.GPT_EDU_JSP, {description: "js_programming",         implementationClass: JSClassRoomOwner}],
    [groupTypeConstants.GPT_EDU_JSP_NODE, {description: "web design with node.js, js, and sql",  implementationClass: JSClassRoomOwner}]
]);

/* 
	 static facotry method for ClassRoomOwner to assure that it creates appropriate child classes
     and calls its async init method.
*/
async function createClassRoomOwner() {
    const paramMap = PageUtil.getUrlParameterMap();
    const modeStr = paramMap.get(sysConstants.UPN_MODE);
    const mode = modeStr ? parseInt(modeStr, 10) : 0;
    let groupId = null
    let sequenceId = null
    let groupType = null
		
    // set class mode needs to be called before super.init()
    const classMode = mode;
    if (mode && mode === 1) {
        const groupStr = paramMap.get(sysConstants.UPN_GROUP);
        const sequenceStr = paramMap.get(sysConstants.UPN_SEQUENCE);
        const groupTypeStr = paramMap.get(sysConstants.UPN_GROUP_TYPE);  
        if (!groupTypeStr || !sequenceStr || !groupStr) {
            alert('Invalid URL.  You probably have no privilge to access this page!');
            return;
        }
        groupId = parseInt(groupStr);	
        sequenceId = parseInt(sequenceStr);
        groupType = parseInt(groupTypeStr);
    } else {
        // live mode, need to use AuthPage to obtain session info
        const authPage = new AuthPage()
        await authPage.validateLiveSession();
        groupType = authPage.liveSession.group_type;
        groupId = authPage.liveSession.group_id	
        sequenceId = authPage.liveSession.sequence_id;
    }

    const classroomConstructor = GROUP_TYPE_TO_CLASSROOM_TYPE_MAP.get(groupType);
    const myInstance = new classroomConstructor.implementationClass(classMode, groupType, groupId, sequenceId);
    await myInstance.init();
    return myInstance;
}

let classRoomOwner= null;

// A $( document ).ready() block.
$(document).ready(async function() {
    console.log( "ClassRoomOwner page ready!" );
	classRoomOwner = await createClassRoomOwner();
});