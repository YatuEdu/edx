import {UserTextQuestion}					   	from './q_text.js'
import {UserFormatterText}					   	from './q_formatter_text.js'
import {UserIntegerQuestionText} 				from './q_integer.js'
import {UserDropdownSelection}  			   	from './q_dropDown.js'
import {UserCompositeControl}				   	from './q_composite_control.js'
import {UserBeneficiaryControl}				   	from './q_beneficiary.js'
import {UserCompositeControlWithTwoDropdowns}  	from './q_composite_control_with_two_dropdowns.js'
import {InsuranceInfoComponentDynList}			from './q_insuranceInfo_component_dyn_list.js'
import {MetaDataManager}						from './metaDataManager.js'
import {StringUtil}		  						from './util.js';
import {Net}          							from './net.js';
import {credMan}      							from './credManFinMind.js'

const DEFAULT_NO_BENEFICIARY = 1;
const DEFAULT_NO_CONTINGENT_BENEFICIARY = 0;
	
/*
	COMPONENT FACTORY FOR text field control
*/
class UIComponentFactory {
	/*
		Create regex powered text input control according to its
		type.
	*/
	static createTextField(qInfo) {
		let regex = null;
		let formatter = null;
		let numberOnly = false;
		
		if (qInfo.attr_name ==='app_email') {
			// email regex
			regex = MetaDataManager.regForeEmail; 
		} 
		else if (qInfo.attr_name ==='app_phone') {
			// us phone number regex
			regex = MetaDataManager.regForUSPhoneNumber; 
			formatter = StringUtil.formatUSPhoneNumber;
			numberOnly = true;
		}
		else if (qInfo.attr_name.indexOf('ssn') >= 0) {
			// us ssn regex
			regex = MetaDataManager.regForSSN
			formatter = StringUtil.formatSocialSecurity;
			numberOnly = true;
		}
		else {
			// reg for everything
			regex = null;
		}
		
		if (!formatter) {
			return new UserTextQuestion(qInfo, regex);
		}
		
		// formatter text input
		return new UserFormatterText(qInfo, numberOnly, regex, formatter);
	}
	
	/**
		A composition control consists of two or more instances of defined 'UserQuestionBase' object
	**/
	static createCompositionControl(qInfo) {
		// multiple labels extraction:
		const labels = qInfo.attr_label.split('*');

		// composite control for driver lic - state
		if (qInfo.attr_name ==='app_driver_lic') {
			const components = [];
			
			// create lic text input:
			//		partial qinfo contains label is enough because it is a sub-control
			const subqInfo = {attr_id: qInfo.attr_id, attr_label: labels[0], sv1: qInfo.sv1};
			const regex = MetaDataManager.regForEverything;
			const com1 = new UserTextQuestion(subqInfo, regex);
			components.push(com1);
			
			
			// create state drop down list:
			//		partial qinfo contains label is enough because it is a sub-control
			const STATE_ENUM_ID = 26;
			const subqInfo2 = {attr_id: qInfo.attr_id, attr_label: labels[1], sv1: qInfo.sv2};
			const com2 = new UserDropdownSelection(subqInfo2, MetaDataManager.enumMap.get(STATE_ENUM_ID), true);
			components.push(com2);
			
			// now create composite control
			return new UserCompositeControl(qInfo, components);
		} 
		
		// composite control for birth contry - state if us
		if (qInfo.attr_name ==='app_country_of_birth') {
			const components = [];
			
			// create lic text input:
			//		partial qinfo contains label is enough because it is a sub-control
			const subqInfo = {attr_id: qInfo.attr_id, attr_label: labels[0], sv1: qInfo.sv1};
			const regex = MetaDataManager.regForEverything;
			const COUNTRY_ENUM_ID = 30;
			const com1 = new UserDropdownSelection(subqInfo, MetaDataManager.enumMap.get(COUNTRY_ENUM_ID), 0);
			components.push(com1);
			
			
			// create state drop down list:
			//		partial qinfo contains label is enough because it is a sub-control
			// Note: since the 2nd DROPDOWN LIST has the same attribute id and this will not work.  We 
			//       append an extra index number at the end (_2)
			const subqInfo2 = {attr_id: qInfo.attr_id + "_2", attr_label: labels[1], sv1: qInfo.sv2};
			const STATE_ENUM_ID = 26;
			const com2 = new UserDropdownSelection(subqInfo2, MetaDataManager.enumMap.get(STATE_ENUM_ID), 1);
			components.push(com2);
			
			// now create composite control
			return new UserCompositeControlWithTwoDropdowns(qInfo, components, 'United States');
		}
		
		// composite control for 'employment"
		if (qInfo.attr_name ==='app_employment') {
			const components = [];
			
			// create empolyer input:
			//		partial qinfo contains label is enough because it is a sub-control
			const subqInfo = {attr_id: qInfo.attr_id, attr_label: labels[0], sv1: qInfo.sv1};
			const regex = null;
			const com1 = new UserTextQuestion(subqInfo, regex);
			components.push(com1);
			
			
			// create duty:
			//		partial qinfo contains label is enough because it is a sub-control
			// Note: since the 2nd text field has the same attribute id and this will not work.  We 
			//       append an extra index number at the end (_2)			
			const subqInfo2 = {attr_id: qInfo.attr_id + "_2", attr_label: labels[1], sv1: qInfo.sv2};
			const com2 = new UserTextQuestion(subqInfo2, regex);
			components.push(com2);
			
			// now create composite control
			return new UserCompositeControl(qInfo, components);
		}
		
		// composite control for 'employment details"
		if (qInfo.attr_name ==='app_employment_details') {
			const components = [];
			
			// create empolyer input:
			//		partial qinfo contains label is enough because it is a sub-control
			const subqInfo = {attr_id: qInfo.attr_id, attr_label: labels[0], sv1: qInfo.sv1};
			const regex =null;
			const com1 = new UserTextQuestion(subqInfo, regex);
			components.push(com1);		
			
			// create duty:
			//		partial qinfo contains label is enough because it is a sub-control
			// Note: since the 2nd text field has the same attribute id and this will not work.  We 
			//       append an extra index number at the end (_2)
			const subqInfo2 = {attr_id: qInfo.attr_id + "_2", attr_label: labels[1], sv1: qInfo.sv2};
			const com2 = new UserTextQuestion(subqInfo2, regex);
			components.push(com2);
			
			// now create composite control
			return new UserCompositeControl(qInfo, components);
		}
	}
		
	/*
		Create beneficary complex control 
	*/
	
	static async createBeneficiaryControl(appId, qInfo, isContingent) {
		
		// get benificary info from server
		let beneficiaryList = null;
		let minimum = 1;
		let defaultNo = DEFAULT_NO_BENEFICIARY;
		if (isContingent) {
			minimum = 0;
			defaultNo = DEFAULT_NO_CONTINGENT_BENEFICIARY;
			beneficiaryList = await Net.getContingentBeneficiaryInfo(appId, credMan.credential.token);
		}
		else {
			beneficiaryList = await Net.getBeneficiaryInfo(appId, credMan.credential.token);
		}
		// 
		return new UserBeneficiaryControl(qInfo, beneficiaryList.data, defaultNo, minimum);
	}
	
	/*
		Create Existing Isurance Composite Control
	*/
	static async createExistingIsuranceControl(appId, qInfo) {
		// get benificary info from server
		const insList = await Net.getEixstingInsuranceInfo(appId, credMan.credential.token);
		return new InsuranceInfoComponentDynList(qInfo, insList.data, 1, 0, ['Name', 'Policy Number', 'Replace', 'Action']);
	}
}

export {UIComponentFactory};