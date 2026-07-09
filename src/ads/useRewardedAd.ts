import { useEffect, useRef } from 'react';
import { useRewardedAd as useRewardedAdBase } from 'react-native-google-mobile-ads';
import { REWARDED_AD_UNIT_ID } from './adUnitIds';

export const useRewardedAd = (onEarned: () => void) => {
  const { isLoaded, isEarnedReward, isClosed, load, show } = useRewardedAdBase(REWARDED_AD_UNIT_ID);
  const earnedRef = useRef(false);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isEarnedReward && !earnedRef.current) {
      earnedRef.current = true;
      onEarned();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEarnedReward]);

  useEffect(() => {
    if (isClosed) {
      earnedRef.current = false;
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClosed]);

  return { loaded: isLoaded, show: () => show() };
};
