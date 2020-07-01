/**
 * @author NorthRange Development Team
 * @fileoverview Image locking module
 */
import Component from '../interface/component';
import {componentNames as components} from '../consts';

/**
 * Lock component
 * @class Lock
 * @extends {Component}
 * @param {Graphics} graphics - Graphics instance
 * @ignore
 */
class Lock extends Component {
    constructor(graphics) {
        super(components.LOCK, graphics);
    }

    /**
     * Start locking.
     */
    start() {
        this.getCanvas().discardActiveObject();
        this._setSelectionState(false);
    }

    /**
     * End locking.
     */
    end() {
        this._setSelectionState(true);
    }

    _setSelectionState(selectable) {
        const canvas = this.getCanvas();
        canvas.forEachObject(obj => {
            obj.evented = selectable;
            obj.selectable = selectable;
        });
        canvas.renderAll();
    }
}

export default Lock;
