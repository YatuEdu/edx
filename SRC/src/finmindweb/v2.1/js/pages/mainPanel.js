import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'
import {MyApplication} from './mainPanel/myApplication.js'
import {MyInsurancePolicies} from './mainPanel/myInsurancePolicies.js'
import {MyProfile} from './mainPanel/myProfile.js'
import {ProducerDashboard} from './mainPanel/producerDashboard.js'
import {Clients} from './mainPanel/clients.js'
import {Applications} from './mainPanel/applications.js'
import {InsurancePolicies} from './mainPanel/insurancePolicies.js'
import {AdminDashboard} from './mainPanel/adminDashboard.js'
import {People} from './mainPanel/people.js'
import {AllApplications} from './mainPanel/allApplications.js'
import {AllInsurancePolicies} from './mainPanel/allInsurancePolicies.js'
import {ChangeLogs} from './mainPanel/changeLogs.js'
import {MyInquiries} from './mainPanel/myInquiries.js'
import {AllInquiries} from './mainPanel/allInquiries.js'
import {InsurancePolicyDetails} from "./mainPanel/insurancePolicyDetails.js";
import {MyDashboard} from "./mainPanel/myDashboard.js";

const page_template = `
<div class="container-fluid position-fixed start-0 end-0 bottom-0 p-0" style="top: 6rem;">
    <div class="row h-100 g-0">
        <div class="col-2 bg-white">
            <div class="events-sidebar">
                <ul id="menu" class="list-unstyled px-2 py-3">
                </ul>
            </div>

        </div>
        <div class="col-10 bg-white" id="subMainPageContainer" style="border: 11px solid #FAFCFF;">

        </div>
    </div>
</div>
`;

const menu_me = `
<li class="my-2">
	<div class="px-3 text-body text-opacity-50 fs-8 pb-2">Me</div>
</li>
<li class="my-2">
	<a class="fm-sw" href="#myDashboard">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 4.375c1.68 0 3.258.442 4.622 1.217l-.922.922a8.125 8.125 0 0 0-11.82 6.944l-.005.292H.625A9.375 9.375 0 0 1 10 4.375zm8.125 9.375a8.09 8.09 0 0 0-.89-3.7l.923-.923a9.325 9.325 0 0 1 1.212 4.32l.005.303h-1.25zm.271-7.513l-.884-.884-7.954 7.955.883.884 7.955-7.955z" fill="#1F232E"/></svg>My Dashboard
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#myApplication">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.118 5.312L10.585.963c-.362-.21-.809-.21-1.172 0L1.88 5.313v8.698c0 .419.224.805.586 1.015L10 19.375l7.533-4.35c.363-.209.586-.595.586-1.014V5.312zm-8.12 3.965L3.755 5.673l6.244-3.606 6.245 3.606-6.246 3.604zm.626 1.084l6.244-3.605v7.209l-6.244 3.604v-7.208zm-1.25 0L3.13 6.755v7.21l6.245 3.604v-7.208z" fill="#1F232E"/></svg>My Applications
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#myInsurancePolicies">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.375 1.875V6.25h1.25V1.875h-1.25zM7.79 6.906L3.37 2.487l-.884.884 4.42 4.42.884-.885zm4.42 0l4.419-4.419.883.884-4.419 4.42-.884-.885zM11.25 10a1.25 1.25 0 0 1-2.333.625H1.875v-1.25h7.042a1.25 1.25 0 0 1 2.332.625zm-4.344 2.21l-4.42 4.42.884.883 4.42-4.42-.884-.883zm6.187 0l4.42 4.42-.884.883-4.42-4.42.884-.883zm5.032-2.835h-4.376v1.25h4.376v-1.25zm-8.75 8.75V13.75h1.25v4.375h-1.25z" fill="#1F232E"/></svg>My Insurance Policies
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#myProfile">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.75 10a8.75 8.75 0 1 0-17.5 0 8.75 8.75 0 0 0 17.5 0zM5.125 15.7a7.47 7.47 0 0 0 4.513 1.791L10 17.5a7.467 7.467 0 0 0 4.84-1.77l.086-.079-.01-.042a2.502 2.502 0 0 0-2.225-1.852l-.192-.007h-5a2.508 2.508 0 0 0-2.394 1.757l-.038.142.058.051zm7.374-3.2a3.75 3.75 0 0 1 3.39 2.144 7.5 7.5 0 1 0-11.78 0A3.75 3.75 0 0 1 7.5 12.5h5zM10 3.75a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5zM10 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" fill="#1F232E" opacity=".9"/></svg>My Profile
	</a>
</li>
`;

