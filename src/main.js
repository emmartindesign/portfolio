import './styles/global.css';


const siteHeader = document.querySelector('.site-header');
const siteSocial = document.querySelector('.site-social');

if (siteHeader || siteSocial) {
	let isStuck = false;
	const updateHeaderState = () => {
		const nextState = window.scrollY > 24;
		if (nextState === isStuck) return;
		isStuck = nextState;
		const update = () => {
			if (siteHeader) siteHeader.classList.toggle('is-stuck', isStuck);
			if (siteSocial) siteSocial.classList.toggle('is-stuck', isStuck);
		};
		if (document.startViewTransition) document.startViewTransition(update);
		else update();
	};
	updateHeaderState();
	window.addEventListener('scroll', updateHeaderState, { passive: true });
}

const sections = [...document.querySelectorAll('main > section[id]')];
const tocLinks = [...document.querySelectorAll('.toc a')];
const toc = document.querySelector('.toc');
const sectionModifierClasses = sections.reduce((classes, section) => {
	classes[section.id] = `section-${section.id}`;
	return classes;
}, {});
const cubeWrap = document.querySelector('.cube-wrap');
const cubeSectionClasses = sections.reduce((classes, section) => {
	classes[section.id] = `cube-wrap--${section.id}`;
	return classes;
}, {});

if (sections.length && tocLinks.length) {
	const setCurrentSection = (sectionId) => {
		const isPastHero = sectionId !== 'hero';
		const sectionModifierClass = sectionModifierClasses[sectionId];
		tocLinks.forEach((link) => {
			link.setAttribute('aria-current', link.getAttribute('href') === `#${sectionId}` ? 'true' : 'false');
		});
		if (toc) {
			toc.classList.toggle('is-visible', isPastHero);
			toc.classList.remove(...Object.values(sectionModifierClasses).map((className) => `toc--${className}`));
			if (sectionModifierClass) toc.classList.add(`toc--${sectionModifierClass}`);
		}
		if (siteHeader) {
			siteHeader.classList.remove(...Object.values(sectionModifierClasses).map((className) => `site-header--${className}`));
			if (sectionModifierClass) siteHeader.classList.add(`site-header--${sectionModifierClass}`);
		}
		if (siteSocial) {
			siteSocial.classList.remove(...Object.values(sectionModifierClasses).map((className) => `site-social--${className}`));
			if (sectionModifierClass) siteSocial.classList.add(`site-social--${sectionModifierClass}`);
		}
		const activeSection = document.getElementById(sectionId);
		const cubeColor = activeSection ? getComputedStyle(activeSection).getPropertyValue('--cube-section-color').trim() : '';
		if (cubeColor) {
			document.documentElement.style.setProperty('--cube-current-color', cubeColor);
			if (cubeWrap) cubeWrap.style.setProperty('--cube-current-color', cubeColor);
		}
		if (cubeWrap) {
			const cubeSectionClass = cubeSectionClasses[sectionId];
			cubeWrap.classList.remove(...Object.values(cubeSectionClasses), 'undefined');
			if (cubeSectionClass) cubeWrap.classList.add(cubeSectionClass);
		}
	};

	const sectionObserver = new IntersectionObserver((entries) => {
		const visibleSection = entries
			.filter((entry) => entry.isIntersecting)
			.sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
		if (visibleSection) setCurrentSection(visibleSection.target.id);
	}, { threshold: 0.55 });

	sections.forEach((section) => sectionObserver.observe(section));
	const hashTarget = window.location.hash ? document.querySelector(window.location.hash) : null;
	const initialSection = hashTarget || document.getElementById('hero') || sections[0];
	setCurrentSection(initialSection.id);
}

const contactForms = document.querySelectorAll('[data-contact-form]');

contactForms.forEach((form) => {
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const status = form.querySelector('.form-status');
		const submitBtn = form.querySelector('.submit-button');
		const formData = new FormData(form);

		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.textContent = 'Sending...';
		}
		if (status) {
			status.textContent = '';
		}

		try {
			const response = await fetch(form.action || 'https://formspree.io/f/xoeqzodb', {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json'
				}
			});

			if (response.ok) {
				if (status) status.textContent = 'Thanks! Your inquiry has been sent.';
				form.reset();
			} else {
				const data = await response.json();
				if (status) {
					if (data && data.errors && data.errors.length) {
						status.textContent = data.errors.map((err) => err.message).join(', ');
					} else {
						status.textContent = 'Oops! There was a problem sending your message.';
					}
				}
			}
		} catch (error) {
			if (status) status.textContent = 'Oops! There was a network issue. Please try again.';
		} finally {
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.innerHTML = 'Send inquiry &rarr;';
			}
		}
	});
});

// ─── Image Zoom Dialog / Lightbox ───────────────────────────────────────────
let mediaDialog = document.querySelector('.media-dialog');

if (!mediaDialog) {
	mediaDialog = document.createElement('dialog');
	mediaDialog.className = 'media-dialog';
	mediaDialog.innerHTML = `
		<div class="media-dialog-content">
			<button class="media-dialog-close" type="button" aria-label="Close dialog">&times;</button>
			<img src="" alt="" />
			<p class="media-dialog-caption"></p>
		</div>
	`;
	document.body.appendChild(mediaDialog);

	const closeBtn = mediaDialog.querySelector('.media-dialog-close');
	closeBtn.addEventListener('click', () => mediaDialog.close());

	// Close on backdrop click
	mediaDialog.addEventListener('click', (event) => {
		const rect = mediaDialog.querySelector('.media-dialog-content').getBoundingClientRect();
		const isInDialog = (
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width
		);
		if (!isInDialog) {
			mediaDialog.close();
		}
	});
}

