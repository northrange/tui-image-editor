/**
 * @author NorthRange Development Team
 * @fileoverview Brooklyn filter
 */
import fabric from 'fabric';
import {blend, overlay} from './functions';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Brooklyn = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.BaseFilter.prototype */ {
        type: 'Brooklyn',

        brightnessFilter: new fabric.Image.filters.Brightness({
            brightness: -0.05
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

            blend(options.imageData, topLayerImageData, overlay);

            this.brightnessFilter.applyTo2d(options);
        },

        createTopLayer(width, height) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);

            gradient.addColorStop(0, '#a8dfc1');
            gradient.addColorStop(1, '#c4b7c8');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            return ctx;
        }
    }
);

fabric.Image.filters.Brooklyn.fromObject = fabric.Image.filters.BaseFilter.fromObject;
