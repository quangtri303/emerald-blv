import { gsap } from "gsap";

export function archiveInit() {
	const $sections = $(".section-home-archive");

	$sections.find(".archive").on("click", function () {
		const $archive = $(this);
		const archiveIndex = Number($archive.attr("data-archive-index"));
		const $section = $archive.closest(".section-home-archive");

		$archive.addClass("active").siblings(".archive").removeClass("active");
		$section.find(".archive-bg").css("transform", `translateX(${archiveIndex * 100}%)`);
	});

	$sections.each(function () {
		const section = this;
		const slider = section.querySelector(".archive-slider");

		if (!slider) return;

		const viewport = slider.querySelector(".archive-slider-viewport");
		const track = slider.querySelector(".archive-slider-track");
		const slides = Array.from(slider.querySelectorAll(".archive-slide"));
		const prev = slider.querySelector("[data-archive-prev]");
		const next = slider.querySelector("[data-archive-next]");
		const progress = slider.querySelector(".archive-pagination-fill");
		const current = slider.querySelector(".archive-pagination-current");
		const shouldLoop = slider.dataset.loop !== "false";
		let activeIndex = 0;
		let pointerStart = null;

		if (!slides.length) return;

		const normalizeIndex = (index) => {
			if (!shouldLoop) return Math.max(0, Math.min(index, slides.length - 1));
			return (index % slides.length + slides.length) % slides.length;
		};

		const readWidth = (name) => parseFloat(getComputedStyle(section).getPropertyValue(name)) || 100;

		const getTrackX = (index) => {
			const inactiveWidth = viewport.clientWidth * readWidth("--archive-inactive-width") / 100;
			const gap = parseFloat(getComputedStyle(track).columnGap) || 0;

			return -index * (inactiveWidth + gap);
		};

		const update = (index, animate = true) => {
			activeIndex = normalizeIndex(index);
			const activeWidth = `${readWidth("--archive-active-width")}%`;
			const inactiveWidth = `${readWidth("--archive-inactive-width")}%`;
			const duration = animate ? .65 : 0;

			slides.forEach((slide, slideIndex) => {
				slide.classList.toggle("active", slideIndex === activeIndex);
				gsap.to(slide, {
					duration,
					ease: "power3.inOut",
					flexBasis: slideIndex === activeIndex ? activeWidth : inactiveWidth,
					overwrite: true,
				});
			});

			gsap.to(track, {
				duration,
				ease: "power3.inOut",
				x: getTrackX(activeIndex),
				overwrite: true,
			});

			gsap.to(progress, {
				duration,
				ease: "power3.inOut",
				scaleX: (activeIndex + 1) / slides.length,
				transformOrigin: "left center",
				overwrite: true,
			});

			current.textContent = String(activeIndex + 1).padStart(2, "0");
			prev.classList.toggle("disabled", !shouldLoop && activeIndex === 0);
			next.classList.toggle("disabled", !shouldLoop && activeIndex === slides.length - 1);
		};

		prev.addEventListener("click", () => update(activeIndex - 1));
		next.addEventListener("click", () => update(activeIndex + 1));

		slides.forEach((slide, index) => {
			slide.addEventListener("click", () => update(index));
		});

		viewport.addEventListener("pointerdown", (event) => {
			pointerStart = event.clientX;
		});

		viewport.addEventListener("pointerup", (event) => {
			if (pointerStart === null) return;

			const distance = event.clientX - pointerStart;
			const threshold = Math.min(60, viewport.clientWidth * .1);

			if (Math.abs(distance) > threshold) {
				update(activeIndex + (distance < 0 ? 1 : -1));
			}

			pointerStart = null;
		});

		viewport.addEventListener("pointercancel", () => {
			pointerStart = null;
		});

		window.addEventListener("resize", () => update(activeIndex, false));
		update(0, false);
	});
}