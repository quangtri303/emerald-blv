export function amenityInit() {
	const floorSelector = ".section-home-amenity .floor, #lv1 .floor, #lv2 .floor";

	$(document).off("click.floorTabs", floorSelector).on("click.floorTabs", floorSelector, function () {
		const $floor = $(this);
		const floorIndex = Number($floor.attr("data-floor-index"));
		const $section = $floor.closest(".section-home-amenity, #lv1, #lv2");

		$floor.addClass("active").siblings(".floor").removeClass("active");
		$section.find(".floor-bg").css("transform", `translateX(${floorIndex * 100}%)`);
		$section.find(".legend-img").addClass("hidden").eq(floorIndex).removeClass("hidden");
	});
}
