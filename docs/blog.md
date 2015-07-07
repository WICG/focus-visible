# Input Modality - `:focus`'ing on users
Throughout the history of Web development, we're always trying to find ways to make the user experience better while maintaining a 'works for everyone' approach.  CSS had media queries which allowed us to express that this stylesheet was for print, while that one was for screen.  Later, we found that we could do a lot better in servicing the user if only we could know something *about* that screen and thus the responsive design movement was born.  Now, we find ourselves in a similar place - different user agents support different means for interacting with elements and each has potentially different implications.

Consider the humble focus ring - you see it when you are filling out a form with text boxes.  It's an important visual indicator because you're about to type and you want to know where those characters are about to land.  This is true regarless of the device that you are using because the only way to interact with that element is to type some text.  But now consider a `<select>` box - it is fully keyboard operable and that's important, but a huge number of users won't interact with it via a keyboard, ever. In fact, in some cases (mobile, for example) they simply cannot.  We know from user feedback that, in cases like this, users (and businesses) frequently find a focus ring less than desirable in terms of design and their ability to comprehend the UI.  Because of this, browsers tend to treat some elements differently (natively) based on whether a user reached them via keyboard or otherwise.

All of these are competing problems with no good way to mutually resolve them and therefore they frequently lead authors toward bad choices that sacrifice the experience of one user for another: Either everything has focus rings because of keyboard accessibility, or nothing has focus rings because of their other users (or business preferences).  This says nothing of the problem created for users who utilize both approaches.


What we really want is a way to balance all of these desires and provide really high-quality UX for everyone.  Sadly, the browser doesn't expose information about how the user *can* use an interface, and it *can't* know how a user *will* use an interface if there are multiple options.  So what do we do?  Do we just throw up our hands and say "these are the limitations" - or do we try to do better?

# We can do better: Here's a proposal (and early prototype)
We're proposing an idea called `input-modality` which would expose information to authors and allow them to adapt the interface in the same way that media queries allow authors to adapt to change in screen size.  Simply put, as the user interacts with controls, we know it.  We know what they did (a keypress, a touch, a mouse click) and we know what the target they are interacting with is capable of accepting (do you have to type or don't you).  Using this information, we believe that we can expose via a simple heuristic and allow easy solutions that provide a much better user experience for everyone.

Let's go back to our focus ring example:  What we really want is to say "If someone is interacting via the keyboard, they need a visual indicator of what has focus, but if they are using a touch based device they don't."  If they could express this simply, they might wind up with a rule which expressed something like (note, this example uses an attribute set on the body based on the prollyfill provided which works with today's technology, but the ultimate means of expression is debatable - the important takeaway is that it should be something that captures the simplicity and thrust below):

```css
body:not([input-modality=keyboard]) :focus {
    outline: none;
    }
    ```

A rule like this would allow users of touch devices or mouse oriented users to avoid the focus ring except in cases where the only available input modality was a keyboard (like `<input type=text>`) while allowing keyboard users to see the focus ring based on the fact that they are using the keyboard.  If a user begins using the mouse, simply pressing tab/shift tab will let them know where they are by shifting the modality back to keyboard.

You can try out a [demo](http://alice.github.io/modality/demo/) of the [prototype prollyfill](https://github.com/alice/modality), or [include it](https://alice.github.io/modality/src/keyboard-modality.js) in your own web page.

This illustrates a single (but critically important) potential use of the ability to identify how the user prefers to interact with the UI, but authors frequently find themselves in similar pickles because they currently have no insight beyond what the agent itself is capable of.
