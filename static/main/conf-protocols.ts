import debug from 'debug';
import { ProtocolRequest, ProtocolResponse } from 'electron';

export type FileResponse = string | ProtocolResponse;
export type BufferResponse = Buffer | ProtocolResponse;

const log = debug('app:configure:log');

const e404 = { error: 404 };

/*
const defaultPicPath = path.join(__dirname, '..', 'img-album.svg');
let defaultPicBuffer: BufferResponse | null = null;

export async function getDefaultPicBuffer(): Promise<BufferResponse> {
  if (!defaultPicBuffer) {
    defaultPicBuffer = {
      data: await fs.readFile(defaultPicPath),
      mimeType: 'image/svg+xml',
    };
  }
  return defaultPicBuffer;
}

async function tuneProcessor(
  req: ProtocolRequest,
  trimmedUrl: string,
): Promise<FileResponse> {
  const key: SongKey = trimmedUrl;
  const db = await getMusicDB();
  if (!db) {
    return e404;
  }
  const song = db.songs.get(key);
  if (song) {
    const thePath = song.path;
    log('Returning file read from ' + thePath);
    const mimeType =
      audioMimeTypes.get(path.extname(thePath).toLowerCase()) ?? 'audio/mpeg';
    return { path: thePath, mimeType };
  } else {
    return e404;
  }
}
*/

type Registerer<T> = (
  scheme: string,
  handler: (
    request: ProtocolRequest,
    callback: (response: T | ProtocolResponse) => void,
  ) => void,
) => boolean;

// Helper to check URL's & transition to async functions
function registerProtocolHandler<ResponseType>(
  type: string,
  registerer: Registerer<ResponseType>,
  processor: (
    req: ProtocolRequest,
    trimmedUrl: string,
  ) => Promise<ProtocolResponse | ResponseType>,
  defaultValue: ProtocolResponse | ResponseType = e404,
) {
  const protName = type.substr(0, type.indexOf(':'));
  log(`Protocol ${type} (${protName})`);
  registerer(protName, (req, callback) => {
    log(`${type} URL request:`);
    log(req);
    if (!req.url) {
      callback({ error: -324 });
    } else if (req.url.startsWith(type)) {
      processor(req, req.url.substr(type.length))
        .then(callback)
        .catch((reason: any) => {
          log(`${type}:// failure`);
          log(reason);
          callback(defaultValue);
        });
    } else {
      callback(defaultValue);
    }
  });
}

// This sets up all protocol handlers
export function configureProtocols(): void {
  /*  getDefaultPicBuffer()
    .then((val) =>
      // TODO: Enable both song & album pictures
      // folder-level photos are fine, but for song requests, check the song
      // then fall back to the album
      registerProtocolHandler(
        'pic://album/',
        // eslint-disable-next-line @typescript-eslint/unbound-method
        protocol.registerBufferProtocol,
        picBufProcessor,
        val,
      ),
    )
    .catch((reason) => {
      log('Unable to register pic:// handling');
      log(reason);
    });
  registerProtocolHandler(
    'tune://song/',
    // eslint-disable-next-line @typescript-eslint/unbound-method
    protocol.registerFileProtocol,
    tuneProcessor,
  );*/
}

// This sets up reactive responses to changes, for example:
// locations change, so music needs to be rescanned
export function configureListeners(): void {
  //  persist.subscribe('locations', UpdateDB);
}
