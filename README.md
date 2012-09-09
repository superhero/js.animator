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

### Animators instance interface

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
        int|string <b>id</b>
        <br> The id of the callback we wont returned
      </td>
      <td>Returns the callback by specified id. If id dosn't exists in queue,
      null is returned</td>
    </tr>

    <tr>
      <td>get</td>
      <td colspan="3">
        <b>Alias for "<i>getCallback</i>" and "<i>getQueue</i>". If param is undefined then the whole queue is returned.</b>
      </td>
    </tr>

    <tr>
      <td>setCallback</td>
      <td>Animator</td>
      <td>
          int|string <b>id</b>
          <br> The id of the callback
          <br>
          <br> function <b>fn</b>
          <br> The callback we wish to set
          <br>
          <br> int <b>length</b> [optional]
          <br> How many times we wish to call upon the callback
        </ul>
      </td>
      <td>
        Sets a callback function with a given id. This can also be used to 
        replace an alredy existing callback.
        <br> 
        <br> <i><b>WARNING!</b> Using this function is not the recomended way
        to add a function to the queue. Use addCallback for this purpose
        instead.</i>
      </td>
    </tr>

    <tr>
      <td>set</td>
      <td colspan="3">
        <b>Alias for "<i>setCallback</i>" and "<i>setQueue</i>".</b>
      </td>
    </tr>

    <tr>
      <td>addCallback</td>
      <td>int|array</td>
      <td>
        function|array <b>fn</b>
        <br> The function, or an array of functions, we wish to add to the queue
        <br> 
        <br> int <b>length</b> [optional]
        <br> How many times we wish to call upon the callback
        <br> 
        <br> start <b>boolean</b> [optional]
        <br> If true, the callback routine will automatically start after
             callbacks are added. Defaults to true
      </td>
      <td>
        Adds one or many functions to the queue. Returns the generated id or an
        array of them if multiple callbacks where specicified.
      </td>
    </tr>

    <tr>
      <td>add</td>
      <td colspan="3">
        <b>Alias for "<i>addCallback</i>"</b>
      </td>
    </tr>

    <tr>
      <td>removeCallback</td>
      <td>Animator</td>
      <td>
        int|function|object <b>fn</b>
        <br> The id, function or instance we wish to remove from the queue
      </td>
      <td>
        Removes a callback from the queue and stops the routine if there's no
        more callbacks in the queue.
      </td>
    </tr>

    <tr>
      <td>remove</td>
      <td colspan="3">
        <b>Alias for "<i>removeCallback</i>"</b>
      </td>
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
        Object <b>queue</b>
        <br> The queue new queue
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
      <td>clear</td>
      <td colspan="3">
        <b>Alias for "<i>clearQueue</i>"</b>
      </td>
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
        Element <b>element</b>
        <br> The element to render in
      </td>
      <td>
        <b>Not required!</b> If specifyed one may optimize the animation.
      </td>
    </tr>

    <tr>
      <td>removeElement</td>
      <td>Animator</td>
      <td></td>
      <td>Removes any specified element to render in.</td>
    </tr>
  </tbody>
</table>

### Animators static interface

*OBS!* All the methods that are availible from the instance interface are also
availible in the static interface.

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
      <td>getInstance</td>
      <td>Animator</td>
      <td></td>
      <td>
        Lazyloads an instance that can be acceced through a static interface.
      </td>
    </tr>
  </tbody>
</table>

### Example of use

Let's start of by defining our rendering loop:
```javascript
var loop = function()
{
  // do cool stuff
}
```
Then we need an instance of Animator:
**The new interface has a static alternative that doesn't require this step**
```javascript
var instance = new Animator();
```
Now we want to add the loop to Animators queue: 
```javascript
var id = instance.addCallback( loop );

// Or you can use a shorter alternative:
var id = instance.add( loop );

// And then there is a static alternative:
var id = Animator.add( loop );
```
By adding the loop to a queue we are able to use multiple rendering loops
within the same callback routin. Just stack them on by using `addCallback`

By adding a callback to the routine we also start the animation. If we wish to 
prevent this to manually start the routine at a later point we have to declare 
this when calling the method. We do this by passing on a false third parameter 
to the method:
```javascript
var id = instance.add( loop, null, false );

// Static alternative:
var id = Animator.add( loop, null, false );
```
To start the routine manually:
```javascript
instance.start();

// Static alternative:
Animator.start();
```
To stop Animator from calling the loop we need to remove it from the queue, we 
can do this manually or specify how many times the loop should be called upon 
adding it to the queue.

To do it manually we need to alter the rendering loop:
```javascript
var loop = function( i )
{
  if( i == expectedLength )
  {
    instance.removeCallback( id );

    // Or more a more simple alternative:
    instance.remove( id );

    // Static alternative:
    Animator.remove( id );
    
    return;
  }

  // do cool stuff
}
```
Tough, if we alredy know the expected length then we can specify this when we
add the loop to the queue:
```javascript
instance.add( loop, expectedLength );

// Static alternative:
Animator.add( loop, expectedLength );
```
By specifying the expected length when we add the loop to the queue we no 
longer need to alter the animation loop.

When there's no longer any callbacks in the queue then the routine will
automatically stop. If you by any reason would like to stop or pause the
routine at any time then use the method `stop`:
```javascript
instance.stop();

// Static alternative:
Animator.stop();
```