const registerZoomImages = () => {
	const zoomImages = document.querySelectorAll(
		'.grid-col-media img, .grid-media-full img, .gallery-card img, .carousel-slide img, [data-zoomable]'
	);
	zoomImages.forEach((img) => {
		if (img.dataset.hasZoomListener) return;
		img.dataset.hasZoomListener = 'true';

		img.addEventListener('click', () => {
			const slide = img.closest('.carousel-slide');
			if (slide && !slide.classList.contains('is-centered')) {
				// Don't zoom if slide is not centered; clicking will center it instead
				return;
			}

			const dialogImg = mediaDialog.querySelector('img');
			const dialogCaption = mediaDialog.querySelector('.media-dialog-caption');
			dialogImg.src = img.currentSrc || img.src;
			dialogImg.alt = img.alt || '';

			// Look for neighboring caption if available
			const parent = img.closest('.grid-col-media, .grid-media-full, .media-container, .carousel-slide, .gallery-card');
			const caption = parent ? parent.querySelector('.media-caption, .carousel-slide-caption, p') : null;
			dialogCaption.textContent = caption ? caption.textContent.trim() : (img.alt || '');
			dialogCaption.style.display = dialogCaption.textContent ? 'block' : 'none';

			if (typeof mediaDialog.showModal === 'function') {
				mediaDialog.showModal();
			} else {
				mediaDialog.setAttribute('open', '');
			}
		});
	});
};

registerZoomImages();

// ─── Auto-Scrolling Snap Carousel with Dots ─────────────────────────────────
const initCarousels = () => {
	const carousels = document.querySelectorAll('.case-study-carousel');

	carousels.forEach((carousel) => {
		const viewport = carousel.querySelector('.carousel-viewport');
		const slides = carousel.querySelectorAll('.carousel-slide');
		const dotsContainer = carousel.querySelector('.carousel-dots');

		if (!viewport || !slides.length) return;

		let activeIndex = 0;
		let ticking = false;

		const scrollToSlide = (idx) => {
			if (!slides[idx]) return;
			const targetScroll = slides[idx].offsetLeft + (slides[idx].offsetWidth / 2) - (viewport.clientWidth / 2);
			viewport.scrollTo({ left: targetScroll, behavior: 'smooth' });
		};

		// Generate dots if not present
		if (dotsContainer && !dotsContainer.children.length) {
			slides.forEach((_, idx) => {
				const dot = document.createElement('button');
				dot.type = 'button';
				dot.className = `carousel-dot ${idx === 0 ? 'is-active' : ''}`;
				dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
				dot.addEventListener('click', () => {
					scrollToSlide(idx);
				});
				dotsContainer.appendChild(dot);
			});
		}

		const dots = carousel.querySelectorAll('.carousel-dot');

		// Click on non-centered slide scrolls it into center
		slides.forEach((slide, idx) => {
			slide.addEventListener('click', (e) => {
				if (!slide.classList.contains('is-centered')) {
					e.preventDefault();
					e.stopPropagation();
					scrollToSlide(idx);
				}
			});
		});

		// Identify the centered slide and sync classes/dots
		const updateCenteredSlides = () => {
			const viewportRect = viewport.getBoundingClientRect();
			const viewportCenter = viewportRect.left + (viewportRect.width / 2);
			let closestIndex = 0;
			let minDiff = Infinity;

			slides.forEach((slide, idx) => {
				const slideRect = slide.getBoundingClientRect();
				const slideCenter = slideRect.left + (slideRect.width / 2);
				const diff = Math.abs(viewportCenter - slideCenter);
				if (diff < minDiff) {
					minDiff = diff;
					closestIndex = idx;
				}
			});

			activeIndex = closestIndex;

			slides.forEach((slide, idx) => {
				slide.classList.toggle('is-centered', idx === closestIndex);
			});

			dots.forEach((dot, idx) => {
				dot.classList.toggle('is-active', idx === closestIndex);
			});

			ticking = false;
		};

		viewport.addEventListener('scroll', () => {
			if (!ticking) {
				window.requestAnimationFrame(updateCenteredSlides);
				ticking = true;
			}
		}, { passive: true });

		// Initialize center slide on load and on resize
		updateCenteredSlides();
		window.addEventListener('resize', updateCenteredSlides, { passive: true });

		// Auto-scroll slowly, pausing on mouse hover or touch
		let autoScrollTimer = null;
		const interval = parseInt(carousel.dataset.interval, 10) || 6000;

		const nextSlide = () => {
			const nextIdx = (activeIndex + 1) % slides.length;
			scrollToSlide(nextIdx);
		};

		const startAutoScroll = () => {
			if (!autoScrollTimer && slides.length > 1) {
				autoScrollTimer = setInterval(nextSlide, interval);
			}
		};

		const stopAutoScroll = () => {
			if (autoScrollTimer) {
				clearInterval(autoScrollTimer);
				autoScrollTimer = null;
			}
		};

		carousel.addEventListener('mouseenter', stopAutoScroll);
		carousel.addEventListener('mouseleave', startAutoScroll);
		carousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
		carousel.addEventListener('touchend', startAutoScroll, { passive: true });

		startAutoScroll();
	});
};

initCarousels();


