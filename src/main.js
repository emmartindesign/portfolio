import './styles/global.css';

const isProtectedCaseStudy = document.body.dataset.protected === 'true';

if (isProtectedCaseStudy) {
	const password = 'emm-ds-1';
	const gate = document.createElement('section');
	gate.className = 'case-study-gate';
	gate.setAttribute('aria-labelledby', 'case-study-gate-title');
	gate.innerHTML = '<div class="case-study-gate-panel"><a class="case-study-back" href="/">&larr; Back</a><p class="eyebrow">Private case study</p><h1 id="case-study-gate-title" class="display">Enter password</h1><form class="case-study-gate-form"><label for="case-study-password">Password<input id="case-study-password" name="password" type="password" autocomplete="current-password" required></label><button class="submit-button" type="submit">View case study &rarr;</button><p class="case-study-gate-status" role="alert" aria-live="polite"></p></form></div>';
	document.body.append(gate);

	gate.querySelector('form').addEventListener('submit', (event) => {
		event.preventDefault();
		const input = gate.querySelector('input');
		const status = gate.querySelector('.case-study-gate-status');
		if (input.value !== password) {
			status.textContent = 'That password did not work.';
			input.select();
			return;
		}
		document.body.classList.add('case-study-unlocked');
		document.querySelector('[data-protected-content]').innerHTML = '<div class="case-study-hero"><a class="case-study-back case-study-back-top" href="/">&larr; Back</a><h1 class="display">Raintree AI PDLC</h1><h2>Speeding up the product design lifecycle with generative AI and design-system context.</h2></div><div class="case-study-body"><dl class="case-study-meta"><div><dt>Roles</dt><dd>Product design, AI workflow strategy</dd></div><div><dt>Tools</dt><dd>Figma, design-system libraries, generative AI tools</dd></div><div><dt>Team</dt><dd>Raintree product and engineering team</dd></div><div><dt>Timeline</dt><dd>Placeholder timeline</dd></div></dl><article><h3>Overview</h3><p>Product design processes are quickly adopting generative AI tools for every step in the process. This work explored how design systems can provide the necessary context for generated user interfaces.</p><h4>Goal</h4><p>Streamline Raintree’s PDLC process so teams can move faster while keeping product outputs consistent and useful.</p><h4>Section title 1</h4><p>Placeholder text</p><h4>Section title 2</h4><p>Placeholder text</p><h4>Section title 3</h4><p>Placeholder text</p><blockquote class="case-study-quote">Quote Placeholder</blockquote></article></div><a class="case-study-back" href="/">&larr; Back to the portfolio</a>';
		gate.remove();
	});
}

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
