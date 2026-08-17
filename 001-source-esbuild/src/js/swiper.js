import Swiper from "swiper";
import { Autoplay, EffectFade, Grid, Mousewheel, Navigation, Pagination } from "swiper/modules";

/**
 * @param swiperInit
 */
export function swiperInit () {
	$(".swiper-column-auto").each(function (index) {
		const $this = $(this);
		// Configuration flagsvideoSetting
		const config = {
			loop: $this.hasClass("swiper-loop"),
			touchMove: $this.hasClass("allow-touchMove") || true,
			mouseWheel: $this.hasClass("allow-mouseWheel") ? { forceToAxis: true } : false,
			autoHeight: $this.hasClass("auto-height"),
			hasVideo: $this.hasClass("auto-detect-video"),
			progressbar: $this.hasClass("progressbar"),
			time: $this.attr("data-time") || 3500,
			autoplay: $this.hasClass("autoplay"),
		};

		// Add unique identifier class
		$this.addClass(`swiper-column-auto-id-${index}`);

		// Create swiper with optimized options
		new Swiper(`.swiper-column-auto-id-${index} .swiper`, {
			modules: [Navigation, Pagination, Mousewheel],
			speed: 500,
			observer: true,
			observeParents: true,
			spaceBetween: 0,
			loop: config.loop,
			...(config.autoplay && {
				autoplay: {
					delay: config.time,
				},
			}),
			slidesPerView: "auto",
			pagination: {
				el: `.swiper-column-auto-id-${index} .swiper-pagination`,
				clickable: true,
				...(config.progressbar && {
					type: 'progressbar',
				}),
			},
			mousewheel: config.mouseWheel,
			allowTouchMove: config.touchMove,
			navigation: {
				prevEl: `.swiper-column-auto-id-${index} .btn-prev`,
				nextEl: `.swiper-column-auto-id-${index} .btn-next`,
			},
			watchSlidesProgress: true,
			autoHeight: config.autoHeight,
			on: {
				init: function () {
				},
				slideChange: function () {
				},
			},
		});
	});
	new Swiper(".section-home-banner .swiper", {
		modules: [Navigation, Autoplay, EffectFade],
		slidesPerView: 1,
		spaceBetween: 0,
		speed: 1000,
		loop: true,
		effect: "fade",
		fadeEffect: {
			crossFade: true,
		},
		// autoplay: {
		// 	delay: 5000,
		// },
		navigation: {
			nextEl: ".section-home-banner .btn-next",
			prevEl: ".section-home-banner .btn-prev",
		},
	});
	new Swiper(".section-news .swiper", {
		modules: [Navigation, Autoplay],
		slidesPerView: 1,
		spaceBetween: 10,
		speed: 1000,
		// autoplay: {
		// 	delay: 5000,
		// },
		breakpoints: {
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 3,
				spaceBetween: 40,
			},
		},
		navigation: {
			nextEl: ".section-news .btn-next",
			prevEl: ".section-news .btn-prev",
		},
	});
	new Swiper(".section-partners .swiper", {
		modules: [Pagination, Autoplay],
		slidesPerView: 2,
		slidesPerGroup:2,
		spaceBetween: 10,
		speed: 1000,
		autoplay: {
			delay: 5000,
		},
		breakpoints: {
			1024: {
				slidesPerView: 4,
				slidesPerGroup: 4,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 5,
				slidesPerGroup: 5,
				spaceBetween: 40,
			},
		},
		pagination: {
			el: ".section-partners .swiper-pagination",
			clickable: true,
		},

	});
	initAptSwipers(document);
}

function initAptSwipers (root) {
	const $root = $(root);
	const $swipers = $root.is(".swiper-apt")
		? $root.add($root.find(".swiper-apt"))
		: $root.find(".swiper-apt");

	$swipers.each(function () {
		if (this.swiper) return;

		const swiperElement = this;
		const $controls = $(this).parent();
		const updateNavigationState = (swiper) => {
			$controls.find(".btn-prev").toggleClass("disabled", swiper.isBeginning);
			$controls.find(".btn-next").toggleClass("disabled", swiper.isEnd);
		};
		const updateRoomButton = (swiper) => {
			updateNavigationState(swiper);
			const dialog = swiperElement.closest("#roomListA, #roomListB");
			const panel = swiperElement.closest(".dialog-floor-panel");
			if (!dialog || !panel?.classList.contains("active")) return;

			const roomId = swiper.slides[swiper.activeIndex]?.dataset.roomId || swiper.slides[swiper.activeIndex]?.dataset.roomCode || "";
			const button = dialog.querySelector("[data-emerald-dialog-3-button]");
			if (button && roomId) button.dataset.roomId = roomId;
			dialog.querySelectorAll(".dialog-room-note").forEach((note) => {
				note.hidden = (note.dataset.roomId || note.dataset.roomCode) !== roomId;
			});
		};
		const swiper = new Swiper(this, {
			modules: [Navigation],
			slidesPerView: 1,
			initialSlide: Number(this.dataset.initialSlide) || 0,
			speed: 1000,
			allowTouchMove: true,
			spaceBetween: 10,
			observer: true,
			observeParents: true,
			navigation: {
				nextEl: $controls.find(".btn-next")[0],
				prevEl: $controls.find(".btn-prev")[0],
			},
			on: {
				init: updateRoomButton,
				slideChange: updateRoomButton,
			},
		});
		swiper.updateRoomButton = () => updateRoomButton(swiper);
	});
}

export function initDialogSwiper (content) {
	if (content) initAptSwipers(content);
}
