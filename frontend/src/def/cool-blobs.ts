import React from "react";

export const animateBlob = (e: React.MouseEvent) => {
	const _blob = e.currentTarget.querySelector("span.button-blob");
	if (!_blob) return;
	let blob = _blob as HTMLElement;
	
	let buttonRect = e.currentTarget.getBoundingClientRect();
	let docEl = document.documentElement;
	let left = buttonRect.left + (window.pageXOffset || docEl.scrollLeft || 0);
	
	let x = e.clientX - left;
	
	const fromLeftLimit = 30;
	const fromRightLimit = (buttonRect.width - fromLeftLimit);
	let fromX = x < fromLeftLimit ? fromLeftLimit : x > fromRightLimit ? fromRightLimit : x;
	
	const toLeftLimit = 60;
	const toRightLimit = (buttonRect.width - toLeftLimit);
	let toX = x < toLeftLimit ? toLeftLimit : x > toRightLimit ? toRightLimit : x;
	
	blob.animate([
		{ opacity: 1, width: "60px", height: "80%", top: "10%", transform: "translateX(calc(" + fromX + "px - 50%))" },
		{ opacity: 0, width: "120px", height: "100%", top: 0, transform: "translateX(calc(" + toX + "px - 50%))" }
	], {
		duration: 400,
		fill: "forwards",
		easing: "ease"
	});
}
