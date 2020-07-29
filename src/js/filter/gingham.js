/**
 * @author NorthRange Development Team
 * @fileoverview Gingham filter
 */
import fabric from 'fabric';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Gingham = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.Blend.prototype */ {
        type: 'Gingham',

        blendFilter: new fabric.Image.filters.BlendColor({
            color: 'lavender',
            mode: 'screen',
            alpha: 0.35
        }),

        brightnessFilter: new fabric.Image.filters.Brightness({
            brightness: 0.03
        }),

        hueRotationFilter: new fabric.Image.filters.HueRotation({
            rotation: -10 / 180
        }),

        contrastFilter: new fabric.Image.filters.Contrast({
            contrast: 0.03
        }),

        /**
         * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
         *
         * @param {Object} options - options for filter application
         */
        applyTo2d(options) {
            this.blendFilter.applyTo2d(options);
            this.brightnessFilter.applyTo2d(options);
            this.hueRotationFilter.applyTo(options);
            this.contrastFilter.applyTo2d(options);
        }
    }
);

fabric.Image.filters.Gingham.fromObject = fabric.Image.filters.BaseFilter.fromObject;
