export function overviewInit() {
	$(".section-home-overview .custom-play-btn").each(function () {
		const $playButton = $(this);
		const video = $playButton.siblings("video")[0];

		if (!video) return;

		const setPlaybackState = function () {
			const isPlaying = !video.paused;

			$playButton.toggleClass("is-hidden", isPlaying);
			$(video).toggleClass("is-playing", isPlaying);
		};

		const playVideo = function () {
			if (video.ended) video.currentTime = 0;

			const playPromise = video.play();
			if (playPromise && typeof playPromise.catch === "function") {
				playPromise.catch(function () {
					// Keep the paused state when the browser blocks playback.
				});
			}
		};

		$(video).on("play pause", setPlaybackState);
		$(video).on("click", function () {
			if (video.paused) {
				playVideo();
			} else {
				video.pause();
			}
		});

		$playButton.on("click", function () {
			if (video.paused) playVideo();
		});

		setPlaybackState();
	});
}
