import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

// Flip this to `true` before archiving a TestFlight build, and back to
// `false` before submitting to the App Store. There's no reliable way to
// detect TestFlight vs. App Store at runtime in JS, so this is manual.
// While `true`, every ad slot serves Google's test creatives regardless of
// platform, so ads are guaranteed to fill and won't affect live stats.
const USE_TEST_ADS = false;

// Real production AdMob ad unit IDs. __DEV__ or USE_TEST_ADS falls back to
// Google's test IDs so local/dev/TestFlight builds never serve (or
// accidentally click-fraud) live ads.
const IOS_BANNER_AD_UNIT_ID = 'ca-app-pub-8788799202066241/4848736643';
const IOS_SQUARE_AD_UNIT_ID = 'ca-app-pub-8788799202066241/6830078327';
const IOS_INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-8788799202066241/6095581157';
const IOS_REWARDED_AD_UNIT_ID = 'ca-app-pub-8788799202066241/4441542534';

const ANDROID_BANNER_AD_UNIT_ID = 'ca-app-pub-8788799202066241/7666471677';
const ANDROID_SQUARE_AD_UNIT_ID = 'ca-app-pub-8788799202066241/9885440909';
const ANDROID_INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-8788799202066241/7675457372';
const ANDROID_REWARDED_AD_UNIT_ID = 'ca-app-pub-8788799202066241/1034826161';

const useTestIds = __DEV__ || USE_TEST_ADS;

export const BANNER_AD_UNIT_ID = useTestIds
  ? TestIds.BANNER
  : Platform.select({ ios: IOS_BANNER_AD_UNIT_ID, android: ANDROID_BANNER_AD_UNIT_ID, default: TestIds.BANNER });

export const SQUARE_AD_UNIT_ID = useTestIds
  ? TestIds.BANNER
  : Platform.select({ ios: IOS_SQUARE_AD_UNIT_ID, android: ANDROID_SQUARE_AD_UNIT_ID, default: TestIds.BANNER });

export const INTERSTITIAL_AD_UNIT_ID = useTestIds
  ? TestIds.INTERSTITIAL
  : Platform.select({ ios: IOS_INTERSTITIAL_AD_UNIT_ID, android: ANDROID_INTERSTITIAL_AD_UNIT_ID, default: TestIds.INTERSTITIAL });

export const REWARDED_AD_UNIT_ID = useTestIds
  ? TestIds.REWARDED
  : Platform.select({ ios: IOS_REWARDED_AD_UNIT_ID, android: ANDROID_REWARDED_AD_UNIT_ID, default: TestIds.REWARDED });
