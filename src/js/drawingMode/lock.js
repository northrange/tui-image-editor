/**
 * @author NorthRange Development Team
 * @fileoverview LockDrawingMode class
 */
import DrawingMode from '../interface/drawingMode';
import {drawingModes, componentNames as components} from '../consts';

/**
 * LockDrawingMode class
 * @class
 * @ignore
 */
class LockDrawingMode extends DrawingMode {
    constructor() {
        super(drawingModes.LOCK);
    }

    /**
    * start this drawing mode
    * @param {Graphics} graphics - Graphics instance
    * @override
    */
    start(graphics) {
        const locker = graphics.getComponent(components.LOCK);
        locker.start();
    }

    /**
     * stop this drawing mode
     * @param {Graphics} graphics - Graphics instance
     * @override
     */
    end(graphics) {
        const locker = graphics.getComponent(components.LOCK);
        locker.end();
    }
}

export default LockDrawingMode;
