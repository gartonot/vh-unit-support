function calculateUnitValue(unit) {
    switch (unit) {
        case 'dvh':
            return window.innerHeight * 0.01;
        case 'svh':
            return document.documentElement.clientHeight * 0.01;
        case 'lvh':
            return Math.max(window.innerHeight, window.innerWidth) * 0.01;
        default:
            throw new Error(`Unknown unit: ${unit}`);
    }
}

function setCustomProperty(units, isDefault = false) {
    if (isDefault) {
        units.forEach(function(unit) {
            document.documentElement.style.setProperty(`--1${unit}`, `1${unit}`);
        });
    } else {
        units.forEach(function(unit) {
            const value = calculateUnitValue(unit);
            document.documentElement.style.setProperty(`--1${unit}`, `${value}px`);
        });
    }
}

function setVh(units = [], isDefault = false) {
    // Default units
    const validUnits = ['dvh', 'svh', 'lvh'];
    
    if (!Array.isArray(units)) {
        // Copy default values
        units = validUnits.slice();
    }

    if (units.length === 0) {
        // Copy default values
        units = validUnits.slice();
    } else {
        units = units.filter(unit => validUnits.includes(unit));
        if (units.length === 0) {
            units = validUnits.slice();
        } 
    }

    if (isDefault) {
        setCustomProperty(units, true);
    } else {
        setCustomProperty(units);
    }
}

function hasFeatureDetected(feature) {
    try {
        return window.CSS.supports(feature);
    } catch (error) {
        return false;
    }
}

function init(units = []) {
    // SSR support
    if (typeof window === 'undefined') {
        return;
    }

    // Set default units
    setVh(units, true);

    // Don`t run polyfill if browser supports the units
    if (
        hasFeatureDetected('height: 100dvh') &&
        hasFeatureDetected('height: 100svh') &&
        hasFeatureDetected('height: 100lvh')
    ) {
        return;
    }

    // Start the calculation as soon as possible
    setVh(units);

    // Start the calculation again when DOM has loaded
    document.addEventListener('DOMContentLoaded', setVh);

    // Start the calculation when window is resized
    window.addEventListener('resize', function() {
        requestAnimationFrame(() => {
            setVh();
        });
    });

    // Start the calculation when change orientation
    window.addEventListener('orientationchange', setVh);
}

module.exports = init;
