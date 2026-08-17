import { lv3Init } from "./lv3";
import { initDialogSwiper } from "./swiper";

function selectFloor (dialog, floorIndex) {
	const tabs = Array.from(dialog.querySelectorAll(".floor-tabs .floor"));
	const panels = Array.from(dialog.querySelectorAll("[data-floor-panel]"));
	const index = Math.max(0, Math.min(Number(floorIndex) || 0, tabs.length - 1));

	tabs.forEach((tab, tabIndex) => tab.classList.toggle("active", tabIndex === index));
	panels.forEach((panel) => panel.classList.toggle("active", Number(panel.dataset.floorPanel) === index));

	const background = dialog.querySelector(".floor-bg");
	if (background) background.style.transform = `translateX(${index * 100}%)`;

	const activePanel = dialog.querySelector(`[data-floor-panel="${index}"]`);
	const activeSwiper = activePanel?.querySelector(".swiper-apt")?.swiper;
	if (activeSwiper) {
		activeSwiper.update();
		activeSwiper.updateRoomButton?.();
	}
}

const dialogOpenState = {};

function hideFloorPlanTooltip () {
	if (!window.ImageMapPro || typeof window.ImageMapPro.hideTooltip !== "function") return;

	const hideTooltip = () => {
		const result = window.ImageMapPro.hideTooltip("Floor Plan", "Thap A");
		if (result?.catch) result.catch(() => {});
	};

	window.setTimeout(hideTooltip, 0);
}

function openFloorPlan (tower) {
	hideFloorPlanTooltip();
	return openDialog(`floorPlan${tower}`, `dialog/FloorPlan${tower}.html`);
}

function openRoomList (tower, roomId) {
	return openDialog(`roomList${tower}`, `dialog/RoomList${tower}.html`, roomId);
}

function openDialog (dialogId, dialogUrl, roomId = "") {
	const configuredUrl = window.emeraldNamedDialogUrls?.[dialogId] || dialogUrl;
	const url = new URL(configuredUrl, document.baseURI);
	const normalizedRoomId = String(roomId).trim();
	if (normalizedRoomId) url.searchParams.set("room", normalizedRoomId);
	const resolvedUrl = url.toString();

	if (dialogOpenState[dialogId] || document.querySelector(`#${dialogId}`)) return false;

	if (window.Fancybox?.show) {
		dialogOpenState[dialogId] = true;
		const showDialog = () => {
			window.Fancybox.show([{ src: resolvedUrl, type: "ajax" }], {
				dragToClose: false,
				Carousel: {
					Panzoom: {
						touch: false,
					},
				},
				on: {
					done: function (fancybox, slide) {
						initializeDialogContent(slide?.$content);
					},
					destroy: function () {
						delete dialogOpenState[dialogId];
					},
					error: function () {
						delete dialogOpenState[dialogId];
					},
				},
			});
		};
		const isTouchInput = window.matchMedia?.("(pointer: coarse)").matches;
		if (isTouchInput || "ontouchstart" in window) {
			window.setTimeout(showDialog, 0);
		} else {
			showDialog();
		}
		return false;
	}

	window.location.href = resolvedUrl;
	return false;
}

function runAjaxScripts (content) {
	content.querySelectorAll("script").forEach((script) => {
		if (script.type === "speculationrules") return;

		if (script.src) {
			if (!document.querySelector(`script[src="${script.src}"]`)) {
				const external = document.createElement("script");
				external.src = script.src;
				external.async = false;
				document.head.appendChild(external);
			}
			return;
		}

		const inline = document.createElement("script");
		inline.textContent = script.textContent;
		document.head.appendChild(inline);
		inline.remove();
	});
}

function prepareFloorplanStages (scope) {
	const stages = Array.from(scope.querySelectorAll(".floorplan-map-stage"));
	stages.forEach((stage) => {
		if (stage.dataset.floorplanSizing === "ready") return;

		stage.dataset.floorplanSizing = "pending";
		stage.style.visibility = "hidden";
		stage.style.opacity = "0";
	});
	return stages;
}

function floorplanStagesReady (stages) {
	return stages.every((stage) => {
		const maps = Array.from(stage.querySelectorAll(".imp-container"));
		return maps.length > 0 && maps.every((map) => {
			const image = map.querySelector(".imp-image");
			const rect = map.getBoundingClientRect();
			return image?.complete && image.naturalWidth > 0 && rect.width > 0 && rect.height > 0;
		});
	});
}

function revealFloorplanStages (stages) {
	if (!stages.length) return;

	const deadline = performance.now() + 1500;
	const reveal = () => {
		stages.forEach((stage) => {
			stage.style.transition = "opacity 180ms ease";
			stage.style.visibility = "visible";
			stage.style.opacity = "1";
			stage.dataset.floorplanSizing = "ready";
		});
	};

	const waitForMap = () => {
		if (floorplanStagesReady(stages) || performance.now() >= deadline) {
			requestAnimationFrame(() => window.setTimeout(reveal, 40));
			return;
		}
		requestAnimationFrame(waitForMap);
	};

	requestAnimationFrame(waitForMap);
}

export function initializeDialogContent (content) {
	const scope = content instanceof Element ? content : content?.[0];
	if (!scope || scope.dataset.emeraldDialogContentInitialized) return;

	const floorplanStages = prepareFloorplanStages(scope);
	runAjaxScripts(scope);
	initDialogSwiper(scope);
	floorplanDialogInit(scope);
	lv3Init(scope);
	scope.dataset.emeraldDialogContentInitialized = "true";
	revealFloorplanStages(floorplanStages);
}

export function floorplanDialogInit (root = document) {
	const scope = root instanceof Element ? root : document;
	const dialogs = scope.matches?.("#floorPlanA, #floorPlanB, #roomListA, #roomListB")
		? [scope]
		: Array.from(scope.querySelectorAll("#floorPlanA, #floorPlanB, #roomListA, #roomListB"));

	dialogs.forEach((dialog) => {
		if (dialog.dataset.floorplanDialogInitialized) return;

		dialog.querySelectorAll(".floor-tabs .floor").forEach((tab) => {
			tab.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
				selectFloor(dialog, tab.dataset.floorIndex);
			});
		});

		const detailButton = dialog.querySelector("[data-emerald-dialog-3-button]");
		detailButton?.addEventListener("click", () => {
			const roomId = detailButton.dataset.roomId || detailButton.dataset.roomCode || "";
			if (roomId && typeof window.openRoomDetail === "function") window.openRoomDetail(roomId);
		});

		dialog.dataset.floorplanDialogInitialized = "true";
	});
}

export function openFloorPlanA () {
	return openFloorPlan("A");
}

export function openFloorPlanB () {
	return openFloorPlan("B");
}

export function openRoomListA (roomId) {
	return openRoomList("A", roomId);
}

export function openRoomListB (roomId) {
	return openRoomList("B", roomId);
}

export function openRoomDetail (roomId) {
	return openDialog("roomDetail", "dialog/RoomDetail.html", roomId);
}
