import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Net} from "../../core/net.js";
import {UIUtil} from "../../core/uiUtil.js";

const pageTemplate = `
<div class="card h-100 border-0 rounded-0">
	<div class="card-header d-flex align-items-center bg-white p-4 border-0">
		<h5 class="m-0">Dashboard</h5>
		<div class="ms-auto d-flex align-items-center">
			<div class="mx-4">
				<span class="text-secondary">Updated at: </span><span id="updatedTime">2021-06-18 08:24:59</span>
			</div>
			<button type="button" class="btn text-primary" id="btnRefresh">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.01 6.232h3v-3" stroke="#1871FF" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.111 4.11a5.5 5.5 0 0 1 7.778 0l2.122 2.122M4.99 9.768h-3v3" stroke="#1871FF" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.889 11.89a5.498 5.498 0 0 1-7.778 0L1.989 9.767" stroke="#1871FF" stroke-linecap="round" stroke-linejoin="round"/></svg>
				Refresh
			</button>
		</div>
	</div>
	<div id="list" class="card-body px-4 py-0 position-relative overflow-auto" style="height: 0;">		
	</div>
</div>
`;

const rowTemplate = `
<div id="{id}" class="row py-1 mb-4">
  <div class="col-3 fw-bold">
    <h6 class="mt-3 mb-4">{productName}</h6>
    <div class="mb-4">
      <div class="fs-7 text-secondary">Insured Name:</div>
      <p class="fs-8">{insuredName}</p></div>
    <div class="mb-4">
      <div class="fs-7 text-secondary">Insurer:</div>
      <p class="fs-8">{insurer}</p></div>
    <div class="mb-4">
      <div class="fs-7 text-secondary">Coverage:</div>
      <p class="fs-8">{coverage}</p></div>
    <div class="mb-4">
      <div class="fs-7 text-secondary">Start Date:</div>
      <p class="fs-8">{startDate}</p></div>
  </div>
  <div class="col-9">
    <div class="row chartRow">
    </div>
  </div>
</div>
`;

const chartTemplate = `
<div class="col-6">
	<div class="position-relative">
	  <div class="w-100 shadow-sm chartDiv" style="height: 330px;"></div>
	  <div class="position-absolute fw-bold" style="top: 15px;left: 15px;font-size: 13px;">{chartName}
		<span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Cash Value">
		  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path clip-rule="evenodd" d="M6 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round" />
			<path d="M6 4.5v2" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round" />
			<ellipse cx="6" cy="8.5" rx=".5" ry=".5" fill="#1F1534" fill-opacity=".5" /></svg></span>
		<div class="input-group d-inline-flex w-auto ms-3">
		  <ul class="nav nav-pills fs-8 me-3 rounded-1" id="M-Y" role="tablist" style="border:1px solid rgba(31, 21, 52, 0.2);">
			<li class="nav-item" role="presentation">
			  <a class="nav-link py-1 px-2 rounded-1 year10 active" data-bs-toggle="pill" href="#" role="tab" aria-selected="true">10Y</a></li>
			<li class="nav-item" role="presentation">
			  <a class="nav-link py-1 px-2 rounded-1 yearAll" data-bs-toggle="pill" href="#" role="tab" aria-selected="false">All</a></li>
		  </ul>
		</div>
	  </div>
	</div>
</div>
`;