const menu_clients = `
<li class="my-2">
	<div class="px-3 text-body text-opacity-50 fs-8 pt-4 pb-2">Client Management</div>
</li>
<li class="my-2">
	<a class="fm-sw" href="#producerDashboard">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 4.375c1.68 0 3.258.442 4.622 1.217l-.922.922a8.125 8.125 0 0 0-11.82 6.944l-.005.292H.625A9.375 9.375 0 0 1 10 4.375zm8.125 9.375a8.09 8.09 0 0 0-.89-3.7l.923-.923a9.325 9.325 0 0 1 1.212 4.32l.005.303h-1.25zm.271-7.513l-.884-.884-7.954 7.955.883.884 7.955-7.955z" fill="#1F232E"/></svg>Producer Dashboard
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#clients">
		<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="#1F232E" fill-rule="nonzero"><path d="M10 7.187a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm0 1.25a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM15.312 8.438a5.305 5.305 0 0 1 4.25 2.125.625.625 0 0 1-1 .75 4.056 4.056 0 0 0-3.25-1.625.625.625 0 0 1 0-1.25zM4.688 8.438a.625.625 0 0 1-.001 1.25 4.055 4.055 0 0 0-3.25 1.624.625.625 0 0 1-1-.749 5.305 5.305 0 0 1 4.25-2.125z"/><path d="M10 13.437a5.627 5.627 0 0 1 5.059 3.164.625.625 0 1 1-1.124.547 4.377 4.377 0 0 0-7.87 0 .625.625 0 0 1-1.125-.547A5.627 5.627 0 0 1 10 13.437zM3.721 3.59a3.125 3.125 0 0 1 4.036 2.385.625.625 0 1 1-1.228.235A1.875 1.875 0 1 0 4.51 8.429l.177.008a.625.625 0 0 1 0 1.25 3.125 3.125 0 0 1-.966-6.097zM14.535 3.535a3.125 3.125 0 1 1 .777 6.153.625.625 0 1 1 0-1.25A1.875 1.875 0 1 0 13.47 6.21a.625.625 0 1 1-1.228-.234 3.125 3.125 0 0 1 2.293-2.44z"/></g></svg>Clients
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#applications">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.118 5.312L10.585.963c-.362-.21-.809-.21-1.172 0L1.88 5.313v8.698c0 .419.224.805.586 1.015L10 19.375l7.533-4.35c.363-.209.586-.595.586-1.014V5.312zm-8.12 3.965L3.755 5.673l6.244-3.606 6.245 3.606-6.246 3.604zm.626 1.084l6.244-3.605v7.209l-6.244 3.604v-7.208zm-1.25 0L3.13 6.755v7.21l6.245 3.604v-7.208z" fill="#1F232E"/></svg>Applications
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#insurancePolicies">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.375 1.875V6.25h1.25V1.875h-1.25zM7.79 6.906L3.37 2.487l-.884.884 4.42 4.42.884-.885zm4.42 0l4.419-4.419.883.884-4.419 4.42-.884-.885zM11.25 10a1.25 1.25 0 0 1-2.333.625H1.875v-1.25h7.042a1.25 1.25 0 0 1 2.332.625zm-4.344 2.21l-4.42 4.42.884.883 4.42-4.42-.884-.883zm6.187 0l4.42 4.42-.884.883-4.42-4.42.884-.883zm5.032-2.835h-4.376v1.25h4.376v-1.25zm-8.75 8.75V13.75h1.25v4.375h-1.25z" fill="#1F232E"/></svg>Insurance Policies
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#myInquiries">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.375 1.875V6.25h1.25V1.875h-1.25zM7.79 6.906L3.37 2.487l-.884.884 4.42 4.42.884-.885zm4.42 0l4.419-4.419.883.884-4.419 4.42-.884-.885zM11.25 10a1.25 1.25 0 0 1-2.333.625H1.875v-1.25h7.042a1.25 1.25 0 0 1 2.332.625zm-4.344 2.21l-4.42 4.42.884.883 4.42-4.42-.884-.883zm6.187 0l4.42 4.42-.884.883-4.42-4.42.884-.883zm5.032-2.835h-4.376v1.25h4.376v-1.25zm-8.75 8.75V13.75h1.25v4.375h-1.25z" fill="#1F232E"/></svg>My Inquiries
	</a>
</li>
`;

