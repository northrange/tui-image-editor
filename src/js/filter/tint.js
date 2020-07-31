/**
 * @author NorthRange Development Team
 * @fileoverview Tint filter
 */
import fabric from 'fabric';

/* eslint-disable no-mixed-operators */
fabric.Image.filters.Tint = fabric.util.createClass(fabric.Image.filters.BlendColor,
    /** @lends fabric.Image.filters.BlendColor.prototype */ {
        type: 'Tint',

        mode: 'tint'
    }
);
