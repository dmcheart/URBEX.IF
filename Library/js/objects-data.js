// Data for every map object (towers / bomb shelters / abandoned sites).
// All object data lives here — loaded like a normal <script> tag (same
// pattern as agreement-data.js / licence-data.js / contacts-data.js).
// There is no per-object config.json anymore; this file is the only source
// of truth, so adding/editing an object never touches any other file.
//
// Photos live as plain files in one flat folder: Library/images/objects/
// (not split per-object), and are loaded with <img src="...">, which works
// fine over file:// — only fetch() of JSON/text is blocked by CORS when the
// site is opened directly from disk instead of through a server.
//
// IMAGE NAMING: <shortName><order>.<ext>, e.g. khp1.jpeg, khp2.jpg, khp3.jpg
//   - shortName: a short tag for the object (doesn't have to match its id),
//     just needs to be unique enough not to collide with other objects'
//     photos in the shared folder.
//   - order: a number at the end of the filename, starting at 1 — this is
//     the only thing that controls gallery order, so keep it sequential.
//   - ext: whatever the original file is (.jpg/.jpeg/.png).
//
// HOW TO ADD A NEW OBJECT:
// 1. Pick a new id (next free number).
// 2. Copy one of the entries below and fill it in.
// 3. If it has photos, drop them straight into Library/images/objects/ named
//    <shortName><order>.<ext> and list the exact filenames in "images" below
//    (e.g. "images": ["khp1.jpeg", "khp2.jpg", "khp3.jpg"]).
// 4. Set "lastUpdated" to today's date (DD.MM.YYYY) so visitors can see the
//    info is current — and bump it again any time you edit that object later.
// 5. Save this file — no other file needs to change.
//
// FIELD REFERENCE:
//   type         "tower" | "shelter" | "abandoned"
//   security     0-5, steps of 0.5 — "охрана" stars (shown for all types)
//   condition    0-5, steps of 0.5 — "сохран" stars (shelter/abandoned only;
//                omit this field entirely for towers)
//   closedYear   optional, number
//   lastUpdated  string, "DD.MM.YYYY" — date this entry was last edited;
//                shown to visitors as "Updated: <date>" so they can judge
//                whether the info might be stale. Update it whenever you
//                change anything else in the entry.
//   coordinates  { lat, lng, display }  — lat/lng place the pin, display is
//                the human-readable string shown in the popup
//   addedBy      { type: "admin" }
//                or { type: "user", nickname: "...", socials: { youtube: "...", tiktok: "..." } }
//   images       array of filenames inside Library/objects/<id>/images/
//   content      { ru: { name, description, closureReason }, uk: {...}, en: {...} }
//                any language may be omitted — falls back to ru -> en -> uk
//                IMPORTANT: the Ukrainian key is "uk" (not "ua") — that's the
//                standard language code, same as the "uk" used everywhere else
//                in the site (translations.js, the language switcher, etc).
//                Using "ua" by mistake is still recognized as a fallback for
//                "uk" so old entries won't silently break, but please write
//                "uk" for anything new.

