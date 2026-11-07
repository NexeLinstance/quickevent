// src/commands/collapse/helper.js

export function ensureWrapper(details) {
  let wrapper = details.querySelector(':scope > .qe-collapse-wrapper');
  if (wrapper) return wrapper;

  wrapper = document.createElement('div');
  wrapper.className = 'qe-collapse-wrapper';
  wrapper.style.overflow = 'hidden';
  
  Array.from(details.childNodes).forEach(node => {
    if (node.nodeType === 1 && node.tagName === 'SUMMARY') return;
    wrapper.appendChild(node);
  });
  
  details.appendChild(wrapper);
  return wrapper;
}

export function animateCollapse(details, action, duration) {
  // 1. LOCK: If currently animating, ignore new requests
  if (details._qeAnimating) return;

  const wrapper = ensureWrapper(details);
  const isCurrentlyOpen = details.classList.contains('qe-collapse-open');

  if (action === 'open' && isCurrentlyOpen) return;
  if (action === 'close' && !isCurrentlyOpen) return;
  if (action === 'toggle') action = isCurrentlyOpen ? 'close' : 'open';

  // Accordion logic
  if (action === 'open') {
    const summary = details.querySelector('summary');
    const groupValue = summary ? (summary.getAttribute('accordion') || summary.getAttribute('chain')) : null;
    if (groupValue) {
      document.querySelectorAll('details').forEach(otherDetails => {
        if (otherDetails === details) return; 
        const otherSummary = otherDetails.querySelector('summary');
        if (otherSummary && (otherSummary.getAttribute('accordion') === groupValue || otherSummary.getAttribute('chain') === groupValue)) {
          if (otherDetails.classList.contains('qe-collapse-open')) {
            animateCollapse(otherDetails, 'close', duration);
          }
        }
      });
    }
  }

  // 2. SET LOCK FLAG
  details._qeAnimating = true;
  wrapper.getAnimations().forEach(a => a.cancel());

  if (action === 'open') {
    details.open = true; 
    
    // Measure target height
    wrapper.style.height = 'auto';
    void wrapper.offsetHeight; 
    const targetHeight = wrapper.getBoundingClientRect().height;
    
    // Set to 0 and force reflow
    wrapper.style.height = '0px';
    void wrapper.offsetHeight;

    // Animate
    const anim = wrapper.animate([
      { height: '0px' },
      { height: `${targetHeight}px` }
    ], {
      duration,
      easing: 'ease',
      fill: 'forwards'
    });

    details.classList.add('qe-collapse-open');

    anim.onfinish = () => {
      wrapper.style.height = ''; 
      anim.cancel();
      details._qeAnimating = false; // 3. UNLOCK
    };
  } else {
    const startHeight = wrapper.getBoundingClientRect().height;

    const anim = wrapper.animate([
      { height: `${startHeight}px` },
      { height: '0px' }
    ], {
      duration,
      easing: 'ease',
      fill: 'forwards'
    });

    details.classList.remove('qe-collapse-open');

    anim.onfinish = () => {
      details.open = false;
      wrapper.style.height = '';
      anim.cancel();
      details._qeAnimating = false; // 3. UNLOCK
    };
  }
}