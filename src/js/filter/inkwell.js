/**
 * @author NorthRange Development Team
 * @fileoverview Inkwell filter
 */
import fabric from 'fabric';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Inkwell = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.Blend.prototype */ {
        type: 'Inkwell',

        contrastFilter: new fabric.Image.filters.Contrast({
            contrast: 0.17
        }),

        brightnessFilter: new fabric.Image.filters.Brightness({
            brightness: 0.14
        }),

        grayscaleFilter: new fabric.Image.filters.Grayscale({
            mode: 'luminosity'
        }),

        /**
         * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
         *
         * @param {Object} options - options for filter application
         */
        applyTo2d(options) {
            this.contrastFilter.applyTo2d(options);
            this.brightnessFilter.applyTo2d(options);
            this.grayscaleFilter.applyTo2d(options);
        }
    }
);

fabric.Image.filters.Inkwell.fromObject = fabric.Image.filters.BaseFilter.fromObject;
