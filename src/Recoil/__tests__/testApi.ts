/*
import { snapshot_UNSTABLE } from 'recoil';
import { currentIndexState, songListState } from '../Local';

jest.mock('../../MyWindow');

it('Adding empty songs does nothing', () => {
  const initialSnapshot = snapshot_UNSTABLE();
  expect(
    initialSnapshot.getLoadable(songListState).valueOrThrow(),
  ).toStrictEqual([]);
  expect(
    initialSnapshot.getLoadable(currentIndexState).valueOrThrow(),
  ).toStrictEqual(-1);
});

*/
import debug from 'debug';
import { act } from 'react-test-renderer';
import { RecoilState, RecoilValueReadOnly } from 'recoil';
import { MyTransactionInterface } from '../api';

const err = debug('api:test');

jest.useFakeTimers();
jest.mock('../../MyWindow');

function flushPromisesAndTimers(): Promise<void> {
  // Wrap flush with act() to avoid warning that only shows up in OSS environment
  return act(
    () =>
      new Promise((resolve) => {
        // eslint-disable-next-line no-restricted-globals
        setTimeout(resolve, 100);
        jest.runAllTimers();
      }),
  );
}

type RecoilSetter = <T>(
  rv: RecoilState<T>,
  valOrUpdate: ((curVal: T) => T) | T,
) => void;
type RecoilGetter = <T>(rv: RecoilState<T> | RecoilValueReadOnly<T>) => T;

function makeCallbackIfc(
  set: RecoilSetter,
  get: RecoilGetter,
): MyTransactionInterface {
  return {
    set,
    get,
    reset: (rv: RecoilState<any>) => {
      err("Reset doesn't work in here :(");
      return;
    },
  };
}

it('Need to update this to use the transaction api', () =>
  expect(true).toBeTruthy());
