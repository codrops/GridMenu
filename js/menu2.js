/**
 * menu2.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */
{
	class Box {
		constructor(el, pos) {
			this.DOM = {el: el};
			this.DOM.bg = this.DOM.el.querySelector('.grim__item-bg');
			this.DOM.inner = this.DOM.el.querySelector('.grim__item-content > .grim__item-inner');
			this.DOM.img = this.DOM.el.querySelector('.grim__item-img');
			this.DOM.cover = this.DOM.el.querySelector('.grim__item-bg-cover');
			this.DOM.link = this.DOM.el.querySelector('a.grim__link');
			this.pos = pos;
		}
		open() {
			return new Promise((resolve, reject) => {
				this.DOM.bg.style.transformOrigin = this.pos % 2 === 0 ? '50% 100%' : '0% 50%';

				anime.remove(this.DOM.bg);
				anime({
					targets: this.DOM.bg,
					duration: this.DOM.bg.dataset.duration || 40+this.pos*20, // increment as more boxes get revealed..
					easing: this.DOM.bg.dataset.easing || 'easeInOutQuad',
					opacity: {
						value: 1,
						duration: 1
					},
					scaleY: this.pos % 2 === 0 ? [0,1] : 1,
					scaleX: Math.abs(this.pos % 2) == 1 ? [0,1] : 1,
					complete: () => {
						if ( this.DOM.img && this.DOM.cover ) {
							this.DOM.img.style.opacity = 1;
							this.DOM.cover.style.opacity = 1;
							this.DOM.cover.style.transformOrigin = '100% 50%';
							anime.remove(this.DOM.cover);
							anime({
								targets: this.DOM.cover,
								duration: 700,
								easing: 'easeOutQuint',
								scaleX: [1,0]
							});
						}

						if ( this.DOM.inner ) {
							anime.remove(this.DOM.inner);
							anime({
								targets: this.DOM.inner,
								duration: 1200,
								delay: 150,
								easing: 'easeOutQuint',
								opacity: {
									value: 1,
									duration: 1
								},
								translateY: ['100%','0%']
							});
						}
						
						resolve();
					}
				});
			});
		}
		close() {
			return new Promise((resolve, reject) => {
				const animateBoxFn = () => {
					this.DOM.bg.style.transformOrigin = this.pos % 2 === 0 ? '50% 0%' : '100% 50%';

					anime.remove(this.DOM.bg);
					anime({
						targets: this.DOM.bg,
						duration: this.DOM.bg.dataset.duration || 80+this.pos*10,
						easing: this.DOM.bg.dataset.easing || 'easeInOutQuad',
						opacity: {
							value: 0,
							delay: this.DOM.bg.dataset.duration || 40+this.pos*10,
							duration: 1
						},
						scaleY: this.pos % 2 === 0 ? [1,0] : 1,
						scaleX: Math.abs(this.pos % 2) == 1 ? [1,0] : 1,
						complete: resolve
					});
				};

				if ( this.DOM.img && this.DOM.cover ) {
					anime.remove(this.DOM.img);
					anime({
						targets: this.DOM.img,
						duration: 200,
						easing: 'linear',
						opacity: 0
					});
				}
				animateBoxFn();

				if ( this.DOM.inner ) {
					this.DOM.inner.style.opacity = 0;
				}
			});
		}
	}

	class Menu {
		constructor(el) {
			this.DOM = {el: el};
			this.DOM.items = Array.from(this.DOM.el.querySelectorAll('.grim__item'));
			this.itemsTotal = this.DOM.items.length;
			this.boxes = [];
			this.DOM.items.forEach((item, pos) => {
				this.boxes.push(new Box(item, pos));
			});

			this.initEvents();
		}
		initEvents() {
			for( let i = 0; i < this.itemsTotal; ++i ) {
				const link = this.boxes[i].DOM.link;
				if ( link ) {
					link.addEventListener('click', (ev) => {
						ev.preventDefault();
						if ( this.isAnimating ) return;
						document.querySelector('.content--switch-current').classList.remove('content--switch-current');
						document.querySelector(link.getAttribute('href')).classList.add('content--switch-current');
						this.close();
					});
				}
			}
		}
		open() {
			this.toggle('open');
		}
		close() {
			this.toggle('close');
		}
		toggle(action) {
			if ( this.isAnimating ) return;
			this.isAnimating = true;
			if ( action === 'open' ) {
				this.openBoxes();
			}
			else {
				this.closeBoxes();
			}
		}
		openBoxes(pos = 0) {
			this.toggleBoxes('open', pos);
		}
		closeBoxes(pos = 0) {
			this.toggleBoxes('close', pos);
		}
		toggleBoxes(action, pos) {
			if ( pos >= this.itemsTotal ) {
				this.isAnimating = false;
				return;
			};
			DOM.grim.classList[action === 'open' ? 'add' : 'remove']('grim--open');
			const box = this.boxes[pos];
			box[action === 'open' ? 'open' : 'close']().then(() => this[action === 'open' ? 'openBoxes' : 'closeBoxes'](pos+1));
		}
	}

	let DOM = {};

	imagesLoaded(document.querySelectorAll('.grim__item-img'), {background: true}, () => {
		document.body.classList.remove('loading');

		DOM.grim = document.querySelector('.grim');
		DOM.menu = new Menu(DOM.grim);
		DOM.menuCtrls = {
			open: document.querySelector('.menu-trigger'),
			close: document.querySelector('.menu-trigger--close')
		};
	
		DOM.menuCtrls.open.addEventListener('click', () => DOM.menu.open());
		DOM.menuCtrls.close.addEventListener('click', () => DOM.menu.close());
	});
}