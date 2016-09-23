Based on a conversation between Alice Boxhall, Brian Kardell and Marcy Sutton, this prototype attaches/manages metadata in the form of a `modality` attribute to the body, as a way to allow authors to experiment with adapting style based on the user's _active_ input modality (i.e., how they are interacting with the UI _right now_).

[Demo](https://alice.github.io/modality/demo)

## Rationale

There are many instances in which it would be useful for authors to understand the user's current interaction modality and be able to adapt the UI with better accomodations. The motivating example is `:focus` where the status quo is quite problematic:

- The default focus ring is not based on a single :focus rule as some might expect, not all things which can receive focus receive a ring in all cases. Adding such a rule is always currently problematic, but it's also exceptionally common.
- Many developers disable the default focus ring in their CSS styles, others attempt to style it in concert with their design. The former often seems to be a result of finding the default focus ring both aesthetically unpleasant and confusing to users when applied after a mouse or touch event and introduces accessibility problems.  The latter inevitably creates considerably more of the kind of problem that the former was trying to solve.

To deal with this:
- It seems evident that a visual indication of what has focus is only interesting to a user who is using the keyboard to interact with the page. A user using any kind of pointing device would only be interested in what is in focus if they were _just about_ to use the keyboard - otherwise, it is irrelevant and potentially confusing.
- Thus, if we only show the focus ring when relevant, we can avoid user confusion and avoid creating incentives for developers to disable it.  
- A mechanism for exposing focus ring styles only when the keyboard is the user's current input modality gives us this opportunity.

## API Proposal

```css
/* override UA stylesheet if necessary */
:focus {
  outline: none;
}

/* establish desired focus ring appearance for appropriate input modalities */
:focusring {
  outline: 2px solid blue;
}
```

:focusring matches native elements that are
1. focussed; and 
2. would display a focus ring if only UA styles applied

Additionally, :focusring matches non-native elements as if they were
native button elements.

## Example heuristic

The heuristic used to decide the current modality should not be defined
normatively. An example heuristic is to update modality on each style recalc:
if the most recent user interaction was via the keyboard; and less than 100ms
has elapsed since the last input event; then the modality is keyboard. Otherwise,
the modality is not keyboard.

## Implementation Prototype

The tiny [keyboard-modality.js](http://alice.github.io/modality/src/keyboard-modality.js) provides a prototype intended to achieve the goals we are proposing with technology that exists today in order for developers to be able to try it out, understand it and provide feedback.  Simply speaking, it sets a `modality=keyboard` attribute on `body` if the script determines that the keyboard is being used. Similarly, the attribute is removed if the script determines that the user is no longer using the keyboard. This allows authors to write rules which consider the input modality and style appropriately. Note that the prototype does not match the proposed API - it is intended to give developers a feel for the model rather than to provide a high-fidelity polyfill.

It also simulates how the default UA styles would be adjusted by appending the following style as the first rule in the page, which disables the focus ring _unless_ `modality` is set to `keyboard`:

```html
body:not([modality=keyboard]) :focus {
    outline: none;
}
```

(This is added in a `<style>` element with the ID `"disable-focus-ring"`, to allow easy removal if different behaviour is desired.)


### How it works
The script uses two heuristics to determine whether the keyboard is being used:

- a `focus` event immediately following a `keydown` event
- focus moves into an element which requires keyboard interaction, such as a text field
- _TODO: ideally, we also trigger keyboard modality following a keyboard event which activates an element or causes a mutation; this still needs to be implemented._

Custom elements may use the `supports-modality` attribute to provide a whitelist of supported modalities; any element without this whitelist is considered to support all modalities. Only elements which only support keyboard modality will trigger the `modality=keyboard` attribute on `<body>`.
