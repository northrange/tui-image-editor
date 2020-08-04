/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Image crop module (start cropping, end cropping)
 */
import snippet from 'tui-code-snippet';
import fabric from 'fabric';
import Component from '../interface/component';
import Cropzone from '../extension/cropzone';
import {eventNames as events, keyCodes, componentNames, CROPZONE_DEFAULT_OPTIONS} from '../consts';
import {clamp, fixFloatingPoint} from '../util';

const MOUSE_MOVE_THRESHOLD = 10;
const DEFAULT_OPTION = {
    presetRatio: null,
    top: -10,
    left: -10,
    height: 1,
    width: 1
};

/**
 * Cropper components
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @class Cropper
 * @ignore
 */
class Cropper extends Component {
    constructor(graphics) {
        super(componentNames.CROPPER, graphics);

        /**
         * Cropzone
         * @type {Cropzone}
         * @private
         */
        this._cropzone = null;

        /**
         * StartX of Cropzone
         * @type {number}
         * @private
         */
        this._startX = null;

        /**
         * StartY of Cropzone
         * @type {number}
         * @private
         */
        this._startY = null;

        /**
         * Fixed aspect ratio of Cropzone
         * @type {number}
         * @private
         */
        this._fixedAspectRatio = null;

        /**
         * State whether shortcut key is pressed or not
         * @type {boolean}
         * @private
         */
        this._withShiftKey = false;

        /**
         * Listeners
         * @type {object.<string, function>}
         * @private
         */
        this._listeners = {
            keydown: this._onKeyDown.bind(this),
            keyup: this._onKeyUp.bind(this),
            mousedown: this._onFabricMouseDown.bind(this),
            mousemove: this._onFabricMouseMove.bind(this),
            mouseup: this._onFabricMouseUp.bind(this)
        };
    }

    /**
     * Start cropping
     */
    start() {
        if (this._cropzone) {
            return;
        }
        const canvas = this.getCanvas();

        canvas.forEachObject(obj => { // {@link http://fabricjs.com/docs/fabric.Object.html#evented}
            obj.evented = false;
        });

        this._cropzone = new Cropzone(canvas, snippet.extend({
            left: -1,
            top: -1,
            width: 0.5,
            height: 0.5,
            strokeWidth: 0, // {@link https://github.com/kangax/fabric.js/issues/2860}
            cornerSize: 10,
            cornerColor: 'black',
            fill: 'transparent'
        }, CROPZONE_DEFAULT_OPTIONS, this.graphics.cropSelectionStyle));

        canvas.discardActiveObject();
        canvas.add(this._cropzone);
        canvas.on('mouse:down', this._listeners.mousedown);
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';

        fabric.util.addListener(document, 'keydown', this._listeners.keydown);
        fabric.util.addListener(document, 'keyup', this._listeners.keyup);
    }

    /**
     * End cropping
     */
    end() {
        const canvas = this.getCanvas();
        const cropzone = this._cropzone;

        if (!cropzone) {
            return;
        }
        canvas.remove(cropzone);
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        canvas.off('mouse:down', this._listeners.mousedown);
        canvas.forEachObject(obj => {
            obj.evented = true;
        });

        this._cropzone = null;

        fabric.util.removeListener(document, 'keydown', this._listeners.keydown);
        fabric.util.removeListener(document, 'keyup', this._listeners.keyup);
    }

    /**
     * Change cropzone visible
     * @param {boolean} visible - cropzone visible state
     */
    changeVisibility(visible) {
        if (this._cropzone) {
            this._cropzone.set({visible});
        }
    }

    selectCropzoneRect() {
        const canvas = this.getCanvas();
        const cropzone = this._cropzone;

        canvas.remove(cropzone);
        canvas.add(cropzone);
        canvas.setActiveObject(cropzone);
    }

    /**
     * onMousedown handler in fabric canvas
     * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event
     * @private
     */
    _onFabricMouseDown(fEvent) {
        const canvas = this.getCanvas();

        if (fEvent.target) {
            this.selectCropzoneRect();

            return;
        }

        canvas.selection = false;
        const coord = canvas.getPointer(fEvent.e);

        this._startX = coord.x;
        this._startY = coord.y;

        canvas.on({
            'mouse:move': this._listeners.mousemove,
            'mouse:up': this._listeners.mouseup
        });
    }

    /**
     * onMousemove handler in fabric canvas
     * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event
     * @private
     */
    _onFabricMouseMove(fEvent) {
        const canvas = this.getCanvas();
        const pointer = canvas.getPointer(fEvent.e);
        const {x, y} = pointer;
        const cropzone = this._cropzone;

        if (Math.abs(x - this._startX) + Math.abs(y - this._startY) > MOUSE_MOVE_THRESHOLD) {
            canvas.remove(cropzone);
            cropzone.set(this._calcRectDimensionFromPoint(x, y));

            canvas.add(cropzone);
            canvas.setActiveObject(cropzone);

            cropzone.canvasEventTrigger[events.OBJECT_SCALED](cropzone);
        }
    }

