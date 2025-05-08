/**
 * Utility functions for accessibility features in DrishyaScan
 */

// Calculate contrast ratio between two colors
export const calculateContrastRatio = (foreground, background) => {
    // Convert hex to luminance
    const getLuminance = (hex) => {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Convert to RGB
      let r = parseInt(hex.substr(0, 2), 16) / 255;
      let g = parseInt(hex.substr(2, 2), 16) / 255;
      let b = parseInt(hex.substr(4, 2), 16) / 255;
      
      // Apply gamma correction
      r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
      g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
      b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
      
      // Calculate luminance
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    // Get luminance values
    const foregroundLum = getLuminance(foreground);
    const backgroundLum = getLuminance(background);
    
    // Calculate ratio
    const ratio = foregroundLum > backgroundLum
      ? (foregroundLum + 0.05) / (backgroundLum + 0.05)
      : (backgroundLum + 0.05) / (foregroundLum + 0.05);
    
    return ratio;
  };
  
  // Check if contrast meets WCAG standards
  export const meetsWCAGContrast = (ratio, level = 'AA', isLargeText = false) => {
    if (level === 'AAA') {
      return isLargeText ? ratio >= 4.5 : ratio >= 7;
    }
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  };
  
  // Focus trap for modals and dialogs
  export const createFocusTrap = (containerRef) => {
    let focusableEls = containerRef.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    // Convert NodeList to Array for easier manipulation
    focusableEls = Array.from(focusableEls).filter(el => !el.disabled);
    
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    
    // Function to handle tab key press
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    
    return {
      activate: () => {
        // Set focus to first element
        if (firstEl) {
          firstEl.focus();
        }
        
        // Add event listener
        document.addEventListener('keydown', handleTabKey);
      },
      deactivate: () => {
        // Remove event listener
        document.removeEventListener('keydown', handleTabKey);
      }
    };
  };
  
  // Ensure screen reader only text is properly styled
  export const srOnly = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: '0'
  };
  
  // Helper to announce changes to screen readers
  export const announceToScreenReader = (message) => {
    const announce = document.createElement('div');
    announce.setAttribute('aria-live', 'assertive');
    announce.setAttribute('aria-atomic', 'true');
    announce.classList.add('sr-only');
    document.body.appendChild(announce);
    
    // Set timeout to ensure screen readers register the element before content is added
    setTimeout(() => {
      announce.textContent = message;
      
      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announce);
      }, 1000);
    }, 100);
  };