// import AOS from "aos";
import lozad from "lozad";
import { setBackgroundElement, buttonToTop, clickScrollToDiv, menuSpy, stickElementToEdge } from "./helper";
import { header } from "./header";
import { initDialogSwiper, swiperInit } from "./swiper";
import { amenityInit } from "./amenity";
import { overviewInit } from "./overview";
import { archiveInit } from "./archive";
import { lv3Init } from "./lv3";
import { introVideoInit } from "./intro-video";
$(document).ready(function () {
	introVideoInit();
	setBackgroundElement();
	stickElementToEdge();
	menuSpy();
	clickScrollToDiv(".homepage .section-home-sidebar .sidebar-link, .homepage .header-menu-list a[href^='#']", () => 0);
	buttonToTop();
	header.init();
	swiperInit();
	if (window.Fancybox) {
		window.Fancybox.bind("[data-fancybox]", {
			on: {
				done: function (fancybox, slide) {
					initDialogSwiper(slide?.$content);
					lv3Init(slide?.$content);
				},
			},
		});
	}
	amenityInit();
	overviewInit();
	archiveInit();
});

/*==================== Aos Init ====================*/
// AOS.init({
// 	offset: 100,
// });
/*==================== Lazyload JS ====================*/
const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();

window.FE = {
	lozad: observer.observe,
}
