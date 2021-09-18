import { MakeError, MakeLogger } from '@freik/core-utils';
import { RecoilState, RecoilValueReadOnly, useRecoilCallback } from 'recoil';

const log = MakeLogger('api'); // eslint-disable-line
const err = MakeError('ReadWrite-err'); // eslint-disable-line

export type MyTransactionInterface = {
  get: <T>(recoilVal: RecoilState<T> | RecoilValueReadOnly<T>) => T;
  set: <T>(
    recoilVal: RecoilState<T>,
    valOrUpdater: ((currVal: T) => T) | T,
  ) => void;
  reset: <T>(recoilVal: RecoilState<T>) => void;
};

type FnType<Args extends readonly unknown[], Return> = (
  ...args: Args
) => Return;

// I'm making my own hook to use instead of the currently-too-constrained
// useRecoilTransaction hook
export function useMyTransaction<Args extends readonly unknown[], Return>(
  fn: (ntrface: MyTransactionInterface) => FnType<Args, Return>,
): FnType<Args, Return> {
  return useRecoilCallback(({ set, reset, snapshot }) => {
    const get = <T>(recoilVal: RecoilState<T> | RecoilValueReadOnly<T>) =>
      snapshot.getLoadable(recoilVal).getValue();
    return fn({ set, reset, get });
  });
}
