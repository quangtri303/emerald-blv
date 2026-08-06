export function amenityInit() {
	$(".section-home-amenity .floor").on("click", function () {
		const $floor = $(this);
		const floorIndex = Number($floor.attr("data-floor-index"));
		const $amenity = $floor.closest(".section-home-amenity");

		$floor.addClass("active").siblings(".floor").removeClass("active");
		$amenity.find(".floor-bg").css("transform", `translateX(${floorIndex * 100}%)`);
	});
}