window.OBJECTS_DATA = {
    1: {
        type: "abandoned",
        security: 2.5,
        condition: 3.5,
        closedYear: 2019,
        coordinates: {
            lat: 48.89325,
            lng: 24.748694,
            display: "48°53'35.7\"N 24°44'55.3\"E"
        },
        lastUpdated: "19.07.2026",
        addedBy: {
            type: "admin"
        },
        images: ["khp1.jpeg", "khp2.jpg", "khp3.jpg"],
        content: {
            ru: {
                name: "Ивано-Франковский комбинат хлебопродуктов (КХП)",
                description: "Крупное государственное предприятие агропромышленного комплекса в Ивано-Франковске (основано в 1979 году). Специализировалось на переработке зерна, производстве муки, круп и комбикормов. Располагает мощным элеваторным комплексом вместимостью более 79 тысяч тонн и собственной железнодорожной веткой.",
                closureReason: "Финансовый кризис и долги, а также полуаварийное состояние оборудования."
            },
            uk: {
                name: "Івано-Франківський комбінат хлібопродуктів (КХП)",
                description: "Велике державне підприємство агропромислового комплексу в Івано-Франківську (засновано в 1979 році). Спеціалізувалося на переробці зерна, виробництві борошна, круп та комбікормів. Має потужний елеваторний комплекс місткістю понад 79 тисяч тонн і власною залізничною гілкою.",
                closureReason: "Фінансова криза та борги, а також напіваварійний стан обладнання."
            },
            en: {
                name: "Ivano-Frankivsk Grain Processing Plant (KHP)",
                description: "A large state-owned agro-industrial enterprise in Ivano-Frankivsk (founded in 1979). Specializing in grain processing, flour, cereals, and animal feed production. It has a powerful elevator complex with a capacity of over 79,000 tons and its own railway line.",
                closureReason: "Financial crisis and debt, as well as the semi-emergency condition of the equipment."
            }
        }
    },
	2: {
		type: "tower",
		security: 1.5,
		// condition
		// closedYear
		coordinates: {
			lat: 48.917701689213004,
			lng: 24.72692416392521,
			display: "48°55'03.7\"N 24°43'36.9\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "admin"
		},
		images: ["lightingtower1.jpg", "lightingtower1_2.jpg"],
		content: {
			ru: {
				name: "Осветительная вышка",
				description: "Старая металлическая вышка с прожекторами."
			},
			uk: {
				name: "Освітлювальна вежа",
				description: "Стара металева вежа з прожекторами."
			},
			en: {
				name: "Lighting tower",
				description: "An old metal tower with floodlights."
			}
		}
	},
	3: {
		type: "tower",
		security: 4,
		// condition
		// closedYear
		coordinates: {
			lat: 48.919694,
			lng: 24.727778,
			display: "48°55'10.9\"N 24°43'40.0\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "admin"
		},
		images: ["lightingtower3.jpg"],
		content: {
			ru: {
				name: "Осветительная вышка",
				description: "Старая металлическая вышка с прожекторами."
			},
			uk: {
				name: "Освітлювальна вежа",
				description: "Стара металева вежа з прожекторами."
			},
			en: {
				name: "Lighting tower",
				description: "An old metal tower with floodlights."
			}
		}
	},
	4: {
		type: "tower",
		security: 4,
		// condition
		// closedYear
		coordinates: {
			lat: 48.919778,
			lng: 24.727778,
			display: "48°55'11.2\"N 24°43'40.0\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "admin"
		},
		images: ["lightingtower2.jpg"],
		content: {
			ru: {
				name: "Осветительная вышка",
				description: "Старая металлическая вышка с прожекторами."
			},
			uk: {
				name: "Освітлювальна вежа",
				description: "Стара металева вежа з прожекторами."
			},
			en: {
				name: "Lighting tower",
				description: "An old metal tower with floodlights."
			}
		}
	},
	5: {
		type: "tower",
		security: 2,
		// condition
		// closedYear
		coordinates: {
				lat: 48.916167,
				lng: 24.728111,
				display: "48°54'58.2\"N 24°43'41.2\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "admin"
		},
		images: ["lightingtower4.jpg", "lightingtower4_2.jpg"],
		content: {
			ru: {
				name: "Осветительная вышка",
				description: "Старая металлическая вышка с прожекторами."
			},
			uk: {
				name: "Освітлювальна вежа",
				description: "Стара металева вежа з прожекторами."
			},
			en: {
				name: "Lighting tower",
				description: "An old metal tower with floodlights."
			}
		}
	},
	6: {
		type: "tower",
		security: 5,
		// condition
		// closedYear
		coordinates: {
			lat: 48.917457863786474,
			lng: 24.70843313829116,
			display: "48°55'02.9\"N 24°42'30.4\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "admin"
		},
		images: ["tvtower1.jpg", "tvtower1_2.jpg", "tvtower1_3.jpg"],
		content: {
			ru: {
				name: "Ивано-Франковская телевышка",
				description: "Металлическая решетчатая телевизионная башня высотой 192 метра. Главный телекоммуникационный объект города."
			},
			uk: {
				name: "Івано-Франківська телевежа",
				description: "Металева ґратчаста телевізійна вежа висотою 192 метри. Головний телекомунікаційний об'єкт міста."
			},
			en: {
				name: "Ivano-Frankivsk TV Tower",
				description: "A 192-meter-high steel lattice television tower. The main telecommunication structure in the city."
			}
		}
	},
	7: {
		type: "abandoned",
		security: 2,
		condition: 1.5,
		closedYear: 2020,
		coordinates: {
			lat: 48.912857605628204,
			lng: 24.736261135187938,
			display: "48°54'46.3\"N 24°44'10.5\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "user",
			nickname: "🚷 HEART ☢️",
			socials: {
				tiktok: "https://www.tiktok.com/@dmcheart"
			}
		},
		images: ["63kzz1.jpg", "63kzz1_2.jpg", "63kzz1_3.jpg", "63kzz1_4.jpg"],
		content: {
			ru: {
				name: "63-й котельно-сварочный завод",
				description: "Бывшее оборонное и гражданское предприятие (Ивано-Франковский КСЗ). Занималось выпуском котлов, резервуаров и спецоборудования. Окончательно ликвидировано в конце 2025 года после банкротства и приватизации."
			},
			uk: {
				name: "63-й котельно-зварювальний завод",
				description: "Колишнє оборонне та цивільне підприємство (Івано-Франківський КЗЗ). Займалося випуском котлів, резервуарів та спецобладнання. Остаточно ліквідоване наприкінці 2025 року після банкрутства та приватизації."
			},
			en: {
				name: "63rd Boiler and Welding Plant",
				description: "Former defense and civilian enterprise (Ivano-Frankivsk Boiler-Welding Plant). It manufactured boilers, tanks, and specialized equipment. Finally liquidated in late 2025 following bankruptcy and privatization."
			}
		}
	},
	8: {
		type: "abandoned",
		security: 3,
		condition: 0,
		closedYear: 2020,
		coordinates: {
			lat: 48.911889,
			lng: 24.737194,
			display: "48°54'42.8\"N 24°44'13.9\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "user",
			nickname: "🚷 HEART ☢️",
			socials: {
				tiktok: "https://www.tiktok.com/@dmcheart"
			}
		},
		images: ["hangar63kzz1.jpg"],
		content: {
			ru: {
				name: "Ангар 63-го завода",
				description: "Заброшенный ангар на территории бывшего котельно-сварочного завода."
			},
			uk: {
				name: "Ангар 63-го заводу",
				description: "Закинутий ангар на території колишнього котельно-зварювального заводу."
			},
			en: {
				name: "Hangar of the 63rd Plant",
				description: "An abandoned hangar inside the former boiler and welding plant."
			}
		}
	},
	9: {
		type: "abandoned",
		security: 0,
		condition: 0,
		closedYear: 1930,
		coordinates: {
			lat: 48.919500,
			lng: 24.710028,
			display: "48°55'10.2\"N 24°42'36.1\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "admin"
		},
		images: ["chocolatefactory1.jpg", "chocolatefactory1_2.jpg", "chocolatefactory1_3.jpg"],
		content: {
			ru: {
				name: "Заброшенная шоколадная фабрика Кровицкого",
				description: "Историческое здание первой Станиславовской фабрики шоколада и десертных сахаров, открытой в 1926 году. Заброшена с 1930 года. Находится в разрушенном состоянии во дворах центра города."
			},
			uk: {
				name: "Закинута шоколадна фабрика Кровицького",
				description: "Історична будівля першої Станиславівської фабрики шоколаду та десертних цукрів, відкритої у 1926 році. Закинута з 1930 року. Перебуває у зруйнованому стані в дворах центру міста."
			},
			en: {
				name: "Abandoned Krowicki Chocolate Factory",
				description: "Historical building of the first Stanislawow factory of chocolate and dessert sugars, opened in 1926. Abandoned since 1930. Currently in a ruined state located in the courtyards of the city center."
			}
		}
	},
	10: {
		type: "abandoned",
		security: 1.5,
		condition: 3,
		closedYear: 2010,
		coordinates: {
			lat: 48.892528,
			lng: 24.756222,
			display: "48°53'33.1\"N 24°45'22.4\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "user",
			nickname: "Danger.if🔧🚷️",
			socials: {
				tiktok: "https://www.tiktok.com/@sukaxqw_"
			}
		},
		images: ["avtolivmash1.jpg", "avtolivmash1_2.jpg", "avtolivmash1_3.jpg"],
		content: {
			ru: {
				name: "Здание «Автоливмаш» (часть «Пресмаша»)",
				description: "Огромный заброшенный промышленный корпус «Автоливмаш», входящий в общий комплекс «Пресмаш». Использовался для производства литейного оборудования."
			},
			uk: {
				name: "Будівля «Автоливмаш» (частина «Пресмашу»)",
				description: "Величезний закинутий промисловий корпус «Автоливмаш», що входить до загального комплексу «Пресмаш». Використовувався для виробництва ливарного обладнання."
			},
			en: {
				name: "Avtolyvmash Building (part of Presmash)",
				description: "A huge abandoned industrial building of Avtolyvmash, which is part of the larger Presmash complex. It was used for manufacturing foundry equipment."
			}
		}
	},
	11: {
		type: "tower",
		security: 2,
		// condition
		coordinates: {
			lat: 48.842917,
			lng: 24.723861,
			display: "48°50'34.5\"N 24°43'25.9\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "admin"
		},
		images: ["cellphonetower1.jpg"],
		content: {
			ru: {
				name: "Вышка сотовой связи",
				description: "Металлическая решетчатая мачта с приемопередающими антеннами операторов мобильной связи."
			},
			uk: {
				name: "Вежа стільникового зв'язку",
				description: "Металева ґратчаста щогла з прийомопередавальними антенами операторів мобільного зв'язку."
			},
			en: {
				name: "Cell phone tower",
				description: "A steel lattice mast equipped with transceiver antennas for mobile network operators."
			}
		}
	},
	12: {
		type: "shelter",
		security: 4,
		condition: 2,
		coordinates: {
			lat: 48.894611,
			lng: 24.751389,
			display: "48°53'40.6\"N 24°45'05.0\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "user",
			nickname: "🚷 HEART ☢️",
			socials: {
				tiktok: "https://www.tiktok.com/@dmcheart"
			}
		},
		images: ["bbkhp321451.jpg", "bbkhp321451_2.jpg"],
		content: {
			ru: {
				name: "Бомбоубежище №32145 Ивано-Франковского комбината хлебопродуктов (КХП)",
				description: "Защитное сооружение гражданской обороны (бомбоубежище), расположенное на территории комбината хлебопродуктов."
			},
			uk: {
				name: "Бомбосховище №32145 Івано-Франківського комбінату хлібопродуктів (КХП)",
				description: "Захисна споруда цивільної оборони (бомбосховище), розташована на території комбінату хлібопродуктів."
			},
			en: {
				name: "Bomb Shelter No. 32145 of Ivano-Frankivsk Bakery Plant (KHP)",
				description: "A civil defense protective structure (bomb shelter) located on the premises of the bakery plant."
			}
		}
	},
};