const noCashValueTemplate = `
<div class="col-6">
	<div class="position-relative">
	  <div id="" class="w-100 shadow-sm" style="height: 330px;">
		<div class="d-flex flex-column justify-content-center align-items-center pt-5 h-100">
		  <div class="pt-3">
			<img src="../img/bg-rocket.svg" class="img-fluid"></div>
		  <p class="text-center fs-8 text-secondary mt-3">No cash value these years :)</p></div>
	  </div>
	  <div class="position-absolute fw-bold" style="top: 15px;left: 15px;font-size: 13px;">Cash Value
		<span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Cash Value">
		  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path clip-rule="evenodd" d="M6 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round" />
			<path d="M6 4.5v2" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round" />
			<ellipse cx="6" cy="8.5" rx=".5" ry=".5" fill="#1F1534" fill-opacity=".5" /></svg></span>
		<div class="input-group d-inline-flex w-auto ms-3">
		  <input type="text" class="form-control form-control-sm border-end-0" style="width: 3.5rem;border-color: rgba(31, 21, 52, 0.2);" id="ChartDate-1" lay-key="1" value="2022">
		  <span class="input-group-text bg-transparent" style="border-color: rgba(31, 21, 52, 0.2);">
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			  <path clip-rule="evenodd" d="M1.5 2.784c0-.433.351-.784.784-.784h7.433c.432 0 .783.35.783.784v7.432c0 .433-.35.784-.783.784H2.284a.784.784 0 0 1-.784-.784V2.784z" stroke="#458FF6" stroke-width=".784" stroke-linecap="round" stroke-linejoin="round" />
			  <path d="M8 1v2M4 1v2M1.5 5h9" stroke="#458FF6" stroke-width=".784" stroke-linecap="round" stroke-linejoin="round" /></svg>
		  </span>
		</div>
	  </div>
	</div>
</div>
`;

const flatDeathBenefitTemplate = `
<div class="col-6">
<div class="position-relative">
  <div id="" class="w-100 shadow-sm" style="height: 330px;">
	<div class="d-flex flex-column justify-content-center align-items-center h-100">
	  <h6 class="pt-5">Flat death benefit: xxx</h6>
	  <div class="pt-3 text-center">
		<img src="../img/bg-deathbenefit.png" class="w-50"></div>
	</div>
  </div>
  <div class="position-absolute fw-bold" style="top: 15px;left: 15px;font-size: 13px;">Death Benefit
	<span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Death Benefit">
	  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path clip-rule="evenodd" d="M6 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M6 4.5v2" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round" />
		<ellipse cx="6" cy="8.5" rx=".5" ry=".5" fill="#1F1534" fill-opacity=".5" /></svg></span>
	<div class="input-group d-inline-flex w-auto ms-3">
	  <input type="text" class="form-control form-control-sm border-end-0" style="width: 3.5rem;border-color: rgba(31, 21, 52, 0.2);" id="ChartDate-1" lay-key="1" value="2022">
	  <span class="input-group-text bg-transparent" style="border-color: rgba(31, 21, 52, 0.2);">
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
		  <path clip-rule="evenodd" d="M1.5 2.784c0-.433.351-.784.784-.784h7.433c.432 0 .783.35.783.784v7.432c0 .433-.35.784-.783.784H2.284a.784.784 0 0 1-.784-.784V2.784z" stroke="#458FF6" stroke-width=".784" stroke-linecap="round" stroke-linejoin="round" />
		  <path d="M8 1v2M4 1v2M1.5 5h9" stroke="#458FF6" stroke-width=".784" stroke-linecap="round" stroke-linejoin="round" /></svg>
	  </span>
	</div>
  </div>
</div>
</div>
`;

class MyDashboard {
	#container;
	#cashValueMap = new Map();
	#deathBenefitMap = new Map();

    constructor(container) {
		this.#container = container;
		this.init();
	}

	// hook up events
	async init() {
		this.#container.empty();
		this.#container.append(pageTemplate);
		console.log('producerDashboard init');

		laydate.render({
			elem: '.chartDate'
			,lang: 'en'
			,type: 'year'
		});

		await this.draw(false);

		$('#btnRefresh').click
	}