const menu_admin = `
<li class="my-2">
	<div class="px-3 text-body text-opacity-50 fs-8 pt-4 pb-2">Admin Area</div>
</li>
<li class="my-2">
	<a class="fm-sw" href="#adminDashboard">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 4.375c1.68 0 3.258.442 4.622 1.217l-.922.922a8.125 8.125 0 0 0-11.82 6.944l-.005.292H.625A9.375 9.375 0 0 1 10 4.375zm8.125 9.375a8.09 8.09 0 0 0-.89-3.7l.923-.923a9.325 9.325 0 0 1 1.212 4.32l.005.303h-1.25zm.271-7.513l-.884-.884-7.954 7.955.883.884 7.955-7.955z" fill="#1F232E"/></svg>Admin Dashboard
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#people">
		<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="#1F232E" fill-rule="nonzero"><path d="M10 7.187a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm0 1.25a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM15.312 8.438a5.305 5.305 0 0 1 4.25 2.125.625.625 0 0 1-1 .75 4.056 4.056 0 0 0-3.25-1.625.625.625 0 0 1 0-1.25zM4.688 8.438a.625.625 0 0 1-.001 1.25 4.055 4.055 0 0 0-3.25 1.624.625.625 0 0 1-1-.749 5.305 5.305 0 0 1 4.25-2.125z"/><path d="M10 13.437a5.627 5.627 0 0 1 5.059 3.164.625.625 0 1 1-1.124.547 4.377 4.377 0 0 0-7.87 0 .625.625 0 0 1-1.125-.547A5.627 5.627 0 0 1 10 13.437zM3.721 3.59a3.125 3.125 0 0 1 4.036 2.385.625.625 0 1 1-1.228.235A1.875 1.875 0 1 0 4.51 8.429l.177.008a.625.625 0 0 1 0 1.25 3.125 3.125 0 0 1-.966-6.097zM14.535 3.535a3.125 3.125 0 1 1 .777 6.153.625.625 0 1 1 0-1.25A1.875 1.875 0 1 0 13.47 6.21a.625.625 0 1 1-1.228-.234 3.125 3.125 0 0 1 2.293-2.44z"/></g></svg>People
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#allApplications">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.118 5.312L10.585.963c-.362-.21-.809-.21-1.172 0L1.88 5.313v8.698c0 .419.224.805.586 1.015L10 19.375l7.533-4.35c.363-.209.586-.595.586-1.014V5.312zm-8.12 3.965L3.755 5.673l6.244-3.606 6.245 3.606-6.246 3.604zm.626 1.084l6.244-3.605v7.209l-6.244 3.604v-7.208zm-1.25 0L3.13 6.755v7.21l6.245 3.604v-7.208z" fill="#1F232E"/></svg>All Applications
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#allInsurancePolicies">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.375 1.875V6.25h1.25V1.875h-1.25zM7.79 6.906L3.37 2.487l-.884.884 4.42 4.42.884-.885zm4.42 0l4.419-4.419.883.884-4.419 4.42-.884-.885zM11.25 10a1.25 1.25 0 0 1-2.333.625H1.875v-1.25h7.042a1.25 1.25 0 0 1 2.332.625zm-4.344 2.21l-4.42 4.42.884.883 4.42-4.42-.884-.883zm6.187 0l4.42 4.42-.884.883-4.42-4.42.884-.883zm5.032-2.835h-4.376v1.25h4.376v-1.25zm-8.75 8.75V13.75h1.25v4.375h-1.25z" fill="#1F232E"/></svg>All Insurance Policies
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#allInquiries">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.375 1.875V6.25h1.25V1.875h-1.25zM7.79 6.906L3.37 2.487l-.884.884 4.42 4.42.884-.885zm4.42 0l4.419-4.419.883.884-4.419 4.42-.884-.885zM11.25 10a1.25 1.25 0 0 1-2.333.625H1.875v-1.25h7.042a1.25 1.25 0 0 1 2.332.625zm-4.344 2.21l-4.42 4.42.884.883 4.42-4.42-.884-.883zm6.187 0l4.42 4.42-.884.883-4.42-4.42.884-.883zm5.032-2.835h-4.376v1.25h4.376v-1.25zm-8.75 8.75V13.75h1.25v4.375h-1.25z" fill="#1F232E"/></svg>All Inquiries
	</a>
</li>
<li class="my-2">
	<a class="fm-sw" href="#changeLogs">
		<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="#1F232E" fill-rule="nonzero"><path d="M14.4 8c.331 0 .6.293.6.655 0 .328-.222.6-.511.647l-.09.007H9.6c-.331 0-.6-.293-.6-.654 0-.33.222-.601.511-.648L9.601 8H14.4zM14.4 11c.331 0 .6.293.6.655 0 .328-.222.6-.511.647l-.09.007H9.6c-.331 0-.6-.293-.6-.654 0-.33.222-.601.511-.648l.09-.007H14.4z"/><path d="M16.667 2H3.334A1.332 1.332 0 0 0 2 3.333v13.333C2 17.403 2.597 18 3.334 18h13.333A1.333 1.333 0 0 0 18 16.665V3.333C18 2.597 17.403 2 16.667 2zM3.334 3.333h13.332v13.334l-13.332-.001V3.333z"/><path d="M6.654 2c.33 0 .601.247.648.568l.007.099v14.666a.66.66 0 0 1-.655.667.659.659 0 0 1-.647-.568L6 17.333V2.667A.66.66 0 0 1 6.654 2z"/></g></svg>Change Logs
	</a>
</li>
`;

