const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.faq-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});

document.querySelectorAll('.checkout-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('#checkout-note')?.classList.add('highlight-note');
  });
});

const consentKey = 'ugc_ad_testing_os_analytics_consent';
const consentBanner = document.querySelector('[data-consent-banner]');

function setAnalyticsConsent(granted) {
  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  localStorage.setItem(consentKey, granted ? 'granted' : 'denied');
  if (consentBanner) consentBanner.hidden = true;
}

const savedConsent = localStorage.getItem(consentKey);
if (savedConsent === 'granted') {
  setAnalyticsConsent(true);
} else if (savedConsent === 'denied') {
  setAnalyticsConsent(false);
} else if (consentBanner) {
  consentBanner.hidden = false;
}

document.querySelector('[data-consent-accept]')?.addEventListener('click', () => setAnalyticsConsent(true));
document.querySelector('[data-consent-reject]')?.addEventListener('click', () => setAnalyticsConsent(false));
document.querySelector('[data-cookie-settings]')?.addEventListener('click', () => {
  if (consentBanner) consentBanner.hidden = false;
});

document.querySelectorAll('a[href^="https://buy.stripe.com/"]').forEach(link => {
  link.addEventListener('click', () => {
    // This event records an outbound click, not a loaded Stripe checkout or a sale.
    if (localStorage.getItem(consentKey) !== 'granted') return;
    window.gtag?.('event', 'checkout_click', {
      cta_location: link.closest('.mobile-buy') ? 'mobile_bar'
        : link.closest('header') ? 'header'
        : link.closest('section')?.id || (link.closest('.final-cta') ? 'final_cta' : 'other'),
      currency: 'USD',
      value: 29,
      items: [{ item_id: 'ugc-ad-testing-os', item_name: 'UGC Ad Testing OS', price: 29, quantity: 1 }],
      transport_type: 'beacon'
    });
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
