import React, { useEffect } from 'react';
import $ from 'jquery';
import feather from 'feather-icons';
import '@popperjs/core';
import 'slick-carousel';
import './App.css';

function App() {
  useEffect(() => {
    $(function () {
      // init feather icons
      feather.replace();

      // init tooltip & popovers
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="popover"]').popover();

      //page scroll
      $('a.page-scroll').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top - 20
        }, 1000);
        event.preventDefault();
      });

      // slick slider
      $('.slick-about').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        arrows: false
      });

      //toggle scroll menu
      var scrollTop = 0;
      $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        //adjust menu background
        if (scroll > 80) {
          if (scroll > scrollTop) {
            $('.smart-scroll').addClass('scrolling').removeClass('up');
          } else {
            $('.smart-scroll').addClass('up');
          }
        } else {
          // remove if scroll = scrollTop
          $('.smart-scroll').removeClass('scrolling').removeClass('up');
        }

        scrollTop = scroll;

        // adjust scroll to top
        if (scroll >= 600) {
          $('.scroll-top').addClass('active');
        } else {
          $('.scroll-top').removeClass('active');
        }
        return false;
      });

      // scroll top top
      $('.scroll-top').click(function () {
        $('html, body').stop().animate({
          scrollTop: 0
        }, 1000);
      });

      /**Theme switcher - DEMO PURPOSE ONLY */
      $('.switcher-trigger').click(function () {
        $('.switcher-wrap').toggleClass('active');
      });
      $('.color-switcher ul li').click(function () {
        var color = $(this).attr('data-color');
        $('#theme-color').attr("href", "css/" + color + ".css");
        $('.color-switcher ul li').removeClass('active');
        $(this).addClass('active');
      });
    });
  }, []);

  return (
    <div classNameName="App">
      <section className="smart-scroll">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-md navbar-dark">
            <a className="navbar-brand heading-black" href="index.html">

              <svg className="hero" version="1.0" xmlns="http://www.w3.org/2000/svg" width="362.000000pt" height="416.000000pt"
                viewBox="0 0 362.000000 416.000000" preserveAspectRatio="xMidYMid meet">

                <g transform="translate(0.000000,416.000000) scale(0.100000,-0.100000)" stroke="none">
                  <path d="M591 3193 c18 -32 143 -249 278 -483 134 -234 300 -522 367 -640 68
-118 129 -223 136 -233 12 -15 20 -5 75 91 34 60 100 174 146 254 l85 146 -28
48 c-15 27 -77 135 -137 239 -61 105 -143 247 -184 318 l-74 128 -50 14 c-269
75 -632 175 -639 175 -4 0 7 -26 25 -57z" />
                  <path d="M3040 3235 c-25 -8 -157 -43 -295 -80 -476 -127 -550 -148 -567 -164
-13 -13 -141 -231 -135 -231 1 0 47 14 102 30 55 16 103 30 108 30 16 0 3 -29
-84 -178 -100 -173 -160 -277 -299 -517 -233 -403 -320 -556 -320 -563 0 -10
265 -491 277 -503 5 -5 33 33 65 89 31 53 89 153 129 222 39 69 81 140 91 158
10 18 53 93 95 165 42 73 127 220 188 327 61 107 152 265 202 350 49 85 145
252 213 370 68 118 161 279 207 357 45 78 83 144 83 147 0 8 -5 7 -60 -9z" />
                </g>
              </svg>
            </a>
            <button className="navbar-toggler navbar-toggler-right border-0" type="button" data-toggle="collapse"
              data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
              aria-label="Toggle navigation">
              <span data-feather="grid"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a className="nav-link page-scroll" href="#features">Features</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link page-scroll" href="#pricing">Pricing</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link page-scroll" href="#faq">FAQ</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link page-scroll" href="#blog">Blog</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link page-scroll d-flex flex-row align-items-center text-primary" href="#">
                    <em data-feather="layout" width="18" height="18" className="mr-2"></em>
                    Try Generator
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </section>

      <section className="py-7 py-md-0 bg-hero" id="home">
        <div className="container">
          <div className="row vh-md-100">
            <div className="col-md-8 col-sm-10 col-12 mx-auto my-auto text-center">
              <h1 className="heading-black text-capitalize">Vetonary</h1>
              <p className="lead py-3">Cung cấp APIs kiểm tra từ ngữ miễn phí, nhanh chóng.</p>
              <button className="btn btn-primary d-inline-flex flex-row align-items-center">
                Bắt đầu ngay
                <em className="ml-2" data-feather="arrow-right"></em>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-6 pb-7" id="features">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-center">
              <h2 className="heading-black">Vetonary có gì ?</h2>
              <p className="text-muted lead">Vetonary là một website cung cấp các APIs kiểm tra từ ngữ thô tục Tiếng Việt với
                công cụ mạnh mẽ hoàn
                toàn miễn phí</p>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-10 mx-auto">
              <div className="row feature-boxes">
                <div className="col-md-6 box">
                  <div className="icon-box box-primary">
                    <div className="icon-box-inner">
                      <span data-feather="edit-3" width="35" height="35"></span>
                    </div>
                  </div>
                  <h5>Đóng góp cho đội ngũ phát triển</h5>
                  <p className="text-muted">Bạn có thể đóng góp các từ ngữ của mình, để cải thiện phạm vi kiểm tra của APIs tại
                    <a href="">đây</a>
                  </p>
                </div>
                <div className="col-md-6 box">
                  <div className="icon-box box-success">
                    <div className="icon-box-inner">
                      <span data-feather="monitor" width="35" height="35"></span>
                    </div>
                  </div>
                  <h5>Tương thích tốt</h5>
                  <p className="text-muted">Website thân thiện dễ sử dụng, mang lại một trãi nghiệm tuyệt vời.</p>
                </div>
                <div className="col-md-6 box">
                  <div className="icon-box box-danger">
                    <div className="icon-box-inner">
                      <span data-feather="layout" width="35" height="35"></span>
                    </div>
                  </div>
                  <h5>Tính cá nhân</h5>
                  <p className="text-muted">Bạn có thể sử dụng các APIs hoặc các Token của chúng tôi để tạo ra một chức năng
                    riêng biệt cho website của bạn</p>
                </div>
                <div className="col-md-6 box">
                  <div className="icon-box box-info">
                    <div className="icon-box-inner">
                      <span data-feather="globe" width="35" height="35"></span>
                    </div>
                  </div>
                  <h5>Cộng đòng phát triển linh hoạt</h5>
                  <p className="text-muted">Tính nghiêm ngặc trong bảo mật giúp dịch vụ chúng tôi giúp bạn có một cộng đồng hỗ
                    trợ</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-6">
            <div className="col-md-6 mr-auto">
              <h2>Một số đánh giá về dịch vụ</h2>
              <p className="mb-5">Dịch vụ mang lại nhiều đánh giá tích cực về ý tưởng và hiệu năng từ cộng đồng Developers tại
                Việt Nam</p>
              <a href="#" className="btn btn-light">
                Xem ngay
              </a>
            </div>
            <div className="col-md-5">
              <div className="slick-about">
                <img src="./assets/images/blog-1.jpg" className="img-fluid rounded d-block mx-auto" alt="Work 1" />
                <img src="./assets/images/blog-2.jpg" className="img-fluid rounded d-block mx-auto" alt="Work 2" />
                <img src="./assets/images/blog-3.jpg" className="img-fluid rounded d-block mx-auto" alt="Work 3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-7 bg-dark section-angle top-right bottom-right" id="pricing">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-center">
              <h2 className="text-white heading-black">Chọn gói dịch vụ</h2>
              <p className="text-light lead">Miễn phí 7 ngày dùng thử</p>
            </div>
          </div>
          <div className="row pt-5 pricing-table">
            <div className="col-12 mx-auto">
              <div className="card-deck pricing-table">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title pt-3">Personal</h3>
                    <h2 className="card-title text-primary mb-0 pt-4">$59</h2>
                    <div className="text-muted font-weight-medium mt-2">per month</div>
                    <ul className="list-unstyled pricing-list">
                      <li>1 user</li>
                      <li>10 websites</li>
                      <li>Access to premium templates</li>
                      <li>Basic support</li>
                    </ul>
                    <a href="#" className="btn btn-primary">
                      Start free trial
                    </a>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title pt-3">Agency</h3>
                    <h2 className="card-title text-info mb-0 pt-4">$159</h2>
                    <div className="text-muted font-weight-medium mt-2">per month</div>
                    <ul className="list-unstyled pricing-list">
                      <li>2-15 users</li>
                      <li>50 websites</li>
                      <li>Access to premium templates</li>
                      <li>Priority support</li>
                    </ul>
                    <a href="#" className="btn btn-info">
                      Start free trial
                    </a>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title pt-3">Enterprise</h3>
                    <h2 className="card-title text-primary mb-0 pt-4">$499</h2>
                    <div className="text-muted font-weight-medium mt-2">per month</div>
                    <ul className="list-unstyled pricing-list">
                      <li>Unlimited users</li>
                      <li>Unlimited websites</li>
                      <li>Access to premium templates</li>
                      <li>24/7 support</li>
                    </ul>
                    <a href="#" className="btn btn-primary">
                      Start free trial
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-6">
            <div className="col-md-4 mr-auto">
              <h3>Everything is covered.</h3>
              <p className="lead">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in nisi commodo, tempus odio a,
                vestibulum nibh.
              </p>
            </div>
            <div className="col-md-7 offset-md-1">
              <ul className="features-list">
                <li>Weekly new templates</li>
                <li>Access to new features</li>
                <li>MailChimp integration</li>
                <li>Stripe integration</li>
                <li>100 refund guarantee</li>
                <li>Advance SEO tools</li>
                <li>Free unlimited support</li>
              </ul>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-8 col-12 divider top-divider mx-auto pt-5 text-center">
              <h3>Tạo tài khoản của bạn ngay bây giờ</h3>
              <p className="mb-4">Tạo cho mình một tài khoản để sử dụng Token của chúng tôi miễn phí</p>
              <button className="btn btn-primary">
                Tạo tài khoản ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-7" id="faq">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-center">
              <h2>Câu hỏi thường gặp</h2>
              <p className="text-muted lead">Câu trả lời cho những câu hỏi phổ biến nhất.</p>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-10 mx-auto">
              <div className="row">
                <div className="col-md-6 mb-5">
                  <h6>Tôi có thể thử miễn phí không?</h6>
                  <p className="text-muted">APIs của chúng tôi hoàn toàn miễn phí, tuy nhiên để đạt bản không giới hạn. Vui lòng
                    sử dụng bản trả phí</p>
                </div>
                <div className="col-md-6 mb-5">
                  <h6>Bạn có phí ẩn không?</h6>
                  <p className="text-muted">Chúng tôi không hề tính phí ẩn, bạn chỉ cần trả một gói bất kì và trãi nghiệm</p>
                </div>
                <div className="col-md-6 mb-5">
                  <h6>Các phương thức thanh toán bạn chấp nhận là gì?</h6>
                  <p className="text-muted">Chúng tôi nhận chuyển khoản vào thông tin phía <a href="">dưới</a></p>
                </div>
                <div className="col-md-6 mb-5">
                  <h6>Bạn phát hành cập nhật như thế nào?</h6>
                  <p className="text-muted">Mã nguồn sẽ tự động cập nhật, những Token cũ vẫn sẽ hoạt động bình thường</p>
                </div>
                <div className="col-md-6 mb-5">
                  <h6>Chính sách hoàn tiền của bạn là gì?</h6>
                  <p className="text-muted">Nếu bạn ngưng việc trãi nghiệm vui lòng liên hệ thông tin bên <a href="">dưới</a>
                  </p>
                </div>
                <div className="col-md-6 mb-5">
                  <h6>Làm thế nào để liên hệ với bạn?</h6>
                  <p className="text-muted">Bạn có thể liên hệ qua Email hoặc thông tin phía <a href="">dưới</a></p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-6 mx-auto text-center">
              <h5 className="mb-4">Còn câu hỏi nào không?
              </h5>
              <a href="#" className="btn btn-primary">Liên hệ với chúng tôi</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-7 bg-dark section-angle top-left bottom-left" id="blog">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-center">
              <h2 className="heading-black">Thôn tin mới nhất</h2>
              <p className="text-muted lead">Cùng xem để hiểu chúng tôi hơn</p>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-4">
              <div className="card">
                <a href="#">
                  <img className="card-img-top img-raised" src="./assets/images/blog-1.jpg" alt="Blog 1" />
                </a>
                <div className="card-body">
                  <a href="#" className="card-title mb-2">
                    <h5>We launch new iOS & Android mobile apps</h5>
                  </a>
                  <p className="text-muted small-xl mb-2">Sep 27, 2018</p>
                  <p className="card-text">Nam liber tempor cum soluta nobis eleifend option congue nihil imper,
                    consectetur adipiscing elit. <a href="#">Learn more</a></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <a href="#">
                  <img className="card-img-top img-raised" src="./assets/images/blog-2.jpg" alt="Blog 2" />
                </a>
                <div className="card-body">
                  <a href="#" className="card-title mb-2">
                    <h5>New update is available for the editor</h5>
                  </a>
                  <p className="text-muted small-xl mb-2">August 16, 2018</p>
                  <p className="card-text">Nam liber tempor cum soluta nobis eleifend option congue nihil imper,
                    consectetur adipiscing elit. <a href="#">Learn more</a></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <a href="#">
                  <img className="card-img-top img-raised" src="./assets/images/blog-3.jpg" alt="Blog 3" />
                </a>
                <div className="card-body">
                  <a href="#" className="card-title mb-2">
                    <h5>The story of building #1 page builder</h5>
                  </a>
                  <p className="text-muted small-xl mb-2">December 2nd, 2017</p>
                  <p className="card-text">Nam liber tempor cum soluta nobis eleifend option congue nihil imper,
                    consectetur adipiscing elit. <a href="#">Learn more</a></p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-6">
            <div className="col-md-6 mx-auto text-center">
              <a href="#" className="btn btn-primary">Xem tất cả</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6">
        <div className="container">
          <div className="row">
            <div className="col-sm-5 mr-auto">
              <h5>About Knight</h5>
              <p className="text-muted">Magnis modipsae que voloratati andigen daepeditem quiate conecus aut labore.
                Laceaque quiae sitiorem rest non restibusaes maio es dem tumquam explabo.</p>
              <ul className="list-inline social social-sm">
                <li className="list-inline-item">
                  <a href=""><i className="fa fa-facebook"></i></a>
                </li>
                <li className="list-inline-item">
                  <a href=""><i className="fa fa-twitter"></i></a>
                </li>
                <li className="list-inline-item">
                  <a href=""><i className="fa fa-google-plus"></i></a>
                </li>
                <li className="list-inline-item">
                  <a href=""><i className="fa fa-dribbble"></i></a>
                </li>
              </ul>
            </div>
            <div className="col-sm-2">
              <h5>Legal</h5>
              <ul className="list-unstyled">
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Refund policy</a></li>
              </ul>
            </div>
            <div className="col-sm-2">
              <h5>Partner</h5>
              <ul className="list-unstyled">
                <li><a href="#">Refer a friend</a></li>
                <li><a href="#">Affiliates</a></li>
              </ul>
            </div>
            <div className="col-sm-2">
              <h5>Help</h5>
              <ul className="list-unstyled">
                <li><a href="#">Support</a></li>
                <li><a href="#">Log in</a></li>
              </ul>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12 text-muted text-center small-xl">
              &copy; 2019 Knight - All Rights Reserved
            </div>
          </div>
        </div>
      </footer>

      <div className="scroll-top">
        <i className="fa fa-angle-up" aria-hidden="true"></i>
      </div>

      <div className="switcher-wrap">
        <div className="switcher-trigger">
          <span className="fa fa-gear"></span>
        </div>
        <div className="color-switcher">
          <h6>Color Switcher</h6>
          <ul className="mt-3 clearfix">
            <li className="bg-teal active" data-color="default" title="Default Teal"></li>
            <li className="bg-purple" data-color="purple" title="Purple"></li>
            <li className="bg-blue" data-color="blue" title="Blue"></li>
            <li className="bg-red" data-color="red" title="Red"></li>
            <li className="bg-green" data-color="green" title="Green"></li>
            <li className="bg-indigo" data-color="indigo" title="Indigo"></li>
            <li className="bg-orange" data-color="orange" title="Orange"></li>
            <li className="bg-cyan" data-color="cyan" title="Cyan"></li>
            <li className="bg-yellow" data-color="yellow" title="Yellow"></li>
            <li className="bg-pink" data-color="pink" title="Pink"></li>
          </ul>
          <p>These are just demo colors. You can <b>easily</b> create your own color scheme.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
