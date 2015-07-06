
Based on a conversation between Alice Boxhall, Brian Kardell and Marcy Sutton, this code attaches/manages metadata in the form of a `modality` attribute to the body.

As a starting point, this should enable simple focus rules that meet the spirit of a11y guidelines for keyboard users but don't get in the way for pointer users ala something like the example below...

```html
<script src="http://alice.github.io/modality/modality.js"></script>
<style>
/* Style the focus ring however you like, or don't style it at all ... */
:focus {
  outline: 2px solid green;
}

/* disable or provide an alternate style for the non-keyboard case */
body:not[modality=keyboard] :focus {
  outline: none;
}
</style>
 ```

[Demo](https://alice.github.io/modality/testpage.html)
