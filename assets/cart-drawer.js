class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);

/* =========== Progress bar functionality ============ */


// Listen for when the DOM is fully loaded and ready.
document.addEventListener('DOMContentLoaded', function() {

  // Add event listeners to all forms that add items to the cart.
  document.querySelectorAll('form[action="/cart/add"]').forEach(function(form) {
      form.addEventListener('submit', function(e) {
          e.preventDefault();

          var formData = new FormData(form); // Gather the form data to be sent.

          // Make an asynchronous AJAX request to add the item to the cart.
          fetch('/cart/add.js', {
              method: 'POST',
              body: formData,
              headers: {
                  'X-Requested-With': 'XMLHttpRequest' // Indicates that the request is an AJAX call.
              }
          })
          .then(response => response.json()) // Convert the response to JSON.
          .then(data => {
              updateCartAndProgress(); // Call the function to update the progress bar.
          })
          .catch((error) => {
              console.error('Error:', error);
          });
      });
  });

  // Add event listeners to buttons that remove items from the cart.
  document.querySelectorAll('.remove-from-cart-button').forEach(function(button) {
      button.addEventListener('click', function(e) {
          e.preventDefault();
          var productId = this.getAttribute('data-product-id'); // Get the product ID to be removed.
          
          // Make an asynchronous AJAX request to remove the item from the cart.
          fetch('/cart/change.js', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest' // Indicates that the request is an AJAX call.
              },
              body: JSON.stringify({ id: productId, quantity: 0 }) // Send the product ID and set the quantity to 0 to remove it.
          })
          .then(response => response.json()) // Convert the response to JSON.
          .then(data => {
              updateCartAndProgress(); // Call the function to update the progress bar.
          })
          .catch((error) => {
              console.error('Error:', error);
          });
      });
  });

  // Add event listeners to forms that update the quantity of items in the cart.

  document.querySelectorAll('.update-cart-quantity-form').forEach(function(form) {
      form.addEventListener('submit', function(e) {
          e.preventDefault();

          var formData = new FormData(form);

          // Make an asynchronous AJAX request to remove the item from the cart.
          fetch('/cart/update.js', {
              method: 'POST',
              body: formData,
              headers: {
                  'X-Requested-With': 'XMLHttpRequest' // Indicates that the request is an AJAX call.
              }
          })
          .then(response => response.json())
          .then(data => {
              updateCartAndProgress(); // Call the function to update the progress bar.
          })
          .catch((error) => {
              console.error('Error:', error);
          });
      });
  });

  // Call the function to update the progress bar on initial page load.
  updateCartAndProgress();
});