    /**
     * Get rect dimension setting from Canvas-Mouse-Position(x, y)
     * @param {number} x - Canvas-Mouse-Position x
     * @param {number} y - Canvas-Mouse-Position Y
     * @returns {{left: number, top: number, width: number, height: number}}
     * @private
     */
    _calcRectDimensionFromPoint(x, y) {
        const canvas = this.getCanvas();
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const startX = this._startX;
        const startY = this._startY;

        let width = Math.max(Math.abs(clamp(x, startX, x >= startX ? canvasWidth : 0) - startX), 1);
        let height = Math.max(Math.abs(clamp(y, startY, y >= startY ? canvasHeight : 0) - startY), 1);

        [width, height] = this._ensureRectDimensionIsInBoundary(x, y, width, height);

        const left = x >= startX ? startX : startX - width;
        const top = y >= startY ? startY : startY - height;

        return {
            left,
            top,
            width,
            height
        };
    }

    _ensureRectDimensionIsInBoundary(x, y, width, height) {
        const canvas = this.getCanvas();
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const startX = this._startX;
        const startY = this._startY;
        const maxWidth = Math.abs((x >= startX ? canvasWidth : 0) - startX);
        const maxHeight = Math.abs((y >= startY ? canvasHeight : 0) - startY);

        if (this._fixedAspectRatio) {
            const currentAspect = fixFloatingPoint(width / height);
            width = currentAspect >= this._fixedAspectRatio ? width : height * this._fixedAspectRatio;
            height = currentAspect >= this._fixedAspectRatio ? width / this._fixedAspectRatio : height;
        }

        const stayInBoundFactor = Math.max(width / maxWidth, height / maxHeight, 1);
        width = width / stayInBoundFactor;
        height = height / stayInBoundFactor;

        return [width, height];
    }

    _isCropzoneSet() {
        return this._cropzone && this._cropzone.left >= 0 && this._cropzone.top >= 0;
    }

    /**
     * onMouseup handler in fabric canvas
     * @private
     */
    _onFabricMouseUp() {
        const cropzone = this._cropzone;
        const listeners = this._listeners;
        const canvas = this.getCanvas();

        canvas.setActiveObject(cropzone);
        canvas.off({
            'mouse:move': listeners.mousemove,
            'mouse:up': listeners.mouseup
        });
    }

    /**
     * Get cropped image data
     * @param {Object} cropRect cropzone rect
     *  @param {Number} cropRect.left left position
     *  @param {Number} cropRect.top top position
     *  @param {Number} cropRect.width width
     *  @param {Number} cropRect.height height
     * @returns {?{imageName: string, url: string}} cropped Image data
     */
    getCroppedImageData(cropRect) {
        const canvas = this.getCanvas();
        const containsCropzone = canvas.contains(this._cropzone);
        if (!cropRect) {
            return null;
        }

        if (containsCropzone) {
            canvas.remove(this._cropzone);
        }

        const imageData = {
            imageName: this.getImageName(),
            url: canvas.toDataURL(cropRect)
        };

        if (containsCropzone) {
            canvas.add(this._cropzone);
        }

        return imageData;
    }

    /**
     * Get cropped rect
     * @returns {Object} rect
     */
    getCropzoneRect() {
        const cropzone = this._cropzone;

        if (!cropzone.isValid()) {
            return null;
        }

        return {
            left: cropzone.left,
            top: cropzone.top,
            width: cropzone.width,
            height: cropzone.height
        };
    }

    /**
     * Set a cropzone rectangle
     * @param {number} [aspectRatio] - aspect ratio to use for the cropzone rect
     * @param {boolean} [fixAspect] - whether or not to fix the aspect ratio
     * @param {number} [sizeInPercent] - the size of the cropzone in percentage of the original image
     */
    setCropzoneRect(aspectRatio, fixAspect, sizeInPercent) {
        this._renderCropzoneRect(aspectRatio, fixAspect, ar => ar
            ? this._getPresetPropertiesForCropSize(ar, fixAspect, sizeInPercent || 0.5)
            : DEFAULT_OPTION);
    }

    /**
     * Update the current cropzone rect, taking the given preset ratio as the basis for the cropzone rect.
     * @param {number} [aspectRatio] - aspect ratio to use for the new cropzone rect
     * @param {boolean} [fixAspect] - whether or not to fix the aspect ratio
     */
    updateCropzoneRect(aspectRatio, fixAspect) {
        if (!this._isCropzoneSet()) {
            this.setCropzoneRect(aspectRatio || 1, fixAspect);
        } else {
            this._renderCropzoneRect(aspectRatio, fixAspect, ar => this._updateCurrentCropzoneRect(ar, fixAspect));
        }
    }

