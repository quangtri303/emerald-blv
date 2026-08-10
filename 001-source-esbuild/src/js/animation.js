import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { animate, createTimeline, onScroll, splitText, stagger } from "animejs";
gsap.registerPlugin(ScrollTrigger)

const fadeAnimations = [
    { selector: ".fade-up", x: 0, y: 100 },
    { selector: ".fade-down", x: 0, y: -100 },
    { selector: ".fade-left", x: 100, y: 0 },
    { selector: ".fade-right", x: -100, y: 0 },
]

const locationBorderPaths = [
    {
        width: 262,
        height: 135,
        d: "M256.551 4.53076H65.4122C29.7553 4.53076 0.849609 33.4363 0.849609 69.0929C0.849609 104.749 29.7553 133.656 65.4123 133.656H256.551",
    },
    {
        width: 257,
        height: 131,
        d: "M0.00031054 0.849609H191.14C226.796 0.849609 255.702 29.7553 255.702 65.4122C255.702 101.069 226.796 129.975 191.139 129.975H0.00031054",
    },
    {
        width: 257,
        height: 131,
        d: "M256.551 0.849609H65.4122C29.7553 0.849609 0.849609 29.7553 0.849609 65.4122C0.849609 101.069 29.7553 129.975 65.4123 129.975H256.551",
    },
    {
        width: 262,
        height: 135,
        d: "M4.53058 0.849609H195.67C231.327 0.849609 260.232 29.7553 260.232 65.4122C260.232 101.069 231.327 129.975 195.67 129.975H4.53058",
    },
]

const svgNamespace = "http://www.w3.org/2000/svg"
let locationBorderMaskId = 0

function createLocationBorderReveal(border, index) {
    const image = border.querySelector("img")
    const pathData = locationBorderPaths[index]
    const imageSource = image?.dataset.src || image?.currentSrc || image?.src

    if (!image || !pathData || !imageSource) return null

    const svg = document.createElementNS(svgNamespace, "svg")
    const mask = document.createElementNS(svgNamespace, "mask")
    const maskPath = document.createElementNS(svgNamespace, "path")
    const maskBackground = document.createElementNS(svgNamespace, "rect")
    const maskedImage = document.createElementNS(svgNamespace, "image")
    const maskId = `location-border-mask-${locationBorderMaskId++}`

    svg.setAttribute("viewBox", `0 0 ${pathData.width} ${pathData.height}`)
    svg.setAttribute("preserveAspectRatio", "none")
    svg.setAttribute("aria-hidden", "true")
    svg.classList.add("location-border-reveal")
    Object.assign(svg.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
    })

    mask.setAttribute("id", maskId)
    mask.setAttribute("maskUnits", "userSpaceOnUse")
    mask.setAttribute("maskContentUnits", "userSpaceOnUse")
    mask.setAttribute("x", "0")
    mask.setAttribute("y", "0")
    mask.setAttribute("width", pathData.width)
    mask.setAttribute("height", pathData.height)

    maskBackground.setAttribute("width", pathData.width)
    maskBackground.setAttribute("height", pathData.height)
    maskBackground.setAttribute("fill", "black")

    maskPath.setAttribute("d", pathData.d)
    maskPath.setAttribute("fill", "none")
    maskPath.setAttribute("stroke", "white")
    maskPath.setAttribute("stroke-width", "8")
    maskPath.setAttribute("stroke-linecap", "round")
    maskPath.setAttribute("stroke-linejoin", "round")

    maskedImage.setAttribute("x", "0")
    maskedImage.setAttribute("y", "0")
    maskedImage.setAttribute("width", pathData.width)
    maskedImage.setAttribute("height", pathData.height)
    maskedImage.setAttribute("preserveAspectRatio", "none")
    maskedImage.setAttribute("href", new URL(imageSource, document.baseURI).href)
    maskedImage.setAttribute("mask", `url(#${maskId})`)

    mask.append(maskBackground, maskPath)
    svg.append(mask, maskedImage)
    border.appendChild(svg)
    image.style.visibility = "hidden"

    const pathLength = maskPath.getTotalLength()
    gsap.set(maskPath, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
    })

    return maskPath
}

function locationGraphAnimation() {
    gsap.utils.toArray(".section-home-location").forEach((section) => {
        const locationNames = section.querySelectorAll(".location-grid .location-name")
        const borders = section.querySelectorAll(".location-border")
        const borderPaths = Array.from(borders)
            .map((border, index) => createLocationBorderReveal(border, index))
            .filter(Boolean)

        if (!locationNames.length && !borderPaths.length) return

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 90%",
                once: true,
            },
        })

        if (locationNames.length) {
            timeline.fromTo(
                locationNames,
                { clipPath: "inset(0 0 100% 0)" },
                {
                    clipPath: "inset(0 0 0% 0)",
                    duration: 0.65,
                    ease: "none",
                    stagger: 0.1,
                },
                0,
            )
        }

        timeline.to(
            borderPaths,
            {
                strokeDashoffset: 0,
                duration: 1,
                ease: "none",
                stagger: 1,
            },
            0,
        )
    })
}

export default function initAnimation() {
    fadeAnimations.forEach(({ selector, x, y }) => {
        gsap.utils.toArray(selector).forEach((element) => {
            gsap.fromTo(
                element,
                { autoAlpha: 0, x, y },
                {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 90%",
                        toggleActions: "play none none none",
                    },
                },
            )
        })
    })

    locationGraphAnimation()
}

export function splitTextAnimation() {
  const texts = document.querySelectorAll(".text-typing");

  texts.forEach((text) => {
    const split = splitText(text, {
      chars: true,
    });

    animate(split.chars, {
      opacity: [0, 1],
      translateY: [-30, 0],
      duration: 600,
      delay: stagger(40),
      ease: "out(3)",

      autoplay: onScroll({
        target: text,
        enter: "bottom-=20% top",
      }),
    });
  });
  const words = document.querySelectorAll(".text-typing-word");

  words.forEach((text) => {
    const split = splitText(text, {
      words: true,
    });

    animate(split.words, {
      opacity: [0, 1],
      translateY: [-30, 0],
      duration: 600,
      delay: stagger(40),
      ease: "out(3)",

      autoplay: onScroll({
        target: text,
        enter: "bottom-=20% top",
      }),
    });
  });
}
