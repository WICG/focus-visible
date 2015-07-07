Based on a conversation between Alice Boxhall, Brian Kardell and Marcy Sutton, this code attaches/manages metadata in the form of a `modality` attribute to the body, as a way to experiment with styling based on user modality.

[Demo](https://alice.github.io/modality/testpage.html)

## Rationale

There are many instances in which it would be beneficial to know the user's current modality. The motivating example is `:focus`:

- Many developers disable the focus ring in their CSS styles. This often seems to be a result of finding the focus ring both aesthetically unpleasant and confusing to users when applied after a mouse or touch event.
- It seems evident that what has focus is only interesting to a user who is using the keyboard to interact with the page. A user using any kind of pointing device would only be interested in what is in focus if they were _just about_ to use the keyboard - otherwise, it is irrelevant and potentially confusing.
- Thus, if we only show the focus ring when relevant, we can avoid user confusion and avoid creating incentives for developers to disable it.

A mechanism for selecting focus styles only when the keyboard is being used gives us this opportunity.
x
## Implementation

At this stage, we're only looking at keyboard modality.

The logic in [keyboard-modality.js](http://alice.github.io/modality/src/keyboard-modality.js) sets a `modality=keyboard` attribute on `body` if the script determines that the keyboard is being used. This attribute is removed if the script determines that the user is no longer using the keyboard.

It also appends the following style to the page, which disables the focus ring _unless_ `modality` is set to `keyboard`:

```html
body:not([modality=keyboard]) :focus {
    outline: none;
}
```

(This is added in a `<style>` element with the ID `"disable-focus-ring"`, to allow easy removal if different behaviour is desired.)

The script uses two heuristics to determine whether the keyboard is being used:

- a `focus` event immediately following a `keydown` event
- focus moves into an element which requires keyboard interaction, such as a text field
- _TODO: ideally, we also trigger keyboard modality following a keyboard event which activates an element or causes a mutation; this still needs to be implemented._

Custom elements may use the `supports-modality` attribute to provide a whitelist of supported modalities; any element without this whitelist is considered to support all modalities. Only elements which only support keyboard modality will trigger the `modality=keyboard` attribute on `<body>`.
