(function() {
    var CONSENT_KEY = 'l1xio_cookie_consent';
    var ANALYTICS_KEY = 'l1xio_pageviews';

    function getConsent() {
        try {
            var stored = localStorage.getItem(CONSENT_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    }

    function setConsent(consent) {
        try {
            localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
        } catch (e) {}
    }

    function trackPageview() {
        var consent = getConsent();
        if (consent && consent.analytics) {
            try {
                var views = parseInt(localStorage.getItem(ANALYTICS_KEY) || '0', 10);
                localStorage.setItem(ANALYTICS_KEY, String(views + 1));
            } catch (e) {}
        }
    }

    function showBanner() {
        var banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('hidden');
        }
    }

    function hideBanner() {
        var banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('hidden');
        }
    }

    function initCookieBanner() {
        var consent = getConsent();
        if (consent !== null) {
            hideBanner();
            trackPageview();
            return;
        }

        showBanner();

        var acceptBtn = document.getElementById('cookie-accept');
        var rejectBtn = document.getElementById('cookie-reject');
        var customizeBtn = document.getElementById('cookie-customize-btn');
        var saveBtn = document.getElementById('cookie-save');
        var customizePanel = document.getElementById('cookie-customize');
        var analyticsCheckbox = document.getElementById('cookie-analytics');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                setConsent({ necessary: true, analytics: true });
                hideBanner();
                trackPageview();
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', function() {
                setConsent({ necessary: true, analytics: false });
                hideBanner();
            });
        }

        if (customizeBtn && customizePanel) {
            customizeBtn.addEventListener('click', function() {
                customizePanel.classList.toggle('hidden');
            });
        }

        if (saveBtn && analyticsCheckbox) {
            saveBtn.addEventListener('click', function() {
                setConsent({ necessary: true, analytics: analyticsCheckbox.checked });
                hideBanner();
                if (analyticsCheckbox.checked) {
                    trackPageview();
                }
            });
        }
    }

    function playNotificationSound() {
        try {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            var ctx = new AudioContext();
            var oscillator = ctx.createOscillator();
            var gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.3);
        } catch (e) {}
    }

    function initSoundButton() {
        var soundBtn = document.getElementById('play-sound-btn');
        if (soundBtn) {
            soundBtn.addEventListener('click', playNotificationSound);
        }
    }

    function initContactForm() {
        var form = document.getElementById('contact-form');
        var formContainer = document.getElementById('contact-form-container');
        var successMessage = document.getElementById('contact-success');

        if (form && formContainer && successMessage) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                formContainer.style.display = 'none';
                successMessage.classList.remove('hidden');
            });
        }
    }

    function initCheckoutForm() {
        var form = document.getElementById('checkout-form');
        var formContainer = document.getElementById('checkout-form-container');
        var successMessage = document.getElementById('checkout-success');

        if (form && formContainer && successMessage) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                formContainer.style.display = 'none';
                successMessage.classList.remove('hidden');
            });
        }
    }

    function initCheckoutPlan() {
        var params = new URLSearchParams(window.location.search);
        var plan = params.get('plan');
        var planDisplay = document.getElementById('selected-plan');

        if (planDisplay && plan) {
            var planNames = {
                'starter': 'Starter (€499/month)',
                'business': 'Business (€1,499/month)',
                'enterprise': 'Enterprise (Contact Sales)'
            };
            planDisplay.textContent = planNames[plan] || plan;
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        initCookieBanner();
        initSoundButton();
        initContactForm();
        initCheckoutForm();
        initCheckoutPlan();
    });
})();
