import { useCreation, useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash';
import { useRef } from 'react';
import { useRegistAnchor } from './canvas-meta';
import { useGraphNodeOptions, useValueFocus } from './graph';

const Node = ({ node, children }) => {
  const ref = useRef();
  const option = useGraphNodeOptions();
  const { focus, onFocus } = useValueFocus();

  const { Component, defaultProps } = useCreation(() => {
    const { component: Component, props: defaultProps } = option[node?.type] || option.default;
    return { Component, defaultProps };
  }, [option]);

  useRegistAnchor(node?._id, ref);

  const onFocusItem = useMemoizedFn(evt => {
    evt.stopPropagation();
    evt.preventDefault();
    onFocus(node);
  });

  return (
    <div className="mind-graph-node">
      <div
        className={focus?._id === node._id ? 'mind-graph-node-wrapper-focus' : 'mind-graph-node-wrapper'}
        ref={ref}
        onClick={onFocusItem}
      >
        <Component {...defaultProps} {...node} />
      </div>
      {children && <div className="mind-graph-node-children">{children}</div>}
    </div>
  );
};

export default Node;

export function renderTree(nodes) {
  return nodes.map(node => {
    if (isEmpty(node.children)) {
      return <Node key={node._id} node={node} />;
    }
    return (
      <Node key={node._id} node={node}>
        {node.children.map(child => renderTree([child]))}
      </Node>
    );
  });
}
