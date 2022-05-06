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

const Add = () => {
  const { focus } = useValueFocus();
  const { add } = useValueOption();
  const onAdd = () => {
    if (focus) {
      const { id } = focus;
      add({ parentId: id });
    }
  };
  return (
    <Action active={focus} onClick={onAdd}>
      add
    </Action>
  );
};
const Sub = () => {
  const { focus } = useValueFocus();
  const { add } = useValueOption();
  const onSub = () => {
    if (focus) {
      const { parentId } = focus;
      add({ parentId });
    }
  };
  return (
    <Action active={focus} onClick={onSub}>
      sub
    </Action>
  );
};
const Redo = () => {
  const { redo, canRedo } = useValueOption();
  return (
    <Action active={canRedo} onClick={redo}>
      redo
    </Action>
  );
};
const Undo = () => {
  const { undo, canUndo } = useValueOption();
  return (
    <Action active={canUndo} onClick={undo}>
      undo
    </Action>
  );
};
const Del = () => {
  const { focus, unFocus } = useValueFocus();
  const { del } = useValueOption();
  const onClick = () => {
    if (focus) {
      const { id } = focus;
      del(id);
      unFocus();
    }
  };
  return (
    <Action active={focus} onClick={onClick}>
      del
    </Action>
  );
};
const App = () => {
  return (
    <div className="w-full h-screen">
      <Graph options={{ initialValues: data }}>
        <div className="px-2 py-1 bg-white rounded-sm shadow absolute top-2 left-2 flex gap-2">
          <Add />
          <Sub />
          <Redo />
          <Undo />
          <Del />
        </div>
      </Graph>
    </div>
  );
};

export default App;
