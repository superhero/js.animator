/*
  Animator - Javascript
  Copyright (C) 2012  Erik Landvall
  Dual licensed under the MIT and GPL version 3 licenses
*/

/**
 * Animator is a class ment to create smother animations when possible
 * 
 * @link http://webstuff.nfshost.com/anim-timing/Overview.html
 * @link https://developer.mozilla.org/en/DOM/window.requestAnimationFrame
 * @link http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation
 */
var Animator = function()
{
  
  var

  // A handler to this instance
  _animator = this,

  // A spcifed element for better optimatation. Usuly the canvas where we are
  // painting
  _element = undefined,

  // The queue
  _queue = {},

  // The queue id, auto increment
  _queueId = 0,

  // A flag that determines if the loop is running
  _running = false,

  // The routines id
  _id,

  /**
   * Handle to the callback-routine
   */
  _requestAnimationFrame = ( function()
  {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame

        // Fallback
        || function( callback )
        {return window.setTimeout( callback, 1000 / 60 );};
  })(),

  /**
   * Handle to cancel the routine
   */
  _cancelAnimationFrame = ( function()
  {
    return window.cancelAnimationFrame
        || window.cancelRequestAnimationFrame
        || window.webkitCancelAnimationFrame 
        || window.webkitCancelRequestAnimationFrame 
        || window.mozCancelAnimationFrame 
        || window.mozCancelRequestAnimationFrame
        || window.msCancelAnimationFrame 
        || window.msCancelRequestAnimationFrame 
        || window.oCancelAnimationFrame 
        || window.oCancelRequestAnimationFrame
        || window.clearTimeout;
  })();

  /**
   * Starts the animation loop, if not already running
   * 
   * @type Animator
   */
  this.start = function()
  {
    if( !_running )
    {
      _running = true;

      ( function loop()
      {
        _id = _requestAnimationFrame( loop, _animator.getElement() );

        var queue = _animator.getQueue();

        for( var key in queue )
          queue[ key ].iterations == null 
          || queue[ key ].iterated < queue[ key ].iterations
            ? queue[ key ].callback( queue[ key ].iterated++ )
            : _animator.removeCallback( key );
      })();
    }

    return _animator;
  }

  /**
   * Stops/Pauses the animation loop, if running...
   * 
   * @type Animator
   */
  this.stop = function()
  {
    _cancelAnimationFrame( _id );

    _running = false;

    return _animator;
  }

  /**
   * Returns if animation loop is currently running
   * 
   * @type boolean
   */
  this.isRunning = function()
  {
    return _running;
  }

  /**
   * Returns the callback by specified id. If id dosn't exists in queue, null
   * is returned
   * 
   * @param id int - The id of the callback we wont returned
   * @type function|null
   */
  this.getCallback = function( id )
  {
    return _queue[ id ]
      ? _queue[ id ].callback
      : null;
  }

  /**
   * Sets a callback function with a given id. This can also be used to replace
   * an alredy existing callback.
   * 
   * Warning! Using this function is not the recomended way to add a function to
   * the queue. Use addCallback for this purpose instead.
   * 
   * @param id int|string - The id of the callback
   * @param fn function - The callback we wish to set
   * @param length int - [optional] How many times we wish to call upon the
   * callback
   * @exception 'Invalid type'
   * @type Animator
   */
  this.setCallback = function( id, fn, length )
  {
    if( typeof fn != 'function' )
      throw 'Invalid type';
    
    length = typeof length == 'number' 
      ? length 
      : null;
    
    _queue[ id ] = _queue[ id ]
      ?
      {
        callback:
          fn,
        
        iterations:
          ( length == null
          ? _queue[ id ].iterations
          : length ),
          
        iterated:
          _queue[ id ].iterated || 0
      }
      :
      {
        callback:
          fn,
        
        iterations:
          length,
          
        iterated:
          0
      };
      
    return this;
  }

  /**
   * Adds one or many functions to the queue
   * 
   * @param fn function|array - The function, or an array of functions, we
   * wish to add to the queue
   * @param length int - [optional] How many times we wish to call upon the
   * callback
   * @exception 'Only functions are allowed in the queue'
   * @exception 'Incomplete interface'
   * @type int|array
   */
  this.addCallback = function( fn, length )
  {
    var id = undefined;
    
    length = length || null;

    switch( typeof fn )
    {
      case 'function':
        id = ++_queueId;
        
        // If the id alredy existes, recurs to generat a new one
        if( _queue[ id ] )
          return _animator.addCallback( fn, length );
        
        _animator.setCallback( id, fn, length );
        
        break;

      case 'object':
        if( fn instanceof Array )
        {
          id = [];

          for( var i = 0, l = fn.length; i < l; i++ )
            switch( typeof fn )
            {
              case 'object':
                if( !fn[ i ].callback )
                  throw 'Incomplete interface';
                
                fn[ i ].length = 
                  fn[ i ].length
                  || fn[ i ].iterations
                  || null;
                  
                id.push(
                  _animator.addCallback(
                    fn[ i ].callback,
                    fn[ i ].length ));
                break;
                
              case 'function':
                id.push( _animator.addCallback( fn[ i ] ));
                break;
            }
          break;
        }

      default :
        throw 'Only functions are allowed in the queue';
    }

    return id;
  }

  /**
   * Removes a callback from the queue
   * 
   * @param fn int|function|object - The id, function or instance we wish to
   * remove from the queue.
   * @exception 'Invalid type'
   * @type Animator
   */
  this.removeCallback = function( fn )
  {
    switch( typeof fn )
    {
      case 'number':
      case 'string':
        delete _queue[ fn ];
        break;

      case 'object':
      case 'function':
        for( var id in _queue )
          if( _queue[ id ] === fn )
            _animator.removeCallback( id );
        break;

      default:
        throw 'Invalid type';
    }

    return _animator;
  }

  /**
   * Returns the current queue
   * 
   * @type Object
   */
  this.getQueue = function()
  {
    return _queue;
  }

  /**
   * Clears the old queue and sets a new one
   * 
   * @param queue Object - The queue new queue
   * @exception 'Only functions are allowed in the queue'
   * @type Animator
   */
  this.setQueue = function( queue )
  {
    _animator.clearQueue();
    _animator.addToQueue( queue );

    return _animator;
  }

  /**
   * Unsets the queue
   * 
   * @type Animator
   */
  this.clearQueue = function()
  {
    _queue = {};

    return _animator;
  }

  /**
   * Returns if the queue is empty
   * 
   * @type boolean
   */
  this.isQueueEmpty = function()
  {
    for( var key in _animator.getQueue() )
      return false;

    return true;
  }

  /**
   * Returns the specified element we wish to render on
   *
   * @type Element|undefined
   */
  this.getElement = function()
  {
    return _element;
  }

  /**
   * Not required. If specifyed one may optimize the animation
   *
   * @param element Element - [optional] The element to render in
   * @exception 'Unrecognized element'
   * @type Animator
   */
  this.setElement = function( element )
  {
    if( element == undefined )
      _animator.removeElement();

    else if( element instanceof Element )
      _element = element;

    else if( jQuery && element instanceof jQuery )
      _element = element.get( 0 );

    else
      throw 'Unrecognized element';

    return _animator;
  }

  /**
   * Removes any specified element to render in
   * 
   * @type Animator
   */
  this.removeElement = function()
  {
    _element = undefined;

    return _animator;
  }
}