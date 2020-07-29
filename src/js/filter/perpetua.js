/**
 * @author NorthRange Development Team
 * @fileoverview Perpetua filter
 */
import fabric from 'fabric';
import {blend, softLight} from './functions';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Perpetua = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.Blend.prototype */ {
        type: 'Perpetua',

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

            blend(options.imageData, topLayerImageData, softLight);
        },

        createTopLayer(width, height) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;
            const gradient = ctx.createLinearGradient(0, -height / 2, 0, 2 * height);

            gradient.addColorStop(0, '#005b9a');
            gradient.addColorStop(1, '#e6c13d');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            return ctx;
        }
    }
);

fabric.Image.filters.Perpetua.fromObject = fabric.Image.filters.BaseFilter.fromObject;
