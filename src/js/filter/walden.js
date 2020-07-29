/**
 * @author NorthRange Development Team
 * @fileoverview Walden filter
 */
import fabric from 'fabric';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Walden = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.Blend.prototype */ {
        type: 'Walden',

        blendFilter: new fabric.Image.filters.BlendColor({
            color: '#0044cc',
            mode: 'screen',
            alpha: 0.3
        }),

        brightnessFilter: new fabric.Image.filters.Brightness({
            brightness: 0.06
        }),

        hueRotationFilter: new fabric.Image.filters.HueRotation({
            rotation: -10 / 180
        }),

        saturationFilter: new fabric.Image.filters.Saturation({
            saturation: 0.2
        }),

        texture: document.createElement('canvas'),

        /**
         * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
         *
         * @param {Object} options - options for filter application
         */
        applyTo2d(options) {
            this.blendFilter.applyTo2d(options);
            this.brightnessFilter.applyTo2d(options);
            this.hueRotationFilter.applyTo(options);
            this.saturationFilter.applyTo2d(options);
        }
    }
);

fabric.Image.filters.Walden.fromObject = fabric.Image.filters.BaseFilter.fromObject;
