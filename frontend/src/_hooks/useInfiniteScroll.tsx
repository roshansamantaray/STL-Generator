// src/_hooks/useInfiniteScroll.ts
import { useEffect } from 'react';

const useInfiniteScroll = (fetchMore: () => void, hasMore: boolean) => {
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore) return;
      
      if (
        window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
        document.documentElement.scrollTop === 0
      )
        return;
      fetchMore();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchMore, hasMore]);
};

export default useInfiniteScroll;
