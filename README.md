Based on a conversation between Alice Boxhall, Brian Kardell and Marcy Sutton, this snippet attaches/manages metadata in the form of an attribute to an element whose focus has been set via a pointing device rather than the keyboard unless:
* It has setSelectionRange method, because things you can type are different
* It has an aria role of textbox, so artificial elements that get the aria right should still work
* is has an attribute 'disable-point-focus' so that it is simple to create an opt-out for custom elements/constructs

Should enable simple focus rules that meet the spirit of a11y guidelines for keyboard users but don't get in the way for pointer users.

```html
<script src="http://alice.github.io/point-focus/point-focus.js"></script>
<style>
[point-focused] :focus {
   outline: none;
}

:not([point-focused]) :focus {
   .... focus ring styles....
}
   </style>
 ```

[Demo](https://alice.github.io/point-focus/testpage.html)
