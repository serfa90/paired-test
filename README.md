# Shopify Store Theme Customization Documentation

This document outlines the customizations made to the Shopify store theme to enhance user experience with a dynamic cart and a responsive mobile menu. The customizations span across several Liquid template files, associated CSS files, and JavaScript functionality.

## Modified Files Overview

- `header.liquid`: Updated to include additional styles for the header.
- `header-drawer.liquid`: Customized to implement the mobile menu layout and interactivity.
- `cart-drawer.liquid`: Modified to alter the shopping cart popup functionality and to include new JavaScript logic for cart updates and progress bar functionality.
- `component-menu-drawer.css`: Contains added styles specific to the mobile menu's visual appearance.
- `component-cart-drawer.css`: Includes styles pertaining to the cart drawer's look and feel.
- `cart.js` and `cart-drawer.js`: Updated with functions that handle cart updates and display the progress bar for free shipping.

## Detailed File Changes

### `cart-drawer.liquid`

- **Changes**: In addition to altering the shopping cart popup, this file now includes JavaScript functions for dynamic cart updates and progress bar functionality.
- **Purpose**: To enable asynchronous cart updates without reloading the page and to visually indicate the user's progress towards earning free shipping.

### JavaScript Functionality in `cart-drawer.js`

#### Event Listeners for Cart Updates

- **Add to Cart Forms**: Event listeners are attached to all forms that add items to the cart. These listeners prevent the default form submission and instead make an AJAX request to add items to the cart.
- **Remove from Cart Buttons**: Similar event listeners are set up for buttons that remove items from the cart, sending a request to set the item quantity to zero.
- **Update Cart Quantity Forms**: Event listeners are also added to forms that update the quantity of cart items, making AJAX requests to reflect these changes.

#### `updateCartAndProgress()`

- **Functionality**: This function fetches the current cart data and updates the progress bar based on the cart's total price.
- **Trigger**: Called after any cart operation such as item addition, removal, or quantity update.

#### `updateProgressBar(total)`

- **Functionality**: Adjusts the progress bar's width and updates the messaging to reflect progress towards the free shipping threshold.
- **Parameters**: `total` - the total price of items in the cart.

## Implementation Notes

- After implementing these changes, ensure that all the interactions are tested extensively.
- The progress bar should accurately reflect changes in the cart and motivate users towards the free shipping threshold.
- Maintain consistency in styling by adhering to the predefined CSS classes and IDs.
