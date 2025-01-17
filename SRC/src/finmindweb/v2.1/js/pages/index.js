import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'

const page_template = `
<div class="container-fluid g-0 position-relative" id="index-top">
    <div class="container position-relative">
        <ul class="nav nav-pills fs-5 justify-content-center pt-lg-5 mb-3 mb-lg-0" role="tablist" id="index-top-tabs">
            <li class="nav-item me-5" role="presentation">
                <a class="nav-link m-0 px-1 pb-1" data-bs-toggle="pill" href="#index-top-customer" role="tab" aria-selected="false">Customer</a>
            </li>
            <li class="nav-item ms-5" role="presentation">
                <a class="nav-link active m-0 px-1 pb-1" data-bs-toggle="pill" href="#index-top-producer" role="tab" aria-selected="true">Producer</a>
            </li>
        </ul>
    </div>
    <div class="container-fluid g-0 tab-content position-relative">
        <div class="tab-pane fade" id="index-top-customer" role="tabpanel">
            <div class="container position-relative">
                <figure>
                    <img src="../img/index-banner-customer-bg.svg">
                </figure>
                <div class="row position-relative py-lg-5">
                    <div class="col-12 col-lg-7">
                        <h2 class="display-5 fw-bold mt-lg-5 mb-3 pt-4">For your all new personalized life insurance experience</h2>
                        <div class="row">
                            <div class="col-12 col-lg-9">
                                <p class="fs-5 text-secondary mb-5">We connect you with expert producer. Provide optimal and transparent coverage eligibility and rate decisions based on your financial needs.</p>
                            </div>
                        </div>
                    </div>
                    <div class="pb-lg-4">
                        <a id="fm_start_pipeline_customer" class="btn btn-primary btn-lg rounded-pill px-5">Start Free Quote</a>
                        <a href="" class="btn btn-outline-primary btn-lg rounded-pill px-5 ms-lg-4 mt-3 mt-md-0">Open Tutorial</a>
                    </div>
                </div>
            </div>
            <div class="index-ourservices position-relative">
                <div class="container">
                    <div class="row position-relative justify-content-center mt-5 mb-5 pt-5">
                        <div class="col-11 col-lg-10 text-center">
                            <h2 class="display-6 fw-bold">
                <span class="d-inline-flex flex-column">
                    <span>Our services</span>
                    <span class="d-inline-block border-bottom border-4 border-dark mt-4 mb-4 w-25 mx-auto"></span>
                </span>
                            </h2>
                            <p class="fs-5">
                                We connect you with expert agent. Provide optimal and transparent coverage eligibility and rate decisions based on your real situation.
                            </p>
                        </div>
                    </div>
                    <div class="row g-5 px-lg-5 d-flex justify-content-between card-wrap">
                        <div class="col-12 col-lg-4">
                            <div class="card border-0 bg-white mx-3">
                                <div class="card-body">
                                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M48.333 16.917H9.667a4.833 4.833 0 0 0-4.834 4.833v24.167a4.833 4.833 0 0 0 4.834 4.833h38.666a4.833 4.833 0 0 0 4.834-4.833V21.75a4.833 4.833 0 0 0-4.834-4.833z" stroke="#458FF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M38.667 50.75V12.083a4.833 4.833 0 0 0-4.834-4.833h-9.666a4.833 4.833 0 0 0-4.834 4.833V50.75" stroke="#458FF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    <h4 class="card-title my-3">Apply in Minute</h4>
                                    <p class="card-text text-body text-opacity-75">Online application improves the efficiency of insurance application. Provide a good experience to minimize the communication time with producers.</p>
                                </div>
                            </div>
                            <div class="card border-0 bg-white mx-3 mt-5">
                                <div class="card-body">
                                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.733 25.375a16.268 16.268 0 1 1 32.535 0c0 8.114 1.698 12.823 3.193 15.397a1.812 1.812 0 0 1-1.559 2.728H11.098a1.812 1.812 0 0 1-1.56-2.729c1.497-2.573 3.195-7.282 3.195-15.396zM21.75 43.5v1.813a7.25 7.25 0 1 0 14.5 0V43.5M41.559 5.435a23.668 23.668 0 0 1 8.59 9.542M7.85 14.977a23.668 23.668 0 0 1 8.591-9.542" stroke="#4891F6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    <h4 class="card-title my-3">Notification</h4>
                                    <p class="card-text text-body text-opacity-75">Receive timely notification for important updates.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-lg-4">
                            <div class="card border-0 bg-white mx-3">
                                <div class="card-body">
                                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M29 53.167c13.347 0 24.167-10.82 24.167-24.167 0-13.347-10.82-24.167-24.167-24.167C15.653 4.833 4.833 15.653 4.833 29c0 13.347 10.82 24.167 24.167 24.167z" stroke="#458FF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 38.667c5.339 0 9.667-4.328 9.667-9.667 0-5.339-4.328-9.667-9.667-9.667-5.339 0-9.667 4.328-9.667 9.667A9.667 9.667 0 0 0 29 38.667zM11.914 11.914l10.247 10.247M35.84 35.84l10.246 10.246M35.84 22.16l10.246-10.246M35.84 22.16l8.53-8.53M11.914 46.086l10.247-10.247" stroke="#458FF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    <h4 class="card-title my-3">Easy to Use</h4>
                                    <p class="card-text text-body text-opacity-75">Simplified application process and easy to follow.</p>
                                </div>
                            </div>
                            <div class="card border-0 bg-white mx-3 mt-5">
                                <div class="card-body">
                                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28 49.75c12.012 0 21.75-9.738 21.75-21.75S40.012 6.25 28 6.25 6.25 15.988 6.25 28 15.988 49.75 28 49.75z" stroke="#4891F6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.844 26.188a2.719 2.719 0 1 0 0-5.438 2.719 2.719 0 0 0 0 5.438zM36.156 26.188a2.719 2.719 0 1 0 0-5.438 2.719 2.719 0 0 0 0 5.438z" fill="#4891F6"/><path d="M37.42 33.437a10.88 10.88 0 0 1-18.84 0" stroke="#4891F6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    <h4 class="card-title my-3">Open and Transparent</h4>
                                    <p class="card-text text-body text-opacity-75">Provide all knowledge that your need to know for you making the best choice to your needs.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-lg-4">
                            <div class="card border-0 bg-white mx-3">
                                <div class="card-body">
                                    <svg width="61" height="58" viewBox="0 0 61 58" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M0 0h60.372v58H0z"/><path d="M36.978 15.225a2.368 2.368 0 0 0-.72 1.692c0 .632.259 1.24.72 1.691l4.024 3.867a2.57 2.57 0 0 0 1.761.69 2.57 2.57 0 0 0 1.761-.69l9.484-9.11a13.981 13.981 0 0 1 1.097 8.576c-.55 2.9-2.006 5.57-4.176 7.654-2.17 2.084-4.948 3.484-7.967 4.012-3.018.529-6.132.16-8.927-1.055l-17.382 16.7a5.45 5.45 0 0 1-3.774 1.501 5.449 5.449 0 0 1-3.773-1.501 5.027 5.027 0 0 1-1.563-3.625c0-1.36.562-2.664 1.563-3.625l17.382-16.7a13.983 13.983 0 0 1-1.098-8.577c.55-2.9 2.007-5.57 4.176-7.654 2.17-2.084 4.949-3.483 7.967-4.012a15.656 15.656 0 0 1 8.928 1.055l-9.458 9.087-.025.024z" stroke="#458FF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    <h4 class="card-title my-3">Manage Policies</h4>
                                    <p class="card-text text-body text-opacity-75">Better manage your policies and view everything at any time. Easy to make decisions for every stage of your life!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="tab-pane fade show active" id="index-top-producer" role="tabpanel">
            <div class="container position-relative">
                <figure>
                    <img src="../img/index-banner-producer-bg.svg">
                </figure>
                <div class="row position-relative pt-lg-5">
                    <div class="col-12 col-lg-7">
                        <h2 class="display-5 fw-bold mt-lg-5 mb-3 pt-4">The most professional tool for improving your business productivity and making your everyday tasks much easier</h2>
                        <div class="row">
                            <div class="col-12 col-lg-9">
                                <p class="fs-5 text-secondary mb-5">We enable you to work with your customers more closely, efficiently, and most of all, to build trust and relationship.</p>
                            </div>
                        </div>
                    </div>
                    <div class="pb-lg-0">
                        <a id="fm_start_pipeline" class="btn btn-primary btn-lg rounded-pill px-5">Start Free Quote</a>
                        <a href="#" class="btn btn-outline-primary btn-lg rounded-pill px-5 ms-lg-4 mt-3 mt-md-0">Open Tutorial</a>
                    </div>
                </div>
            </div>
            <div class="index-ourservices position-relative">
                <div class="container">
                    <div class="row position-relative justify-content-center mt-5 mb-5 pt-5">
                        <div class="col-11 col-lg-10 text-center">
                            <h2 class="display-6 fw-bold">
                <span class="d-inline-flex flex-column">
                    <span>Our services</span>
                    <span class="d-inline-block border-bottom border-4 border-dark mt-4 mb-4 w-25 mx-auto"></span>
                </span>
                            </h2>
                        </div>
                    </div>
                    <div class="row g-5 px-lg-5 d-flex justify-content-between card-wrap">
                        <div class="col-12 col-lg-4">
                            <div class="card border-0 bg-white mx-3">
                                <div class="card-body">
                                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M48.333 16.917H9.667a4.833 4.833 0 0 0-4.834 4.833v24.167a4.833 4.833 0 0 0 4.834 4.833h38.666a4.833 4.833 0 0 0 4.834-4.833V21.75a4.833 4.833 0 0 0-4.834-4.833z" stroke="#458FF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M38.667 50.75V12.083a4.833 4.833 0 0 0-4.834-4.833h-9.666a4.833 4.833 0 0 0-4.834 4.833V50.75" stroke="#458FF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    <h4 class="card-title my-3">Professional Assistant</h4>
                                    <p class="card-text text-body text-opacity-75">Tips and reminder for needed tasks. Many examples for how to communicate with customers. Help producer to do business in high ethical standard.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-lg-4">
                            <div class="card border-0 bg-white mx-3">
                                <div class="card-body">
                                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M29 53.167c13.347 0 24.167-10.82 24.167-24.167 0-13.347-10.82-24.167-24.167-24.167C15.653 4.833 4.833 15.653 4.833 29c0 13.347 10.82 24.167 24.167 24.167z" stroke="#458FF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 38.667c5.339 0 9.667-4.328 9.667-9.667 0-5.339-4.328-9.667-9.667-9.667-5.339 0-9.667 4.328-9.667 9.667A9.667 9.667 0 0 0 29 38.667zM11.914 11.914l10.247 10.247M35.84 35.84l10.246 10.246M35.84 22.16l10.246-10.246M35.84 22.16l8.53-8.53M11.914 46.086l10.247-10.247" stroke="#458FF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    <h4 class="card-title my-3">Appilcation Tracking</h4>
                                    <p class="card-text text-body text-opacity-75">Track the status of customer application closely.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-lg-4">
                            <div class="card border-0 bg-white mx-3">
                                <div class="card-body">
                                    <svg width="61" height="58" viewBox="0 0 61 58" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M0 0h60.372v58H0z"/><path d="M36.978 15.225a2.368 2.368 0 0 0-.72 1.692c0 .632.259 1.24.72 1.691l4.024 3.867a2.57 2.57 0 0 0 1.761.69 2.57 2.57 0 0 0 1.761-.69l9.484-9.11a13.981 13.981 0 0 1 1.097 8.576c-.55 2.9-2.006 5.57-4.176 7.654-2.17 2.084-4.948 3.484-7.967 4.012-3.018.529-6.132.16-8.927-1.055l-17.382 16.7a5.45 5.45 0 0 1-3.774 1.501 5.449 5.449 0 0 1-3.773-1.501 5.027 5.027 0 0 1-1.563-3.625c0-1.36.562-2.664 1.563-3.625l17.382-16.7a13.983 13.983 0 0 1-1.098-8.577c.55-2.9 2.007-5.57 4.176-7.654 2.17-2.084 4.949-3.483 7.967-4.012a15.656 15.656 0 0 1 8.928 1.055l-9.458 9.087-.025.024z" stroke="#458FF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    <h4 class="card-title my-3">Manage Clients</h4>
                                    <p class="card-text text-body text-opacity-75">Better organize your client policies and view information at any time.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="container">
    <div class="row g-0 px-3 px-md-0 ">
        <div class="col-12 col-md-5">
            <img src="../img/index-leading-insurance-providers-bg.svg" class="img-fluid">
        </div>
        <div class="col-12 col-md-6 col-lg-4 offset-md-1 offset-lg-2">
            <h2 class="display-6 fw-bold mt-5 mt-md-0 pt-md-0 pt-lg-5">Leading insurance providers</h2>
            <span class="d-inline-block border-bottom border-4 border-dark mt-4 mb-5 w-25"></span>
            <p class="fs-5 text-secondary mb-5">FinMind provides progressive, and affordable insurance, accessible online for everyone. To us, it’s not just work. We take pride in the solutions we deliver.</p>
        </div>
    </div>
</div>


<div class="container-fluid my-5 pt-5 px-4 px-lg-2 index-ft-slides-wrap">
    <div class="container">
        <div id="index-ft-slides" class="carousel slide carousel-fade" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <div class="w-100 h-100 rounded-9 py-5" style="background: linear-gradient(208.18deg, #67C3F3 9.05%, #5A98F2 76.74%);">
                        <h5 class="text-white text-center h2 fw-bold px-4">What our customer are saying</h5>
                        <span class="d-block border-bottom border-2 border-light mx-auto mt-4 mb-5" style="width: 6%"></span>
                        <div class="w-75 mt-lg-4 mx-auto text-white">
                            <div class="row">
                                <div class="col-12 col-lg-auto">
                                    <div class="mx-auto d-flex flex-column flex-lg-row justify-content-center justify-content-lg-start align-items-center">
                                        <img src="../img/avatar-demo.jpeg" class="rounded-circle" style="width: 8.75rem;">
                                        <div class="text-white align-self-center ms-lg-4 mt-3 mt-lg-0 text-center text-lg-start">
                                            <h5 class="fw-bold mb-1">Edward Newgate</h5>
                                            <span>Founder Circle</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-lg-auto offset-lg-1">
                                    <div class="mt-3 text-center text-lg-start">
                                        “Say something here.”
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="w-100 h-100 rounded-9 py-5 bg-success">
                        <h5 class="text-white text-center h2 fw-bold px-4">What our customer are saying</h5>
                        <span class="d-block border-bottom border-2 border-light mx-auto mt-4 mb-5" style="width: 6%"></span>
                        <div class="w-75 mt-lg-4 mx-auto text-white">
                            <div class="row">
                                <div class="col-12 col-lg-auto">
                                    <div class="mx-auto d-flex flex-column flex-lg-row justify-content-center justify-content-lg-start align-items-center">
                                        <img src="../img/avatar-demo.jpeg" class="rounded-circle" style="width: 8.75rem;">
                                        <div class="text-white align-self-center ms-lg-4 mt-3 mt-lg-0 text-center text-lg-start">
                                            <h5 class="fw-bold mb-1">Edward Newgate</h5>
                                            <span>Founder Circle</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-lg-auto offset-lg-1">
                                    <div class="mt-3 text-center text-lg-start">
                                        “Say something here.”
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="w-100 h-100 rounded-9 py-5 bg-secondary">
                        <h5 class="text-white text-center h2 fw-bold px-4">What our customer are saying</h5>
                        <span class="d-block border-bottom border-2 border-light mx-auto mt-4 mb-5" style="width: 6%"></span>
                        <div class="w-75 mt-lg-4 mx-auto text-white">
                            <div class="row">
                                <div class="col-12 col-lg-auto">
                                    <div class="mx-auto d-flex flex-column flex-lg-row justify-content-center justify-content-lg-start align-items-center">
                                        <img src="../img/avatar-demo.jpeg" class="rounded-circle" style="width: 8.75rem;">
                                        <div class="text-white align-self-center ms-lg-4 mt-3 mt-lg-0 text-center text-lg-start">
                                            <h5 class="fw-bold mb-1">Edward Newgate</h5>
                                            <span>Founder Circle</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-lg-auto offset-lg-1">
                                    <div class="mt-3 text-center text-lg-start">
                                        “Say something here.”
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="position-relative mt-4 d-flex justify-content-center align-content-center">
                <a class="carousel-control-prev position-relative" href="#index-ft-slides" role="button" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </a>
                <ol class="carousel-indicators position-relative d-flex align-content-center">
                    <li data-bs-target="#index-ft-slides" data-bs-slide-to="0" class="active"></li>
                    <li data-bs-target="#index-ft-slides" data-bs-slide-to="1"></li>
                    <li data-bs-target="#index-ft-slides" data-bs-slide-to="2"></li>
                </ol>
                <a class="carousel-control-next position-relative" href="#index-ft-slides" role="button" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </a>
            </div>
        </div>
    </div>
</div>
`;

const WIZARD_PATH="./prelogin/wizard.html";

/**
	This class manages both login and sigup workflow
**/
class IndexPageHandler {
	#userName;
	#credMan;
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.init();
	}
	
	// hook up events
	async init() {
		// handle wizard
		$('#fm_start_pipeline').click(this.handleStartPipeline.bind(this));
		$('#fm_start_pipeline_customer').click(this.handleStartPipeline.bind(this));
	}
	
	handleStartPipeline(e) {
		e.preventDefault();
		
		// go to wizard page
		window.location.href = WIZARD_PATH; 
	};
}

let indexPageHandler = null;

$( document ).ready(function() {
	console.log( "index page ready!" );
	$("#pageContainer").html(page_template);
	indexPageHandler = new IndexPageHandler(credMan);
});
