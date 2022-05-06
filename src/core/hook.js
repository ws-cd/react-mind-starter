import { useDebounceFn, useMemoizedFn, useSize } from 'ahooks';
import { clone, isFunction } from 'lodash';
import { useEffect, useMemo, useReducer, useState } from 'react';

export const useZoom = (scale, max, min) => {
  const [zoom, setZoom] = useState(1);
  const zoomIn = useMemoizedFn(() => {
    const inZoom = zoom + scale;
    if (inZoom > max) {
      return;
    }
    setZoom(inZoom);
  });
  const zoomOut = useMemoizedFn(() => {
    const outZoom = zoom - scale;
    if (outZoom < min) {
      return;
    }
    setZoom(outZoom);
  });
  return useMemo(() => ({ zoom, zoomText: `${zoom * 100}%`, zoomIn, zoomOut }), [zoom]);
};

export const useFocusItem = () => {
  const [focus, setFocus] = useState(null);
  const onFocus = useMemoizedFn(item => setFocus(item));
  const unFocus = useMemoizedFn(() => {
    setFocus(null);
  });
  return useMemo(() => ({ focus, onFocus, unFocus }), [focus]);
};

export const useResizeCallback = (ref, callback) => {
  const size = useSize(ref);
  const { run: debounceResizeRefrsh } = useDebounceFn(() => requestAnimationFrame(callback), { wait: 120 });
  useEffect(() => {
    if (size) {
      debounceResizeRefrsh();
    }
  }, [size]);
};

const ActionType = {
  Undo: 'UNDO',
  Redo: 'REDO',
  Set: 'SET',
  Reset: 'RESET',
  Refrsh: 'REFRESH'
};
const initialState = {
  past: [],
  present: null,
  future: []
};
const reducer = (state, action) => {
  const { past, present, future } = state;
  switch (action.type) {
    case ActionType.Undo: {
      if (past.length === 0) {
        return state;
      }
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    }
    case ActionType.Redo: {
      if (future.length === 0) {
        return state;
      }
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    }
    case ActionType.Set: {
      const { newPresent, old } = action;
      if (newPresent === old) {
        return state;
      }
      return {
        past: [...past, old],
        present: newPresent,
        future: []
      };
    }
    case ActionType.Reset: {
      const { newPresent } = action;
      return {
        past: [],
        present: newPresent,
        future: []
      };
    }
    case ActionType.Refrsh: {
      return { ...state, present: clone(state.present) };
    }
    default:
    // ...
  }
};

export const useUndoRedo = initialPresent => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    present: initialPresent
  });
  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;
  const undo = useMemoizedFn(() => {
    if (canUndo) {
      dispatch({ type: ActionType.Undo });
    }
  });
  const redo = useMemoizedFn(() => {
    if (canRedo) {
      dispatch({ type: ActionType.Redo });
    }
  });
  const set = useMemoizedFn(expression => {
    const old = clone(state.present);
    dispatch({
      type: ActionType.Set,
      newPresent: isFunction(expression) ? expression.call(null, state.present) : expression,
      old
    });
  });
  const reset = useMemoizedFn(expression =>
    dispatch({
      type: ActionType.Reset,
      newPresent: isFunction(expression) ? expression.call(null, state.present) : expression
    })
  );
  const refresh = useMemoizedFn(() => dispatch({ type: ActionType.Refrsh }));
  return [state, { set, reset, refresh, undo, redo, canUndo, canRedo }];
};
