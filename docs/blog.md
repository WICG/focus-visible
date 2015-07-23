# Input Modality - `:focus`'ing on users
Throughout the history of Web development, we're always trying to find ways to make the user experience better while maintaining a 'works for everyone' approach.  Early on, CSS had a concept called a [Media Sheet](http://www.w3.org/TR/2011/REC-CSS2-20110607/media.html#media-sheets) which allowed us to express that these styles over here are for print media, while those other ones over here were for users viewing on a screen.  

Later, as the ways in which users viewed sites became increasingly more varied, it became evident that by just knowing a little bit more about the medium we were displaying on, we could do much better.  Thus, something more advanced was introduced in [CSS Media Queries Level 3](http://www.w3.org/TR/css3-mediaqueries/) which allowed authors to identify rules to target not just the overall _kind_ of media, but things _about_ the media, like it's size and whether or not it supported color.  From this, the modern Responsive Web movement was born and it's inarguably improved things.

Now, we find ourselves in a similar place, but from a different direction:  We're starting to realize that knowing how a particular user actually _interacts_ with content matters too.  To illustrate: Consider the humble focus ring.

## The Focus Ring
Authors might understand that the focus ring is important to keyboard users, but overall it's probably a little less well understood than some other things we deal with all the time.  However, considering it carefully shows us some interesting things that we might apply more broadly too.

Statistically speaking, it's a fair bet (since you're also reading this) that you're a pretty technically hip user using a modern, touch or pointer-enabled device to navigate through the Web.   It's also a pretty good statistical bet that most of your users are a little less well-technically-vesed and even more reliant on the pointing device.  Thus, the vast majority of user don't really think about the focus ring much, it's subtle and it's supposed to be. 

Imagine for a moment, however, the common experience of pulling up something like Twitter in a Web browser, on your cell phone - you are taken promptly to a login page where you see two fields asking for your username and password.  Touching one of those fields shows the focus ring on the thing that you touched and are about to interact with providing a visual indicator that it is the thing that is active and ready to receive input.  For many of us, this will also cause an on-screen keyboard display to appear, but for some (those with slider phones or a Blackberry, for example) not so.  In all cases though, it lets the user know that if you start typing characters _this is where they will land_.  In otherwords, it helps you understand the interface you're interacting with.

But interacting with a mouse or pointer isn't the only way to navigate - something can receive focus programatically too, for example, our login could be inside a dialog which appeared because of some action.  Showing the focus ring on the username when this dialog appears lets the user know the same kind of information.

Then, of course, there is the ultra important case of a keyboard oriented user.  Some users, for various and wide ranging reasons use a keyboard.  A user with a disability preventing the fine motor controls necessary to control a mouse will use a keyboard (or even something which relays keyboard commands through voice perhaps), however, there are other reasons as well.
A user might have a broken mouse.  A skilled user may occasionally find it more convenient to not switch back and forth as they are typing.  In any case, sending the `tab` key allows these users to navigate sequentially through important the fields and when this is the case, regardless of why, in a very similar way to the cell-phone examples above, the _way_ that those users understand 'which' thing is active (and thus how you might potentially interact with it via the keyboard) is indicated via the focus ring.

These are very, very important things so if you're sold on the value of the focus ring, it's tempting to over-simplify, wave our hands and call it "done".  All we need to do is say "when a thing has focus it should get the focus ring indicator".  Since, designs vary, what the particular focus ring should look like could vary too, so we need CSS support to customize it:  On a white page background, a light blue outline might be really appropriate - but if your interface _is_light blue, you might need to consider this in your branding and perhaps provide something as simple as:

```css
:focus { outline: 3px solid green; }
```

Simple, right?  Unfortunately, not really... If you've never done so, try adding a global focus rule like the one above and use the UI for a bit.  If you're using a mouse, it can be pretty disconcerting and unpleasant. In fact, it can be downright confusing as suddenly you begin to notice that focus ring in ways/places you probably didn't before you added it.  Why?  Understanding this is the case is where things get really interesting.
 

## The Fly in the Ointment
There's a fly in the ointment here, but where?  To answer this, think back our login form: Did the submit button get the focus ring after you pressed it?  Technically it had focus for any time the subsequent submission was taking place, but if you clicked it with a mouse (as many probably did), you'd probably now notice that it did not get the focus ring.  However, if you reached it by way of keyboard navigation, it would.  As it turns out, there's more to it.  

The focus ring has been around for a long, long time.  We know, probably intuitively, that for very many users the keyboard is not their primary means of interaction.  Long ago, browsers recognized this too and it turns out global focus ring that _always_ shows whenever anything has focus winds up creating a kind of bad trade-off:  Instead of simply being enabling in the cases where it needed to be, it was distracting or confusing when it was unnecessary which was, strictly mathematically speaking "most of the time" for an average user.

In other word, browsers tend to treat some elements differently (natively) based on whether a user reached them via keyboard or otherwise.  If the control is a textbox, it's always going to show the focus indicator because the only way to interact with it is to push some buttons on the keyboard and send keys into that control.  However, if it's a button, we can speculate that it's more likely that it's going to be pushed with some kind of pointing device _unless_ the user got to the button by way of keyboard.  Interesting, right?  And it turns out that this isn't a new thing, it's got a long history: Browsers [have been experimenting](https://bugzilla.mozilla.org/show_bug.cgi?id=377320) with variations of this since at least IE7. 

Implementations vary a bit, and we're still trying to strike the right balances, but overall the idea is consistent and you might say a big success.  

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
