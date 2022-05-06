import { useMemoizedFn, useSafeState } from 'ahooks';
import { useEffect, useLayoutEffect } from 'react';
import { useGraphAnchorOptions } from './graph';
import { scrollToPoint, treeForEach } from './util';

const CanvasMeta = {
  info: {
    mTo: 0,
    mLo: 0,
    sc: { x: 0, y: 0 },
    cc: { x: 0, y: 0 }
  }, /// 画布信息
  anchors: {} /// 锚点信息： [node-id] : anchor {left, right, top, bottom}
};

/// 计算移动到中心的偏移
function computeInfo(scrollEle, containerEle) {
  const { offsetWidth, offsetHeight } = scrollEle;
  const sc = { x: offsetWidth / 2, y: offsetHeight / 2 };
  const cc = { x: containerEle.offsetWidth / 2, y: containerEle.offsetHeight / 2 };
  return {
    mTo: Math.abs(cc.y - sc.y),
    mLo: Math.abs(cc.x - sc.x),
    sc,
    cc
  };
}
export function useInitiCanvasMeta(scrollId, canvasId) {
  useLayoutEffect(() => {
    const scroll = document.getElementById(scrollId);
    const info = computeInfo(scroll, document.getElementById(canvasId));
    // update mv center offset
    CanvasMeta.info = info;
    // move to center
    scroll.scrollTop = info.mTo;
    scroll.scrollLeft = info.mLo;
  }, []);

  const fitCenter = useMemoizedFn(async () => {
    const { mTo, mLo } = CanvasMeta.info;
    await scrollToPoint(mTo, mLo, scrollId);
  });

  return fitCenter;
}

const computeAnchor = ({ left, top, width, height }, options) => {
  const [lOption, tOption, rOption, bOption] = options;
  const bottom = top + height;
  const right = left + width;
  return {
    // example: left [x + offset, y + (h * rate) + offset]
    left: [left + lOption.orthogonalOffset, top + height * lOption.rate + lOption.offset],
    top: [left + width * tOption.rate + tOption.offset, top + tOption.orthogonalOffset],
    right: [right + rOption.orthogonalOffset, top + height * rOption.rate + rOption.offset],
    bottom: [left + width * bOption.rate + bOption.offset, bottom + bOption.orthogonalOffset]
  };
};
export function useRegistAnchor(key, ref) {
  const options = useGraphAnchorOptions();
  useEffect(() => {
    const { current: node } = ref;
    const anchor = computeAnchor(
      {
        left: node.offsetLeft,
        top: node.offsetTop,
        width: node.offsetWidth,
        height: node.offsetHeight
      },
      options
    );
    CanvasMeta.anchors[key] = anchor;
  });
}

export function useLinks(tree) {
  const [links, setLinks] = useSafeState([]);
  useEffect(() => {
    const linksTags = [];
    treeForEach(tree, node => {
      const { parent, _id } = node;
      if (parent) {
        const pAnchor = CanvasMeta.anchors[parent._id];
        const nAnchor = CanvasMeta.anchors[_id];
        if (pAnchor && nAnchor) {
          // l -> r
          linksTags.push({
            _id: parent._id + '&' + _id,
            source: pAnchor.right,
            target: nAnchor.left
          });
        }
      }
    });
    setLinks(linksTags);
  }, [tree]);
  return links;
}
