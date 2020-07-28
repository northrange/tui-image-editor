/**
 * @author NorthRange Development Team
 * @fileoverview Toaster filter
 */
import fabric from 'fabric';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Toaster = fabric.util.createClass(fabric.Image.filters.BaseFilter,
    /** @lends fabric.Image.filters.Blend.prototype */ {
        type: 'Toaster',

        contrastFilter: new fabric.Image.filters.Contrast({
            contrast: 0.17
        }),

        brightnessFilter: new fabric.Image.filters.Brightness({
            brightness: -0.08
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
            const gradient = this.toasterGradient(width, height);
            const gradientImageData = gradient.getImageData(0, 0, width, height);

            this.blend(options.imageData, gradientImageData,
                (bottomPixel, topPixel) => 255 - (255 - topPixel) * (255 - bottomPixel) / 255);

            this.contrastFilter.applyTo2d(options);
            this.brightnessFilter.applyTo2d(options);
        },

        toasterGradient(width, height) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.6);

            gradient.addColorStop(0, '#804e0f');
            gradient.addColorStop(1, '#3b003b');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            return ctx;
        },

        blend(backgroundData, foregroundData, transform) {
            for (let i = 0, size = backgroundData.data.length; i < size; i += 4) {
                // red
                backgroundData.data[i] = transform(backgroundData.data[i], foregroundData.data[i]);
                // green
                backgroundData.data[i + 1] = transform(backgroundData.data[i + 1], foregroundData.data[i + 1]);
                // blue
                backgroundData.data[i + 2] = transform(backgroundData.data[i + 2], foregroundData.data[i + 2]);
                // the fourth slot is alpha. We don't need that (so skip by 4)
            }

            return backgroundData;
        }
    }
);

fabric.Image.filters.Toaster.fromObject = fabric.Image.filters.BaseFilter.fromObject;
