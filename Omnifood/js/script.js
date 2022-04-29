'use strict';

//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// 🔴 Important Things :

// 1.
// Enabling All CSS transitions after the page load
setTimeout(() => document.body.classList.remove('preload'), 400);

// 2.
// Updating the year in the footer
(function () {
  const copyrightDate = document.querySelector('.copyright-date');
  copyrightDate.textContent = `${new Date().getFullYear()}`;
})();

// 3.
// Does the browser, support "gap" property in flexbox ?
// if not then use margin instead of gap
(function () {
  const flexContainer = document.createElement('div');

  // 🟣 Styling the flexContainer :
  const styles = {
    display: 'flex',
    'flex-direction': 'column',
    gap: '1px',
  };

  Object.entries(styles).forEach(([property, value]) =>
    flexContainer.style.setProperty(property, value)
  );

  // 🟣 Creating two elements(flex-items), inside that flexContainer
  flexContainer.appendChild(document.createElement('div'));
  flexContainer.appendChild(document.createElement('div'));

  /* these flex-items are empty,
   so They don't have HEIGHT
   but ONLY "1px" gap, between them...
   Therefore, the height of the flexContainer should be "1px"
   ( if this browser supports "gap" property for "flexbox" ) */

  // 🟣 Adding the flexContainer element to the DOM ( index.html )
  document.body.appendChild(flexContainer);

  // 🟣 Checking the flexContainer height in the browser
  const isSupported = flexContainer.scrollHeight === 1;
  /* The Element.scrollHeight read-only property,
   is a measurement of the height of an element’s content,
   including content not visible on the screen due to overflow.
  */

  // 🟣 Removing the flexContainer element from the DOM ( index.html )
  flexContainer.parentNode.removeChild(flexContainer);

  if (!isSupported) {
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', 'css/no-gap.css');

    document.head.appendChild(stylesheet);
    document.body.classList.add('no-flex-gap');
  }
})();

//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// 🔴 Functions :

// 1.
const changeThemeColor = (newColor) =>
  theme.setAttribute('content', newColor);

// 2.
const goToSection = function (sectionID) {
  if (sectionID === '#') {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  } else {
    const section = document.querySelector(sectionID);
    // If there is no element with this ID, it returns "null"
    // "null" is a falsy value !

    if (section) {
      // 🟣 Old Method (Better for Compatibility ✅):
      const coordinates = section.getBoundingClientRect();
      // The returned value is a DOMRect object

      window.scrollTo({
        top: window.pageYOffset + coordinates.top,
        left: window.pageXOffset + coordinates.left,
        behavior: 'smooth', // does not work on Safari by default !!!
        /* There is a fix for that, We need a polyfill,
        What is the polyfill ?
        A polyfill is a piece of code (usually JavaScript on the Web),
        used to provide modern functionality on older browsers
        that do not natively support it.
        "SmoothScroll" polyfill has imported to the "index.html"
        */
      });

      // 🟣 New Method:
      // section.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// 🔴 Selecting Elements
const mobileNavBtn = document.querySelector('.mobile-nav-btn');
const header = document.querySelector('.header');
const heroSection = document.querySelector('.hero-section');
const heroButtons = document.querySelector('.hero-btns');

// The Initial Theme Color
const theme = document.querySelector('meta[name="theme-color"]');
const initialThemeColor = theme.getAttribute('content');

//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// 🔴 Event Listeners :

// 1.
// Makes "Main Nav" work in mobile screens
mobileNavBtn.addEventListener('click', () =>
  header.classList.toggle('mobile-nav-open')
);

// 2.
// Adding functionality to links inside navigation and logo
header.addEventListener('click', function (e) {
  e.preventDefault(); // disable the default behavior

  const clickedEl = e.target;
  const isNavLink = clickedEl.getAttribute('href')?.startsWith('#');
  /*
    >>> clickedEl.getAttribute('href') <<<
    If the clicked element doesn't contain "href" attribute,
    it returns "null".
    if you try to call ".startsWith()" method on "null",
    you will get "typeError"
    but we used "Optional chaining (?.)"
    so it returns "undefined" immediately.
    "undefined" is a falsy value
    If the clicked element contains the 'href' attribute,
    it returns a "string".
    We can call ".startsWith()" method in a "String"
    This method returns a Boolean
    Does this string start with the '#' character or not?
  */

  /* "isNavLink" can be "undefined" or "true"
     true, if "href" starts with '#' */
  if (isNavLink) {
    // Here, all hrefs start with '#'
    const href = clickedEl.getAttribute('href');

    goToSection(href);

    // On Mobile Screens:
    const isMobileNavOpen = this.classList.contains('mobile-nav-open');
    /* Is the Mobile Nav menu open,
     when the user clicks on one of the main navigation links? */

    isMobileNavOpen && this.classList.remove('mobile-nav-open');
    // If yes then close the Mobile Nav menu

    // 🟣 this --> header
  }
});

// 3.
// Adding functionality to hero buttons(Links)
heroButtons.addEventListener('click', function (e) {
  e.preventDefault(); // disable the default behavior

  const clickedEl = e.target;
  const isHeroBtn = clickedEl.getAttribute('href')?.startsWith('#');
  /////////////////////////////////////////////////////////////////
  if (isHeroBtn) {
    const href = clickedEl.getAttribute('href');
    goToSection(href);
  }
});

//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// 🔴 IntersectionObserver

// 1.
// Making Navbar(Header), sticky after the user passes the hero section
new IntersectionObserver(
  // callbackFn
  (entries) => {
    const [{ isIntersecting }] = entries;
    if (!isIntersecting) {
      // if (isIntersecting === false)
      header.classList.add('sticky-nav');
      changeThemeColor('#fff');
    } else {
      // else if (isIntersecting === true)
      header.classList.remove('sticky-nav');
      changeThemeColor(initialThemeColor);
    }
    // 🟣 Mobile Nav Part
    const isMobileNavOpen = header.classList.contains('mobile-nav-open');
    if (isMobileNavOpen) {
      header.classList.add('preload'); // Remove Animation
      header.classList.remove('mobile-nav-open');
      // Closing the Mobile Nav Menu Without Animation

      setTimeout(() => header.classList.remove('preload'), 400);
      // Activating the Animation after 400 milliseconds
    }
  },
  // Options
  {
    root: null,
    threshold: 0,
    rootMargin: '-90px',
  }
).observe(heroSection);
/* so as soon as "heroSection" moves out of the viewport,
we should get a new event */
