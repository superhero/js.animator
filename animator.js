/*
  Animator - Javascript
  Copyright (C) 2012  Erik Landvall
  Dual licensed under the MIT and GPL version 3
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
          queue[ key ].iterations == null ||
          queue[ key ].iterated < queue[ key ].iterations
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
   * Alias for getCallback and getQueue. If param is undefined then the whole
   * queue is returned.
   */
  this.get = function( id )
  {
    return id 
      ? _animator.getCallback( id )
      : _animator.getQueue();
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
      
    return _animator;
  }
  
  /**
   * Alias for setCallback and setQueue
   */
  this.set = function( id_queue, fn, length )
  {
    return fn
      ? _animator.setCallback( id_queue, fn, length )
      : _animator.setQueue( id_queue );
  }

  /**
   * Adds one or many functions to the queue
   * 
   * @param fn function|array - The function, or an array of functions, we
   * wish to add to the queue
   * @param length int - [optional] How many times we wish to call upon the
   * callback
   * @param start boolean - [optional] If true, the callback routine will
   * automatically start after callbacks are added. Defaults to true.
   * @exception 'Only functions are allowed in the queue'
   * @exception 'Incomplete interface'
   * @type int|array
   */
  this.addCallback = function( fn, length, start )
  {
    var id = undefined;
    
    length = length == undefined 
           ? null
           : length;
    start  = start  == undefined 
           ? true 
           : start;

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

    if( start )
      _animator.start();

    return id;
  }

  /**
   * Alias for addCallback
   */
  this.add = this.addCallback;

  /**
   * Removes a callback from the queue and stops the routine if there's no more
   * callbacks in the queue.
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
    }
    
    if( _animator.isQueueEmpty() )
      _animator.stop();

    return _animator;
  }
  
  /**
   * Alias for removeCallback
   */
  this.remove = this.removeCallback;

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
    _animator.addCallback( queue );

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
   * Alias for clearQueue
   */
  this.clear = this.clearQueue;

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
    if( !element )
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

/**
 * Lazyloads an instance that can be acceced through a static interface.
 * 
 * @static
 * @return Animator
 */
Animator.getInstance = function()
{
  if( !Animator._instance )
    Animator._instance = new Animator();
  
  return Animator._instance;
}

/**
 * Starts the animation loop, if not already running
 * 
 * @static
 * @type Animator
 */
Animator.start = function()
{
  return Animator.getInstance().start();
}

/**
 * Stops/Pauses the animation loop, if running...
 * 
 * @static
 * @type Animator
 */
Animator.stop = function()
{
  return Animator.getInstance().stop();
}

/**
 * Returns if animation loop is currently running
 * 
 * @static
 * @type boolean
 */
Animator.isRunning = function()
{
  return Animator.getInstance().isRunning();
}

/**
 * Returns the callback by specified id. If id dosn't exists in queue, null
 * is returned
 * 
 * @param id int - The id of the callback we wont returned
 * @static
 * @type function|null
 */
Animator.getCallback = function( id )
{
  return Animator.getInstance().getCallback( id );
}

/**
 * Alias for getCallback and getQueue. If param is undefined then the whole
 * queue is returned.
 */
Animator.get = function( id )
{
  return Animator.getInstance().get( id );
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
 * @static
 * @type Animator
 */
Animator.setCallback = function( id, fn, length )
{
  return Animator.getInstance().setCallback( id, fn, length );
}

/**
 * Alias for setCallback and setQueue
 */
Animator.set = function( id_queue, fn, length )
{
  return Animator.getInstance().set( id_queue, fn, length );
}

/**
 * Adds one or many functions to the queue
 * 
 * @param fn function|array - The function, or an array of functions, we
 * wish to add to the queue
 * @param length int - [optional] How many times we wish to call upon the
 * callback
 * @param start boolean - [optional] If true, the callback routine will
 * automatically start after callbacks are added. Defaults to true.
 * @exception 'Only functions are allowed in the queue'
 * @exception 'Incomplete interface'
 * @static
 * @type int|array
 */
Animator.addCallback = function( fn, length, start )
{
  return Animator.getInstance().addCallback( fn, length, start );
}

/**
 * Alias for addCallback
 */
Animator.add = Animator.addCallback;

/**
 * Removes a callback from the queue and stops the routine if there's no more
 * callbacks in the queue.
 * 
 * @param fn int|function|object - The id, function or instance we wish to
 * remove from the queue.
 * @exception 'Invalid type'
 * @static
 * @type Animator
 */
Animator.removeCallback = function( fn )
{
  return Animator.getInstance().removeCallback( fn );
}

/**
 * Alias for removeCallback
 */
Animator.remove = Animator.removeCallback;

/**
 * Returns the current queue
 * 
 * @static
 * @type Object
 */
Animator.getQueue = function()
{
  return Animator.getInstance().getQueue();
}

/**
 * Clears the old queue and sets a new one
 * 
 * @param queue Object - The queue new queue
 * @exception 'Only functions are allowed in the queue'
 * @static
 * @type Animator
 */
Animator.setQueue = function( queue )
{
  return Animator.getInstance().setQueue( queue );
}

/**
 * Unsets the queue
 * 
 * @static
 * @type Animator
 */
Animator.clearQueue = function()
{
  return Animator.getInstance().clearQueue();
}

/**
 * Alias for clearQueue
 */
Animator.clear = Animator.clearQueue;

/**
 * Returns if the queue is empty
 * 
 * @static
 * @type boolean
 */
Animator.isQueueEmpty = function()
{
  return Animator.getInstance().isQueueEmpty();
}

/**
 * Returns the specified element we wish to render on
 *
 * @static
 * @type Element|undefined
 */
Animator.getElement = function()
{
  return Animator.getInstance().getElement();
}

/**
 * Not required. If specifyed one may optimize the animation
 *
 * @param element Element - [optional] The element to render in
 * @exception 'Unrecognized element'
 * @static
 * @type Animator
 */
Animator.setElement = function( element )
{
  return Animator.getInstance().setElement( element );
}

/**
 * Removes any specified element to render in
 * 
 * @static
 * @type Animator
 */
Animator.removeElement = function()
{
  return Animator.getInstance().removeElement();
}