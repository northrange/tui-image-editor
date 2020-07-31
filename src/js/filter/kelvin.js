/**
 * @author NorthRange Development Team
 * @fileoverview Kelvin filter
 */
import fabric from 'fabric';
import {blend, overlay, colorDodge} from './functions';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Kelvin = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.BaseFilter.prototype */ {
        type: 'Kelvin',

        texture: document.createElement('canvas'),

        /**
         * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
         *
         * @param {Object} options - options for filter application
         */
        applyTo2d(options) {
            const width = options.sourceWidth;
            const height = options.sourceHeight;
            const overlayLayer = this.createTopLayer(width, height, '#b77d21');
            const colorDodgeLayer = this.createTopLayer(width, height, '#382c34');
            const overlayLayerImageData = overlayLayer.getImageData(0, 0, width, height);
            const colorDodgeLayerImageData = colorDodgeLayer.getImageData(0, 0, width, height);

            blend(options.imageData, overlayLayerImageData, overlay);
            blend(options.imageData, colorDodgeLayerImageData, colorDodge);
        },

        createTopLayer(width, height, color) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;

            ctx.fillStyle = color;
            ctx.fillRect(0, 0, width, height);

            return ctx;
        }
    }
);

fabric.Image.filters.Kelvin.fromObject = fabric.Image.filters.BaseFilter.fromObject;
