import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorCode, useIAP } from 'react-native-iap';
import { REMOVE_ADS_SKU } from './productIds';

const PREMIUM_STORAGE_KEY = 'isPremium';
// StoreKit/Play Billing can silently drop a purchase request (backgrounding,
// flaky network, an already-pending transaction) without ever firing
// onPurchaseSuccess or onPurchaseError. Without a timeout the "Processing…"
// button gets stuck forever and the user has to force-quit to try again.
const PURCHASE_TIMEOUT_MS = 20000;

export const usePremium = () => {
  const [isPremium, setIsPremiumState] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const purchaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPurchaseTimeout = useCallback(() => {
    if (purchaseTimeoutRef.current) {
      clearTimeout(purchaseTimeoutRef.current);
      purchaseTimeoutRef.current = null;
    }
  }, []);

  const persistPremium = useCallback((value: boolean) => {
    setIsPremiumState(value);
    AsyncStorage.setItem(PREMIUM_STORAGE_KEY, value ? 'true' : 'false').catch((error) =>
      console.log('Error saving premium state:', error)
    );
  }, []);

  const {
    connected,
    products,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    getAvailablePurchases,
    availablePurchases,
    restorePurchases,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      clearPurchaseTimeout();
      if (purchase.productId === REMOVE_ADS_SKU) {
        persistPremium(true);
        try {
          await finishTransaction({ purchase, isConsumable: false });
        } catch (error) {
          console.log('Error finishing transaction:', error);
        }
      }
      setPurchasing(false);
    },
    onPurchaseError: (error) => {
      clearPurchaseTimeout();
      console.log('Purchase error:', error);
      setPurchasing(false);
      // "Already owned" surfaces as a purchase error on both platforms when a
      // prior transaction never finished (e.g. after the timeout below fires
      // before the store actually completes it) — reconcile instead of
      // leaving the user stuck on a dead "Buy Now" button.
      const message = (error?.message ?? '').toLowerCase();
      if (message.includes('already') || message.includes('own')) {
        getAvailablePurchases();
      } else if (error?.code !== ErrorCode.UserCancelled) {
        Alert.alert('Purchase Failed', 'Something went wrong. Please try again.');
      }
    },
  });

  useEffect(() => clearPurchaseTimeout, [clearPurchaseTimeout]);

  // Load persisted entitlement immediately so ads stay hidden across restarts
  // even before the store connection round-trip completes.
  useEffect(() => {
    AsyncStorage.getItem(PREMIUM_STORAGE_KEY)
      .then((stored) => {
        if (stored === 'true') setIsPremiumState(true);
      })
      .catch((error) => console.log('Error loading premium state:', error));
  }, []);

  useEffect(() => {
    if (connected) {
      fetchProducts({ skus: [REMOVE_ADS_SKU], type: 'in-app' });
      getAvailablePurchases();
    }
  }, [connected, fetchProducts, getAvailablePurchases]);

  // Reconcile with the store's record of past non-consumable purchases
  // (covers reinstalls, restores, and the initial post-purchase queue replay).
  useEffect(() => {
    const owned = availablePurchases.some((p) => p.productId === REMOVE_ADS_SKU);
    if (owned) {
      persistPremium(true);
    }
  }, [availablePurchases, persistPremium]);

  const product = products.find((p) => p.id === REMOVE_ADS_SKU);

  const purchasePremium = useCallback(async () => {
    if (!connected || purchasing) return;
    setPurchasing(true);
    clearPurchaseTimeout();
    // requestPurchase is fire-and-forget — the real result comes through
    // onPurchaseSuccess/onPurchaseError, which the store can fail to ever
    // call (backgrounded app, dropped connection). Fall back to unstick the
    // button and let the user retry rather than being stuck on "Processing…".
    purchaseTimeoutRef.current = setTimeout(() => {
      purchaseTimeoutRef.current = null;
      setPurchasing(false);
      getAvailablePurchases();
      Alert.alert(
        'Still Working?',
        "The purchase is taking longer than expected. If you completed payment, tap Restore Purchases in a moment. Otherwise, try again."
      );
    }, PURCHASE_TIMEOUT_MS);

    try {
      await requestPurchase({
        request: {
          apple: { sku: REMOVE_ADS_SKU },
          google: { skus: [REMOVE_ADS_SKU] },
        },
        type: 'in-app',
      });
    } catch (error) {
      clearPurchaseTimeout();
      console.log('Error requesting purchase:', error);
      setPurchasing(false);
    }
  }, [connected, purchasing, requestPurchase, clearPurchaseTimeout, getAvailablePurchases]);

  const restore = useCallback(async () => {
    try {
      await restorePurchases();
    } catch (error) {
      console.log('Error restoring purchases:', error);
    }
  }, [restorePurchases]);

  return {
    isPremium,
    purchasing,
    priceLabel: product?.displayPrice ?? '$2.99',
    purchasePremium,
    restore,
  };
};
