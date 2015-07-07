# `modality` media query proposal

## Introduction

There are many instances in which it would be beneficial to know the user's current modality. The motivating example is `:focus`:

- Many developers disable the focus ring in their CSS styles. This often seems to be a result of finding the focus ring both aesthetically unpleasant and confusing to users when applied after a mouse or touch event.
- It seems evident that what has focus is only interesting to a user who is using the keyboard to interact with the page. A user using any kind of pointing device would only be interested in what is in focus if they were _just about_ to use the keyboard - otherwise, it is irrelevant and potentially confusing.
- Thus, if we only show the focus ring when relevant, we can avoid user confusion and avoid creating incentives for developers to disable it.

A mechanism for selecting focus styles only when the keyboard is being used gives us this opportunity.

We propose a new media query, `modality`, which would allow an author to specify a particular user modality, for example:

```html
@media (input-modality: keyboard) {
 :focus {
    outline: 2px rainbow unicorn;
  }
}
```

## Modalities

At this stage, we are only considering keyboard modality, motivated by the focus ring issue. However, as this proposal evolves, we will likely add other modalities.

Each modality consists of:
- a name,
- a series of trigger situations which will cause the media query to match,
- a series of trigger situations which will cause the media query to cease to match.

### Keyboard modality

Keyboard modality will be matched immediately after:

- a `focus` event triggered from the keyboard, or
- focus moves into an element which requires keyboard interaction, or
- a user uses the keyboard to interact with an element which was focused via another means

Keyboard modality will cease to match immediately after:

- any blur event not immediately followed by one of the activation triggers above.
