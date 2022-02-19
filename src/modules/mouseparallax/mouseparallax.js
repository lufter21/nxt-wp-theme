/**
 * @constructor
 * @this {Mouseparallax}
 * @param {string} elSel
 * @param {object} [options={}]
 * @param {number} [options.deltaX=21]
 * @param {number} [options.deltaY=21]
 * @param {object[]} [options.rangeX=[]]
 * @param {number} options.rangeX[]
 * @param {number} options.rangeX[]
 * @param {object[]} [options.rangeY=[]]
 * @param {number} options.rangeY[0]
 * @param {number} options.rangeY[1]
 */

function Mouseparallax(elSel, options) {
	var _ = this,
		defaultOpt = {
			listener: document,
			deltaX: 21,
			deltaY: 21,
			rangeX: [],
			rangeY: [],
		},
		options = options || {},
		opt = $.extend({}, defaultOpt, options),
		startMousePos = { X: 0, Y: 0 },
		listenerW = $(opt.listener).innerWidth(),
		listenerH = $(opt.listener).innerHeight(),
		cursorPos = { X: 0, Y: 0 },
		direct = {},
		elems = [];

	_.disabled = false;

	$(elSel).each(function () {
		const $el = $(this);

		elems.push({
			$el: $el,
			translateElement: { X: 0, Y: 0 },
			startElementPos: { X: 0, Y: 0 },
			deltaX: ($el.attr('data-delta-x') !== undefined) ? +$el.attr('data-delta-x') : opt.deltaX,
			deltaY: ($el.attr('data-delta-y') !== undefined) ? +$el.attr('data-delta-y') : opt.deltaY,
			rangeX: ($el.attr('data-range-x') !== undefined) ? $el.attr('data-range-x').split(',') : opt.rangeX,
			rangeY: ($el.attr('data-range-y') !== undefined) ? $el.attr('data-range-y').split(',') : opt.rangeY
		});
	});

	$(document).on('mouseenter', opt.listener, function (e) {
		if (_.disabled) return;
		
		startMousePos.X = e.clientX;
		startMousePos.Y = e.clientY;
	});

	$(opt.listener).on('mousemove', opt.listener, function (e) {
		if (_.disabled) return;

		if (e.clientX > cursorPos.X) {
			direct.X = 'right';
		} else {
			direct.X = 'left';
		}
		cursorPos.X = e.clientX;

		if (e.clientY > cursorPos.Y) {
			direct.Y = 'up';
		} else {
			direct.Y = 'down';
		}
		cursorPos.Y = e.clientY;

		var deltaMouse = {
			X: e.clientX - startMousePos.X,
			Y: e.clientY - startMousePos.Y
		};

		elems.forEach(function (el) {
			el.translateElement = {
				X: deltaMouse.X * (el.deltaX / listenerW) + el.startElementPos.X,
				Y: deltaMouse.Y * (el.deltaY / listenerH) + el.startElementPos.Y
			};

			if (el.startMousePosX) {
				el.translateElement.X = (e.clientX - el.startMousePosX) * (el.deltaX / listenerW) + el.startElementPos.X;
			}

			if (el.startMousePosY) {
				el.translateElement.Y = (e.clientY - el.startMousePosY) * (el.deltaY / listenerH) + el.startElementPos.Y;
			}

			var translateX = el.translateElement.X,
				translateY = el.translateElement.Y;

			if (el.rangeX) {
				if (el.translateElement.X <= el.rangeX[0] * -1) {
					if (direct.X == 'left') {
						el.startMousePosX = e.clientX;
						el.startElementPos.X = +el.rangeX[0] * -1;
					}
					translateX = el.rangeX[0] * -1;
				} else if (el.translateElement.X >= el.rangeX[1]) {
					if (direct.X == 'right') {
						el.startMousePosX = e.clientX;
						el.startElementPos.X = +el.rangeX[1];
					}
					translateX = el.rangeX[1];
				}
			}

			if (el.rangeY) {
				if (el.translateElement.Y >= el.rangeY[1]) {
					if (direct.Y == 'down') {
						el.startMousePosY = e.clientY;
						el.startElementPos.Y = +el.rangeY[1];
					}
					translateY = el.rangeY[1];
				} else if (el.translateElement.Y <= +el.rangeY[0] * -1) {
					if (direct.Y == 'up') {
						el.startMousePosY = e.clientY;
						el.startElementPos.Y = +el.rangeY[0] * -1;
					}
					translateY = +el.rangeY[0] * -1;
				}
			}

			el.$el.css('transform', 'translate(' + translateX + 'px, ' + translateY + 'px)');
		});

	});

	$(document).on('mouseleave', opt.listener, function (e) {
		if (_.disabled) return;

		elems.forEach(function (el) {
			el.startElementPos.X = el.translateElement.X;
			el.startElementPos.Y = el.translateElement.Y;
			el.startMousePosX = null;
			el.startMousePosY = null;
		});
	});
}