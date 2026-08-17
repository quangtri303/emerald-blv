const stackSelector = "svg[data-svg-stack]"

async function fetchSvgRoot(source) {
	const response = await fetch(new URL(source, document.baseURI))

	if (!response.ok) {
		throw new Error(`Unable to load ${source}: ${response.status} ${response.statusText}`)
	}

	const svgText = await response.text()
	const svgRoot = new DOMParser().parseFromString(svgText, "image/svg+xml").documentElement

	if (!svgRoot || svgRoot.nodeName.toLowerCase() !== "svg") {
		throw new Error(`${source} does not contain a valid SVG root`)
	}

	return svgRoot
}

function copySvgAttributes(target, source) {
	["viewBox", "fill", "xmlns", "xmlns:xlink"].forEach((attributeName) => {
		const value = source.getAttribute(attributeName)

		if (value !== null) {
			target.setAttribute(attributeName, value)
		}
	})
}

async function mergeSvgStack(target) {
	const sources = target.dataset.svgStack
		.split(",")
		.map((source) => source.trim())
		.filter(Boolean)

	if (!sources.length) return

	const svgRoots = await Promise.all(sources.map(fetchSvgRoot))
	copySvgAttributes(target, svgRoots[0])

	while (target.firstChild) {
		target.removeChild(target.firstChild)
	}

	// Each source uses the same viewBox, so appending their root children
	// preserves the original visual stacking order in one inline SVG.
	svgRoots.forEach((svgRoot) => {
		Array.from(svgRoot.childNodes).forEach((child) => {
			target.appendChild(document.importNode(child, true))
		})
	})

	target.dataset.svgMerged = "true"
}

export function mergeLocationSvgs() {
	document.querySelectorAll(stackSelector).forEach((target) => {
		if (target.dataset.svgMerged === "true") return

		mergeSvgStack(target).catch((error) => {
			console.error("Unable to merge location SVGs:", error)
		})
	})
}
