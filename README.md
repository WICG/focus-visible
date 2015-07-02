Based on a conversation between Alice Boxhall, Brian Kardell and Marcy Sutton, this code attaches/manages metadata in the form of an `point-indicated` attribute to the body.
Something is point-indicatable (that is, will set that flag on any pointer-based indication) unless:

* It is explicitly forbidden by the element having a boolean disable-point-indication attribute.
* It accepts text input by having either a .selectionStart accessor which is callable without error or an aria role="textbox"


This should enable simple focus rules that meet the spirit of a11y guidelines for keyboard users but don't get in the way for pointer users ala something like the example below...

```html
<script src="http://alice.github.io/point-focus/point-focus.js"></script>
<style>
/* Style the focus ring however you like ... */
:focus {
  outline: 2px solid green;
}

/* disable or style otherwise based on touch ... */
body[point-indicated] :focus {
  outline: none;
}
   </style>
 ```

[Demo](https://alice.github.io/point-focus/testpage.html)