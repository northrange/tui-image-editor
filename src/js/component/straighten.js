/**
 * @author NorthRange Development Team
 * @fileoverview Image straightening module
 */
import snippet from 'tui-code-snippet';
import {Promise} from '../util';
import Component from '../interface/component';
import StraightenGrid from '../extension/straightenGrid';
import {componentNames as components} from '../consts';

/**
 * Image Straightening component
 * @class Straighten
 * @extends {Component}
 * @param {Graphics} graphics - Graphics instance
 * @ignore
 */
/* eslint-disable no-mixed-operators */
class Straighten extends Component {
    constructor(graphics) {
        super(components.STRAIGHTEN, graphics);

        this._angle = 0;
        this._clipRect = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.getCanvas().getWidth(),
            height: this.getCanvas().getHeight()
        });
        this._rotation = this.graphics.getComponent(components.ROTATION);
    }

    /**
     * Start straightening.
     */
    start() {
        const canvas = this.getCanvas();

        canvas.forEachObject(obj => { // {@link http://fabricjs.com/docs/fabric.Object.html#evented}
            obj.evented = false;
        });

        this._straightenGrid = new StraightenGrid(canvas, this.getCanvasImage(), snippet.extend({
            color: 'rgba(255, 255, 255, 0.7)',
            hCellCount: 6,
            vCellCount: 6,
            withCircles: true
        }, this.graphics.straightenGridStyle));

        canvas.discardActiveObject();
        canvas.add(this._straightenGrid);
        canvas.selection = false;
        canvas.renderAll();
    }

    /**
     * End straightening.
     */
    end() {
        if (!this._straightenGrid) {
            return;
        }

        const canvas = this.getCanvas();

        canvas.remove(this._straightenGrid);
        canvas.selection = true;
        canvas.forEachObject(obj => {
            obj.evented = true;
        });

        this._straightenGrid = null;
    }

    getCurrentAngle() {
        return this._angle;
    }

    getClipRect() {
        return this._clipRect;
    }

    straighten(angle, rotationAngle = 0) {
        angle %= 360;

        const canvas = this.getCanvas();
        const canvasImage = this.getCanvasImage();

        const imageSize = this._rotateAndGetSize(rotationAngle);
        const straightenedImageSize = this._rotateAndGetSize(angle + rotationAngle);
        const maxRect = this._findLargestRectWithSameAspect(imageSize.width, imageSize.height,
            straightenedImageSize.width, straightenedImageSize.height, angle);
        this._angle = angle;
        this._clipRect = new fabric.Rect({
            originX: 'left',
            originY: 'top',
            left: (straightenedImageSize.width - maxRect.width) / 2,
            top: (straightenedImageSize.height - maxRect.height) / 2,
            width: maxRect.width,
            height: maxRect.height,
            absolutePositioned: true
        });

        canvas.forEachObject(obj => {
            if (obj !== this._straightenGrid) {
                obj.set({clipPath: this._clipRect});
            }
        });

        if (this._straightenGrid) {
            this._straightenGrid.set({
                angle: 0,
                left: 0,
                top: 0
            }).setCoords();
            this._straightenGrid.setClipRect(this._clipRect);
        }

        canvasImage.set({clipPath: this._clipRect});
        canvas.renderAll();

        return Promise.resolve(angle);
    }

    _rotateAndGetSize(angle) {
        const canvasImage = this.getCanvasImage();

        if (angle || angle === 0) {
            this._rotation.setAngle(angle);
        }

        const projection = canvasImage.oCoords;
        const w = Math.max(projection.tl.x, projection.tr.x, projection.bl.x, projection.br.x);
        const h = Math.max(projection.bl.y, projection.tl.y, projection.br.y, projection.tr.y);

        return new fabric.Rect({
            width: w,
            height: h
        });
    }

    _findLargestRectWithSameAspect(originalWidth, originalHeight, rotatedWidth, rotatedHeight, angle) {
        const aspectRatio = originalWidth / originalHeight;
        const rotatedAspectRatio = rotatedWidth / rotatedHeight;
        const angleInRad = Math.abs(angle) * Math.PI / 180;
        const totalHeight = aspectRatio < 1 ? originalWidth / rotatedAspectRatio : originalHeight;
        const h = totalHeight / (aspectRatio * Math.sin(angleInRad) + Math.cos(angleInRad));
        const w = h * aspectRatio;

        return new fabric.Rect({
            width: w,
            height: h
        });
    }
}

export default Straighten;