const SIGNIN_PATH="/prelogin/login.html";

class MainPageHandler {
	#userName;
	#credMan;

	constructor(credMan) {
		this.#credMan = credMan;
		this.init();
	}

	// hook up events
	async init() {
		// 如果状态失效，跳转到登录页面
		const loggedIn = await this.#credMan.hasLoggedIn();
		if (!loggedIn) {
			window.location.href = SIGNIN_PATH;
		}

		// 加载左侧菜单
		this.loadMenus();

		// 页面切换处理
		$('.fm-sw').click(this.handlePageSwitch.bind(this));

		// 初始化子页面
		let hash = window.location.hash;
		let splits = hash.split('#');
		let subPage = 'myApplication';
		if (splits.length==2) {
			subPage = splits[1];
		}
		if (subPage.indexOf('?')!=-1) {
			subPage = subPage.split('?')[0];
		}
		this.switchPage(subPage);
		let that = this;
		window.addEventListener("popstate", function(e) {
			console.log("popstate" + document.URL);
			if (document.URL.indexOf('mainPanel.html')!=-1) {
				let page = document.URL.split('mainPanel.html#')[1];
				if (page.indexOf('?')!=-1) {
					page = page.split('?')[0];
				}
				that.switchPage(page);
			}
		}, false);
	}

	loadMenus() {
		const role = this.#credMan.credential.role;
		switch (role) {
			case 'client':
				$('#menu').append(menu_me);
				break;
			case 'agent':
				$('#menu').append(menu_me);
				$('#menu').append(menu_clients);
				break;
			case 'admin':
				$('#menu').append(menu_me);
				$('#menu').append(menu_admin);
				break;
		}

	}

	handlePageSwitch(e) {
		// let page = window.location.hash;
		let href = e.target.href;
		let splits = href.split('#');
		if (splits.length==2) {
			// e.preventDefault();
			let page = splits[1];
			this.switchPage(page);

		}
	}

	switchPage(page) {
		let container = $('#subMainPageContainer');
		switch(page) {
			case 'myDashboard':
				new MyDashboard(container);
				break;
			case 'myApplication':
				new MyApplication(container);
				break;
			case 'myInsurancePolicies':
				new MyInsurancePolicies(container);
				break;
			case 'myProfile':
				new MyProfile(container);
				break;
			case 'producerDashboard':
				new ProducerDashboard(container);
				break;
			case 'clients':
				new Clients(container);
				break;
			case 'applications':
				new Applications(container);
				break;
			case 'insurancePolicies':
				new InsurancePolicies(container);
				break;
			case 'adminDashboard':
				new AdminDashboard(container);
				break;
			case 'people':
				new People(container);
				break;
			case 'allApplications':
				new AllApplications(container);
				break;
			case 'allInsurancePolicies':
				new AllInsurancePolicies(container);
				break;
			case 'changeLogs':
				new ChangeLogs(container);
				break;
			case 'myInquiries':
				new MyInquiries(container);
				break;
			case 'allInquiries':
				new AllInquiries(container);
				break;
			case 'insurancePolicyDetails':
				new InsurancePolicyDetails(container);
				break;
		}
		$(".fm-sw").removeClass('active');
		$("a[href='#"+page+"']").addClass('active');
	}

}

let mainPageHandler = null;

$( document ).ready(function() {
	console.log( "main page ready!" );
	$("#pageContainer").html(page_template);
	mainPageHandler = new MainPageHandler(credMan);
});
