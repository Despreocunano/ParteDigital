import { useCallback } from 'react';
import { trackEvent, trackPageView, trackSignUp, trackBeginCheckout, trackPurchase } from '../lib/analytics';

export const useAnalytics = () => {
  const trackCTA = useCallback((location: string, buttonText: string) => {
    trackEvent('cta_click', {
      location,
      button_text: buttonText
    });
  }, []);

  const trackFormSubmission = useCallback((formName: string, success: boolean) => {
    trackEvent('form_submit', {
      form_name: formName,
      success
    });
  }, []);

  const trackFeatureView = useCallback((featureName: string) => {
    trackEvent('feature_view', {
      feature_name: featureName
    });
  }, []);

  return {
    trackPageView,
    trackSignUp,
    trackBeginCheckout,
    trackPurchase,
    trackCTA,
    trackFormSubmission,
    trackFeatureView,
    trackEvent
  };
}; 