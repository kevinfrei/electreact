import debug from 'debug';
import { protocol, ProtocolRequest, ProtocolResponse } from 'electron';
import { promises as fs } from 'fs';
import path from 'path';

export type FileResponse = string | ProtocolResponse;
export type BufferResponse = Buffer | ProtocolResponse;

const log = debug('app:protocols:log');

const defaultPicPath = path.join(__dirname, '..', 'logo.svg');
let defaultPicBuffer: BufferResponse | null = null;

export async function GetDefaultPicBuffer(): Promise<BufferResponse> {
  if (!defaultPicBuffer) {
    defaultPicBuffer = {
      data: await fs.readFile(defaultPicPath),
      mimeType: 'image/svg+xml',
    };
  }
  return defaultPicBuffer;
}

const e404 = { error: 404 };

async function sipProtocolHandler(
  req: ProtocolRequest,
  trimmedUrl: string,
): Promise<FileResponse> {
  const key: string = trimmedUrl;
  log(`URL: ${key}`);
  const data = false;
  if (data) {
    const mimeType = 'audio/mpeg';
    const thedata = await fs.readFile('thePath');
    return { data: thedata, mimeType };
  } else {
    log('Data not found');
    return e404;
  }
}

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
      processor(req, decodeURI(req.url.substr(type.length)))
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
export async function RegisterProtocols(): Promise<void> {
  registerProtocolHandler(
    'sip://secure/',
    // eslint-disable-next-line @typescript-eslint/unbound-method
    protocol.registerFileProtocol,
    sipProtocolHandler,
  );
}

// This sets up reactive responses to changes, for example:
// locations change, so music needs to be rescanned
export function RegisterListeners(): void {
  //  Persistence.subscribe("locations", UpdateAudioLocations);
}
