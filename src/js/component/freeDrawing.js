/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Free drawing module, Set brush
 */
import fabric from 'fabric';
import Component from '../interface/component';
import {brushNames, componentNames} from '../consts';

/**
 * FreeDrawing
 * @class FreeDrawing
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @ignore
 */
class FreeDrawing extends Component {
    constructor(graphics) {
        super(componentNames.FREE_DRAWING, graphics);

        /**
         * Brush width
         * @type {number}
         */
        this.width = 12;

        /**
         * fabric.Color instance for brush color
         * @type {fabric.Color}
         */
        this.oColor = new fabric.Color('rgba(0, 0, 0, 0.5)');

        /**
         * Component map
         * @type {Object.<string, fabric.Brush>}
         * @private
         */
        this._brushMap = {};

        /**
         * Listeners
         * @type {object.<string, function>}
         * @private
         */
        this._listeners = {
            pathcreated: this._onFabricPathCreated.bind(this)
        };

        this._registerBrushes();

        this._tmp = fabric;
    }

    /**
     * Start free drawing mode
     * @param {{width: ?number, color: ?string, shadow: ?object}} [setting] - Brush width & color
     */
    start(setting) {
        const canvas = this.getCanvas();

        canvas.isDrawingMode = true;
        this.setBrush(setting);

        this.graphics.getComponent(componentNames.LOCK).start();
        canvas.on({
            'path:created': this._listeners.pathcreated
        });
    }

    /**
     * Set brush
     * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
     */
    setBrush(setting) { // eslint-disable-line complexity
        const canvas = this.getCanvas();
        const oldBrush = canvas.freeDrawingBrush;

        if (setting.brush && this._brushMap[setting.brush]) {
            canvas.freeDrawingBrush = this._brushMap[setting.brush];
            canvas.freeDrawingBrush.color = oldBrush.color;
            canvas.freeDrawingBrush.width = oldBrush.width;
            canvas.freeDrawingBrush.shadow = oldBrush.shadow;
        }

        const brush = canvas.freeDrawingBrush;

        setting = setting || {};
        this.width = setting.width || this.width;
        if (setting.color) {
            this.oColor = new fabric.Color(setting.color);
        }
        brush.width = this.width;
        brush.color = this.oColor.toRgba();

        if (setting.shadow) {
            brush.shadow = new fabric.Shadow(setting.shadow);
        }
    }

    /**
     * End free drawing mode
     */
    end() {
        const canvas = this.getCanvas();

        canvas.isDrawingMode = false;

        this.graphics.getComponent(componentNames.LOCK).end();
        canvas.off('path:created', this._listeners.pathcreated);
    }

    /**
     * Mousedown event handler in fabric canvas
     * @param {{path: fabric.Object}} obj - Fabric path object
     * @private
     */
    _onFabricPathCreated(obj) {
        this.getCanvas().setActiveObject(obj.path);
    }

    /**
     * Create components
     * @private
     */
    _registerBrushes() {
        const canvas = this.getCanvas();
        this._brushMap[brushNames.PENCIL] = new fabric.PencilBrush(canvas);
        this._brushMap[brushNames.CIRCLE] = new fabric.CircleBrush(canvas);
        this._brushMap[brushNames.SPRAY] = new fabric.SprayBrush(canvas);
        this._brushMap[brushNames.PATTERN] = new fabric.PatternBrush(canvas);
        this._brushMap[brushNames.HLINE] = this._createHLineBrush();
        this._brushMap[brushNames.VLINE] = this._createVLineBrush();
        this._brushMap[brushNames.SQUARE] = this._createSquareBrush();
        this._brushMap[brushNames.DIAMOND] = this._createDiamondBrush();
    }

    /**
     * Create H-Line brush.
     * @returns {fabric.PatternBrush} - the create H-Line brush.
     */
    _createHLineBrush() {
        const hLinePatternBrush = new fabric.PatternBrush(this.getCanvas());

        hLinePatternBrush.getPatternSrc = function(color) {
            const patternCanvas = document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            const ctx = patternCanvas.getContext('2d');

            ctx.lineWidth = 5;
            ctx.strokeStyle = color || this.color;
            ctx.beginPath();
            ctx.moveTo(5, 0);
            ctx.lineTo(5, 10);
            ctx.closePath();
            ctx.stroke();

            if (!this.color) {
                color = null;
            }

            return patternCanvas;
        };
        hLinePatternBrush.getPatternSrcFunction = function() {
            return hLinePatternBrush.getPatternSrc.bind(this, this.color);
        };

        return hLinePatternBrush;
    }

    _createVLineBrush() {
        const vLinePatternBrush = new fabric.PatternBrush(this.getCanvas());

        vLinePatternBrush.getPatternSrc = function(color) {
            const patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            const ctx = patternCanvas.getContext('2d');

            ctx.strokeStyle = color || this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.lineTo(10, 5);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };
        vLinePatternBrush.getPatternSrcFunction = function() {
            return vLinePatternBrush.getPatternSrc.bind(this, this.color);
        };

        return vLinePatternBrush;
    }

    _createSquareBrush() {
        const squarePatternBrush = new fabric.PatternBrush(this.getCanvas());

        squarePatternBrush.getPatternSrc = function(color) {
            const squareWidth = 10, squareDistance = 2;
            const patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            const ctx = patternCanvas.getContext('2d');

            ctx.fillStyle = color || this.color;
            ctx.fillRect(0, 0, squareWidth, squareWidth);

            return patternCanvas;
        };
        squarePatternBrush.getPatternSrcFunction = function() {
            return squarePatternBrush.getPatternSrc.bind(this, this.color);
        };

        return squarePatternBrush;
    }

    _createDiamondBrush() {
        const diamondPatternBrush = new fabric.PatternBrush(this.getCanvas());
        diamondPatternBrush.getPatternSrc = function(color) {
            const squareWidth = 10, squareDistance = 5;
            const patternCanvas = fabric.document.createElement('canvas');
            const rect = new fabric.Rect({
                width: squareWidth,
                height: squareWidth,
                angle: 45,
                fill: color || this.color
            });
            const canvasWidth = rect.getBoundingRect().width;

            patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
            rect.set({
                left: canvasWidth / 2,
                top: canvasWidth / 2
            });

            const ctx = patternCanvas.getContext('2d');
            rect.render(ctx);

            return patternCanvas;
        };
        diamondPatternBrush.getPatternSrcFunction = function() {
            return diamondPatternBrush.getPatternSrc.bind(this, this.color);
        };

        return diamondPatternBrush;
    }
}

export default FreeDrawing;
