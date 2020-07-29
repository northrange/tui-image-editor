/**
 * @author NorthRange Development Team
 * @fileoverview Clarendon filter
 */
import fabric from 'fabric';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Clarendon = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.Blend.prototype */ {
        type: 'Clarendon',

        blendFilter: new fabric.Image.filters.BlendColor({
            color: '#7fbbe3',
            mode: 'screen',
            alpha: 0.2
        }),

        contrastFilter: new fabric.Image.filters.Contrast({
            contrast: 0.15
        }),

        saturationFilter: new fabric.Image.filters.Saturation({
            saturation: 0.5
        }),

        /**
         * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
         *
         * @param {Object} options - options for filter application
         */
        applyTo2d(options) {
            this.blendFilter.applyTo2d(options);
            this.contrastFilter.applyTo2d(options);
            this.saturationFilter.applyTo2d(options);
        }
    }
);

fabric.Image.filters.Clarendon.fromObject = fabric.Image.filters.BaseFilter.fromObject;
