/**
 * @author NorthRange Development Team
 * @fileoverview Straighten an image
 */
import commandFactory from '../factory/command';
import {componentNames, commandNames} from '../consts';

const {STRAIGHTEN} = componentNames;

/**
 * Chched data for undo
 * @type {Object}
 */
let chchedUndoDataForSilent = null;

/**
 * Make undo data
 * @param {Component} straightenComp - straighten component
 * @returns {object} - undodata
 */
function makeUndoData(straightenComp) {
    return {
        angle: straightenComp.getCurrentAngle()
    };
}

const command = {
    name: commandNames.STRAIGHTEN_IMAGE,

    /**
     * Rotate an image
     * @param {Graphics} graphics - Graphics instance
     * @param {number} angle - angle value (degree)
     * @param {number} rotationAngle - rotation of the image (degree)
     * @param {boolean} isSilent - is silent execution or not
     * @returns {Promise}
     */
    execute(graphics, angle, rotationAngle, isSilent) {
        const straightenComp = graphics.getComponent(STRAIGHTEN);

        if (!this.isRedo) {
            const undoData = makeUndoData(straightenComp);

            chchedUndoDataForSilent = this.setUndoData(undoData, chchedUndoDataForSilent, isSilent);
        }

        return straightenComp.straighten(angle, rotationAngle);
    },
    /**
     * @param {Graphics} graphics - Graphics instance
     * @returns {Promise}
     */
    undo(graphics) {
        const straightenComp = graphics.getComponent(STRAIGHTEN);
        const [, , rotationAngle] = this.args;

        return straightenComp.straighten(this.undoData.angle, rotationAngle);
    }
};

commandFactory.register(command);

export default command;
