import './js/polyfill';
import './css/index.styl';
import imageEditor from './js/imageEditor';
// filters
import './js/filter/1977';
import './js/filter/amaro';
import './js/filter/brooklyn';
import './js/filter/clarendon';
import './js/filter/gingham';
import './js/filter/inkwell';
import './js/filter/kelvin';
import './js/filter/lark';
import './js/filter/lofi';
import './js/filter/moon';
import './js/filter/nashville';
import './js/filter/perpetua';
import './js/filter/toaster';
import './js/filter/walden';

// commands
import './js/command/addIcon';
import './js/command/addImageObject';
import './js/command/addObject';
import './js/command/addShape';
import './js/command/addText';
import './js/command/applyFilter';
import './js/command/changeIconColor';
import './js/command/changeShape';
import './js/command/changeText';
import './js/command/changeTextStyle';
import './js/command/clearObjects';
import './js/command/flip';
import './js/command/loadImage';
import './js/command/removeFilter';
import './js/command/removeObject';
import './js/command/resizeCanvasDimension';
import './js/command/rotate';
import './js/command/straighten';
import './js/command/setObjectProperties';
import './js/command/setObjectPosition';

export const ImageEditor = imageEditor;
