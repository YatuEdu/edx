// template parameter:
//  0 - group id
//  1 - image file name
//	2 - 
const GROUP_CARD_TEMPLATE = `
 <div id="card_div##1"  class="col-sm-6 col-lg-4 py-3 group-card">
	<div class="card h-100">
		<div class="card-body text-center">
			<img src="assets/images/dynamic/group_##1.png" class="img-fluid py-1 my-4" alt="Product 2" height="180">
			<h6 class="mb-0 font-weight-bold translatable" id="card_name_##1" data-text-id="c_group_fld_nm_##1">##2</h6>
			<p class="mb-0"></p>
			<p class="h5 font-weight-bold mb-3 translatable" data-text-id="c_group_fld_num_online_##1">（##4）人在线</p>
			<button class="btn btn-rounded btn-outline-primary translatable" id="card_btn_##1" 
					data-grp-type="##3"
					data-grp-name="##2"
					data-grp-id="##5"
					data-grp-owner="##6"
			        data-text-id="c_group_fld_btn_enter">进入</button>
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
	htmlCard = 	htmlCard.replace(new RegExp(`##1`, 'g'), groupInfo.id)
						.replace(new RegExp(`##2`, 'g'), groupInfo.name)
						.replace(new RegExp(`##3`, 'g'), groupInfo.type)
						.replace(new RegExp(`##4`, 'g'), 1)
						.replace(new RegExp(`##5`, 'g'), groupInfo.id)
						.replace(new RegExp(`##6`, 'g'), groupInfo.owner);
	return  {buttonId: btnAttrId, html: htmlCard};
}

export {getGroupCardHtml};
						