	async draw(isAll) {

		let ret = await Net.userInsurancePolicyGetAll(credMan.credential.token);
		if (ret.data.length > 0) {
			for(let data of ret.data) {
				$('#list').append(rowTemplate
					.replace('{id}', data.id)
					.replace('{productName}', data.product_name)
					.replace('{insuredName}', data.insured_name)
					.replace('{insurer}', '')
					.replace('{coverage}', data.coverage_amount)
					.replace('{startDate}', data.effective_date)
				);

				let chartRow = $('#'+data.id).find('.chartRow');

				if (data.details!=null) {
					let chartCashValue = $(chartTemplate.replace('{chartName}', 'Cash Value'));
					chartRow.append(chartCashValue);
					let chartDeathBenefit = $(chartTemplate.replace('{chartName}', 'Death Benefit'));
					chartRow.append(chartDeathBenefit);
					let rows = data.details.split(',');
					let valueMapCashValue = new Map();
					let valueMapDeathBenefit = new Map();
					for(let row of rows) {
						let cols = row.split('|');
						valueMapCashValue.set(cols[0], cols[1]);
						valueMapDeathBenefit.set(cols[0], cols[2]);
					}
					this.#cashValueMap.set(data.id, valueMapCashValue);
					this.#deathBenefitMap.set(data.id, valueMapDeathBenefit);

					this.drawLineSeries(chartCashValue.find('.chartDiv'), isAll, valueMapCashValue, 'USD');
					this.drawLineSeries(chartDeathBenefit.find('.chartDiv'), isAll, valueMapDeathBenefit, 'USD');

					// 切换处理
					// let div = $('#'+data.id).find('.cashValue');
					this.chartDurationSwitch(chartCashValue, valueMapCashValue);
					// let div2 = $('#'+data.id).find('.deathBenefit');
					this.chartDurationSwitch(chartDeathBenefit, valueMapDeathBenefit);

				} else {
					let chartCashValue = $(noCashValueTemplate);
					chartRow.append(chartCashValue);
					let chartDeathBenefit = $(flatDeathBenefitTemplate);
					chartRow.append(chartDeathBenefit);
				}

			}
		} else {
			$('#list').append('You don\'t have any data with us currently.\n');
		}
		$('#updatedTime').text(moment(new Date()).format('YYYY/MM/DD HH:mm:ss'));

	}

	chartDurationSwitch(div, valueMapCashValue) {
		let year10Btn = $(div).find('.year10');
		let yearAllBtn = $(div).find('.yearAll');
		let chartDiv = div.find('.chartDiv');
		year10Btn.click(e => {
			this.drawLineSeries(chartDiv, false, valueMapCashValue, 'USD');
		});
		yearAllBtn.click(e => {
			this.drawLineSeries(chartDiv, true, valueMapCashValue, 'USD');
		});
	}

	drawLineSeries(chart, isAll, valueMap, valueName) {

		let xs = new Array();
		if (isAll) {
			// show all years
			// first find the earliest year
			let earliestYear = new Date().getFullYear();
			for (let key of valueMap.keys()) {
				if (key < earliestYear) earliestYear = key;
			}
			for(let i=0; i<=new Date().getFullYear()-earliestYear; i++) {
				xs[xs.length] = (parseInt(earliestYear) + i)+'';
			}
		} else {
			// just show 10 years
			for(let i=0; i<10; i++) {
				xs[xs.length] = (new Date().getFullYear() - 10 + 1 + i)+'';
			}
		}
		let values = new Array();
		for(let m of xs) {
			let v = valueMap.get(m);
			if (v!=null) {
				values[values.length] = v;
			} else {
				values[values.length] = 0;
			}
		}
		UIUtil.drawLineSeries(chart, xs, values, valueName);
	}

	drawPieCharts(chart, xs, valueMap, valueName) {
		let values = new Array();
		for(let m of xs) {
			let v = valueMap.get(m);
			if (v!=null) {
				values[values.length] = v;
			} else {
				values[values.length] = 0;
			}
		}
		UIUtil.drawPieCharts(chart, xs, values, valueName);
	}

	genXSeries(from, to) {
		let startDate = new Date(from);
		let endDate = new Date(to);
		let currDate = startDate;
		let dates = new Array();
		for(;currDate<endDate;) {
			let date = new Date(currDate);
			dates[dates.length] = date.getFullYear() + '-' + this.appendZero(date.getMonth()+1);
			currDate.setMonth(currDate.getMonth() + 1);
		}
		return dates;
	}
	appendZero(obj) {
		if(obj<10) return "0" +""+ obj;
		else return obj;
	}


}

export {MyDashboard}
