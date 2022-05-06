import { useCreation, useHistoryTravel, useMemoizedFn } from 'ahooks';
import { nanoid } from 'nanoid';
import { createContext, useContext, useMemo } from 'react';
import { CanvasProvider } from './canvas-context';
import { DefaultBackground, DefaultLinkComponent, DefaultNodeComponent } from './default';
import { useFocusItem, useUndoRedo } from './hook';
import { buildGraphTree, buildId } from './util';

const GraphContext = createContext();

const defaultOptions = {
  initialValues: [],
  nodeOptions: {
    default: {
      component: DefaultNodeComponent,
      props: {}
    }
  },
  anchorOptions: [
    {
      /// left
      rate: 0.5,
      offset: 0,
      orthogonalOffset: 8
    },
    {
      /// top
      rate: 0.5,
      offset: 0,
      orthogonalOffset: 0
    },
    {
      /// right
      rate: 0.5,
      offset: 0,
      orthogonalOffset: -8
    },
    {
      /// bottom
      rate: 0.5,
      offset: 0,
      orthogonalOffset: 0
    }
  ],
  linkOptions: {
    component: DefaultLinkComponent
  },
  canvasOptions: {
    initialScale: 0.25,
    maxScale: 2,
    minScale: 0.5
  }
};

const useValue = initialValues => {
  const values = useCreation(() => buildId(initialValues), []);
  const [{ present: value }, { set: setValue, refresh, reset, undo, redo, canUndo, canRedo }] = useUndoRedo(values);
  return useMemo(() => ({ value, canUndo, canRedo, setValue, redo, undo, refresh, reset }), [value, canRedo, canUndo]);
};
export const GraphProvider = ({ options = defaultOptions, children }) => {
  const nodeOptions = useCreation(() => options.nodeOptions || defaultOptions.nodeOptions, []);
  const anchorOptions = useCreation(() => options.anchorOptions || defaultOptions.anchorOptions, []);
  const linkOptions = useCreation(() => options.linkOptions || defaultOptions.linkOptions, []);
  const canvasOptions = useCreation(() => options.canvasOptions || defaultOptions.canvasOptions, []);

  const { value, canRedo, canUndo, setValue, redo, undo, refresh, reset } = useValue(
    options.initialValues || defaultOptions.initialValues
  );
  const { focus, onFocus, unFocus } = useFocusItem();

  const context = useMemo(
    () => ({
      nodeOptions,
      anchorOptions,
      linkOptions,
      value,
      setValue,
      canRedo,
      redo,
      canUndo,
      undo,
      refresh,
      reset,
      focus,
      onFocus,
      unFocus
    }),
    [value, canRedo, canUndo, focus]
  );
  return (
    <GraphContext.Provider value={context}>
      <div className="w-full h-full relative overflow-hidden">
        <DefaultBackground />
        <CanvasProvider options={canvasOptions}></CanvasProvider>
      </div>
      <div className="absolute top-0 left-0">{children}</div>
    </GraphContext.Provider>
  );
};

export const useGraphTree = () => {
  const { value, refresh } = useContext(GraphContext);
  const tree = useMemo(() => buildGraphTree(value), [value]);
  return { tree, refresh };
};

export const useGraphNodeOptions = () => {
  const { nodeOptions } = useContext(GraphContext);
  return useMemo(() => nodeOptions, []);
};

export const useGraphAnchorOptions = () => {
  const { anchorOptions } = useContext(GraphContext);
  return useMemo(() => anchorOptions, []);
};

export const useGraphLinkOptions = () => {
  const { linkOptions } = useContext(GraphContext);
  return useMemo(() => linkOptions, []);
};

export const useValueFocus = () => {
  const { focus, unFocus, onFocus } = useContext(GraphContext);
  return useMemo(() => ({ focus, unFocus, onFocus }));
};

export const useUndoRedoOption = () => {
  const { undo, redo, disableRedo, disableUndo } = useContext(GraphContext);
  return useMemo(() => ({ undo, redo, disableRedo, disableUndo }), [disableRedo, disableUndo]);
};

const checkIn = (id, values) => values.some(v => v.id === id);
// options
export const useValueOption = () => {
  const { setValue, refresh, redo, undo, canRedo, canUndo, onFocus } = useContext(GraphContext) || {};

  /// add a node
  const add = useMemoizedFn(node => {
    const id = nanoid();
    const wrapper = { _id: id, id, ...node };
    setValue(v => {
      v.push(wrapper);
      return v.slice();
    });
  });

  /// add a node and focus
  const addNode = useMemoizedFn(node => {
    const id = nanoid();
    const wrapper = { _id: id, id, ...node };
    setValue(v => {
      v.push(wrapper);
      return v.slice();
    });
    onFocus(wrapper);
  });

  /// del the node
  const del = useMemoizedFn(id => {
    setValue(v => {
      if (checkIn(id, v)) {
        const data = v.filter(v => v.id !== id);
        return data;
      }
      return v;
    });
  });

  // del the node, effect: will be del the children of the node
  const delNode = useMemoizedFn(id => {
    setValue(v => {
      if (checkIn(id, v)) {
        const collection = [];
        const temp = [id];
        let target = null;
        while (temp.length) {
          target = temp.pop();
          collection.push(target);
          temp.push(...v.filter(i => i.parentId === target).map(i => i.id));
        }
        return v.filter(i => !collection.includes(i.id));
      }
      return v;
    });
  });

  /// update the node
  const update = useMemoizedFn(node => {
    setValue(v => {
      if (checkIn(node?.id, v)) {
        const temp = v.filter(v => v.id !== node?.id);
        temp.push(node);
        return temp;
      }
      return v;
    });
  });

  return useMemo(
    () => ({ add, addNode, del, delNode, update, refresh, setValue, redo, undo, canRedo, canUndo }),
    [canRedo, canUndo]
  );
};
