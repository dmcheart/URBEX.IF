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
				description: "Бывшее оборонное и гражданское предприятие (Ивано-Франковский КСЗ). Занималось выпуском котлов, резервуаров и спецоборудования."
			},
			uk: {
				name: "63-й котельно-зварювальний завод",
				description: "Колишнє оборонне та цивільне підприємство (Івано-Франківський КЗЗ). Займалося випуском котлів, резервуарів та спецобладнання."
			},
			en: {
				name: "63rd Boiler and Welding Plant",
				description: "Former defense and civilian enterprise (Ivano-Frankivsk Boiler-Welding Plant). It manufactured boilers, tanks, and specialized equipment."
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
	13: {
		type: "abandoned",
		security: 0,
		condition: 0,
		// closedYear
		coordinates: {
			lat: 48.917648,
			lng: 24.726165,
			display: "48°55'03.5\"N 24°43'34.2\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "admin"
		},
		images: ["firestation1.jpg", "firestation1_2.jpg", "firestation1_3.jpg"],
		content: {
			ru: {
				name: "Заброшенная пожарная станция",
				description: "Старое здание пожарной части, выведенное из эксплуатации."
			},
			uk: {
				name: "Закинута пожежна станція",
				description: "Стара будівля пожежної частини, виведена з експлуатації."
			},
			en: {
				name: "Abandoned Fire Station",
				description: "An old fire station building that has been decommissioned."
			}
		}
	},
	14: {
		type: "abandoned",
		security: 0,
		condition: 0.5,
		// closedYear
		coordinates: {
			lat: 48.917661,
			lng: 24.725657,
			display: "48°55'03.6\"N 24°43'32.4\"E"
		},
		lastUpdated: "19.07.2026",
		addedBy: {
			type: "user",
			nickname: "🚷d1ggerX_if☢️",
			socials: {
				tiktok: "https://www.tiktok.com/@the_last_stalker_if"
			}
		},
		images: ["firestation2.jpg", "firestation2_1.jpg", "firestation2_2.jpg"],
		content: {
			ru: {
				name: "Склад гражданской обороны (ГО)",
				description: "Склад гражданской обороны, входящий в комплекс пожарной части."
			},
			uk: {
				name: "Склад цивільної оборони (ЦО)",
				description: "Склад цивільної оборони, що входить до комплексу пожежної частини."
			},
			en: {
				name: "Civil Defense Warehouse",
				description: "A civil defense warehouse belonging to the fire station complex."
			}
		},
	},
	15: {
		type: "abandoned",
		security: 0,
		condition: 2.5,
		// closedYear
		coordinates: {
			lat: 48.921694,
			lng: 24.713041,
			display: "48°55'18.1\"N 24°42'46.9\"E"
		},
		lastUpdated: "20.07.2026",
		addedBy: {
			type: "admin"
		},
		images: ["evreischooln1.jpg", "evreischooln1_2.jpg", "evreischooln1_3.jpg", "evreischooln1_4.jpg"],
		content: {
			ru: {
				name: "Заброшенная еврейская гимназия (Корпус №1)",
				description: "Здание построено в конце XIX века. В межвоенный период стало центром еврейского образования в Станиславове: в 1921 году здесь открылась начальная школа, а через 4 года — гимназия. До 1937 года здание трижды расширяли надстройками. В 1944–45 годах немецкий язык здесь преподавал сын Ивана Франко — Тарас. В советское время тут работали средние школы №5, а затем №9."
			},
			uk: {
				name: "Закинута єврейська гімназія (Корпус №1)",
				description: "Будинок збудований наприкінці XIX століття. У період між двома світовими війнами будівля стала центром освіти серед єврейських дітей Станиславова, адже тут у 1921 році було відкрито єврейську початкову школу, а через чотири роки — гімназію. З 1921 по 1937 роки будинок тричі розширювався за рахунок надбудов. У 1944-45 роках вчителем німецької мови школи, яка на той час містилася у приміщенні, був син Івана Франка — Тарас. За часів СРСР приміщення використовувалося як середня школа №5, а згодом — №9."
			},
			en: {
				name: "Abandoned Jewish Gymnasium (Building No. 1)",
				description: "Built at the end of the 19th century. In the interwar period, it became the center of Jewish education in Stanyslaviv, hosting an elementary school since 1921 and a gymnasium four years later. The building was expanded with vertical extensions three times by 1937. In 1944–45, Ivan Franko's son, Taras, taught German here. During the Soviet era, it housed secondary schools No. 5 and later No. 9."
			}
		}
	},
	16: {
		type: "abandoned",
		security: 0,
		condition: 2.5,
		// closedYear
		coordinates: {
			lat: 48.921669,
			lng: 24.713422,
			display: "48°55'18.0\"N 24°42'48.3\"E"
		},
		lastUpdated: "20.07.2026",
		addedBy: {
			type: "admin"
		},
		images: ["evreischooln1.jpg", "evreischooln1_2.jpg", "evreischooln1_3.jpg", "evreischooln1_4.jpg"],
		content: {
			ru: {
				name: "Заброшенная еврейская гимназия (Корпус №2)",
				description: "Здание построено в конце XIX века. В межвоенный период стало центром еврейского образования в Станиславове: в 1921 году здесь открылась начальная школа, а через 4 года — гимназия. До 1937 года здание трижды расширяли надстройками. В 1944–45 годах немецкий язык здесь преподавал сын Ивана Франко — Тарас. В советское время тут работали средние школы №5, а затем №9."
			},
			uk: {
				name: "Закинута єврейська гімназія (Корпус №2)",
				description: "Будинок збудований наприкінці XIX століття. У період між двома світовими війнами будівля стала центром освіти серед єврейських дітей Станиславова, адже тут у 1921 році було відкрито єврейську початкову школу, а через чотири роки — гімназію. З 1921 по 1937 роки будинок тричі розширювався за рахунок надбудов. У 1944-45 роках вчителем німецької мови школи, яка на той час містилася у приміщенні, був син Івана Франка — Тарас. За часів СРСР приміщення використовувалося як середня школа №5, а згодом — №9."
			},
			en: {
				name: "Abandoned Jewish Gymnasium (Building No. 2)",
				description: "Built at the end of the 19th century. In the interwar period, it became the center of Jewish education in Stanyslaviv, hosting an elementary school since 1921 and a gymnasium four years later. The building was expanded with vertical extensions three times by 1937. In 1944–45, Ivan Franko's son, Taras, taught German here. During the Soviet era, it housed secondary schools No. 5 and later No. 9."
			}
		}
	},
	17: {
		type: "shelter",
		security: 4,
		condition: 4,
		coordinates: {
			lat: 48.923361,
			lng: 24.713333,
			display: "48°55'24.1\"N 24°42'48.0\"E"
		},
		lastUpdated: "20.07.2026",
		addedBy: {
			type: "admin"
		},
		images: [],
		content: {
			ru: {
				name: "Бомбоубежище №1 (Белый дом)",
				description: "Защитное сооружение гражданской обороны (бомбоубежище), расположенное в подвальном помещении административного здания («Белый дом»)."
			},
			uk: {
				name: "Бомбосховище №1 (Білий дім)",
				description: "Захисна споруда цивільного захисту (бомбосховище), розташована у підвальному приміщенні адміністративної будівлі («Білий дім»)."
			},
			en: {
				name: "Bomb Shelter No. 1 (White House)",
				description: "A civil defense protective structure (bomb shelter) located in the basement of the administrative building ('White House')."
			}
		}
	},
	18: {
		type: "shelter",
		security: 4,
		condition: 4,
		coordinates: {
			lat: 48.923389,
			lng: 24.713306,
			display: "48°55'24.2\"N 24°42'47.9\"E"
		},
		lastUpdated: "20.07.2026",
		addedBy: {
			type: "admin"
		},
		images: [],
		content: {
			ru: {
				name: "Бомбоубежище №2 (Белый дом)",
				description: "Защитное сооружение гражданской обороны (бомбоубежище), расположенное в подвальном помещении административного здания («Белый дом»)."
			},
			uk: {
				name: "Бомбосховище №2 (Білий дім)",
				description: "Захисна споруда цивільного захисту (бомбосховище), розташована у підвальному приміщенні адміністративної будівлі («Білий дім»)."
			},
			en: {
				name: "Bomb Shelter No. 2 (White House)",
				description: "A civil defense protective structure (bomb shelter) located in the basement of the administrative building ('White House')."
			}
		}
	},
	19: {
		type: "shelter",
		security: 4,
		condition: 4,
		coordinates: {
			lat: 48.923417,
			lng: 24.713250,
			display: "48°55'24.3\"N 24°42'47.7\"E"
		},
		lastUpdated: "20.07.2026",
		addedBy: {
			type: "admin"
		},
		images: [],
		content: {
			ru: {
				name: "Бомбоубежище №3 (Белый дом)",
				description: "Защитное сооружение гражданской обороны (бомбоубежище), расположенное в подвальном помещении административного здания («Белый дом»)."
			},
			uk: {
				name: "Бомбосховище №3 (Білий дім)",
				description: "Захисна споруда цивільного захисту (бомбосховище), розташована у підвальному приміщенні адміністративної будівлі («Білий дім»)."
			},
			en: {
				name: "Bomb Shelter No. 3 (White House)",
				description: "A civil defense protective structure (bomb shelter) located in the basement of the administrative building ('White House')."
			}
		}
	},
	20: {
		type: "shelter",
		security: 4,
		condition: 4,
		coordinates: {
			lat: 48.923472,
			lng: 24.713000,
			display: "48°55'24.5\"N 24°42'46.8\"E"
		},
		lastUpdated: "20.07.2026",
		addedBy: {
			type: "admin"
		},
		images: [],
		content: {
			ru: {
				name: "Бомбоубежище №4 (Белый дом)",
				description: "Защитное сооружение гражданской обороны (бомбоубежище), расположенное в подвальном помещении административного здания («Белый дом»)."
			},
			uk: {
				name: "Бомбосховище №4 (Білий дім)",
				description: "Захисна споруда цивільного захисту (бомбосховище), розташована у підвальному приміщенні адміністративної будівлі («Білий дім»)."
			},
			en: {
				name: "Bomb Shelter No. 4 (White House)",
				description: "A civil defense protective structure (bomb shelter) located in the basement of the administrative building ('White House')."
			}
		}
	},
	21: {
		type: "abandoned",
		security: 0,
		condition: 2.5,
		closedYear: 2020,
		coordinates: {
			lat: 48.923295,
			lng: 24.707862,
			display: "48°55'23.9\"N 24°42'28.3\"E"
		},
		lastUpdated: "20.07.2026",
		addedBy: {
			type: "user",
			nickname: "🚷 HEART ☢️",
			socials: {
				tiktok: "https://www.tiktok.com/@dmcheart"
			}
		},
		images: ["laznyaneptun1.jpg"],
		content: {
			ru: {
				name: "Заброшенная баня «Нептун»",
				description: "Здание было построено в 1845 году и является памятником архитектуры местного значения. В тимпане его фасада установлен известный горельеф «Нептун с русалками». Исторически это место функционировало как баня и считалось старейшей действующей общественной баней в Украине."
			},
			uk: {
				name: "Закинута лазня «Нептун»",
				description: "Будинок був збудований у 1845 році та є пам'яткою архітектури місцевого значення. У тимпані його фасаду встановлено відомий горельєф «Нептун з русалками». Історично це місце функціонувало як лазня і вважалося найстарішою діючою громадською лазнею в Україні."
			},
			en: {
				name: "Abandoned Bathhouse 'Neptune'",
				description: "The building was constructed in 1845 and is a local architectural monument. A famous high-relief 'Neptune with Mermaids' is set in the tympanum of its facade. Historically, this place functioned as a bathhouse and was considered the oldest operating public bathhouse in Ukraine."
			}
		}
	},
	22: {
		type: "abandoned",
		security: 0,
		condition: 1.5,
		coordinates: {
			lat: 48.890136,
			lng: 24.760541,
			display: "48°53'24.5\"N 24°45'37.9\"E"
		},
		lastUpdated: "20.07.2026",
		addedBy: {
			type: "admin"
		},
		images: ["factor1.webp"],
		content: {
			ru: {
				name: "Заброшенная АГНКС «Фактор»",
				description: "Бывшая автомобильная газонаполнительная компрессорная станция (заправка) «Фактор». На данный момент полностью заброшена."
			},
			uk: {
				name: "Закинута АГНКС «Фактор»",
				description: "Колишня автомобільна газонаповнювальна компресорна станція (заправка) «Фактор». Наразі повністю закинута."
			},
			en: {
				name: "Abandoned AGNCKS 'Factor' Gas Station",
				description: "Former CNG (compressed natural gas) filling station 'Factor'. Currently completely abandoned."
			}
		}
	},
};
