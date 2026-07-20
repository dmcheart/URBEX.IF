document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const appContainer = document.getElementById('app-container');

    const infoModal = document.getElementById('info-modal');
    const agreementBody = document.getElementById('agreement-body');
    const footerLinks = document.querySelectorAll('.footer-link');

    const objectModal = document.getElementById('object-modal');
    const objectModalBody = document.getElementById('object-modal-body');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');

    const mapFilterToggle = document.getElementById('map-filter-toggle');
    const mapFilter = document.getElementById('map-filter');
    const mapFilterChecks = document.querySelectorAll('.map-filter-check');

    // Object details open as a centered modal on narrow screens (phones/tablets)
    // instead of the small side/bottom panel, which is cramped there.
    const isMobileView = () => window.matchMedia('(max-width: 768px)').matches;

    const langSwitch = document.getElementById('lang-switch');
    const langCurrentBtn = document.getElementById('lang-current');
    const langCurrentFlag = document.getElementById('lang-current-flag');
    const langDropdown = document.getElementById('lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    const LANG_KEY = 'urbex_lang';
    const COOKIE_CONSENT_KEY = 'urbex_cookie_consent';
    const SUPPORTED_LANGS = ['en', 'uk', 'ru'];
    // "uk" (Ukrainian, ISO code) maps to the "ua" flag-image folder on disk
    const LANG_META = {
        en: { folder: 'en' },
        uk: { folder: 'ua' },
        ru: { folder: 'ru' }
    };
    const flagSrc = (lang) => `Library/images/flags/${LANG_META[lang].folder}/32.png`;

    // ---------- Cookie helpers ----------
    const setCookie = (name, value, days) => {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    };

    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
    };

    let cookiesAllowed = getCookie(COOKIE_CONSENT_KEY) === 'accepted';

    let currentLang = (cookiesAllowed && getCookie(LANG_KEY)) || 'en';
    if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = 'en';
    let currentModalType = null;

    // ---------- 0. Sound effects ----------
    // click.mp3 plays for any click on a button, link, checkbox, marker pin,
    // or modal-close control anywhere on the site.
    // swoosh.mp3 plays whenever the map flies to a point (search result or
    // clicking a marker that's currently far from view), synced to the
    // start of that flyTo animation.
    const CLICK_SOUND_SRC = 'Library/sounds/click.mp3';
    const SWOOSH_SOUND_SRC = 'Library/sounds/swoosh.mp3';

    const clickAudio = new Audio(CLICK_SOUND_SRC);
    clickAudio.volume = 0.5;
    const swooshAudio = new Audio(SWOOSH_SOUND_SRC);
    swooshAudio.volume = 0.5;

    const playSound = (audio) => {
        try {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        } catch (err) {
            // Ignore playback errors (e.g. blocked before first user gesture)
        }
    };
    const playClickSound = () => playSound(clickAudio);
    const playSwooshSound = () => playSound(swooshAudio);

    document.addEventListener('click', (e) => {
        const interactive = e.target.closest(
            'button, a[href], .close-modal, .obj-marker-pin, input[type="checkbox"], input[type="radio"], .map-search-result'
        );
        if (interactive) playClickSound();
    });

    // How "far" a clicked marker needs to be from the current view before the
    // map flies to it (with the swoosh sound). Close markers just open their
    // panel without moving the map.
    const MAP_FOCUS_ZOOM = 17;
    const MAP_FOCUS_DISTANCE_PX = 120;

    const flyToWithSwoosh = (map, latlng, zoom) => {
        playSwooshSound();
        map.flyTo(latlng, zoom, { duration: 0.8 });
    };

    const focusMapOnPoint = (map, latlng) => {
        const targetZoom = Math.max(map.getZoom(), MAP_FOCUS_ZOOM);
        const centerPoint = map.latLngToContainerPoint(map.getCenter());
        const markerPoint = map.latLngToContainerPoint(latlng);
        const pixelDist = centerPoint.distanceTo(markerPoint);
        const isFar = map.getZoom() < MAP_FOCUS_ZOOM || pixelDist > MAP_FOCUS_DISTANCE_PX;
        if (isFar) flyToWithSwoosh(map, latlng, targetZoom);
    };

    // ---------- 1. Preloader ----------
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            if (appContainer) appContainer.classList.add('ready');
        }
    }, 1700);

    // ---------- 2. Language / i18n ----------
    const applyTranslations = (lang) => {
        const dict = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || {};
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) el.placeholder = dict[key];
        });
        document.documentElement.setAttribute('lang', lang);

        if (langCurrentFlag) langCurrentFlag.src = flagSrc(lang);
        langOptions.forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    };

    const setLanguage = (lang) => {
        if (!SUPPORTED_LANGS.includes(lang)) return;
        currentLang = lang;
        if (cookiesAllowed) setCookie(LANG_KEY, lang, 365);
        applyTranslations(lang);
        refreshObjectMarkersLanguage(lang);
        if (typeof updateNotifyState === 'function') updateNotifyState();
        // If a modal is currently open, re-render its content in the new language
        if (infoModal.classList.contains('show') && currentModalType) {
            renderModal(currentModalType);
        }
    };

    // ---------- 3. Language dropdown open/close ----------
    const closeLangDropdown = () => {
        langSwitch.classList.remove('open');
        langCurrentBtn.setAttribute('aria-expanded', 'false');
    };

    const toggleLangDropdown = () => {
        const isOpen = langSwitch.classList.toggle('open');
        langCurrentBtn.setAttribute('aria-expanded', String(isOpen));
        if (isOpen && mapFilter) mapFilter.classList.remove('open');
    };

    if (langCurrentBtn) {
        langCurrentBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLangDropdown();
        });
    }

    langOptions.forEach((btn) => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
            closeLangDropdown();
        });
    });

    document.addEventListener('click', (e) => {
        if (langSwitch && !langSwitch.contains(e.target)) closeLangDropdown();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLangDropdown();
    });

    applyTranslations(currentLang);

    // ---------- 4. Cookie consent banner ----------
    if (!cookiesAllowed && cookieBanner) {
        setTimeout(() => cookieBanner.classList.add('show'), 400);
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            cookiesAllowed = true;
            setCookie(COOKIE_CONSENT_KEY, 'accepted', 365);
            setCookie(LANG_KEY, currentLang, 365);
            if (cookieBanner) cookieBanner.classList.remove('show');
        });
    }

    // ---------- 5. Modal content rendering ----------
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };

    // Detect and strip bullet markers ("•", ".", "-") from a content line
    const parseLine = (line) => {
        const trimmed = line.trim();
        const bulletMatch = trimmed.match(/^[•.\-]\s+(.*)$/);
        if (bulletMatch) return { text: bulletMatch[1], isBullet: true };
        return { text: trimmed, isBullet: false };
    };

    // Turn any "@handle" mention into a clickable Telegram link (safe: runs on already-escaped text)
    const linkifyTelegram = (escapedText) => {
        return escapedText.replace(/@([a-zA-Z0-9_]{4,32})/g, (match, handle) => {
            return `<a href="https://t.me/${handle}" target="_blank" rel="noopener noreferrer" class="agreement-link">@${handle}</a>`;
        });
    };

    const getDataFor = (type) => {
        const source = type === 'agreement' ? window.AGREEMENT_DATA
            : type === 'licence' ? window.LICENCE_DATA
            : type === 'contacts' ? window.CONTACTS_DATA
            : null;
        return source ? source[currentLang] : null;
    };

    const renderModalContent = (data) => {
        const dict = (window.TRANSLATIONS && window.TRANSLATIONS[currentLang]) || {};
        const sectionsHtml = (data.sections || []).map((section) => {
            const contentHtml = (section.content || []).map((line) => {
                const { text, isBullet } = parseLine(line);
                const cls = isBullet ? ' class="agreement-bullet"' : '';
                return `<p${cls}>${linkifyTelegram(escapeHtml(text))}</p>`;
            }).join('');

            return `
                <div class="agreement-section">
                    <div class="agreement-section-title">${escapeHtml(section.title || '')}</div>
                    <div class="agreement-section-content">${contentHtml}</div>
                </div>
            `;
        }).join('');

        const updatedLabel = dict.updatedLabel || 'Updated:';

        agreementBody.innerHTML = `
            <div class="agreement-header">
                <div class="agreement-title">${escapeHtml(data.title || '')}</div>
                ${data.last_updated ? `<div class="agreement-updated">${escapeHtml(updatedLabel)} ${escapeHtml(data.last_updated)}</div>` : ''}
            </div>
            ${sectionsHtml}
        `;
    };

    const renderModal = (type) => {
        const dict = (window.TRANSLATIONS && window.TRANSLATIONS[currentLang]) || {};
        try {
            const data = getDataFor(type);
            if (!data) throw new Error(`No data found for "${type}"`);
            renderModalContent(data);
        } catch (err) {
            agreementBody.innerHTML = `<div class="agreement-error">${escapeHtml(dict.errorText || 'Failed to load this section.')}</div>`;
            console.error('Modal load error:', err);
        }
    };

    const openModal = (type) => {
        currentModalType = type;
        infoModal.classList.add('show');
        agreementBody.scrollTop = 0;
        renderModal(type);
    };

    // ---------- 6. Footer link triggers ----------
    footerLinks.forEach((link) => {
        if (!link.dataset.modal) return;
        link.addEventListener('click', () => openModal(link.dataset.modal));
    });

    // ---------- 7. Modal close (handles info modal, object modal, lightbox) ----------
    const allModals = document.querySelectorAll('.modal');

    document.querySelectorAll('.close-modal').forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.closeTarget;
            const target = targetId ? document.getElementById(targetId) : btn.closest('.modal');
            if (target) target.classList.remove('show');
        });
    });

    window.addEventListener('click', (e) => {
        allModals.forEach((modal) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') allModals.forEach((modal) => modal.classList.remove('show'));
    });

    // ---------- 9. Urbex objects (towers / bomb shelters / abandoned sites) ----------
    // All object data comes from window.OBJECTS_DATA (Library/js/objects-data.js),
    // loaded like the other *-data.js files — no fetch() involved, so this works
    // even when the site is opened directly from disk (file://).
    // See the comment block at the top of objects-data.js for the field reference
    // and instructions on adding a new object.
    const OBJECT_TYPE_COLORS = {
        tower: '#06ae93',
        shelter: '#c46d00',
        abandoned: '#deb07e'
    };

    const objectMarkers = []; // { marker, data }
    const objectPanel = document.getElementById('object-panel');
    let selectedObjectId = null;

    // Object content keys should be "ru" / "uk" / "en" (see objects-data.js field
    // reference). People sometimes write "ua" instead of "uk" for Ukrainian, so
    // we treat it as an alias here instead of silently failing to translate.
    const normalizeContentLang = (lang) => (lang === 'ua' ? 'uk' : lang);

    const getObjText = (data, field, lang) => {
        const chain = [normalizeContentLang(lang), 'ru', 'en', 'uk'];
        for (const l of chain) {
            const entry = (data.content && (data.content[l] || (l === 'uk' && data.content.ua)));
            const v = entry && entry[field];
            if (v) return v;
        }
        return '';
    };

    const conditionTierLabel = (value, dict) => {
        if (value >= 5) return dict.objTierSohran || 'Сохран';
        if (value > 2) return dict.objTierPolubayan || 'Полубаян';
        return dict.objTierBayan || 'Баян';
    };

    const objStarsRow = (value, size) => {
        size = size || 16;
        let html = '';
        for (let i = 1; i <= 5; i++) {
            let kind = 'empty';
            if (value >= i) kind = 'full';
            else if (value >= i - 0.5) kind = 'half';
            html += `<img class="obj-star" src="Library/images/stars/${kind}/32.png" width="${size}" height="${size}" alt="">`;
        }
        return html;
    };

    const objTypeLabelKey = (type) => (type === 'tower' ? 'objTypeTower' : type === 'shelter' ? 'objTypeShelter' : 'objTypeAbandoned');

    // Icon (inline SVG, Lucide-style) shown on each map pin, keyed by object type.
    const OBJECT_TYPE_ICON_SVG = {
        tower: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9"/><path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5"/><circle cx="12" cy="9" r="2"/><path d="M16.2 4.8c2 2 2.26 5.11.8 7.47"/><path d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1"/><path d="M9.5 18h5"/><path d="m8 22 4-11 4 11"/></svg>',
        shelter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
        abandoned: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>'
    };
    const OBJECT_TYPE_ICON_FALLBACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';

    const objectMarkerIcon = (type, lang) => {
        const dict = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || {};
        const color = OBJECT_TYPE_COLORS[type] || '#ffffff';
        const icon = OBJECT_TYPE_ICON_SVG[type] || OBJECT_TYPE_ICON_FALLBACK;
        const label = escapeHtml(dict[objTypeLabelKey(type)] || type || '');
        const html = `
            <div class="obj-marker-pin" style="--marker-color:${color}" title="${label}">
                <span class="obj-marker-emoji">${icon}</span>
            </div>
        `;
        return L.divIcon({
            html,
            className: 'obj-marker-icon',
            iconSize: [34, 44],
            iconAnchor: [17, 42],
            popupAnchor: [0, -36]
        });
    };

    const renderObjectPopup = (data, lang) => {
        const dict = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || {};
        const name = getObjText(data, 'name', lang) || `#${data.id}`;
        const description = getObjText(data, 'description', lang);
        const closureReason = getObjText(data, 'closureReason', lang);
        const typeLabel = dict[objTypeLabelKey(data.type)] || data.type;

        const security = typeof data.security === 'number' ? data.security : null;
        const condition = typeof data.condition === 'number' ? data.condition : null;

        // Note: if a photo doesn't appear, open the browser console — a failed
        // image now logs the exact path it tried to load instead of silently
        // vanishing, so a typo in the filename (or a file missing from
        // Library/images/objects/) is easy to spot.
        const galleryHtml = (data.images && data.images.length)
            ? `<div class="obj-gallery">${data.images.map((img) => {
                const src = `Library/images/objects/${encodeURI(img)}`;
                return `<img src="${src}" alt="" loading="lazy" class="obj-gallery-img" data-full="${src}" onerror="console.warn('URBEX.IF: image failed to load:', '${src}'); this.classList.add('obj-gallery-img-broken')">`;
            }).join('')}</div>`
            : '';

        let addedByHtml = '';
        if (data.addedBy) {
            if (data.addedBy.type === 'admin') {
                addedByHtml = escapeHtml(dict.objAddedByAdmin || 'Added by the Administration');
            } else {
                const nick = escapeHtml(data.addedBy.nickname || '');
                const socialLinks = [];
                if (data.addedBy.socials) {
                    Object.keys(data.addedBy.socials).forEach((key) => {
                        const url = data.addedBy.socials[key];
                        if (url) socialLinks.push(`<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="agreement-link">${escapeHtml(key)}</a>`);
                    });
                }
                addedByHtml = `${escapeHtml(dict.objAddedByLabel || 'Added by')}: ${nick}${socialLinks.length ? ' &middot; ' + socialLinks.join(' &middot; ') : ''}`;
            }
        }

        return `
            <div class="obj-popup">
                ${galleryHtml}
                <div class="obj-popup-name">${escapeHtml(name)}</div>
                <div class="obj-popup-type-badge" style="--type-color:${OBJECT_TYPE_COLORS[data.type] || '#fff'}">${escapeHtml(typeLabel)}</div>

                ${security !== null ? `
                <div class="obj-popup-row">
                    <span class="obj-popup-label">${escapeHtml(dict.objSecurityLabel || 'Security')}</span>
                    <span class="obj-stars-row">${objStarsRow(security)}</span>
                </div>` : ''}

                ${condition !== null && data.type !== 'tower' ? `
                <div class="obj-popup-row">
                    <span class="obj-popup-label">${escapeHtml(dict.objConditionLabel || 'Condition')}</span>
                    <span class="obj-stars-row">${objStarsRow(condition)}</span>
                    <span class="obj-condition-tier">${escapeHtml(conditionTierLabel(condition, dict))}</span>
                </div>` : ''}

                ${description ? `<div class="obj-popup-desc">${escapeHtml(description)}</div>` : ''}
                ${closureReason ? `<div class="obj-popup-closure"><b>${escapeHtml(dict.objClosureLabel || 'Closed because')}:</b> ${escapeHtml(closureReason)}</div>` : ''}
                ${data.closedYear ? `<div class="obj-popup-closed-year">${escapeHtml(dict.objClosedYearLabel || 'Closed in')}: ${escapeHtml(String(data.closedYear))}</div>` : ''}

                ${data.coordinates && data.coordinates.display ? `<div class="obj-popup-coords" data-copy="${escapeHtml(data.coordinates.display)}" title="${escapeHtml(dict.objCopyCoords || 'Click to copy')}">${escapeHtml(data.coordinates.display)}</div>` : ''}

                ${data.lastUpdated ? `<div class="obj-popup-updated">${escapeHtml(dict.updatedLabel || 'Updated:')} ${escapeHtml(data.lastUpdated)}</div>` : ''}

                ${addedByHtml ? `<div class="obj-popup-added-by">${addedByHtml}</div>` : ''}
            </div>
        `;
    };

    const renderObjectPanelEmpty = (lang) => {
        const dict = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || {};
        return `<div class="object-panel-empty" data-i18n="objPanelEmpty">${escapeHtml(dict.objPanelEmpty || 'Select an object on the map to see details.')}</div>`;
    };

    const showObjectInPanel = (data, lang) => {
        selectedObjectId = data.id;
        const html = renderObjectPopup(data, lang);

        if (isMobileView()) {
            if (objectModalBody) objectModalBody.innerHTML = html;
            if (objectModal) objectModal.classList.add('show');
        } else if (objectPanel) {
            objectPanel.innerHTML = html;
        }

        objectMarkers.forEach(({ marker, data: markerData }) => {
            const el = marker.getElement();
            if (el) el.classList.toggle('obj-marker-selected', markerData.id === data.id);
        });
    };

    const refreshObjectMarkersLanguage = (lang) => {
        objectMarkers.forEach(({ marker, data }) => {
            marker.setIcon(objectMarkerIcon(data.type, lang));
        });
        const selected = objectMarkers.find(({ data }) => data.id === selectedObjectId);

        if (objectModal && objectModal.classList.contains('show') && objectModalBody) {
            objectModalBody.innerHTML = selected ? renderObjectPopup(selected.data, lang) : '';
        }
        if (objectPanel) {
            objectPanel.innerHTML = selected ? renderObjectPopup(selected.data, lang) : renderObjectPanelEmpty(lang);
        }
    };

    const loadObjects = (map) => {
        const objectsData = window.OBJECTS_DATA || {};
        const typeCounts = { tower: 0, shelter: 0, abandoned: 0 };
        Object.keys(objectsData).forEach((id) => {
            const data = objectsData[id];
            if (!data || !data.coordinates) return;
            data.id = data.id || id;
            if (typeCounts[data.type] !== undefined) typeCounts[data.type] += 1;
            const marker = L.marker([data.coordinates.lat, data.coordinates.lng], {
                icon: objectMarkerIcon(data.type, currentLang)
            }).addTo(map);
            marker.on('click', () => {
                focusMapOnPoint(map, marker.getLatLng());
                showObjectInPanel(data, currentLang);
            });
            objectMarkers.push({ marker, data });
        });
        document.querySelectorAll('.map-filter-count').forEach((el) => {
            const type = el.dataset.typeCount;
            el.textContent = String(typeCounts[type] || 0);
        });
    };

    // Copy coordinates to clipboard when a popup's coordinate line is clicked
    document.addEventListener('click', (e) => {
        const coordsEl = e.target.closest('.obj-popup-coords');
        if (!coordsEl) return;
        const value = coordsEl.dataset.copy;
        if (value && navigator.clipboard) {
            navigator.clipboard.writeText(value).catch(() => {});
            const dict = (window.TRANSLATIONS && window.TRANSLATIONS[currentLang]) || {};
            const original = coordsEl.textContent;
            coordsEl.textContent = dict.objCoordsCopied || 'Copied';
            setTimeout(() => { coordsEl.textContent = original; }, 1200);
        }
    });

    // If the window is resized across the mobile breakpoint while an object is
    // selected, move its content to wherever it should now be shown.
    let wasMobileView = isMobileView();
    window.addEventListener('resize', () => {
        const nowMobile = isMobileView();
        if (nowMobile === wasMobileView) return;
        wasMobileView = nowMobile;

        const selected = objectMarkers.find(({ data }) => data.id === selectedObjectId);
        if (!selected) return;

        if (nowMobile) {
            if (objectPanel) objectPanel.innerHTML = renderObjectPanelEmpty(currentLang);
            if (objectModalBody) objectModalBody.innerHTML = renderObjectPopup(selected.data, currentLang);
            if (objectModal) objectModal.classList.add('show');
        } else {
            if (objectModal) objectModal.classList.remove('show');
            if (objectPanel) objectPanel.innerHTML = renderObjectPopup(selected.data, currentLang);
        }
    });

    // ---------- Map type filter: open/close the dropdown ----------
    if (mapFilterToggle && mapFilter) {
        mapFilterToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mapFilter.classList.toggle('open');
            mapFilterToggle.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) closeLangDropdown();
        });
        document.addEventListener('click', (e) => {
            if (!mapFilter.contains(e.target)) {
                mapFilter.classList.remove('open');
                mapFilterToggle.setAttribute('aria-expanded', 'false');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') mapFilter.classList.remove('open');
        });
    }

    // Open a gallery photo full-size in the lightbox modal
    document.addEventListener('click', (e) => {
        const img = e.target.closest('.obj-gallery-img');
        if (!img || img.classList.contains('obj-gallery-img-broken')) return;
        if (lightboxModal && lightboxImage) {
            lightboxImage.src = img.dataset.full || img.src;
            lightboxModal.classList.add('show');
        }
    });

    // ---------- 8. Interactive map (Ivano-Frankivsk) ----------
    const mapEl = document.getElementById('site-map');
    if (mapEl && window.L) {
        const IVANO_FRANKIVSK = [48.9226, 24.7111];
        const map = L.map('site-map', {
            scrollWheelZoom: true,
            attributionControl: false
        }).setView(IVANO_FRANKIVSK, 13);

        // Small "Leaflet |" prefix removed — only the legally required
        // OpenStreetMap/CARTO credit is shown, styled small in style.css.
        L.control.attribution({ prefix: false }).addTo(map);

        // CartoDB "dark" basemap: matches the site's dark theme and — unlike the
        // default OSM tiles — doesn't clutter the map with shop/amenity icons.
        // Brightness is lifted via CSS (.leaflet-tile-pane) so it doesn't read as pure black.
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        loadObjects(map);

        // ---------- Object search (by name, across all languages) ----------
        const searchInput = document.getElementById('map-search-input');
        const searchResultsEl = document.getElementById('map-search-results');

        const normalizeSearch = (s) => (s || '').toString().toLowerCase().trim();

        const searchObjects = (query) => {
            const q = normalizeSearch(query);
            if (!q) return [];
            return objectMarkers.filter(({ data }) => {
                return ['ru', 'uk', 'en'].some((l) => {
                    const name = data.content && data.content[l] && data.content[l].name;
                    return name && normalizeSearch(name).includes(q);
                });
            }).slice(0, 8);
        };

        const renderSearchResults = (results) => {
            const dict = (window.TRANSLATIONS && window.TRANSLATIONS[currentLang]) || {};
            const hasQuery = !!normalizeSearch(searchInput.value);
            if (!results.length) {
                searchResultsEl.innerHTML = hasQuery
                    ? `<div class="map-search-empty">${escapeHtml(dict.searchNoResults || 'No objects found.')}</div>`
                    : '';
                searchResultsEl.classList.toggle('show', hasQuery);
                return;
            }
            searchResultsEl.innerHTML = results.map(({ data }) => {
                const name = getObjText(data, 'name', currentLang) || `#${data.id}`;
                const typeLabel = dict[objTypeLabelKey(data.type)] || data.type;
                return `
                    <button type="button" class="map-search-result" data-id="${escapeHtml(String(data.id))}">
                        <span class="map-search-result-emoji">${OBJECT_TYPE_ICON_SVG[data.type] || OBJECT_TYPE_ICON_FALLBACK}</span>
                        <span class="map-search-result-text">
                            <span class="map-search-result-name">${escapeHtml(name)}</span>
                            <span class="map-search-result-type">${escapeHtml(typeLabel)}</span>
                        </span>
                    </button>
                `;
            }).join('');
            searchResultsEl.classList.add('show');
        };

        if (searchInput && searchResultsEl) {
            searchInput.addEventListener('input', () => {
                renderSearchResults(searchObjects(searchInput.value));
            });

            searchInput.addEventListener('focus', () => {
                if (normalizeSearch(searchInput.value)) renderSearchResults(searchObjects(searchInput.value));
            });

            searchResultsEl.addEventListener('click', (e) => {
                const btn = e.target.closest('.map-search-result');
                if (!btn) return;
                const found = objectMarkers.find(({ data }) => String(data.id) === btn.dataset.id);
                if (found) {
                    flyToWithSwoosh(map, [found.data.coordinates.lat, found.data.coordinates.lng], 17);
                    showObjectInPanel(found.data, currentLang);
                }
                searchResultsEl.classList.remove('show');
                searchInput.value = '';
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('#map-search')) searchResultsEl.classList.remove('show');
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') searchResultsEl.classList.remove('show');
            });
        }

        // ---------- 10. Type filter (checkboxes in the map-filter dropdown) ----------
        // All three types are ON by default; unchecking one removes those
        // markers from the map (not just visually hides them).
        const activeTypes = new Set(['tower', 'shelter', 'abandoned']);

        const applyTypeFilter = () => {
            objectMarkers.forEach(({ marker, data }) => {
                const shouldShow = activeTypes.has(data.type);
                const isOnMap = map.hasLayer(marker);
                if (shouldShow && !isOnMap) marker.addTo(map);
                if (!shouldShow && isOnMap) map.removeLayer(marker);
            });
        };

        mapFilterChecks.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                const type = checkbox.dataset.type;
                if (checkbox.checked) activeTypes.add(type);
                else activeTypes.delete(type);
                applyTypeFilter();
            });
        });
    }

    // ---------- 11. Suggest-an-object form ----------
    // No backend: the form builds a plain-text summary of what the person
    // entered and either copies it to the clipboard or opens Telegram with it
    // pre-filled so they can send it to the administrator. Photos are only
    // previewed here (filenames) — the person still has to attach the same
    // files themselves in Telegram, since a static site has nowhere to
    // actually upload them to.
    const ADMIN_TELEGRAM_USERNAME = 'twistedk1d';
    const MAX_SUBMIT_PHOTOS = 4;

    const submitModal = document.getElementById('submit-modal');
    const submitNameInput = document.getElementById('submit-name');
    const submitTypeInput = document.getElementById('submit-type');
    const submitDescInput = document.getElementById('submit-description');
    const submitClosedYearInput = document.getElementById('submit-closed-year');
    const submitCoordsInput = document.getElementById('submit-coords');
    const submitPhotosInput = document.getElementById('submit-photos');
    const submitPhotosPreview = document.getElementById('submit-photos-preview');
    const submitNotifyCheckbox = document.getElementById('submit-notify-me');
    const submitNotifyHint = document.getElementById('submit-notify-hint');
    const submitAuthorFields = document.getElementById('submit-author-fields');
    const submitNicknameInput = document.getElementById('submit-nickname');
    const submitNicknameError = document.getElementById('submit-nickname-error');
    const submitTiktokInput = document.getElementById('submit-tiktok');
    const submitYoutubeInput = document.getElementById('submit-youtube');
    const submitCopyBtn = document.getElementById('submit-copy-btn');
    const submitTelegramBtn = document.getElementById('submit-telegram-btn');
    const submitCopiedMsg = document.getElementById('submit-copied-msg');
    const navSubmitBtn = document.getElementById('nav-submit');

    let submitPhotoFiles = [];

    if (navSubmitBtn && submitModal) {
        navSubmitBtn.addEventListener('click', () => {
            submitModal.classList.add('show');
        });
    }

    // "Credit me as the author" toggle: off -> the suggestion is listed as
    // incognito and the nickname/TikTok/YouTube fields are hidden and left
    // out of the message; on -> those fields show and a nickname is required.
    const updateNotifyState = () => {
        const dict = (window.TRANSLATIONS && window.TRANSLATIONS[currentLang]) || {};
        const on = !!(submitNotifyCheckbox && submitNotifyCheckbox.checked);
        if (submitAuthorFields) submitAuthorFields.classList.toggle('show', on);
        if (submitNotifyHint) {
            submitNotifyHint.textContent = on
                ? (dict.submitNotifyHintOn || 'On — remember to fill in your nickname below.')
                : (dict.submitNotifyHintOff || 'Off — the object will be listed as added incognito.');
        }
        if (!on && submitNicknameInput) submitNicknameInput.classList.remove('input-error');
        if (!on && submitNicknameError) submitNicknameError.classList.remove('show');
    };

    if (submitNotifyCheckbox) {
        submitNotifyCheckbox.addEventListener('change', updateNotifyState);
        updateNotifyState();
    }

    if (submitPhotosInput && submitPhotosPreview) {
        submitPhotosInput.addEventListener('change', () => {
            const dict = (window.TRANSLATIONS && window.TRANSLATIONS[currentLang]) || {};
            const allFiles = Array.from(submitPhotosInput.files || []);
            submitPhotoFiles = allFiles.slice(0, MAX_SUBMIT_PHOTOS);
            const overLimitHtml = allFiles.length > MAX_SUBMIT_PHOTOS
                ? `<div class="submit-photos-limit">${escapeHtml(dict.submitMaxPhotos || 'Only the first 4 photos will be included.')}</div>`
                : '';
            submitPhotosPreview.innerHTML = submitPhotoFiles.map((f) => `<span class="submit-photo-chip">${escapeHtml(f.name)}</span>`).join('') + overLimitHtml;
        });
    }

    // Returns false (and flags the nickname field) if "Credit me as the
    // author" is on but no nickname was entered — there's nothing to credit
    // otherwise. Returns true whenever the check doesn't apply.
    const validateSubmitForm = () => {
        const notifyOn = !!(submitNotifyCheckbox && submitNotifyCheckbox.checked);
        if (!notifyOn) return true;
        if (submitNicknameInput && submitNicknameInput.value.trim()) return true;
        if (submitNicknameInput) submitNicknameInput.classList.add('input-error');
        if (submitNicknameError) submitNicknameError.classList.add('show');
        if (submitNicknameInput) submitNicknameInput.focus();
        return false;
    };

    if (submitNicknameInput) {
        submitNicknameInput.addEventListener('input', () => {
            if (submitNicknameInput.value.trim()) {
                submitNicknameInput.classList.remove('input-error');
                if (submitNicknameError) submitNicknameError.classList.remove('show');
            }
        });
    }

    const buildSubmitText = () => {
        const dict = (window.TRANSLATIONS && window.TRANSLATIONS[currentLang]) || {};
        const typeLabel = dict[objTypeLabelKey(submitTypeInput.value)] || submitTypeInput.value;
        const notifyOn = !!(submitNotifyCheckbox && submitNotifyCheckbox.checked);
        const lines = [`URBEX.IF — ${dict.submitMsgTitle || 'Object suggestion'}`, ''];

        if (submitNameInput.value.trim()) lines.push(`${dict.submitMsgName || 'Name'}: ${submitNameInput.value.trim()}`);
        lines.push(`${dict.submitMsgType || 'Type'}: ${typeLabel}`);
        if (submitDescInput.value.trim()) lines.push(`${dict.submitMsgDescription || 'Description'}: ${submitDescInput.value.trim()}`);
        if (submitClosedYearInput.value.trim()) lines.push(`${dict.submitMsgClosedYear || 'Closed in'}: ${submitClosedYearInput.value.trim()}`);
        if (submitCoordsInput.value.trim()) {
            lines.push(`${dict.submitMsgCoords || 'Coordinates'}: ${submitCoordsInput.value.trim()}`);
        }
        if (submitPhotoFiles.length) {
            lines.push(`${dict.submitMsgPhotos || 'Photos'}: ${submitPhotoFiles.length} — ${submitPhotoFiles.map((f) => f.name).join(', ')}`);
        }

        if (notifyOn) {
            if (submitNicknameInput.value.trim()) lines.push(`${dict.submitMsgNickname || 'Nickname'}: ${submitNicknameInput.value.trim()}`);
            if (submitTiktokInput.value.trim()) lines.push(`TikTok: ${submitTiktokInput.value.trim()}`);
            if (submitYoutubeInput.value.trim()) lines.push(`YouTube: ${submitYoutubeInput.value.trim()}`);
        } else {
            lines.push(`${dict.submitMsgNickname || 'Author'}: ${dict.submitIncognitoValue || 'Incognito'}`);
        }

        return lines.join('\n');
    };

    if (submitCopyBtn) {
        submitCopyBtn.addEventListener('click', () => {
            if (!validateSubmitForm()) return;
            const text = buildSubmitText();
            if (!navigator.clipboard) return;
            navigator.clipboard.writeText(text).then(() => {
                if (submitCopiedMsg) {
                    submitCopiedMsg.classList.add('show');
                    setTimeout(() => submitCopiedMsg.classList.remove('show'), 1800);
                }
            }).catch(() => {});
        });
    }

    if (submitTelegramBtn) {
        submitTelegramBtn.addEventListener('click', () => {
            if (!validateSubmitForm()) return;
            const text = buildSubmitText();
            const url = `https://t.me/${ADMIN_TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        });
    }

});
