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
        <table>
          <tr>
            <td>
              id
            </td>
            <td>
              int|string
            </td>
            <td>
              The id of the callback we wont returned
            </td>
          </tr>
        </table>
      </td>
      <td>Returns the callback by specified id. If id dosn't exists in queue, null is returned</td>
    </tr>

    <tr>
      <td>setCallback</td>
      <td>Animator</td>
      <td>
        <table>
          <tr>
            <td>
              id
            </td>
            <td>
              int|string
            </td>
            <td>
              The id of the callback
            </td>
          </tr>
          <tr>
            <td>
              fn
            </td>
            <td>
              function
            </td>
            <td>
              The callback we wish to set
            </td>
          </tr>

          <tr>
            <td>
              length
            </td>
            <td>
              int
            </td>
            <td>
              **[optional]** How many times we wish to call upon the callback
            </td>
          </tr>
        </table>
      </td>
      <td>
        Sets a callback function with a given id. This can also be used to replace an alredy existing callback.
   
        ***Warning!** Using this function is not the recomended way to add a function to the queue. Use addCallback for this purpose instead.*
      </td>
    </tr>

    <tr>
      <td>addCallback</td>
      <td>int|array</td>
      <td>
        <table>
          <tr>
            <td>
              fn
            </td>
            <td>
              function|array
            </td>
            <td>
              The function, or an array of functions, we wish to add to the queue
            </td>
          </tr>

          <tr>
            <td>
              length
            </td>
            <td>
              int
            </td>
            <td>
              **[optional]** How many times we wish to call upon the callback
            </td>
          </tr>
        </table>
      </td>
      <td>Adds one or many functions to the queue. Returns the generated id or an array of them if multiple callbacks where specicified.</td>
    </tr>

    <tr>
      <td>removeCallback</td>
      <td>Animator</td>
      <td>
        <table>
          <tr>
            <td>
              fn
            </td>
            <td>
              int|function|object
            </td>
            <td>
              The id, function or instance we wish to remove from the queue.
            </td>
          </tr>
        </table>
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
        <table>
          <tr>
            <td>
              queue
            </td>
            <td>
              Object
            </td>
            <td>
              The queue new queue
            </td>
          </tr>
        </table>
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
        <table>
          <tr>
            <td>
              element
            </td>
            <td>
              Element
            </td>
            <td>
              The element to render in.
            </td>
          </tr>
        </table>
      </td>
      <td>**Not required!** If specifyed one may optimize the animation.</td>
    </tr>

    <tr>
      <td>removeElement</td>
      <td>Animator</td>
      <td></td>
      <td>Removes any specified element to render in.</td>
    </tr>
  </tbody>
</table>