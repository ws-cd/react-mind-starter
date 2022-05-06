import { cloneDeep, isArray, isFunction, keyBy } from 'lodash';
import { nanoid } from 'nanoid';
import { animateScroll } from 'react-scroll/modules';

/// 计算移动到中心的偏移
export function computeMvOffset(scrollEle, containerEle) {
  const { offsetWidth, offsetHeight } = scrollEle;
  const sCenter = { x: offsetWidth / 2, y: offsetHeight / 2 };
  const cCenter = { x: containerEle.offsetWidth / 2, y: containerEle.offsetHeight / 2 };
  return {
    mvTOffset: Math.abs(cCenter.y - sCenter.y),
    mvLOffset: Math.abs(cCenter.x - sCenter.x)
  };
}

// 滚动到特殊点
export async function scrollToPoint(top, left, containerId, options) {
  return new Promise(resolve => {
    animateScroll.scrollTo(top, { containerId, smooth: true, ...options });
    animateScroll.scrollTo(left, { containerId, smooth: true, horizontal: true, ...options });
    resolve();
  });
}

// 构建需要的_id
export function buildId(data) {
  if (!data) return [];
  return data.map(d => (d._id ? d : { _id: nanoid(), ...d }));
}
// 构建图树形
export function buildGraphTree(data) {
  if (!data) return [];
  const tars = cloneDeep(data);
  const res = [];
  const idsmap = keyBy(tars, n => n.id);
  let node = tars.shift();
  while (node) {
    const mapNode = idsmap[node['parentId']];
    if (node['parentId']) {
      if (!mapNode) {
        res.push(node);
      } else {
        mapNode.children = mapNode.children || [];
        mapNode.children.push(node);
        node.parent = mapNode;
      }
    } else {
      res.push(node);
    }
    node = tars.shift();
  }
  return res;
}

export function treeForEach(tree, cb, mode = 'BFS', childrenKey = 'children') {
  if (!isArray(tree)) {
    throw new TypeError('tree is not an array');
  }
  if (!isFunction(cb)) {
    throw new TypeError('cb is not a function');
  }
  if (typeof childrenKey !== 'string') {
    throw new TypeError('children is not a string');
  }
  if (childrenKey === '') {
    throw new Error('children is not a valid string');
  }
  // 深度优先遍历 depth first search
  function DFS(treeData) {
    // eslint-disable-next-line
    for (const item of treeData) {
      cb(item);
      if (Array.isArray(item[childrenKey])) {
        DFS(item[childrenKey]);
      }
    }
  }
  // 广度优先遍历 breadth first search
  function BFS(treeData) {
    const queen = treeData;
    while (queen.length > 0) {
      const item = queen.shift();
      cb(item);
      if (Array.isArray(item[childrenKey])) {
        queen.push(...item[childrenKey]);
      }
    }
  }
  const clone = cloneDeep(tree);
  if (mode === 'BFS') {
    BFS(clone);
  } else {
    DFS(clone);
  }
}
