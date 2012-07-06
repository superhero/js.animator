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

## Animators interface

<table>
  <thead>
    <tr>
      <td><b>Name</b></td>
      <td><b>Return type</b></td>
      <td><b>Parameters</b></td>
      <td><b>Description</b></td>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>start</td>
      <td>Animator</td>
      <td></td>
      <td>Starts the animation loop, if not already running.</td>
    </tr>

    <tr>
      <td>stop</td>
      <td>Animator</td>
      <td></td>
      <td>Stops/Pauses the animation loop, if running.</td>
    </tr>

    <tr>
      <td>isRunning</td>
      <td>boolean</td>
      <td></td>
      <td>Returns if animation loop is currently running.</td>
    </tr>

    <tr>
      <td>getCallback</td>
      <td>function|null</td>
      <td>
        <ul>
          <li>
            <i>int|string <b>id</b></i> The id of the callback we wont returned
          </li>
        </ul>
      </td>
      <td>Returns the callback by specified id. If id dosn't exists in queue, null is returned</td>
    </tr>

    <tr>
      <td>setCallback</td>
      <td>Animator</td>
      <td>
        <ul>
          <li>
            <i>int|string <b>id</b></i> The id of the callback
          </li>

          <li>
            <i>function <b>fn</b></i> The callback we wish to set
          </li>

          <li>
            <i>int <b>length</b></i> <b>[optional]</b> How many times we wish to call upon the callback
          </li>
        </ul>
      </td>
      <td>
        Sets a callback function with a given id. This can also be used to replace an alredy existing callback.
   
        <i><b>Warning!</b> Using this function is not the recomended way to add a function to the queue. Use addCallback for this purpose instead.</i>
      </td>
    </tr>

    <tr>
      <td>addCallback</td>
      <td>int|array</td>
      <td>
        <ul>
          <li>
            <i>function|array <b>fn</b></i> The function, or an array of functions, we wish to add to the queue
          </li>

          <li>
            <i>int <b>length</b></i> <b>[optional]</b> How many times we wish to call upon the callback
          </li>
        </ul>
      </td>
      <td>Adds one or many functions to the queue. Returns the generated id or an array of them if multiple callbacks where specicified.</td>
    </tr>

    <tr>
      <td>removeCallback</td>
      <td>Animator</td>
      <td>
        <ul>
          <li>
            <i>int|function|object <b>fn</b></i> The id, function or instance we wish to remove from the queue
          </li>
        </ul>
      </td>
      <td>Removes a callback from the queue.</td>
    </tr>

    <tr>
      <td>getQueue</td>
      <td>Object</td>
      <td></td>
      <td>Returns the current queue</td>
    </tr>

    <tr>
      <td>setQueue</td>
      <td>Animator</td>
      <td>
        <ul>
          <li>
            <i>Object <b>queue</b></i> The queue new queue
          </li>
        </ul>
      </td>
      <td>Clears the old queue and sets a new one.</td>
    </tr>

    <tr>
      <td>clearQueue</td>
      <td>Animator</td>
      <td></td>
      <td>Unsets the queue</td>
    </tr>

    <tr>
      <td>isQueueEmpty</td>
      <td>boolean</td>
      <td></td>
      <td>Returns if the queue is empty.</td>
    </tr>

    <tr>
      <td>getElement</td>
      <td>Element|undefined</td>
      <td></td>
      <td>Returns the specified element we wish to render on.</td>
    </tr>

    <tr>
      <td>setElement</td>
      <td>Animator</td>
      <td>
        <ul>
          <li>
            <i>Element <b>element</b></i> The element to render in
          </li>
        <ul>
      </td>
      <td><b>Not required!</b> If specifyed one may optimize the animation.</td>
    </tr>

    <tr>
      <td>removeElement</td>
      <td>Animator</td>
      <td></td>
      <td>Removes any specified element to render in.</td>
    </tr>
  </tbody>
</table>

## Example of use

Let's star of by defining our rendering loop:

    var loop = function()
    {
      // do cool stuff
    }

Then we need an instance of Animator:

    var animator = new Animator();

Now we wont to add the loop to Animators queue: 

    var id = animator.addCallback( loop );

By adding the loop to the queue we are able to use multiple rendering loops
within the same callback rutin. Just stack them on by using `addCallback`

Now we start the animation:

    animator.start();

To stop Animator from calling the loop we need to remove it from the queue, we can do this manually or specify how many times the loop should be called upon adding it to the queue.

To do it manually we need to alter the rendering loop:

    var loop = function( i )
    {
      if( i == expectedLength )
      {
        animator.removeCallback( id );
        return;
      }

      // do cool stuff
    }

Tough, if we alredy know the expected length then we can specify this when we add the loop to the queue:

    animator.addCallback( loop, expectedLength );

By specifying the expected length when we add the loop to the queue we no longer need to alter the animation loop.

Ones we called upon `start` the process is roling, with or without anything in the queue. This may be unnecessary. To stop this process we call `stop`:

    animator.stop();

*I'm working on a solution that wont require the user to call `start` and `stop` manually, unless this behavior is requested.*