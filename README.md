Based on a conversation between Alice Boxhall, Brian Kardell and Marcy Sutton, this snippet attaches/manages metadata in the form of an attribute to an element whose focus has been set via a pointing device rather than the keyboard unless:
* It has setSelectionRange method, because things you can type are different
* It has an aria role of textbox, so artificial elements that get the aria right should still work
* is has an attribute 'disable-point-focus' so that it is simple to create an opt-out for custom elements/constructs

Should enable simple focus rules that meet the spirit of a11y guidelines for keyboard users but don't get in the way for pointer users.

```html
<script src="https://rawgit.com/bkardell/d444e006bd6cfbc99986/raw/296b29a4099d37031613d9d7c72b588df5ddd065/click-focus.js"></script>
<style>
:not([point-focused]):focus {
   .... focus ring styles....
   }
   </style>
 ```

Note, Brian has some philosophical problems with this (as a mixed user himself, he always like to see the focus ring in order to help his understanding of my context in the document) but he appear to be in the minority and improving the status quo (which is bad) requires someone to suggest change - so here it is...
