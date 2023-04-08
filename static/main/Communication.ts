import { is2TupleOf, isString } from '@freik/typechk';
import debug from 'debug';
import { ipcMain, OpenDialogOptions, shell } from 'electron';
import { IpcMainInvokeEvent } from 'electron/main';
import { Persistence } from './persist';
import { SendToMain, ShowOpenDialog } from './window';

const log = debug('app:Communication:log');
const err = debug('app:Communication:error');

type Handler<R, T> = (arg: T) => Promise<R | void>;

/**
 * Read a value from persistence by name, returning it's unprocessed contents
 *
 * @async @function
 * @param {string} name - the name of the value to read
 * @return {Promise<string>} The raw string contents of the value
 */
async function readFromStorage(name?: string): Promise<string> {
  if (!name) return '';
  try {
    log(`readFromStorage(${name})`);
    const value = await Persistence.getItemAsync(name);
    log(`Sending ${name} response:`);
    log(value);
    return value || '';
  } catch (e) {
    err(`error from readFromStorage(${name})`);
    err(e);
  }
  return '';
}

/**
 * Write a value to persistence by name.
 *
 * @async @function
 * @param {string?} keyValuePair - The key:value string to write
 */
async function writeToStorage([key, value]: [string, string]): Promise<void> {
  try {
    // First, split off the key name:
    log(`writeToStorage(${key} : ${value})`);
    // Push the data into the persistence system
    await Persistence.setItemAsync(key, value);
    log(`writeToStorage(${key}...) completed`);
  } catch (e) {
    err(`error from writeToStorage([${key}, ${value}])`);
    err(e);
  }
}

/**
 * Registers with `ipcMain.handle` a function that takes a mandatory parameter
 * and returns *string* data untouched. It also requires a checker to ensure the
 * data is properly typed
 * @param  {string} key - The id to register a listener for
 * @param  {TypeHandler<T>} handler - the function that handles the data
 * @param  {(v:any)=>v is T} checker - a Type Check function for type T
 * @returns void
 */
function registerChannel<R, T>(
  key: string,
  handler: Handler<R, T>,
  checker: (v: any) => v is T,
): void {
  ipcMain.handle(
    key,
    async (_event: IpcMainInvokeEvent, arg: any): Promise<R | void> => {
      if (checker(arg)) {
        log(`Received ${key} message: handling`);
        return await handler(arg);
      } else {
        err(`Invalid argument type to ${key} handler`);
        err(arg);
      }
    },
  );
}

/**
 * Show a file in the shell
 * @param filePath - The path to the file to show
 */
function showFile(filePath?: string): Promise<void> {
  return new Promise((resolve) => {
    if (filePath) {
      shell.showItemInFolder(filePath);
    }
    resolve();
  });
}

/**
 * Send a message to the rendering process
 *
 * @param  {unknown} message
 * The (flattenable) message to send.
 */
export function AsyncSend(message: unknown): void {
  SendToMain('async-data', { message });
}

function isKeyValue(obj: any): obj is [string, string] {
  return is2TupleOf(obj, isString, isString);
}

// I don't actually care about this type :)
function isVoid(obj: any): obj is void {
  return true;
}

function isStrOrUndef(obj: any): obj is string | undefined {
  return isString(obj) || obj === undefined;
}

function isOpenDialogOptions(obj: any): obj is OpenDialogOptions {
  /* {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: FileFilter[];
    properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>;
    message?: string;
    securityScopedBookmarks?: boolean;
  }*/
  // TODO: Check that stuff ^^^^
  return true;
}

/**
 * Setup any async listeners, plus register all the "invoke" handlers
 */
export function CommsSetup(): void {
  // These are the general "just asking for something to read/written to disk"
  // functions. Media Info, Search, and MusicDB stuff needs a different handler
  // because they don't just read/write to disk.
  registerChannel('read-from-storage', readFromStorage, isString);
  registerChannel('write-to-storage', writeToStorage, isKeyValue);

  // Reviewed & working properly:
  registerChannel('show-file', showFile, isString);
  registerChannel('show-open-dialog', ShowOpenDialog, isOpenDialogOptions);
}
