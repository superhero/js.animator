# Animator - Javascript

*Copyright (c) 2012 Erik Landvall*

*Dual licensed under the MIT and GPL version 3 licenses.*

## What is this
Animator is ment to create smother animations when possible.
It uses requestAnimationFrame as callback routine. 
It also has an queue system to prevent multiple simultaneous routines being used
at the same time.

### See
* http://webstuff.nfshost.com/anim-timing/Overview.html
* https://developer.mozilla.org/en/DOM/window.requestAnimationFrame
* http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation

### Animators interface

<table>
    <thead>
        <tr>
            <td><b>Name</b></td>
            <td><b>Return type</b></td>
            <td><b>Description</b></td>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>start</td>
            <td>Animator</td>
            <td>Starts the animation loop, if not already running.</td>
        </tr>

        <tr>
            <td>stop</td>
            <td>Animator</td>
            <td>Stops/Pauses the animation loop, if running.</td>
        </tr>

        <tr>
            <td>isRunning</td>
            <td>boolean</td>
            <td>Returns if animation loop is currently running.</td>
        </tr>

        <tr>
            <td>isQueueEmpty</td>
            <td>boolean</td>
            <td>Returns if the queue is empty.</td>
        </tr>

        <tr>
            <td>addToQueue</td>
            <td>int</td>
            <td>Adds one ore many functions to the queue.</td>
        </tr>

        <tr>
            <td>removeFromQueue</td>
            <td>Animator</td>
            <td>Removes a function from the queue.</td>
        </tr>

        <tr>
            <td>removeIndexFromQueue</td>
            <td>Animator</td>
            <td>Removes an item from the queue depending on specified index.</td>
        </tr>

        <tr>
            <td>getQueue</td>
            <td>Array</td>
            <td>Returns the current queue.</td>
        </tr>

        <tr>
            <td>setQueue</td>
            <td>Animator</td>
            <td>Clears the old queue and sets a new one.</td>
        </tr>

        <tr>
            <td>clearQueue</td>
            <td>Animator</td>
            <td>Unsets the queue</td>
        </tr>

        <tr>
            <td>getElement</td>
            <td>Element | undefined</td>
            <td>Returns the specified element we wish to render on.</td>
        </tr>

        <tr>
            <td>setElement</td>
            <td>Animator</td>
            <td>Not required. If specifyed one may optimize the animation.</td>
        </tr>

        <tr>
            <td>removeElement</td>
            <td>Animator</td>
            <td>Removes the specified Element we render in.</td>
        </tr>
    </tbody>
</table>