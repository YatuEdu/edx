import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'

const page_template = `
<div class="container-fluid g-0">
    <div class="row g-0">
        <div class="col-12 col-md-6 joinus-side min-vh-100">
            <div class="joinus-side-bg h-100 position-relative">
                <article class="w-50 position-absolute top-50 start-50 translate-middle fs-5 text-white">
                    FinMind is dedicated to enhancing user experience for shopping life insurance. It is totally free to access all the transparent resources and services with the latest web technologies innovated by our engineers.
                </article>
            </div>
        </div>
        <div class="col-11 col-md-4 mx-auto">
            <h2 class="mt-5">Join Us</h2>
            <p class="fw-bold mt-3 text-secondary">To begin this journey, tell us what type of account you’d be opening.</p>
            <a href="../../prelogin/registerCustomer.html" class="joinus-account d-flex align-items-center justify-content-between text-decoration-none px-4 py-3 mt-5">
                <div class="d-flex">
                    <img src="../img/ico-joinus-customer.svg" alt="" class="">
                    <div class="px-4">
                        <h5 class="text-black">Customer</h5>
                        <p class="m-0 text-secondary fs-7">
                            Apply for your insurance and manage your policies.
                        </p>
                    </div>
                </div>
            </a>
            <a href="../../prelogin/registerProducer.html" class="joinus-account d-flex align-items-center text-decoration-none px-4 py-3 mt-4">
                <div class="d-flex">
                    <img src="../img/ico-joinus-producer.svg" alt="" class="">
                    <div class="px-4">
                        <h5 class="text-black">Producer</h5>
                        <p class="m-0 text-secondary fs-7">
                            Have all features of customer account and tools to manage your own clients and assist their applications.
                        </p>
                    </div>
                </div>
            </a>

        </div>
    </div>
</div>
`;


$( document ).ready(function() {
    $("#pageContainer").html(page_template);
});
