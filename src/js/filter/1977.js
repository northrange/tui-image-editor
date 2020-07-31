/**
 * @author NorthRange Development Team
 * @fileoverview 1977 filter
 */
import fabric from 'fabric';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.F1977 = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.BaseFilter.prototype */ {
        type: 'F1977',

        blendFilter: new fabric.Image.filters.BlendColor({
            color: '#f36abc',
            mode: 'screen',
            alpha: 0.3
        }),

        contrastFilter: new fabric.Image.filters.Contrast({
            contrast: 0.15
        }),

        brightnessFilter: new fabric.Image.filters.Brightness({
            brightness: 0.05
        }),

        saturationFilter: new fabric.Image.filters.Saturation({
            saturate: 20
        }),

        /**
         * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
         *
         * @param {Object} options - options for filter application
         */
        applyTo2d(options) {
            this.blendFilter.applyTo2d(options);
            this.contrastFilter.applyTo2d(options);
            this.brightnessFilter.applyTo2d(options);
            this.saturationFilter.applyTo2d(options);
        }
    }
);

fabric.Image.filters.F1977.fromObject = fabric.Image.filters.BaseFilter.fromObject;
