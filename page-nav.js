(function () {
    'use strict';

    var PAGE_ORDER = ['index.html', 'about.html', 'products.html', 'info.html'];
    var COOLDOWN_MS = 1200;
    var ANIMATION_MS = 500;
    var SWIPE_THRESHOLD = 50;
    var EDGE_SWIPE_COUNT = 2;
    var EDGE_SWIPE_WINDOW_MS = 800;

    function getCurrentPageIndex() {
        var path = window.location.pathname;
        var filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        return PAGE_ORDER.indexOf(filename);
    }

    var currentIndex = getCurrentPageIndex();
    if (currentIndex === -1) return;

    var isCoolingDown = false;
    var isTransitioning = false;
    var edgeSwipeCount = 0;
    var lastEdgeSwipeTime = 0;
    var lastEdgeDirection = null;

    function navigateWithSlide(direction, targetUrl) {
        if (isTransitioning) return;
        isTransitioning = true;

        var header = document.querySelector('header');
        var main = document.querySelector('main');
        var canvas = document.getElementById('particles');
        var targets = [header, main, canvas].filter(Boolean);

        targets.forEach(function (el) {
            el.style.transition = 'transform ' + ANIMATION_MS + 'ms cubic-bezier(0.4, 0, 0.2, 1), opacity ' + ANIMATION_MS + 'ms ease';
        });

        void document.body.offsetHeight;

        // Swipe right (next page) = content slides out to the left
        // Swipe left (prev page) = content slides out to the right
        var translateX = direction === 'next' ? '-100vw' : '100vw';
        targets.forEach(function (el) {
            el.style.transform = 'translateX(' + translateX + ')';
            el.style.opacity = '0';
        });

        sessionStorage.setItem('pageNavEntryDirection', direction);

        setTimeout(function () {
            window.location.href = targetUrl;
        }, ANIMATION_MS);
    }

    function applyEntryAnimation() {
        var entryDirection = sessionStorage.getItem('pageNavEntryDirection');
        sessionStorage.removeItem('pageNavEntryDirection');
        if (!entryDirection) return;

        var header = document.querySelector('header');
        var main = document.querySelector('main');
        var canvas = document.getElementById('particles');
        var targets = [header, main, canvas].filter(Boolean);

        // If we went "next", new page enters from the right
        // If we went "prev", new page enters from the left
        var startX = entryDirection === 'next' ? '100vw' : '-100vw';

        targets.forEach(function (el) {
            el.style.transform = 'translateX(' + startX + ')';
            el.style.opacity = '0';
        });

        // Reveal the page (hidden by inline head script to prevent black flash)
        document.documentElement.style.opacity = '1';

        void document.body.offsetHeight;

        targets.forEach(function (el) {
            el.style.transition = 'transform ' + ANIMATION_MS + 'ms cubic-bezier(0.4, 0, 0.2, 1), opacity ' + ANIMATION_MS + 'ms ease';
            el.style.transform = 'translateX(0)';
            el.style.opacity = '1';
        });

        setTimeout(function () {
            targets.forEach(function (el) {
                el.style.transition = '';
                el.style.transform = '';
                el.style.opacity = '';
            });
        }, ANIMATION_MS + 50);
    }

    function onWheel(e) {
        if (isTransitioning || isCoolingDown) return;

        // Block navigation when product overlay is open
        var overlay = document.getElementById('cardOverlay');
        if (overlay && overlay.classList.contains('active')) return;

        var deltaX = e.deltaX;
        // Ignore small movements and vertical-dominant scrolls
        if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
        if (Math.abs(e.deltaY) > Math.abs(deltaX)) return;

        // Swipe right (positive deltaX) = next page, swipe left (negative) = prev page
        var direction = deltaX > 0 ? 'next' : 'prev';
        var targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (targetIndex < 0 || targetIndex >= PAGE_ORDER.length) return;

        var now = Date.now();
        if (direction !== lastEdgeDirection || (now - lastEdgeSwipeTime) > EDGE_SWIPE_WINDOW_MS) {
            edgeSwipeCount = 0;
        }
        lastEdgeDirection = direction;
        lastEdgeSwipeTime = now;
        edgeSwipeCount++;

        if (edgeSwipeCount < EDGE_SWIPE_COUNT) return;

        e.preventDefault();

        isCoolingDown = true;
        setTimeout(function () { isCoolingDown = false; }, COOLDOWN_MS);

        navigateWithSlide(direction, PAGE_ORDER[targetIndex]);
    }

    // Touch swipe support for mobile
    var touchStartX = 0;
    var touchStartY = 0;
    var touchStartTime = 0;
    var TOUCH_SWIPE_MIN = 80;

    function onTouchStart(e) {
        if (isTransitioning || isCoolingDown) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }

    function onTouchEnd(e) {
        if (isTransitioning || isCoolingDown) return;

        var overlay = document.getElementById('cardOverlay');
        if (overlay && overlay.classList.contains('active')) return;

        var touchEndX = e.changedTouches[0].clientX;
        var touchEndY = e.changedTouches[0].clientY;
        var deltaX = touchEndX - touchStartX;
        var deltaY = touchEndY - touchStartY;
        var elapsed = Date.now() - touchStartTime;

        // Must be horizontal swipe, fast enough, and long enough
        if (Math.abs(deltaX) < TOUCH_SWIPE_MIN) return;
        if (Math.abs(deltaY) > Math.abs(deltaX)) return;
        if (elapsed > 500) return;

        // Swipe left (negative deltaX) = next page, swipe right (positive) = prev page
        var direction = deltaX < 0 ? 'next' : 'prev';
        var targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (targetIndex < 0 || targetIndex >= PAGE_ORDER.length) return;

        isCoolingDown = true;
        setTimeout(function () { isCoolingDown = false; }, COOLDOWN_MS);

        navigateWithSlide(direction, PAGE_ORDER[targetIndex]);
    }

    document.addEventListener('DOMContentLoaded', function () {
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        applyEntryAnimation();
    });
})();
