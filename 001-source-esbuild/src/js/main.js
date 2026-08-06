// import AOS from "aos";
import lozad from "lozad";
import { setBackgroundElement, buttonToTop, menuSpy, stickElementToEdge } from "./helper";
import { header } from "./header";
import { swiperInit } from "./swiper";
import { amenityInit } from "./amenity";
import { overviewInit } from "./overview";
import { archiveInit } from "./archive";
$(document).ready(function () {
	setBackgroundElement();
	stickElementToEdge();
	menuSpy();
	buttonToTop();
	header.init();
	swiperInit();
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
