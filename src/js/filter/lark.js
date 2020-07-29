/**
 * @author NorthRange Development Team
 * @fileoverview Lark filter
 */
import fabric from 'fabric';
import {blend, colorDodge} from './functions';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Lark = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.Blend.prototype */ {
        type: 'Lark',

        blendFilter: new fabric.Image.filters.BlendColor({
            color: '#f2f2f2',
            mode: 'darken',
            alpha: 1
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
            const colorDodgeLayer = this.createTopLayer(width, height, '#22253f');
            const colorDodgeLayerImageData = colorDodgeLayer.getImageData(0, 0, width, height);

            blend(options.imageData, colorDodgeLayerImageData, colorDodge);
            this.blendFilter.applyTo2d(options);
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

fabric.Image.filters.Lark.fromObject = fabric.Image.filters.BaseFilter.fromObject;
