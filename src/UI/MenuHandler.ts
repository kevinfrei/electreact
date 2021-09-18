import { MakeError, Type } from '@freik/core-utils';
import { FocusSearch } from '../MyWindow';
import { MyTransactionInterface } from '../Recoil/api';

const log = MakeError('MenuHandler'); // eslint-disable-line
const err = MakeError('MenuHandler-err'); // eslint-disable-line

export function MenuHandler(
  _xact: MyTransactionInterface,
  message: unknown,
): void {
  log('Menu command:');
  log(message);
  // I'm not really thrilled with this mechanism. String-based dispatch sucks
  if (Type.hasStr(message, 'state')) {
    switch (message.state) {
      case 'savePlaylist': {
        break;
      }
      case 'shuffle':
        break;
      case 'repeat':
        break;

      case 'addLocation':
        break;

      case 'find':
        FocusSearch();
        break;

      // Playback control:
      case 'playback':
        break;
      case 'nextTrack':
        break;
      case 'prevTrack':
        break;

      // Time control
      case 'fwd':
        break;
      case 'back':
        break;

      case 'mute':
        break;
      case 'louder':
        break;
      case 'quieter':
        break;
      case 'view':
        break;
      default:
        err('Unknown menu message:');
        err(message);
        break;
    }
  } else {
    err('Malformed menu message:');
    err(message);
  }
}
