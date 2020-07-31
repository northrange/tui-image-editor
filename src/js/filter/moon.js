/**
 * @author NorthRange Development Team
 * @fileoverview Moon filter
 */
import fabric from 'fabric';
import {blend, softLight} from './functions';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Moon = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.BaseFilter.prototype */ {
        type: 'Moon',

        blendFilter: new fabric.Image.filters.BlendColor({
            color: '#383838',
            mode: 'lighten'
        }),

        grayscaleFilter: new fabric.Image.filters.Grayscale({
            mode: 'luminosity'
        }),

        contrastFilter: new fabric.Image.filters.Contrast({
            contrast: 0.1
        }),

        brightnessFilter: new fabric.Image.filters.Brightness({
            brightness: 0.1
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
            const topLayer = this.createTopLayer(width, height, '#a0a0a0');
            const topLayerImageData = topLayer.getImageData(0, 0, width, height);

            blend(options.imageData, topLayerImageData, softLight);
            this.blendFilter.applyTo2d(options);
            this.grayscaleFilter.applyTo2d(options);
            this.contrastFilter.applyTo2d(options);
            this.brightnessFilter.applyTo2d(options);
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

fabric.Image.filters.Moon.fromObject = fabric.Image.filters.BaseFilter.fromObject;
