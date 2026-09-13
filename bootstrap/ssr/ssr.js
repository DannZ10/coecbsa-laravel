import { Head, createInertiaApp } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region resources/js/Pages/Welcome.tsx
var Welcome_exports = /* @__PURE__ */ __exportAll({ default: () => Welcome });
/**
* Scaffold smoke page. Exists only to prove SSR, hydration, Tailwind and the
* design tokens are wired; it is replaced by the real Home page in phase 4.
*/
function Welcome({ laravel, php }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: "CoE CBSA" }), /* @__PURE__ */ jsxs("main", {
		className: "mx-auto flex min-h-dvh max-w-container flex-col justify-center gap-6 px-6",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "font-display text-sm uppercase tracking-[0.2em] text-forest-600",
				children: "Scaffold"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-display text-forest-900",
				children: "CoE CBSA"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "max-w-prose text-muted-foreground",
				children: [
					"Laravel ",
					laravel,
					" · PHP ",
					php,
					" · Inertia · React · TypeScript"
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "rounded-lg bg-forest-700 px-4 py-2 text-paper",
						children: "forest-700"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "rounded-lg bg-amber px-4 py-2 text-ink",
						children: "amber"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "rounded-lg border border-border bg-card px-4 py-2 text-card-foreground",
						children: "card"
					})
				]
			})
		]
	})] });
}
//#endregion
//#region resources/js/ssr.tsx
var pages = /* #__PURE__ */ Object.assign({ "./Pages/Welcome.tsx": Welcome_exports });
createServer((page) => createInertiaApp({
	page,
	render: ReactDOMServer.renderToString,
	title: (title) => title,
	resolve: (name) => {
		const module = pages[`./Pages/${name}.tsx`];
		if (!module) throw new Error(`Inertia page not found: ${name}`);
		return module;
	},
	setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
}));
//#endregion
export {};
