/**
 * @author NorthRange Development Team
 * @fileoverview Nashville filter
 */
import fabric from 'fabric';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Nashville = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.Blend.prototype */ {
        type: 'Nashville',

        lightenBlendFilter: new fabric.Image.filters.BlendColor({
            color: '#004696',
            mode: 'lighten',
            alpha: 0.7
        }),

        darkenBlendFilter: new fabric.Image.filters.BlendColor({
            color: '#f7b099',
            mode: 'darken',
            alpha: 1.25
        }),

        contrastFilter: new fabric.Image.filters.Contrast({
            contrast: 0.06
        }),

        brightnessFilter: new fabric.Image.filters.Brightness({
            brightness: 0.06
        }),

        saturationFilter: new fabric.Image.filters.Saturation({
            saturation: 0.1
        }),

        texture: document.createElement('canvas'),

        /**
         * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
         *
         * @param {Object} options - options for filter application
         */
        applyTo2d(options) {
            this.darkenBlendFilter.applyTo2d(options);
            this.lightenBlendFilter.applyTo2d(options);
            this.contrastFilter.applyTo2d(options);
            this.brightnessFilter.applyTo2d(options);
            this.saturationFilter.applyTo2d(options);
        }
    }
);

fabric.Image.filters.Nashville.fromObject = fabric.Image.filters.BaseFilter.fromObject;
