// Google Analytics 4 Tracking ID
export const GA_TRACKING_ID = 'G-94J5R3EG4C';

// Declare gtag function globally
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize GA4
export const initGA = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID);
  }
};

// Track user registration
export const trackSignUp = (method: string = 'email') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: method,
      currency: 'CLP',
      value: 39990
    });
  }
};

// Track when user starts checkout process
export const trackBeginCheckout = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'CLP',
      value: 39990,
      items: [{
        item_id: 'invitation_publication',
        item_name: 'Publicación de Invitación Digital',
        price: 39990,
        quantity: 1
      }]
    });
  }
};

// Track successful purchase
export const trackPurchase = (transactionId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      currency: 'CLP',
      value: 39990,
      tax: 0,
      shipping: 0,
      items: [{
        item_id: 'invitation_publication',
        item_name: 'Publicación de Invitación Digital',
        price: 39990,
        quantity: 1
      }]
    });
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}; 