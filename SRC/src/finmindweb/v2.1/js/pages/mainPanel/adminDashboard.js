import {sysConstants} from '../../core/sysConst.js'
import {credMan} from '../../core/credManFinMind.js'
import {Net} from "../../core/net.js";
import {UIUtil} from "../../core/uiUtil.js";

const pageTemplate = `
<div class="card h-100 border-0 rounded-0">
	<div class="card-header d-flex align-items-center bg-white p-4 border-0">
		<h5 class="m-0">Dashboard</h5>
		<div class="ms-auto d-flex align-items-center">
			<ul class="nav nav-pills fs-8 me-3 rounded-1" id="M-Y" role="tablist" style="border:1px solid rgba(31, 21, 52, 0.2);">
				<li class="nav-item" role="presentation">
					<a class="nav-link py-1 px-2 rounded-1  active" id="year1" data-bs-toggle="pill" href="#" role="tab" aria-selected="true">1Y</a>
				</li>
				<li class="nav-item" role="presentation">
					<a class="nav-link py-1 px-2 rounded-1" id="year10" data-bs-toggle="pill" href="#" role="tab" aria-selected="false">10Y</a>
				</li>
			</ul>
			<div class="input-group w-auto">
				<input type="text" class="form-control form-control-sm border-end-0" style="width: 4.75rem;border-color: rgba(31, 21, 52, 0.2);" id="chartDate" lay-key="1">
				<span class="input-group-text bg-transparent" style="border-color: rgba(31, 21, 52, 0.2);">
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M1.5 2.784c0-.433.351-.784.784-.784h7.433c.432 0 .783.35.783.784v7.432c0 .433-.35.784-.783.784H2.284a.784.784 0 0 1-.784-.784V2.784z" stroke="#458FF6" stroke-width=".784" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 1v2M4 1v2M1.5 5h9" stroke="#458FF6" stroke-width=".784" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</span>
			</div>
			<div class="mx-4">
				<span class="text-secondary">Updated at: </span><span id="updatedTime"></span>
			</div>
			<button type="button" class="btn text-primary" id="refreshBtn">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.01 6.232h3v-3" stroke="#1871FF" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.111 4.11a5.5 5.5 0 0 1 7.778 0l2.122 2.122M4.99 9.768h-3v3" stroke="#1871FF" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.889 11.89a5.498 5.498 0 0 1-7.778 0L1.989 9.767" stroke="#1871FF" stroke-linecap="round" stroke-linejoin="round"/></svg>
			\tRefresh
			</button>
		</div>
	</div>
	<div class="card-body px-4 py-0 position-relative overflow-auto" style="height: 0;">
		<div class="row py-1">
			<div class="col-6">
				<div class="position-relative">
					<div id="Chart-CreatedApplications" class="w-100 shadow-sm" style="height: 330px;"></div>
					<div class="position-absolute fw-bold" style="top: 15px;left: 15px;font-size: 13px;">
					\tCreated Applications
						<span  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Created Applications">
							<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M6 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 4.5v2" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="6" cy="8.5" rx=".5" ry=".5" fill="#1F1534" fill-opacity=".5"/></svg>
						</span>
					</div>
				</div>
			</div>
			<div class="col-6">
				<div class="position-relative">
					<div id="Chart-CompletedApplications" class="w-100 shadow-sm" style="height: 330px;"></div>
					<div class="position-absolute fw-bold" style="top: 15px;left: 15px;font-size: 13px;">
					\tCompleted Applications
						<span  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Completed Applications">
							<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M6 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 4.5v2" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="6" cy="8.5" rx=".5" ry=".5" fill="#1F1534" fill-opacity=".5"/></svg>
						</span>
					</div>
				</div>
			</div>
			<div class="col-5 pt-4">
				<div class="position-relative">
					<div id="Chart-TotalAmountOfMoney" class="w-100 shadow-sm" style="height: 330px;"></div>
					<div class="position-absolute fw-bold" style="top: 15px;left: 15px;font-size: 13px;">
						Total Amount of Money
						<span  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Total Amount of Money">
							<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M6 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 4.5v2" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="6" cy="8.5" rx=".5" ry=".5" fill="#1F1534" fill-opacity=".5"/></svg>
						</span>
					</div>
				</div>
			</div>
			<div class="col-7 pt-4">
				<div class="row">
					<div class="col-4">
						<div class="position-relative">
							<div id="Chart-ApplicationMoney" class="w-100 shadow-sm" style="height: 330px;"></div>
							<div class="position-absolute fw-bold" style="top: 15px;left: 15px;font-size: 13px;">
								Application Money
								<span  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Application Money">
									<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M6 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 4.5v2" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="6" cy="8.5" rx=".5" ry=".5" fill="#1F1534" fill-opacity=".5"/></svg>
								</span>
							</div>
							<div class="position-absolute text-center top-50 start-50 translate-middle">
								<div class="fs-8 text-secondary">Total</div>
								<h5 class="my-1">824,213</h5>
								<div class="fs-8 text-primary">USD</div>
							</div>
						</div>
					</div>
					<div class="col-4">
						<div class="position-relative">
							<div id="Chart-ApplicantAge" class="w-100 shadow-sm" style="height: 330px;"></div>
							<div class="position-absolute fw-bold" style="top: 15px;left: 15px;font-size: 13px;">
								Applicant Age
								<span  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Applicant Age">
									<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M6 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 4.5v2" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="6" cy="8.5" rx=".5" ry=".5" fill="#1F1534" fill-opacity=".5"/></svg>
								</span>
							</div>
							<div class="position-absolute text-center top-50 start-50 translate-middle">
								<div class="fs-8 text-secondary">Total</div>
								<h5 class="my-1">32</h5>
								<div class="fs-8 text-primary">Applicant</div>
							</div>
						</div>
					</div>
					<div class="col-4">
						<div class="position-relative">
							<div id="Chart-RequestedProduct" class="w-100 shadow-sm" style="height: 330px;"></div>
							<div class="position-absolute fw-bold" style="top: 15px;left: 15px;font-size: 13px;">
								Requested Product
								<span  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Requested Product">
									<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M6 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 4.5v2" stroke="#1F1534" stroke-opacity=".5" stroke-width="1.008" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="6" cy="8.5" rx=".5" ry=".5" fill="#1F1534" fill-opacity=".5"/></svg>
								</span>
							</div>
							<div class="position-absolute text-center top-50 start-50 translate-middle">
								<div class="fs-8 text-secondary">Total</div>
								<h5 class="my-1">32</h5>
								<div class="fs-8 text-primary">Applicant</div>
							</div>
						</div>
					</div>
				</div>
			</div>
							
		</div>
	</div>
</div>
`;

