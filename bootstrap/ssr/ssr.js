import { Head, Link, createInertiaApp, router, useForm, usePage } from "@inertiajs/react";
import { ArrowUpRight, ChevronRight, Images, Languages, LayoutDashboard, LibraryBig, LogIn, LogOut, Mail, Menu, Moon, Newspaper, ShieldCheck, SlidersHorizontal, Sun, Tags, Users, X } from "lucide-react";
import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
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
//#region resources/js/lib/i18n.ts
function lookup(messages, path) {
	return path.split(".").reduce((node, key) => node && typeof node === "object" ? node[key] : void 0, messages);
}
function interpolate(template, values) {
	if (!values) return template;
	return template.replace(/\{(\w+)\}/g, (match, key) => key in values ? String(values[key]) : match);
}
function useLocale() {
	return usePage().props.locale;
}
/**
* `const t = useTranslations('admin.nav')` then `t('news')`.
*
* A missing key returns the full path rather than an empty string: a visible
* `admin.nav.news` in the UI is a bug report, a blank label is a mystery.
*/
function useTranslations(namespace) {
	const messages = usePage().props.translations;
	return (key, values) => {
		const path = namespace ? `${namespace}.${key}` : key;
		const value = lookup(messages, path);
		return typeof value === "string" ? interpolate(value, values) : path;
	};
}
//#endregion
//#region resources/js/lib/utils.ts
/** Merge conditional class names, de-duplicating conflicting Tailwind classes. */
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region resources/js/Layouts/AdminLayout.tsx
var ADMIN_NAV = [
	{
		href: "/admin",
		key: "dashboard",
		icon: LayoutDashboard
	},
	{
		href: "/admin/news",
		key: "news",
		icon: Newspaper
	},
	{
		href: "/admin/categories",
		key: "categories",
		icon: Tags
	},
	{
		href: "/admin/content",
		key: "content",
		icon: SlidersHorizontal
	},
	{
		href: "/admin/gallery",
		key: "gallery",
		icon: Images
	},
	{
		href: "/admin/media",
		key: "media",
		icon: LibraryBig
	},
	{
		href: "/admin/contact",
		key: "inbox",
		icon: Mail
	},
	{
		href: "/admin/users",
		key: "users",
		icon: Users,
		role: "super_admin"
	},
	{
		href: "/admin/settings",
		key: "settings",
		icon: SlidersHorizontal
	}
];
function isAdminRouteActive(pathname, href) {
	return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}
