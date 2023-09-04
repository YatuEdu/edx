import {AuthPage} 						from '../core/authPage.js'
import {ClassRoomOwner} 				from './classRoomOwner.js';
import {ClassRoomAudience}              from './classRoomAudience.js'
import {JSClassRoomOwner} 				from './jsClassRoomOwner.js';
import {JSClassRoomAudience}            from './jsClassRoomAudience.js'
import {groupTypeConstants} 	        from '../core/sysConst.js'
import {PageUtil}	                    from '../core/util.js';
import {sysConstants} 	                from '../core/sysConst.js'

const GROUP_TYPE_TO_CLASSROOM_TYPE_LIST = [
    {role: null, groupType: groupTypeConstants.GPT_EDU_GENERIC_PRESENTATION, 
        description: "rich_text_presentation", implementationClass: ClassRoomOwner},
    {role: null, groupType: groupTypeConstants.GPT_EDU_JSP, 
        description: "js_programming", implementationClass: JSClassRoomOwner},
    {role: null, groupType: groupTypeConstants.GPT_EDU_JSP_NODE, 
        description: "web design with node.js, js, and sql",  implementationClass: JSClassRoomOwner},
    {role: sysConstants.YATU_CHAT_ROOM_ROLE_AUDIENCE, groupType: groupTypeConstants.GPT_EDU_GENERIC_PRESENTATION, 
        description: "rich_text_presentation", implementationClass: ClassRoomAudience},
    {role: sysConstants.YATU_CHAT_ROOM_ROLE_AUDIENCE, groupType: groupTypeConstants.GPT_EDU_JSP, 
        description: "js_programming", implementationClass: JSClassRoomAudience},
    {role: sysConstants.YATU_CHAT_ROOM_ROLE_AUDIENCE, groupType: groupTypeConstants.GPT_EDU_JSP_NODE, 
        description: "web design with node.js, js, and sql",  implementationClass: JSClassRoomAudience}
];

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
    let role = null;
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
        authPage.validateLiveSession();
        groupType = authPage.liveSession.group_type;
        groupId = authPage.liveSession.group_id	
        sequenceId = authPage.liveSession.sequence_id;

        // when searching for implementation class, presenter role is the default (null)
        role = authPage.liveChatRole === sysConstants.YATU_CHAT_ROOM_ROLE_AUDIENCE 
                        ? authPage.liveChatRole 
                        : null;
    }

    const classroomConstructor = GROUP_TYPE_TO_CLASSROOM_TYPE_LIST.find( e => {
        return e.role === role && e.groupType === groupType
    });
    if (classroomConstructor) {
        const myInstance = new classroomConstructor.implementationClass(classMode, groupType, groupId, sequenceId);
        await myInstance.init();
        return myInstance;
    }
   
}

let classRoomOwner= null;

// A $( document ).ready() block.
$(document).ready(async function() {
    console.log( "ClassRoomOwner page ready!" );
	classRoomOwner = await createClassRoomOwner();
});