class AdminDashboard {
	#container;

    constructor(container) {
		this.#container = container;
		this.init();
	}

	// hook up events
	async init() {
		this.#container.empty();
		this.#container.append(pageTemplate);
		console.log('producerDashboard init');
		$('#chartDate').val(new Date().getFullYear());
		let that = this;
		laydate.render({
			elem: '#chartDate'
			,lang: 'en'
			,type: 'year'
			,change: function (value) { //监听日期被切换
				that.draw(value);
			}
		});

		$('#year1').click(e => {
			$('#chartDate').prop('disabled',false);
			let year = $('#chartDate').val();
			this.draw(year);
		});

		$('#year10').click(e => {
			$('#chartDate').prop('disabled',true);
			this.draw();
		});

		$('#refreshBtn').click(e => {
			if ($('#year1').hasClass('active')) {
				let year = $('#chartDate').val();
				that.draw(year);
			} else {
				that.draw();
			}
		});

		let year = $('#chartDate').val();
		this.draw(year);
	}

	async draw(year) {
		let from;
		let to;
		if (year==null) {
			// 10 years
			let currYear = new Date().getFullYear();
			from = (currYear-9)+'-01-01';
			to = currYear+'-12-31';
		} else {
			from = year+'-01-01';
			to = year+'-12-31';
		}

		let xs = this.genXSeries(from, to);

		let ret = await Net.statisticsCreatedApplications(credMan.credential.token, from, to);
		let valueMap = new Map();
		for(let data of ret.data) {
			valueMap.set(data.start_date, data.count);
		}
		this.drawLineSeries($('#Chart-CreatedApplications'), xs, valueMap, 'Applications');


		ret = await Net.statisticsCompletedApplications(credMan.credential.token, from, to);
		valueMap = new Map();
		for(let data of ret.data) {
			valueMap.set(data.start_date, data.count);
		}
		this.drawLineSeries($('#Chart-CompletedApplications'), xs, valueMap, 'Applications');

		ret = await Net.statisticsTotalAmountMoney(credMan.credential.token, from, to);
		valueMap = new Map();
		for(let data of ret.data) {
			let startDate = data.start_date;
			let coverageAmount = data.coverage_amount;
			if (startDate!=null && coverageAmount!=null) {
				valueMap.set(startDate, coverageAmount);
			}
		}
		this.drawLineSeries($('#Chart-TotalAmountOfMoney'), xs, valueMap, 'USD');

		this.drawPieCharts($('#Chart-ApplicationMoney'), xs, valueMap, 'USD');
		this.drawPieCharts($('#Chart-ApplicantAge'), xs, valueMap, 'USD');
		this.drawPieCharts($('#Chart-RequestedProduct'), xs, valueMap, 'USD');

		$('#updatedTime').text(moment(new Date()).format('YYYY/MM/DD HH:mm:ss'));

	}

	drawLineSeries(chart, xs, valueMap, valueName) {
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

export {AdminDashboard}
