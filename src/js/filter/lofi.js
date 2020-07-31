/**
 * @author NorthRange Development Team
 * @fileoverview Lofi filter
 */
import fabric from 'fabric';
import {blend, multiply} from './functions';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Lofi = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.BaseFilter.prototype */ {
        type: 'Lofi',

        contrastFilter: new fabric.Image.filters.Contrast({
            contrast: 0.25
        }),

        saturationFilter: new fabric.Image.filters.Saturation({
            saturation: 0.1
        }),

        texture: document.createElement('canvas'),

        /**
         * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
         *
         * @param {Object} options - options for filter application
         */
        applyTo2d(options) {
            const width = options.sourceWidth;
            const height = options.sourceHeight;
            const topLayer = this.createTopLayer(width, height);
            const topLayerImageData = topLayer.getImageData(0, 0, width, height);

            blend(options.imageData, topLayerImageData, multiply);
            this.contrastFilter.applyTo2d(options);
            this.saturationFilter.applyTo2d(options);
        },

        createTopLayer(width, height) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);

            gradient.addColorStop(0.45, 'white');
            gradient.addColorStop(1, '#222222');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            return ctx;
        }
    }
);

fabric.Image.filters.Lofi.fromObject = fabric.Image.filters.BaseFilter.fromObject;
