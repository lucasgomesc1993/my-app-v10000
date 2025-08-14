import * as React from 'react';

type PossibleRef<T> = React.Ref<T> | undefined;

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => {
    refs.forEach((ref) => setRef(ref, node));
  };
}

function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs);
}

function useForwardedRef<T>(forwardedRef: React.ForwardedRef<T>) {
  const innerRef = React.useRef<T>(null);
  const composedRefs = useComposedRefs(forwardedRef, innerRef);
  return [composedRefs, innerRef] as const;
}

export { useForwardedRef };
