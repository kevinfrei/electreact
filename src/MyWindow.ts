// This is for getting at "global" stuff from the window object
import { ISearchBox } from '@fluentui/react';
import { MakeError, MakeLogger, Type } from '@freik/core-utils';
import { IpcRenderer, NativeImage } from 'electron';
import { IpcRendererEvent, OpenDialogSyncOptions } from 'electron/main';
import { PathLike } from 'fs';
import { FileHandle } from 'fs/promises';
import { HandleMessage } from './ipc';

const log = MakeLogger('MyWindow', false && IsDev());
const err = MakeError('MyWindow-err');

type ReadFile1 = (path: PathLike | FileHandle) => Promise<Buffer>;

/*
 * "Window" stuff goes here
 */

interface MyWindow extends Window {
  ipc?: IpcRenderer;
  isDev: boolean;
  initApp?: () => void;
  ipcSet?: boolean;
  searchBox?: ISearchBox | null;
  clipboard: Electron.Clipboard | undefined;
  readFile: ReadFile1; // | ReadFile2 | ReadFile3;
}

declare let window: MyWindow;

export async function ShowOpenDialog(
  options: OpenDialogSyncOptions,
): Promise<string[] | void> {
  return await CallMain('show-open-dialog', options, Type.isArrayOfString);
}

export function SetInit(func: () => void): void {
  log('Setting initApp');
  window.initApp = func;
}

export function SetSearch(searchBox: ISearchBox | null): void {
  window.searchBox = searchBox;
}

export function FocusSearch(): boolean {
  if (window.searchBox) {
    window.searchBox.focus();
    return true;
  }
  return false;
}

export function IsDev(): boolean {
  return window.isDev === true;
}

export function InitialWireUp(): void {
  if (!window.ipcSet) {
    window.ipcSet = true;

    // Set up listeners for any messages that we might want to asynchronously
    // send from the main process
    window.ipc?.on('async-data', (_event: IpcRendererEvent, data: unknown) => {
      if (
        Type.isArray(data) &&
        Type.isObject(data[0]) &&
        Type.has(data[0], 'message')
      ) {
        log('*** Async message formed properly:');
        log(data[0]);
        HandleMessage(data[0].message);
      } else {
        err('>>> Async malformed message begin');
        err(data);
        err('<<< Async malformed message end');
      }
    });
  }
}

let mediaQuery: MediaQueryList | null = null;

// This adds a listener for a media query and invokes it the first time which
// is necessary to get it to start paying attention, apparently.
export function SubscribeMediaMatcher(
  mq: string,
  handler: (ev: MediaQueryList | MediaQueryListEvent) => void,
): void {
  mediaQuery = window.matchMedia(mq);
  mediaQuery.addEventListener('change', handler);
  handler(mediaQuery);
}

export function UnsubscribeMediaMatcher(
  handler: (ev: MediaQueryList | MediaQueryListEvent) => void,
): void {
  mediaQuery?.removeEventListener('change', handler);
}

export async function InvokeMain<T>(
  channel: string,
  key?: T,
): Promise<unknown | void> {
  let result;
  if (key) {
    log(`Invoking main("${channel}", "...")`);
    result = (await window.ipc!.invoke(channel, key)) as unknown;
    log(`Invoke main ("${channel}" "...") returned:`);
  } else {
    log(`Invoking main("${channel}")`);
    result = (await window.ipc!.invoke(channel)) as unknown;
    log(`Invoke main ("${channel}") returned:`);
  }
  log(result);
  return result;
}

export async function CallMain<R, T>(
  channel: string,
  key: T,
  typecheck: (val: any) => val is R,
): Promise<R | void> {
  let result: any;
  if (!Type.isUndefined(key)) {
    log(`CallMain("${channel}", "...")`);
    // eslint-disable-next-line
    result = await window.ipc!.invoke(channel, key);
    log(`CallMain ("${channel}" "...") returned:`);
  } else {
    log(`CallMain("${channel}")`);
    // eslint-disable-next-line
    result = await window.ipc!.invoke(channel);
    log(`CallMain ("${channel}") returned:`);
  }
  log(result);
  if (typecheck(result)) {
    return result;
  }
  err(
    `CallMain(${channel}, <T>, ${typecheck.name}(...)) result failed typecheck`,
  );
  err(result);
}

export async function PostMain<T>(channel: string, key: T): Promise<void> {
  const isVoid = (a: any): a is void => true;
  return await CallMain(channel, key, isVoid);
}

export function ImageFromClipboard(): NativeImage | undefined {
  return window.clipboard?.readImage();
}