function ThemeToggle() {
	const [dark, setDark] = React.useState(false);
	React.useEffect(() => {
		const initial = localStorage.getItem("cms-theme") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
		setDark(initial === "dark");
		document.documentElement.dataset.theme = initial;
	}, []);
	const toggle = () => {
		const next = dark ? "light" : "dark";
		setDark(!dark);
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem("cms-theme", next);
		} catch {}
	};
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		className: "inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted transition-colors duration-fast hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
		onClick: toggle,
		"aria-label": "Theme",
		children: dark ? /* @__PURE__ */ jsx(Sun, {
			className: "h-4 w-4",
			"aria-hidden": true
		}) : /* @__PURE__ */ jsx(Moon, {
			className: "h-4 w-4",
			"aria-hidden": true
		})
	});
}
function LanguageSwitch() {
	const locale = useLocale();
	return /* @__PURE__ */ jsxs("div", {
		role: "group",
		className: "inline-flex items-center rounded-md border border-line bg-surface p-0.5 text-xs",
		children: [/* @__PURE__ */ jsx(Languages, {
			className: "mx-1 h-3.5 w-3.5 text-foreground-subtle",
			"aria-hidden": true
		}), ["id", "en"].map((code) => /* @__PURE__ */ jsx("button", {
			type: "button",
			className: cn("min-w-[1.9rem] rounded-[6px] px-1.5 py-1 font-semibold transition-colors duration-fast", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus", locale === code ? "bg-primary text-primary-fg" : "text-foreground-muted hover:bg-surface-2 hover:text-foreground"),
			"aria-pressed": locale === code,
			onClick: () => router.post("/admin/locale", { locale: code }, {
				preserveScroll: true,
				preserveState: false
			}),
			children: code.toUpperCase()
		}, code))]
	});
}
function AdminLayout({ title, children }) {
	const page = usePage();
	const user = page.props.auth.user;
	const pathname = new URL(page.url, "http://localhost").pathname;
	const locale = useLocale();
	const t = useTranslations("admin.nav");
	const tRole = useTranslations("admin.role");
	const [open, setOpen] = React.useState(false);
	React.useEffect(() => setOpen(false), [pathname]);
	if (!user) return null;
	const current = ADMIN_NAV.find((item) => isAdminRouteActive(pathname, item.href));
	const visible = ADMIN_NAV.filter((item) => !("role" in item) || item.role === user.role);
	return /* @__PURE__ */ jsxs("div", {
		className: "cms-workspace",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "cms-sidebar",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "cms-sidebar-brand",
				children: [/* @__PURE__ */ jsx(Link, {
					href: "/admin",
					"aria-label": t("home"),
					children: /* @__PURE__ */ jsx("img", {
						src: "/brand/coe-cbsa.png",
						alt: "CoE CBSA",
						className: "cms-brand cms-brand-light",
						width: 144,
						height: 44
					})
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "cms-menu-toggle",
					"aria-label": t("label"),
					"aria-expanded": open,
					"aria-controls": "cms-navigation",
					onClick: () => setOpen((value) => !value),
					children: open ? /* @__PURE__ */ jsx(X, {
						className: "h-5 w-5",
						"aria-hidden": true
					}) : /* @__PURE__ */ jsx(Menu, {
						className: "h-5 w-5",
						"aria-hidden": true
					})
				})]
			}), /* @__PURE__ */ jsxs("div", {
				id: "cms-navigation",
				className: cn("cms-sidebar-panel", open && "cms-sidebar-panel-open"),
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "cms-sidebar-kicker",
						children: t("cms")
					}),
					/* @__PURE__ */ jsx("nav", {
						"aria-label": t("label"),
						children: /* @__PURE__ */ jsx("ul", {
							className: "cms-nav-list",
							children: visible.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
								href: item.href,
								className: "cms-nav-link",
								"aria-current": isAdminRouteActive(pathname, item.href) ? "page" : void 0,
								children: [
									/* @__PURE__ */ jsx(item.icon, {
										className: "h-[18px] w-[18px] shrink-0",
										"aria-hidden": true
									}),
									t(item.key),
									/* @__PURE__ */ jsx("span", {
										className: "cms-nav-dot",
										"aria-hidden": true
									})
								]
							}) }, item.href))
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "cms-sidebar-footer",
						children: [/* @__PURE__ */ jsxs("a", {
							href: `/${locale}`,
							className: "cms-site-link",
							target: "_blank",
							rel: "noopener noreferrer",
							children: [locale === "id" ? "Lihat website" : "View website", /* @__PURE__ */ jsx(ArrowUpRight, {
								className: "h-4 w-4",
								"aria-hidden": true
							})]
						}), /* @__PURE__ */ jsxs("p", { children: [
							"Center of Excellence",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", { children: "Universitas Brawijaya" })
						] })]
					})
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "cms-workspace-body",
			children: [/* @__PURE__ */ jsxs("header", {
				className: "cms-topbar",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "cms-breadcrumb",
					children: [
						/* @__PURE__ */ jsx("span", { children: "CMS" }),
						/* @__PURE__ */ jsx(ChevronRight, {
							className: "h-3.5 w-3.5",
							"aria-hidden": true
						}),
						/* @__PURE__ */ jsx("span", { children: title ?? t(current?.key ?? "dashboard") })
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "cms-topbar-actions",
					children: [
						/* @__PURE__ */ jsx(LanguageSwitch, {}),
						/* @__PURE__ */ jsx(ThemeToggle, {}),
						/* @__PURE__ */ jsxs("div", {
							className: "cms-user",
							children: [/* @__PURE__ */ jsx("span", {
								className: "cms-avatar",
								"aria-hidden": true,
								children: user.name.trim().charAt(0).toUpperCase()
							}), /* @__PURE__ */ jsxs("div", {
								className: "cms-user-details",
								children: [/* @__PURE__ */ jsx("p", { children: user.name }), /* @__PURE__ */ jsx("span", { children: tRole(user.role) })]
							})]
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/admin/logout",
							method: "post",
							as: "button",
							className: "inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted transition-colors duration-fast hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
							"aria-label": t("signOut"),
							title: t("signOut"),
							children: /* @__PURE__ */ jsx(LogOut, {
								className: "h-4 w-4",
								"aria-hidden": true
							})
						})
					]
				})]
			}), /* @__PURE__ */ jsx("main", {
				id: "main-content",
				className: "cms-content",
				tabIndex: -1,
				children
			})]
		})]
	});
}
//#endregion
//#region resources/js/Pages/Admin/Dashboard.tsx
var Dashboard_exports = /* @__PURE__ */ __exportAll({ default: () => Dashboard });
function Dashboard() {
	const t = useTranslations("admin.dashboard");
	const tNav = useTranslations("admin.nav");
	const user = usePage().props.auth.user;
	return /* @__PURE__ */ jsxs(AdminLayout, { children: [/* @__PURE__ */ jsx(Head, { title: tNav("dashboard") }), /* @__PURE__ */ jsxs("header", {
		className: "cms-page-header",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "cms-page-kicker",
				children: tNav("cms")
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "cms-page-heading",
				children: t("greeting", { name: user?.name ?? "" })
			}),
			/* @__PURE__ */ jsx("p", {
				className: "cms-page-description",
				children: t("subtitle")
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Login.tsx
var Login_exports = /* @__PURE__ */ __exportAll({ default: () => Login });
function Login({ googleEnabled }) {
	const t = useTranslations("admin.login");
	const flash = usePage().props.flash;
	const form = useForm({
		email: "",
		password: "",
		remember: false
	});
	return /* @__PURE__ */ jsxs("main", {
		className: "cms-login",
		children: [
			/* @__PURE__ */ jsx(Head, { title: t("title") }),
			/* @__PURE__ */ jsxs("div", {
				className: "cms-login-art",
				"aria-hidden": true,
				children: [/* @__PURE__ */ jsx("div", {
					className: "cms-login-mark",
					children: "CBSA"
				}), /* @__PURE__ */ jsxs("p", { children: [
					"Community-Based",
					/* @__PURE__ */ jsx("br", {}),
					"Sustainable Agroindustry"
				] })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "cms-login-main",
				children: /* @__PURE__ */ jsxs("div", {
					className: "cms-login-panel",
					children: [
						/* @__PURE__ */ jsx("img", {
							src: "/brand/coe-cbsa.png",
							alt: "CoE CBSA",
							className: "cms-brand",
							width: 144,
							height: 44
						}),
						/* @__PURE__ */ jsx("div", {
							className: "cms-login-icon",
							children: /* @__PURE__ */ jsx(ShieldCheck, {
								className: "h-5 w-5",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ jsx("p", {
							className: "cms-page-kicker",
							children: t("kicker")
						}),
						/* @__PURE__ */ jsx("h1", { children: t("title") }),
						/* @__PURE__ */ jsx("p", {
							className: "cms-login-copy",
							children: t("subtitle")
						}),
						flash.error && /* @__PURE__ */ jsx("p", {
							role: "alert",
							className: "mt-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-fg",
							children: flash.error
						}),
						/* @__PURE__ */ jsxs("form", {
							className: "mt-6 space-y-4 text-left",
							onSubmit: (event) => {
								event.preventDefault();
								form.post("/admin/login", { onFinish: () => form.reset("password") });
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ jsx("label", {
											htmlFor: "email",
											className: "block text-xs font-semibold text-forest-800",
											children: t("email")
										}),
										/* @__PURE__ */ jsx("input", {
											id: "email",
											type: "email",
											name: "email",
											autoComplete: "username",
											required: true,
											placeholder: t("emailPlaceholder"),
											value: form.data.email,
											onChange: (event) => form.setData("email", event.target.value),
											"aria-invalid": Boolean(form.errors.email),
											"aria-describedby": form.errors.email ? "email-error" : void 0,
											className: "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
										}),
										form.errors.email && /* @__PURE__ */ jsx("p", {
											id: "email-error",
											role: "alert",
											className: "text-xs text-danger-fg",
											children: form.errors.email
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ jsx("label", {
											htmlFor: "password",
											className: "block text-xs font-semibold text-forest-800",
											children: t("password")
										}),
										/* @__PURE__ */ jsx("input", {
											id: "password",
											type: "password",
											name: "password",
											autoComplete: "current-password",
											required: true,
											value: form.data.password,
											onChange: (event) => form.setData("password", event.target.value),
											"aria-invalid": Boolean(form.errors.password),
											className: "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus"
										}),
										form.errors.password && /* @__PURE__ */ jsx("p", {
											role: "alert",
											className: "text-xs text-danger-fg",
											children: form.errors.password
										})
									]
								}),
								/* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-2 text-xs text-forest-800",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: form.data.remember,
										onChange: (event) => form.setData("remember", event.target.checked),
										className: "h-4 w-4 rounded border-border text-forest-700 focus-visible:ring-2 focus-visible:ring-focus"
									}), t("remember")]
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "submit",
									disabled: form.processing,
									className: "cms-button mt-2 flex w-full items-center justify-center gap-2 rounded-full disabled:opacity-60",
									children: [/* @__PURE__ */ jsx(LogIn, {
										className: "h-4 w-4",
										"aria-hidden": true
									}), t("submit")]
								})
							]
						}),
						googleEnabled && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("p", {
							className: "my-4 text-center text-xs uppercase tracking-widest text-stone-500",
							children: t("or")
						}), /* @__PURE__ */ jsx("a", {
							href: "/admin/auth/google",
							className: "flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-forest-800 transition-colors hover:bg-paper-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
							children: t("google")
						})] }),
						/* @__PURE__ */ jsx("p", {
							className: "cms-login-note",
							children: t("registeredOnly")
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-center text-xs text-stone-500",
							children: t("forgot")
						})
					]
				})
			})
		]
	});
}
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
var pages = /* #__PURE__ */ Object.assign({
	"./Pages/Admin/Dashboard.tsx": Dashboard_exports,
	"./Pages/Admin/Login.tsx": Login_exports,
	"./Pages/Welcome.tsx": Welcome_exports
});
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
