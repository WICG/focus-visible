# Input Modality - `:focus`'ing on users
Throughout the history of Web development, we're always trying to find ways to make the user experience better while maintaining a 'works for everyone' approach.  Early on, CSS had a concept called a [Media Sheet](http://www.w3.org/TR/2011/REC-CSS2-20110607/media.html#media-sheets) which allowed us to express that this stylesheet (or these styles) were for print media, while that this other one over here was for users viewing on a screen.  

Later, as the ways in which users interacted became more varied than initially considered, it became evident that by just knowing a little bit more about the device, we could do much better and something more advanced was introduced in [CSS Media Queries Level 3](http://www.w3.org/TR/css3-mediaqueries/) which allowed authors to write things in a much more targeted fashion based on not just the media, but things about the media - like it's size and whether or not it supported color.  From this, the modern Responsive Web movement was born and it's inarguably improved things.

Now, we find ourselves in a similar place, but from a different direction:  Knowing how a particular user actually _interacts_ with content matters.  To illustrate: Consider the humble focus ring.

## The Focus Ring
Many people take the focus ring for granted, we just notice it now and then.  It's subtle, but it plays an important role.  For keyboard users it's absolutely critical in understanding what to expect, but they're not the only ones.  Imagine for a moment that you are pulling up something like Twitter in a web browser on your cell phone - you are taken promptly to a login page where you see two fields asking for your username and password.  Clicking on one of those fields does several important things, but two we want to examine are that it enables a keyboard display so that you can provide the value and, very, very importantly _it shows the focus ring on the field where those characters are about to land.   This statment is true regarless of the device that you are using because the only way to interact with that element is to type some text.  If you're a oriented user, as you hit the `tab` key you are navigated sequentially through important, usually interactive "things" but just like the cell phone login example above, the way that you understand 'which' thing you are on (and thus how you might potentially interact with it via the keyboard) is indicated via the focus ring.

These are very, very important things so it's tempting to think that all you need to do is say "when a thing has focus it should get the focus ring indicator".  Of course, designs vary so what the particular focus ring should look like could vary too.  On a white page background, a light blue might be really appropriate - but if your interface _is_light blue, you might need to consider this in your branding and perhaps you might write something as simple as:

```css
:focus { outline: 1px solid blue; }
```

## History and the Fly in the Ointment
The focus ring has been around for a long, long time.  We know, probably intuitively, that very many users either don't use the keyboard to interact unless they have to type.  Some of us also know, from data and experience, that that little rectangle is annoying, ugly and, worse, sometimes actively confusing when the user is navigating to something via a mouse.  Consider, for example, a link in the page or a menu.  In cases like this, users (and businesses) frequently find a focus ring less than desirable in terms of design and the net result is that they try to disable it altogether thereby undoing all of the (necessary) good that it added.  

Because of this, browsers tend to treat some elements differently (natively) based on whether a user reached them via keyboard or otherwise and this isn't a new thing: Browsers [have been experimenting](https://bugzilla.mozilla.org/show_bug.cgi?id=377320) with variations of this since at least IE7.  Again, since you are statistically likely to be in the group where this is a subtle benefit you've probably never even noticed it:  Landing on a text `<input>` will yield a focus ring regardless of how you get there, but a `<button>` or `<select>` while fully keyboard capable will only show the focus ring if you've actually used the keyboard (implmentations vary, but the idea is consistent).  

This is merely one case, where this matters sort of thing matters, but it's an important one.  Unfortutately, while there is some similar concept "down there" on this, there is no standard.  For an author, something like this this is currently laced with competing problems with seemingly no good way to mutually resolve them.  This conflict frequently leads authors toward bad choices that sacrifice the experience of one user for another: Either everything has focus rings because of keyboard accessibility, or nothing has focus rings because of their other users (or business preferences).  This says nothing of the problem created for users who utilize both approaches.

Exposing data about what the browser _supports_ won't do it.  The Mac laptop on which I am typing this right now, for example, supports both mouse and keyboard - as do most desktop and laptop devices, it doesn't tell an author anything about me.  
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
