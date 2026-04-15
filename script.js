document.addEventListener('DOMContentLoaded', () => {
	const header = document.querySelector('.site-header');
	if (header) {
		header.addEventListener('pointermove', (event) => {
			const bounds = header.getBoundingClientRect();
			const x = ((event.clientX - bounds.left) / bounds.width) * 100;
			const y = ((event.clientY - bounds.top) / bounds.height) * 100;
			header.style.setProperty('--crack-x', `${x}%`);
			header.style.setProperty('--crack-y', `${y}%`);
			header.style.setProperty('--crack-strength', '0.1');
		});

		header.addEventListener('pointerleave', () => {
			header.style.setProperty('--crack-strength', '0.05');
			header.style.setProperty('--crack-x', '90%');
			header.style.setProperty('--crack-y', '35%');
		});
	}

	const projectContainers = document.querySelectorAll('.project-container');

	projectContainers.forEach((container) => {
		let isDragging = false;
		let dragIntent = false;
		let dragStartX = 0;
		let scrollStartX = 0;
		let dragged = false;
		let lastPointerX = 0;
		let lastPointerTime = 0;
		let velocityX = 0;
		let inertiaFrameId = null;

		const stopInertia = () => {
			if (inertiaFrameId !== null) {
				window.cancelAnimationFrame(inertiaFrameId);
				inertiaFrameId = null;
			}
		};

		const startInertia = () => {
			if (Math.abs(velocityX) < 0.15) {
				return;
			}

			const step = () => {
				velocityX *= 0.94;
				container.scrollLeft -= velocityX * 16;

				if (Math.abs(velocityX) < 0.15) {
					inertiaFrameId = null;
					return;
				}

				inertiaFrameId = window.requestAnimationFrame(step);
			};

			inertiaFrameId = window.requestAnimationFrame(step);
		};

		const endDrag = () => {
			isDragging = false;
			dragIntent = false;
			container.classList.remove('is-dragging');
			startInertia();
		};

		container.addEventListener('pointerdown', (event) => {
			if (event.button !== 0) {
				return;
			}

			stopInertia();
			dragIntent = true;
			isDragging = false;
			dragged = false;
			dragStartX = event.clientX;
			lastPointerX = event.clientX;
			lastPointerTime = performance.now();
			velocityX = 0;
			container.dataset.pointerId = String(event.pointerId);
		});

		container.addEventListener('pointermove', (event) => {
			if (!dragIntent && !isDragging) {
				return;
			}

			const dragDistance = event.clientX - dragStartX;

			if (!isDragging && Math.abs(dragDistance) > 10) {
				isDragging = true;
				scrollStartX = container.scrollLeft;
				container.classList.add('is-dragging');
				if (container.dataset.pointerId) {
					container.setPointerCapture(Number(container.dataset.pointerId));
				}
			}

			if (Math.abs(dragDistance) > 10) {
				dragged = true;
			}

			if (dragged) {
				container.scrollLeft = scrollStartX - dragDistance;
				const now = performance.now();
				const timeDelta = now - lastPointerTime || 16;
				velocityX = (event.clientX - lastPointerX) / timeDelta;
				lastPointerX = event.clientX;
				lastPointerTime = now;
				event.preventDefault();
			}
		});

		container.addEventListener('pointerup', (event) => {
			if (container.hasPointerCapture(event.pointerId)) {
				container.releasePointerCapture(event.pointerId);
			}

			delete container.dataset.pointerId;
			endDrag();
		});
		container.addEventListener('pointercancel', (event) => {
			if (container.hasPointerCapture(event.pointerId)) {
				container.releasePointerCapture(event.pointerId);
			}

			delete container.dataset.pointerId;
			endDrag();
		});
		container.addEventListener('lostpointercapture', () => {
			delete container.dataset.pointerId;
			endDrag();
		});

		container.addEventListener(
			'click',
			(event) => {
				if (!dragged) {
					return;
				}

				event.preventDefault();
				event.stopPropagation();
				dragged = false;
			},
			true
		);

		container.addEventListener('dragstart', (event) => {
			event.preventDefault();
		});
	});
});
