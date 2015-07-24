# Input Modality - `:focus`'ing on users

Web developers and web standards authors alike strive to live up to the promise of "universality" - the idea that the web _should_ be available to all. This concept drives many innovations in web technology, as well as being fundamentally built in to the philosophy of the open standards on which the web is based.

In order to achieve this, we find that having some carefully chosen __user context__ allows web developers to create more flexible and user experiences. We think it's time to expand our view of user context to include __modality__ - but before we flesh that out, let's recap what we can do today with user context. 

== `media`: responding to user context
The [Media Sheet](http://www.w3.org/TR/CSS21/media.html#media-sheets), introduced in CSS 2.0, allows us to specify distinct styles for, say, print media, while not changing the experience for users viewing on a screen. Thus, we can present the same content in multiple ways to best suit the media being used by the user at the time, improving the overall experience.

As the devices and modes used to view web sites became increasingly more varied, it became possible to improve the experience further by allowing authors more fine-grained access to the user context - not just the overall _kind_ of media, but things _about_ the media. This is the concept behind [CSS Media Queries Level 3](http://www.w3.org/TR/css3-mediaqueries/) which allowed authors to identify rules to target media _features_ like viewport size, orientation, and whether it supports color. From this, the modern [Responsive Web](http://alistapart.com/article/responsive-web-design) movement was born.

Now, we find ourselves in a similar place, but from a different direction:  We're starting to realize that knowing how a particular user actually _interacts_ with content matters too. Consider the humble - misunderstood, even - focus ring.

## The Focus Ring
Authors might realise that the focus ring is important to keyboard users, but overall it gets a lot less love than it probably should: the web famously has no shortage of `outline: none;` styles. However, if we ask the question of why the focus ring causes so much frustration, it shines a light on some interesting things that we might apply more broadly too.

Statistically speaking, it's a fair bet (since you're reading this article in or after 2015) that you're a pretty technically proficient user using a modern, touch or pointer-enabled device to navigate through the Web. It's also a pretty good statistical bet that the majority of your users are strongly reliant on the pointing device - less likely to try and interact with a UI via the keyboard than someone who cut their teeth on [Pine](http://www.washington.edu/pine/), say. Thus, to the vast majority of users, the focus ring can appear more like a weird glitch rather than, as intended, a navigational beacon for keyboard users.

Imagine for a moment, however, the common experience of hitting a login page in your mobile device's Web browser: typically, two fields asking for your username and password. Tapping one of those fields shows the focus ring on the thing that you are about to interact with (assuming you touched it intentionally) providing a visual indicator that it is active and ready to receive input. On most current devices, this will also cause an on-screen keyboard display to appear, but for others (those with slider phones or a Blackberry, for example) this is not the case. The consistent feature is that it lets the user know that if they type input, _this is where it will land_: it provides critical _information_ about the interface you're interacting with.

But interacting with a mouse or pointer isn't the only way to navigate - something can receive focus programatically too, for example, our login could be inside a dialog whose appearance was triggered by some other action. Showing the focus ring on the username field when this dialog appears lets the user know the same kind of information - and in this case, there truly is _no other way_ that the user could know that information, since they didn't previously interact with this element at all.

Then, of course, there is the keyboard case: a user, for any of a multitude of reasons, who is currently interacting with the page via the keyboard. This may be
* A user with a disability precluding the fine motor control necessary to control a mouse;
* A user whose mouse is broken;
* A skilled user who finds it more efficient not to move their hands from the keyboard; or many other cases. 
 
In any case, sending the `tab` key allows these users to navigate sequentially through interactive elements on the page (such as form fields). The _only way_ for keyboard users to know which element is active (and thus how you might potentially interact with it via the keyboard) is via the focus style - i.e., by default, the __focus ring__).

Since keyboard users pretty much can't do anything without knowing where focus is, it's tempting to over-simplify, wag our fingers at the nay-sayers and call it a day: we could simply say, "when a thing has focus it *must* get the focus ring indicator". Ok, since designs vary, what the particular focus ring should look like could vary too: on a white page background, a light blue outline might be really appropriate - but if your interface _is_ light blue, you might need to consider this in your branding and perhaps provide something as simple as:

```css
:focus { outline: 3px solid green; }
```

Simple, right?  Unfortunately, not really. Why not?

## The Fly in the Ointment
If you've never done so, try adding a global focus rule like the one above and use the UI for a bit.  If you're using a mouse, it can be pretty disconcerting and unpleasant. In fact, it can be downright confusing as suddenly you begin to notice that focus ring in ways/places you probably didn't before you added it. Understanding why this happens is where things get _really_ interesting. There's a fly in the ointment here, but where?
 
To answer this, think back our login form: Did the submit button get the focus ring after you pressed it?  Technically it had focus for any time the subsequent submission was taking place, but if you clicked it with a mouse (as many probably did), you'd probably now notice that it did not get the focus ring.  However, if you reached it by way of keyboard navigation, it would. As it turns out, there's more to it.  

The focus ring has been around for a long, long time. We know, moreover, that for very many users the keyboard is not their primary means of interaction. Browsers have long recognized this too, as we can see from that submit button behaviour.

It turns out global focus ring that _always_ shows whenever anything has focus winds up creating a kind of bad trade-off: because an element can get focus without a user going anywhere _near_ the (physical _or_ on-screen) keyboard, the focus ring serves only as a distraction or a confusion in these cases. And these cases, strictly mathematically speaking, constitute "most of the time" for an average user. (It's no wonder people are disabling the focus styles left, right and centre!)

So, browsers tend to treat some elements differently (natively) based on whether a user reached them via keyboard or otherwise. If the control is a textbox, it's always going to show the focus indicator because the only way to interact with it usefully is via the keyboard. However, if it's a button, we can predict that it's _more likely_ that it's going to be pressed via some kind of pointing device _unless_ the user got there by way of keyboard.  

Interesting, right?  And it turns out that this isn't a new thing, it's got a long history: Browsers [have been experimenting](https://bugzilla.mozilla.org/show_bug.cgi?id=377320) with variations of this since at least IE7. 

Implementations vary a bit, and  still trying to strike the right balances, but overall the idea is consistent and you might say a big success.  

## An unfortunate disconnect
A couple of billion unaware folks using Web browsers for the last 8+ years have proven it out: In some cases you can significantly improve the experience for everyone by knowing a little bit about how they are using it.  The problem is, this information isn't exposed or standardized in any way so there are two unfortunate disconnects.

First, styling the focus ring is problematic.  The "out of the box" ring doesn't fit with a lot of design, so you'd like to customize it.  However - a simple, global rule is basically a non-option because it cannot consider the same sources of truth about how the user is using the UI as the browser itself and thus makes the experience of the norm measurably worse.  Another option is targeted rules, however, this leads to an explosion of rules and inevitably, lots of things that don't show the focus when they should leaving keyboard users with a partially unintuitive interface altogether.  The net result is a lot of feedback which frequently causes really bad choices - like disabling the ring altogether.  Second, not identifying the importance of such a distinction means that lots of other potential improvements along similar lines can't be experimented with or uncovered.  Merely identifying the capabilities of the system a user is using doesn't help - after all, the Mac laptop on which I am typing this right now, for example, supports both mouse and keyboard - but it doesn't tell an author anything about me, so they cannot adapt. Do you show me the ring or not?  As shown above, the answer is "it depends".  A phone with a slider keyboard or a Blackberry might technically have a means of pushing the tab key to navigate, but if the user isn't using it that way, it doesn't matter.

What we really want is a way to balance all of these desires and provide really high-quality UX for everyone.  Sadly, the browser doesn't currently even have the informtation about how the user *can* use an interface, and it *can't* know how a user *will* use an interface if there are multiple options.  So what do we do?  Do we just throw up our hands and say "these are the limitations" - or do we try to do better?

# We can do better: Here's a proposal (and early prototype)
We belive we can do better.  We're proposing an idea called `input-modality`.  It's aim would be to expose information to authors and allow them to adapt the interface in the same way that media queries allow authors to adapt to change in screen size.  Simply put, as the user interacts with controls, we know it.  We know what they did (a keypress, a touch, a mouse click) and we know what the target they are interacting with is capable of accepting (do you have to type or don't you).  Using this information, we believe that we can expose via a simple heuristic and allow easy solutions that provide a much better user experience for everyone.

Let's go back to our focus ring example:  What we really want is to say "If someone is interacting via the keyboard, they need a visual indicator of what has focus, but if they are using a touch based device they don't."  If they could express this simply, they might wind up with a rule which expressed something like (note, this example uses an attribute set on the body based on the prollyfill provided which works with today's technology, but the ultimate means of expression is debatable - the important takeaway is that it should be something that captures the simplicity and thrust below):

```css
body:not([input-modality=keyboard]) :focus {
    outline: none;
}
```

A rule like this would allow users of touch devices or mouse oriented users to avoid the focus ring except in cases where the only available or very likely input modality was a keyboard (like `<input type=text>`) while allowing keyboard users to see the focus ring on anything with focus based on the fact that they are using the keyboard.  If a user begins using the mouse, simply pressing tab/shift tab will let them know where they are by shifting the modality back to keyboard.

You can try out a [demo](http://alice.github.io/modality/demo/) of the [prototype prollyfill](https://github.com/alice/modality), or [include it](https://alice.github.io/modality/src/keyboard-modality.js) in your own web page.

Further, it's a more future-friendly idea - there is a way that new or custom elements can indicate that they are keyboard-oriented thing and it is the handshake between how the user is using and an understanding of the element itself that dictate the current modality and therefore allows the author to adjust accordingly, easily.

Please try out the concept and let us know what you think.  If you're interested in this idea and our [https://github.com/alice/modality/blob/master/docs/modality-mq.md](proposal), please join us on [http://discourse.wicg.io/](Specifiction) to discuss.
