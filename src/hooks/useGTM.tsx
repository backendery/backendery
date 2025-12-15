import { useEffect } from 'react';

export const useGTM = (gtmId?: string) => {
  useEffect(() => {
    // Check that it is not a preview deployment
    const isPreview = window.location.hostname.includes('vercel.app');

    if (!gtmId || isPreview) {
      console.log('GTM disabled:', isPreview ? 'preview deployment' : 'no GTM ID');
      return;
    }

    // Initializing the dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'gtm.js',
      'gtm.start': Date.now(),
    });

    // Add GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;

    const firstScript = document.querySelectorAll('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    // Add noscript iframe
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);

    document.body.insertBefore(noscript, document.body.firstChild);
  }, [gtmId]);
};
