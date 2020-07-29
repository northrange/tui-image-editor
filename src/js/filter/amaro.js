/**
 * @author NorthRange Development Team
 * @fileoverview Amaro filter
 */
import fabric from 'fabric';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Amaro = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.Blend.prototype */ {
        type: 'Amaro',

        hueRotationFilter: new fabric.Image.filters.HueRotation({
            rotation: -10 / 180
        }),

        contrastFilter: new fabric.Image.filters.Contrast({
            contrast: -0.02
        }),

        brightnessFilter: new fabric.Image.filters.Brightness({
            brightness: 0.1
        }),

        saturationFilter: new fabric.Image.filters.Saturation({
            saturation: 0.35
        }),

        /**
         * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
         *
         * @param {Object} options - options for filter application
         */
        applyTo2d(options) {
            this.hueRotationFilter.applyTo(options);
            this.contrastFilter.applyTo2d(options);
            this.brightnessFilter.applyTo2d(options);
            this.saturationFilter.applyTo2d(options);
        }
    }
);

fabric.Image.filters.Amaro.fromObject = fabric.Image.filters.BaseFilter.fromObject;