    /**
     * Recalc the cropzone rect, using the provided preset Ratio and a function that takes the preset ratio as input
     * and returns the new dimensions for the cropzone rect.
     * @param {number} [aspectRatio] - preset ratio
     * @param {boolean} [fixAspect] - whether or not to fix the aspect ratio
     * @param {function} [dimensionFactory] - factory function for calculating the new dimensions. 
     * Input: presetRatio (number), Output: new dimension object.
     * @private
     */
    _renderCropzoneRect(aspectRatio, fixAspect, dimensionFactory) {
        const canvas = this.getCanvas();
        const cropzone = this._cropzone;

        this._fixedAspectRatio = fixAspect ? aspectRatio : null;

        canvas.discardActiveObject();
        canvas.selection = false;
        canvas.remove(cropzone);

        cropzone.set(dimensionFactory(aspectRatio));

        canvas.add(cropzone);
        canvas.selection = true;
        canvas.setActiveObject(cropzone);
    }

    /**
     * get a cropzone square info
     * @param {number} aspectRatio - preset ratio
     * @param {boolean} [fixAspect] - whether or not to fix the aspect ratio
     * @param {number} [sizeInPercent] - the size of the cropzone in percentage of the original image
     * @returns {{presetRatio: number, left: number, top: number, width: number, height: number}}
     * @private
     */
    _getPresetPropertiesForCropSize(aspectRatio, fixAspect, sizeInPercent) {
        const canvas = this.getCanvas();
        const originalWidth = canvas.getWidth();
        const originalHeight = canvas.getHeight();

        const standardSize = (originalWidth >= originalHeight) ? originalWidth : originalHeight;
        const getScale = (value, orignalValue) => (value > orignalValue) ? orignalValue / value : 1;

        let width = standardSize * aspectRatio;
        let height = standardSize;

        const scaleWidth = getScale(width, originalWidth);
        [width, height] = snippet.map([width, height], sizeValue => sizeValue * scaleWidth);

        const scaleHeight = getScale(height, originalHeight);
        [width, height] = snippet.map([width, height], sizeValue => fixFloatingPoint(sizeValue * scaleHeight));

        // Set cropzone width and height only to 50% of the canvas so that users immediately recognize the cropzone rect, which is not as
        // easily seen when the rect stretches to the canvas edges.
        width *= sizeInPercent;
        height *= sizeInPercent;

        return {
            presetRatio: fixAspect ? aspectRatio : null,
            top: (originalHeight - height) / 2,
            left: (originalWidth - width) / 2,
            width,
            height
        };
    }

    /**
     * Calculate the cropzone rect for a new preset ratio that is based on the dimensions and position of the current
     * cropzone rect.
     * @param {number} [aspectRatio] - preset ratio
     * @param {boolean} [fixAspect] - whether or not to fix the aspect ratio
     * @returns {{presetRatio: number, left: number, top: number, width: number, height: number}}
     * @private
     */
    _updateCurrentCropzoneRect(aspectRatio, fixAspect) {
        const canvas = this.getCanvas();
        const cr = this.getCropzoneRect();
        const currentAspect = cr.width / cr.height;
        aspectRatio = aspectRatio || currentAspect;
        const maxSize = Math.max(cr.width, cr.height);
        const widthRatio = maxSize / canvas.getWidth();
        const heightRatio = maxSize / canvas.getHeight();
        const newRatioIsPortraitButOldIsLandscape = aspectRatio < 1 && currentAspect >= 1;
        const newRatioIsLandscapeButOldIsPortrait = aspectRatio >= 1 && currentAspect < 1;
        const scale = (newRatioIsPortraitButOldIsLandscape || newRatioIsLandscapeButOldIsPortrait)
            ? Math.max(widthRatio, heightRatio, 1)
            : 1;

        return this._ensureNewCropzoneRectIsinBoundary(aspectRatio, fixAspect, maxSize, scale);
    }

    _ensureNewCropzoneRectIsinBoundary(aspectRatio, fixAspect, maxSize, scale) {
        const canvas = this.getCanvas();
        const cr = this.getCropzoneRect();
        let widthRatio = 1;
        let heightRatio = 1;

        if (scale > 1) {
            widthRatio = maxSize / canvas.getWidth();
            heightRatio = maxSize / canvas.getHeight();
        }

        let width, height;

        if (aspectRatio >= 1) {
            width = maxSize / scale;
            height = width / aspectRatio;
        } else {
            height = maxSize / scale;
            width = height * aspectRatio;
        }

        const topOffset = (cr.height - height) / 2;
        const leftOffset = (cr.width - width) / 2;

        return {
            presetRatio: fixAspect ? aspectRatio : null,
            top: clamp(heightRatio > 1 ? 0 : cr.top + topOffset, 0, canvas.getHeight() - height),
            left: clamp(widthRatio > 1 ? 0 : cr.left + leftOffset, 0, canvas.getWidth() - width),
            height,
            width
        };
    }

    /**
     * Keydown event handler
     * @param {KeyboardEvent} e - Event object
     * @private
     */
    _onKeyDown(e) {
        if (e.keyCode === keyCodes.SHIFT) {
            this._withShiftKey = true;
        }
    }

    /**
     * Keyup event handler
     * @param {KeyboardEvent} e - Event object
     * @private
     */
    _onKeyUp(e) {
        if (e.keyCode === keyCodes.SHIFT) {
            this._withShiftKey = false;
        }
    }
}

export default Cropper;
