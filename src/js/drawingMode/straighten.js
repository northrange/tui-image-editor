/**
 * @author NorthRange Development Team
 * @fileoverview StraigtenDrawingMode class
 */
import DrawingMode from '../interface/drawingMode';
import {drawingModes, componentNames as components} from '../consts';

/**
 * StraightenDrawingMode class
 * @class
 * @ignore
 */
class StraightenDrawingMode extends DrawingMode {
    constructor() {
        super(drawingModes.STRAIGHTEN);
    }

    /**
    * start this drawing mode
    * @param {Graphics} graphics - Graphics instance
    * @override
    */
    start(graphics) {
        const straightener = graphics.getComponent(components.STRAIGHTEN);
        straightener.start();
    }

    /**
     * stop this drawing mode
     * @param {Graphics} graphics - Graphics instance
     * @override
     */
    end(graphics) {
        const straightener = graphics.getComponent(components.STRAIGHTEN);
        straightener.end();
    }
}

export default StraightenDrawingMode;
