# Input Modality - `:focus`'ing on users

Web developers and web standards authors alike strive to live up to the promise of "universality" - the idea that the web _should_ be available to all. This concept drives many innovations in web technology, as well as being fundamentally built in to the philosophy of the open standards on which the web is based.

In order to achieve this, we frequently find that having some carefully chosen information about how the user intends to view the content (a concept we'll refer to in this article as "user context") allows web developers to create more flexible and useful user experiences. In this post, we'll lay out a case that it's time to expand our view of user context to include the concept of __modality__ (_how_ the user is interacting with the page), but before we flesh that out, let's take a look at "user context".

## `media`: responding to user context
[Media Sheets](http://www.w3.org/TR/CSS21/media.html#media-sheets), introduced in CSS 2.0, allow us to specify distinct styles for, say, print media, while not changing the experience for users viewing on a screen. This means we can present the same content in multiple ways to best suit the media being used by the user at the time to view it, thereby improving the individual  experiences by taking the _context_ - media - into account.

As the devices and modes used to view web sites became increasingly more varied, it became possible to improve the experience further by allowing authors more fine-grained access to the user context - not just the overall _kind_ of media, but things _about_ the media. This is the concept behind [CSS Media Queries Level 3](http://www.w3.org/TR/css3-mediaqueries/), which allowed authors to identify rules to target media _features_ like viewport size, orientation, and whether it supports color. From this, the modern [Responsive Web](http://alistapart.com/article/responsive-web-design) movement was born - a strong case for the value of exposing user context if there ever was one.

Now, we find ourselves in a similar place, but from a different direction:  We're starting to realize that knowing how a particular user actually _interacts_ with content matters too. Consider the humble - misunderstood, even - focus ring.

## The Focus Ring
Authors might realise that the focus ring is important to keyboard users, but overall it gets a lot less love than it probably should: The web famously has no shortage of `outline: none;` styles. However, if we ask the question of why the focus ring causes so much frustration, it sheds light on some interesting and subtle things that we might apply more broadly too.

The "average" web user is heavily reliant on "random access" style interaction using a mouse or touch screen. However, _all_ users can benefit from seeing where focus is when they're about to type into an input field. To illustrate, picture using a login form in your mobile web browser. Here, the focus ring provides an indication of where your keystrokes are going to end up - critical information if you're about to type your password!

Then, of course, there are users who use the keyboard heavily or exclusively. This may be:
* A user with a disability precluding the fine motor control necessary to control a mouse;
* A user whose mouse is broken;
* A skilled user (you?) who finds it more efficient not to move their hands from the keyboard;

...or many other cases. 
 
In any case, the `tab` key allows users to navigate sequentially through interactive elements on the page (such as form fields) with just a keyboard. The _only way_ for keyboard users to know which element is active (and thus how they might potentially interact with it via the keyboard) is via a visual indictor of what thing is focused - i.e., by default, the __focus ring__).

Given this, it's tempting to put our foot down and ignore the subtleties of the issue.  We could simply say, "when a thing has focus it *must* get the focus ring indicator". However, this runs into issues before we even consider user context.

Since designs vary, what the particular focus ring should look like could vary too. An accessibility-conscious site may nevertheless want to have a consistent style for focus across browsers, which fits in with its branding. The `:focus` selector and `outline` property allow creating a simple rule for this:

```css
:focus { outline: 3px solid green; }
```

That should make everyone happy, right?  Unfortunately, not really.

## The Fly in the Ointment
If you've never done so, try adding a global focus rule like the one above and use the UI for a bit.  If you're using a mouse, it can be pretty disconcerting and unpleasant. In fact, it can be downright confusing as suddenly you begin to notice that focus ring in ways/places you probably didn't before you added it. Understanding why this happens is where things get _really_ interesting. Clearly there's a fly in the ointment here, but where?
 
To answer this, try clicking plain old (unstyled) `<button>` element with a mouse. Since you're paying close attention to it now, you'd probably notice that it did not get the focus ring. However, if you reached it by way of keyboard navigation, it would. But the weird thing is, if you've _set_ a focus style on it, that focus style will be applied _regardless_ of how you used it.

The browser has the privilege of being able to style the button differently depending on how the user used it. It does this because having a global focus ring that _always_ shows whenever anything has focus winds up creating a kind of bad trade-off: Since an element can get focus without a user going anywhere _near_ the (physical _or_ on-screen) keyboard, the focus ring can appear more like a weird glitch rather than, as intended, a navigational beacon for keyboard users. These cases, strictly mathematically speaking, wind up constituting "most of the time" for an "average user". For this reason, it's no wonder we see a so many sites removing the focus ring altogether.


So, browsers tend to (natively) treat some elements differently based on whether a user reached them via keyboard or otherwise. If it's a button, and gets focus when the user clicks it, the browser predicts that the user is unlikely then to want to use the keyboard to activate it, and hides the focus ring. Conversely, if the user navigates to it using the keyboard, it then makes all sorts of sense to show the focus ring. If the control is a textbox, however, it's always going to show the focus indicator because the only way to interact with it usefully is via the keyboard. 

It turns out that this isn't even a new thing, it's got a long history: Browsers [have been experimenting](https://bugzilla.mozilla.org/show_bug.cgi?id=377320) with variations of this since at least IE7. Implementations vary a bit, and browsers are still trying to strike the right balances, but overall the idea is consistent and works well: _A couple of billion mostly unaware folks using Web browsers for the last 8+ years have proven it out_.

# We can do better: Here's a proposal (and early prototype)
So, we can see that in some cases it is possible to significantly improve the experience for everyone by knowing a little bit about how they are using it. The problem is, this information isn't exposed or standardized in any way.

Merely identifying the capabilities of the system a user is using doesn't help either. The Mac laptop on which I am typing this right now, for example, supports both mouse and keyboard. Do you show me the ring or not?  As shown above, the answer is "it depends". And right now, as web authors we don't have any access to helpful information which would help us make that kind of decision.

This is why we're proposing an idea called `input-modality`. It would expose this type of information to authors and allow them to adapt the interface to the user's modality, just as media queries allow authors to adapt to change in screen size. 

Simply put, as the user interacts with controls, the browser knows it. It knows what they did (a keypress, a touch, a mouse click) and it knows what the target they are interacting with is capable of accepting (does a user have to type or not). Using this information, we believe that it is possible to expose this information via a simple heuristic and allow easy solutions that provide a much better user experience for everyone.

Doing so would allow an author to express the following: "If someone is interacting via the keyboard, they need a visual indicator of what has focus, but if they are using a touch based device they don't":
```css
@media (modality: keyboard) {
 :focus {
    outline: -webkit-focus-ring-color auto 5px; /* or default UA style of your choosing */
  }
}

@media not (modality: keyboard) {
 :focus {
    outline: none;
  }
}
```

Rules like this would allow users of touch devices or mouse oriented users to avoid the focus ring except in cases where the only available or very likely input modality was a keyboard (like `<input type=text>`), while allowing keyboard users to see the focus ring on anything with focus based on the fact that they are using the keyboard. If a user begins using the mouse, simply pressing tab/shift tab will let them know where they are by shifting the modality back to keyboard.

We've created a rough prollyfill for this concept. Because we can't (yet) polyfill media queries, it uses the more basic mechanism on setting an attribute on `<body>`, so the above rule would look more like
```css
body([modality=keyboard]) :focus {
    outline: -webkit-focus-ring-color auto 5px; /* or default UA style of your choosing */
}

body:not([modality=keyboard]) :focus {
    outline: none;
}
```

You can try out a [demo](http://alice.github.io/modality/demo/) of the [prototype prollyfill](https://github.com/alice/modality), or [include it](https://alice.github.io/modality/src/keyboard-modality.js) in your own web page.

The prollyfill also incorporates a mechanism for new or custom elements to indicate that they are keyboard-oriented (like a textbox):
```html
<my-element tabindex=0 supports-modality=keyboard></my-element>
```
This will force the page into keyboard mode when this element is focused.

Please try out the concept and let us know what you think.  If you're interested in this idea and our [https://github.com/alice/modality/blob/master/docs/modality-mq.md](proposal), please join us on [http://discourse.wicg.io/](Specifiction) to discuss.
