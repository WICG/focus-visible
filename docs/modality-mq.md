# `modality` media query proposal

## Introduction

There are many instances in which it would be useful for authors to understand the user's current interaction modality and be able to adapt the UI with better accomodations.

As the user interacts with the UI, it can be said to have an active modality in the same way it has an active element or a current size.  Browsers, [since at least IE7](https://bugzilla.mozilla.org/show_bug.cgi?id=377320) have experimented with ideas around how the default focus ring works, for example, based on how the user has acted thusfar.  With 8 years worth of experience (as of the time of this writing), implementers have a lot of feedback and data which definitely seems to indicate that such accomodations are necessary.  However, there are no standards in this space and none of this is exposed to authors. Any author change to the default focus ring is unable to consult the same sources of truth and invariably trades off this work leading to problems which have been written about exhaustively and leave the author with one of three bad choices: 
 * Nothing gets the focus ring because a large number of users use a pointing device and find it confusing or asthetically displeasing, thereby creating accessibility problems for keyboard users and confusion for people who use both
 * Everything focusable gets the focus ring for accessibility sake and the designer and large number of users are left unhappy and confused a majority of the time.
 * Authors write very specific rules about what does and doesn't get the focus indicator regardless of how the user is interacting.  This can be tremendously confusing for keyboard users and cause accessibility problems on its own and it isn't very forward compatible - as new elements are added to the page, or HTML introduces new elements (or authors import custom-elements), each needs custom focus rules or they will work differently.

We propose that lying beneath implementations is already an observable concept of modality and that explaining it as a `modality` primitive (`<input type="text">` for example supports only keyboard as a modality for input and therefore always receives a default focus ring, whereas button `<button>` supports many modalities and it often depends on how you got there).  We propose that defining this and exposing it via a `MediaQuery` would allow appropriate accomodations in the same ways that Responsive Design and Adaptive Design allow authors to create a better experience for all users. The example below shows an example in which users could simply and safely remove the default focus outline when the user isn't using a keyboard and provide one when they are.  As a savvy user switches modalities from touch/point to keys, the active modality changes and the focus ring appears. 

```html
:focus { outline: none; }
@media (modality: keyboard) {
 :focus {
    outline: 2px solid blue;
  }
}
```

Likewise, if necessary, script can easily respond to such a change given `matchMedia` and `MediaQueryListener`.

```js
window.matchMedia("(modality: keyboard)").addListener(function (evt) {
   // The modality has changed to keyboard
});

window.matchMedia("not (modality: keyboard)").addListener(function (evt) {
   // The modality has changed, it's not keyboard
});
```

## Modalities
At this stage, we are only considering keyboard modality (and not keyboard), motivated by the focus ring issue. However, as this proposal evolves, we will likely add other modalities.

Each modality consists of:
- a name,
- a series of trigger situations which will cause modality to reevaluate (see below)
- an algorythmic means of evaluating the resulting modality

### Keyboard modality

The named 'keyboard' modality triggers modality reevaluation immediately after:

- a `focus` event triggered from the keyboard, or
- focus moves into an element, or
- a user uses the keyboard to interact with an element which was focused via another means,
- any blur event not immediately followed by one of the above

Evaluation of the modality (boolean) is determined by evaluating the event that happened above combined with what the element it occurred on supports for input modality.  For example, focusing on an `<input type="text">` will always evaluate to a keyboard modality because this is the only modality it supports, whereas focusing on a `<input type="button">` will evaluate based purely on which event triggered it (keyboard or pointer, for example).


