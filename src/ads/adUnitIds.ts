import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

// Real production AdMob ad unit IDs (iOS). __DEV__ falls back to Google's
// test IDs so local/dev builds never serve (or accidentally click-fraud)
// live ads.
const IOS_BANNER_AD_UNIT_ID = 'ca-app-pub-8788799202066241/4848736643';
const IOS_SQUARE_AD_UNIT_ID = 'ca-app-pub-8788799202066241/6830078327';
const IOS_INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-8788799202066241/6095581157';
const IOS_REWARDED_AD_UNIT_ID = 'ca-app-pub-8788799202066241/4441542534';

export const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.select({ ios: IOS_BANNER_AD_UNIT_ID, default: TestIds.BANNER });

export const SQUARE_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.select({ ios: IOS_SQUARE_AD_UNIT_ID, default: TestIds.BANNER });

export const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({ ios: IOS_INTERSTITIAL_AD_UNIT_ID, default: TestIds.INTERSTITIAL });

export const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.select({ ios: IOS_REWARDED_AD_UNIT_ID, default: TestIds.REWARDED });
