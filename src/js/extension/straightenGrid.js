/**
 * @author NorthRange Development Team
 * @fileoverview StraightenGrid extending fabric.Rect
 */
import fabric from 'fabric';

/**
 * StraightenGrid object
 * @class StraightenGrid
 * @extends {fabric.Rect}
 * @ignore
 */
/* eslint-disable no-mixed-operators, max-params */
const StraightenGrid = fabric.util.createClass(fabric.Rect, /** @lends Cropzone.prototype */{
    /**
     * Constructor
     * @param {Object} canvas canvas
     * @param {Object} canvasImage canvas image
     * @param {Object} options Options object
     * @override
     */
    initialize(canvas, canvasImage, options) {
        options.type = 'straightenGrid';

        this.callSuper('initialize', options);

        this.canvas = canvas;
        this.canvasImage = canvasImage || {};
        this.options = options;

        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();
        const wrapperWidth = this.canvas.wrapperEl.offsetWidth;
        const wrapperHeight = this.canvas.wrapperEl.offsetHeight;
        this._originalHPixelSize = canvasWidth / wrapperWidth;
        this._originalVPixelSize = canvasHeight / wrapperHeight;

        this._clipRect = new fabric.Rect({
            left: 0,
            top: 0,
            width: canvasWidth,
            height: canvasHeight
        });
    },

    setClipRect(rect) {
        this._clipRect = rect;
    },

    _renderGrid(ctx) {
        this._drawGrid(ctx);
    },

    /**
     * Render Straighten-grid
     * @private
     * @override
     */
    _render(ctx) {
        this.callSuper('_render', ctx);

        this.angle = 0;
        this._renderGrid(ctx);
    },

    /**
     * Draw grid lines
     * @param {CanvasRenderingContext2D} ctx - Context
     * @private
     */
    _drawGrid(ctx) {
        const ang = this.canvasImage.angle;
        const imageWidth = ang % 180 === 90 ? this.canvasImage.height : this.canvasImage.width;
        const imageHeight = ang % 180 === 90 ? this.canvasImage.width : this.canvasImage.height;
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();
        const wrapperWidth = this.canvas.wrapperEl.offsetWidth;
        const wrapperHeight = this.canvas.wrapperEl.offsetHeight;
        const hPixelSize = canvasWidth / wrapperWidth;
        const vPixelSize = canvasHeight / wrapperHeight;
        const halfWidth = canvasWidth / 2;
        const halfHeight = canvasHeight / 2;
        const widthAdjuster = hPixelSize / this._originalHPixelSize;
        const heightAdjuster = vPixelSize / this._originalVPixelSize;
        const cellWidth = widthAdjuster * imageWidth / this.options.hCellCount;
        const cellHeight = heightAdjuster * imageHeight / this.options.vCellCount;
        const factors = [1, -1];

        ctx.save();

        factors.forEach(f => {
            for (let i = 0; i < this.options.hCellCount; i += 1) {
                // Draw vertical lines
                const lineWidthFactor = i === 0 ? 2 : 1;
                const y = halfHeight + f * i * cellHeight;
                this._drawLine(ctx, this._clipRect.left, y, this._clipRect.left + this._clipRect.width, y,
                    lineWidthFactor * hPixelSize);
            }

            for (let i = 0; i < this.options.vCellCount; i += 1) {
                // Draw horizontal lines
                const lineWidthFactor = i === 0 ? 2 : 1;
                const x = halfWidth + f * i * cellWidth;
                this._drawLine(ctx, x, this._clipRect.top, x, this._clipRect.top + this._clipRect.height,
                    canvasHeight * lineWidthFactor / wrapperHeight);
            }
        });

        if (this.options.withCircles) {
            this._drawCircles(ctx, halfWidth, halfHeight, Math.min(cellWidth, cellHeight),
                canvasWidth / wrapperWidth);
        }

        ctx.restore();
    },

    _drawLine(ctx, x1, y1, x2, y2, lineWidth) {
        ctx.beginPath();
        ctx.strokeStyle = this.options.color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    },

    _drawCircles(ctx, x, y, cellSize, lineWidth) {
        const innerRadius = cellSize / 2;
        const outerRadius = cellSize * 2;

        ctx.beginPath();
        ctx.strokeStyle = this.options.color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(y, y);
        ctx.arc(x, y, innerRadius, 0, 2 * Math.PI);
        ctx.arc(x, y, outerRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
});

export default StraightenGrid;
