import './styles/global.css';

const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
	let isStuck = false;
	const updateHeaderState = () => {
		const nextState = window.scrollY > 24;
		if (nextState === isStuck) return;
		isStuck = nextState;
		const update = () => siteHeader.classList.toggle('is-stuck', isStuck);
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
		const activeSection = document.getElementById(sectionId);
		const cubeColor = activeSection ? getComputedStyle(activeSection).getPropertyValue('--cube-section-color').trim() : '';
		if (cubeColor) document.documentElement.style.setProperty('--cube-current-color', cubeColor);
		if (cubeWrap) {
			cubeWrap.classList.remove(...Object.values(cubeSectionClasses), 'undefined');
			const cubeSectionClass = cubeSectionClasses[sectionId];
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

const contactForm = document.querySelector('[data-contact-form]');

if (contactForm) {
	contactForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const status = contactForm.querySelector('.form-status');
		status.textContent = 'Thanks. Your note is ready to send.';
		contactForm.reset();
	});
}
