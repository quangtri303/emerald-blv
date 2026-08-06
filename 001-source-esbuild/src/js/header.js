import { headerSearch } from "../../plugins/ComponentsUi/HeaderSearch/HeaderSearch";
/*==================== Header ====================*/
export const header = {
	scrollActive: function () {
		let height = $("header").height();
		if ($(window).scrollTop() > height) {
			$("header").addClass("active");
		} else {
			$("header").removeClass("active");
		}
	},
	mobile: function () {
		const headerElement = $("#site-header");
		const menuButton = $(".header-hamburger");

		const setMenuOrigin = (button) => {
			const bounds = button.getBoundingClientRect();
			const originX = bounds.left + bounds.width / 2;
			const originY = bounds.top + bounds.height / 2;

			headerElement[0].style.setProperty("--menu-origin-x", `${originX}px`);
			headerElement[0].style.setProperty("--menu-origin-y", `${originY}px`);
		};

		menuButton.on("click", function () {
			const isOpen = !headerElement.hasClass("expanded");

			$(this).toggleClass("active", isOpen);
			headerElement.toggleClass("expanded", isOpen);
			$("body").toggleClass("isOpenMenu", isOpen);
			setMenuOrigin(this);
		});

		$(window).on("resize", function () {
			if (headerElement.hasClass("expanded")) {
				setMenuOrigin(menuButton[0]);
			}
		});
	},
	initVariable: function () {
		const height = $("header").height();
		document.documentElement.style.setProperty("--header-height", `${height}px`);
	},
	init: function () {
		headerSearch();
		header.scrollActive();
		header.mobile();
		header.initVariable();
	},
};
document.addEventListener(
	"scroll",
	function (e) {
		header.scrollActive();
	},
	true
);
