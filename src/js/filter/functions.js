/* eslint-disable no-mixed-operators */

/**
 * 
 * @param {ImageData} backgroundData - the Uint8ClampedArray of the background image.
 * @param {ImageData} foregroundData - the Uint8ClampedArray of the foreground image.
 * @param {ImageData} transform - the transformation function
 * @returns {ImageData} - the Uint8ClampedArray of the result
 */
export function blend(backgroundData, foregroundData, transform) {
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

/**
 * Applies the color-dodge blend mode.
 * @param {number} bottomPixel - the bottom layer pixel
 * @param {number} topPixel - the top layer pixel
 * @returns {number} - the result of the color-dogde blend mode
 */
export function colorDodge(bottomPixel, topPixel) {
    return bottomPixel * 255 / (255 - topPixel);
}

/**
 * Applies the multiply blend mode.
 * @param {number} bottomPixel - the bottom layer pixel
 * @param {number} topPixel - the top layer pixel
 * @returns {number} - the result of the multiply blend mode
 */
export function multiply(bottomPixel, topPixel) {
    return (bottomPixel * topPixel) / 255;
}

/**
 * Applies the overlay blend mode.
 * @param {number} bottomPixel - the bottom layer pixel
 * @param {number} topPixel - the top layer pixel
 * @returns {number} - the result of the overlay blend mode
 */
export function overlay(bottomPixel, topPixel) {
    return bottomPixel < 128
        ? 2 * bottomPixel * topPixel / 255
        : 255 - 2 * (255 - topPixel) * (255 - bottomPixel) / 255;
}

/**
 * Applies the soft-light blend mode.
 * @param {number} bottomPixel - the bottom layer pixel
 * @param {number} topPixel - the top layer pixel
 * @returns {number} - the result of the soft-light blend mode
 */
export function softLight(bottomPixel, topPixel) {
    return topPixel < 128
        ? 2 * (topPixel * bottomPixel) / 255 + Math.pow(bottomPixel, 2) * (255 - 2 * topPixel) / (255 * 255)
        : 2 * bottomPixel * (255 - topPixel) / 255 + Math.sqrt(bottomPixel / 255) * (2 * topPixel - 255);
}
