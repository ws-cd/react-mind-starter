import { useKeyPress, useMemoizedFn } from 'ahooks';
import { Graph, useValueFocus, useValueOption } from './core';

const data = [
  { id: 1, parentId: null },
  { id: 2, parentId: 1 },
  { id: 3, parentId: 1 },
  { id: 4, parentId: 3 }
];

const Action = ({ active, onClick, children }) => (
  <span
    onClick={active ? onClick : null}
    className={
      active
        ? 'text-gray-800 text-base leading-none block py-1 rounded cursor-pointer'
        : 'text-gray-400 line-through text-base leading-none block py-1 rounded cursor-not-allowed'
    }
  >
    {children}
  </span>
);
const useOptions = () => {
  const { focus, unFocus } = useValueFocus();
  const { addNode, redo, undo, canRedo, canUndo, delNode } = useValueOption();
  const onDel = useMemoizedFn(() => {
    if (focus) {
      const { id } = focus;
      delNode(id);
      unFocus();
    }
  });
  const onAdd = useMemoizedFn(() => {
    if (focus) {
      const { id } = focus;
      addNode({ parentId: id });
    }
  });
  const onSub = useMemoizedFn(() => {
    if (focus) {
      const { parentId } = focus;
      addNode({ parentId });
    }
  });
  return { onAdd, onSub, onDel, redo, undo, canRedo, canUndo, focus };
};
const Toolbar = () => {
  const { onAdd, onSub, onDel, redo, undo, canRedo, canUndo, focus } = useOptions();
  useKeyPress('enter', onSub);
  useKeyPress('tab', evt => {
    evt.stopPropagation();
    evt.preventDefault();
    onAdd();
  });
  return (
    <div className="px-2 py-1 bg-white rounded-sm shadow absolute top-2 left-2 flex gap-2">
      <Action active={focus} onClick={onAdd}>
        add
      </Action>
      <Action active={focus} onClick={onSub}>
        sub
      </Action>
      <Action active={canRedo} onClick={redo}>
        redo
      </Action>
      <Action active={canUndo} onClick={undo}>
        undo
      </Action>
      <Action active={focus} onClick={onDel}>
        del
      </Action>
    </div>
  );
};
const App = () => {
  return (
    <div className="w-full h-screen">
      <Graph options={{ initialValues: data }}>
        <Toolbar />
      </Graph>
    </div>
  );
};

export default App;
