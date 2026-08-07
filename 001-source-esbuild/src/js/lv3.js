export function lv3Init (root = document) {
	const $root = $(root);
	const $sliders = $root.is(".lv3-slider")
		? $root.add($root.find(".lv3-slider"))
		: $root.find(".lv3-slider");

	$sliders.each(function () {
		const slider = this;
		if (slider.dataset.lv3Initialized) return;

		const viewport = slider.querySelector(".lv3-slider-viewport");
		const track = slider.querySelector(".lv3-slider-track");
		const originalSlides = Array.from(slider.querySelectorAll(".lv3-slide"));
		const prev = slider.querySelector(".lv3-prev");
		const next = slider.querySelector(".lv3-next");

		if (!viewport || !track || !originalSlides.length) return;

		const cloneCount = Math.min(2, Math.floor(originalSlides.length / 2));
		const initialIndex = Math.max(0, originalSlides.findIndex((slide) => slide.classList.contains("active")));
		const createClone = (slide) => {
			const clone = slide.cloneNode(true);
			clone.classList.remove("active");
			clone.classList.add("lv3-slide-clone");
			clone.setAttribute("aria-hidden", "true");
			return clone;
		};

		const leadingClones = document.createDocumentFragment();
		originalSlides.slice(-cloneCount).forEach((slide) => leadingClones.append(createClone(slide)));
		track.prepend(leadingClones);
		originalSlides.slice(0, cloneCount).forEach((slide) => track.append(createClone(slide)));

		const slides = Array.from(track.querySelectorAll(".lv3-slide"));
		let activeIndex = initialIndex;
		let activePosition = initialIndex + cloneCount;
		let pointerStart = null;
		let isAnimating = false;
		let transitionTimer = null;

		const isDesktop = () => window.matchMedia("(min-width: 1200px)").matches;
		const readWidth = (name, fallback) => parseFloat(getComputedStyle(slider).getPropertyValue(name)) || fallback;

		const getTrackOffset = (position) => {
			const activeWidth = viewport.clientWidth * readWidth("--lv3-active-width", 100) / 100;
			const inactiveWidth = viewport.clientWidth * readWidth("--lv3-inactive-width", 100) / 100;
			const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
			const activeCenter = position * (inactiveWidth + gap) + activeWidth / 2;

			return viewport.clientWidth / 2 - activeCenter;
		};

		const render = (position, animate = true) => {
			activePosition = position;
			activeIndex = Number(slides[position].dataset.slideIndex);

			if (!animate) slider.classList.add("lv3-slider-instant");

			slides.forEach((slide, slidePosition) => {
				const isActive = slidePosition === activePosition;
				slide.classList.toggle("active", isActive);
				slide.setAttribute("aria-hidden", String(!isActive));
			});

			if (!isDesktop()) {
				track.style.transform = "";
			} else {
				track.style.transform = `translate3d(${getTrackOffset(activePosition)}px, 0, 0)`;
			}

			if (!animate) {
				void track.offsetWidth;
				requestAnimationFrame(() => slider.classList.remove("lv3-slider-instant"));
			}
		};

		const normalizePosition = () => {
			if (!isAnimating) return;

			clearTimeout(transitionTimer);
			let normalizedPosition = activePosition;
			if (activePosition < cloneCount) normalizedPosition += originalSlides.length;
			if (activePosition >= originalSlides.length + cloneCount) normalizedPosition -= originalSlides.length;

			if (normalizedPosition !== activePosition) render(normalizedPosition, false);
			isAnimating = false;
		};

		const moveTo = (position) => {
			if (isAnimating || position === activePosition || !slides[position]) return;

			if (!isDesktop()) {
				const slideIndex = Number(slides[position].dataset.slideIndex);
				render(slideIndex + cloneCount, false);
				return;
			}

			isAnimating = true;
			render(position);
			transitionTimer = setTimeout(normalizePosition, 750);
		};

		prev?.addEventListener("click", () => moveTo(activePosition - 1));
		next?.addEventListener("click", () => moveTo(activePosition + 1));

		slides.forEach((slide, position) => {
			slide.addEventListener("click", () => moveTo(position));
		});

		track.addEventListener("transitionend", (event) => {
			if (event.target === track && event.propertyName === "transform") normalizePosition();
		});

		viewport.addEventListener("pointerdown", (event) => {
			pointerStart = event.clientX;
		});
		viewport.addEventListener("pointerup", (event) => {
			if (pointerStart === null) return;
			const distance = event.clientX - pointerStart;
			if (Math.abs(distance) > 40) moveTo(activePosition + (distance < 0 ? 1 : -1));
			pointerStart = null;
		});
		viewport.addEventListener("pointercancel", () => { pointerStart = null; });
		window.addEventListener("resize", () => {
			clearTimeout(transitionTimer);
			isAnimating = false;
			render(activeIndex + cloneCount, false);
		});

		slider.dataset.lv3Initialized = "true";
		render(activePosition, false);
	});
}
