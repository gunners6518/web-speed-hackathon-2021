import React from 'react';

/**
 * @typedef {object} Props
 * @property {React.ReactNode} children
 * @property {any} items
 * @property {() => void} fetchMore
 */

/** @type {React.VFC<Props>} */
const InfiniteScroll = ({ children, fetchMore, items }) => {
  const latestItem = items[items.length - 1];

  const prevReachedRef = React.useRef(false);

  React.useEffect(() => {
    const handler = () => {
      // do: 2**18の処理を削除
      const hasReached = window.innerHeight + Math.ceil(window.scrollY) >= document.body.offsetHeight;

      // 画面最下部にスクロールしたタイミングで、登録したハンドラを呼び出す
      if (hasReached && !prevReachedRef.current) {
        // アイテムがないときは追加で読み込まない
        if (latestItem !== undefined) {
          fetchMore();
        }
      }

      prevReachedRef.current = hasReached;
    };

    // 最初は実行されないので手動で呼び出す
    prevReachedRef.current = false;
    handler();

    //do: Passive eventを設定
    document.addEventListener('wheel', handler, { passive: true, capture: true });
    document.addEventListener('touchmove', handler, { passive: true, capture: true });
    document.addEventListener('resize', handler, { passive: true, capture: true });
    document.addEventListener('scroll', handler, { passive: true, capture: true });
    return () => {
      document.removeEventListener('wheel', handler);
      document.removeEventListener('touchmove', handler);
      document.removeEventListener('resize', handler);
      document.removeEventListener('scroll', handler);
    };
  }, [latestItem, fetchMore]);

  return <>{children}</>;
};

export { InfiniteScroll };
