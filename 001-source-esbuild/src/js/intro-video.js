export const introVideoInit = () => {
	const overlay = document.querySelector("[data-intro-video]");
	const video = overlay?.querySelector("video");

	if (!overlay || !video) return;

	const hideIntroVideo = () => {
		overlay.classList.add("is-hidden");
		document.body.classList.remove("disable-scroll");
	};

	const playIntroVideo = () => {
		const playPromise = video.play();

		if (playPromise?.catch) {
			playPromise.catch(hideIntroVideo);
		}
	};

	document.body.classList.add("disable-scroll");
	video.addEventListener("ended", hideIntroVideo, { once: true });
	video.addEventListener("error", hideIntroVideo, { once: true });

	if (video.readyState >= 2) {
		playIntroVideo();
	} else {
		video.addEventListener("loadeddata", playIntroVideo, { once: true });
	}
};
