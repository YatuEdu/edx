import {TimeUtil}	 from '../core/util.js';

// template parameter:
//  0 - group id
//  1 - image file name
//	2 - 
const alertColorStyle='title="This event starts in ##10 hour(s) ##11 minutes" style="font-size:22px; color:#FF0001; font-weight:bold; font-style:italic;"';
const GROUP_CARD_TEMPLATE = `
 <div id="card_div##1"  class="col-sm-10 col-lg-10 py-3 group-card">
	<div class="card h-100">
		<div class="card-body text-center">
			<img src="assets/images/dynamic/default.png" class="img-fluid py-1 my-4" alt="Product 2" height="180">
			<h6 ##9 class="mb-0 font-weight-bold translatable" id="card_name_##1" data-text-id="c_group_fld_nm_##1">##2</h6>
			<p class="mb-0"></p>
			<p class="h5 font-weight-bold mb-3 translatable" data-text-id="c_group_fld_num_online_##1">##4 ##7</p>
			<button class="btn btn-rounded btn-outline-primary translatable" id="card_btn_##1" 
					data-grp-type="##3"
					data-grp-name="##2"
					data-grp-id="##5"
					data-grp-owner="##6"
					data-grp-dt="##8"
			        data-text-id="c_group_fld_btn_enter">join</button>
		</div>
	</div>
  </div>
`;

function cutShort(length, str) {
	return str.substring(0, length);
}

function getGroupCardHtml(groupInfo) {
	let htmlCard = GROUP_CARD_TEMPLATE;
	const btnAttrId = `#card_btn_${groupInfo.id}`;
	
	// alert for the class is it starts within 8 hours 
	let colorStyle = "";
	let inMinutes = 0;
	let inHours = 0;
	if (groupInfo.dt) {
		const startTime = new Date(Number(groupInfo.dt));
		const diffInMin = TimeUtil.diffMinutes(Date.now(), startTime);
		if (diffInMin > 0 && diffInMin  < 8 * 60) {
			colorStyle = alertColorStyle;
			inHours = Math.floor(diffInMin / 60);
			inMinutes = diffInMin % 60;
		}
	}
	htmlCard = 	htmlCard.replace(new RegExp(`##1`, 'g'), groupInfo.id)
						.replace(new RegExp(`##2`, 'g'), groupInfo.name)
						.replace(new RegExp(`##3`, 'g'), groupInfo.type)
						.replace('##4', groupInfo.displayDate ?? 'Any day')
						.replace('##7', groupInfo.displayTime ?? 'Any time')
						.replace(new RegExp(`##5`, 'g'), groupInfo.id)
						.replace(new RegExp(`##6`, 'g'), groupInfo.owner)
						.replace('##8', groupInfo.dt ?? "")
						.replace('##9', colorStyle)
						.replace('##10', inHours )
						.replace('##11', inMinutes);
	return  {buttonId: btnAttrId, html: htmlCard};
}

export {getGroupCardHtml};
						
