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
    
    // The queue
    _queue    = [],
    
    // The id to the running loop
    _id       = undefined,
    
    // A flag that determines if the loop is running
    _running  = false,
    
    /**
     * Handle to the callback-routine
     */
    _requestAnimationFrame = (function()
    {
        return window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame;
    })(),
    
    /**
     * Handle to the cancel part of the callback-routine
     */
    _cancelAnimationFrame = (function()
    {
        return window.cancelAnimationFrame
            || window.webkitCancelAnimationFrame
            || window.webkitCancelRequestAnimationFrame
            || window.mozCancelRequestAnimationFrame
            || window.oCancelRequestAnimationFrame
            || window.msCancelRequestAnimationFrame;
    })();

    // Fallback
    if( !_requestAnimationFrame || !_cancelAnimationFrame )
    {
        _requestAnimationFrame = function( callback )
        {
            return window.setTimeout( callback, 1000 / 60 );
        }

        _cancelAnimationFrame = function( id )
        {
            window.clearTimeout( id );
        }
    }
    
    /**
     * Starts the animation loop, if not already running
     * 
     * @type void
     */
    this.start = function()
    {
        if( !_running )
        {
            _running = true;
            
            (function loop(){
                _id = _requestAnimationFrame( loop );
                
                var queue = _animator.getQueue();
                
                for( var i = 0, l = queue.length; i < l; i++ )
                    queue[ i ]();
            })();
        }
    }
    
    /**
     * Stops/Pauses the animation loop, if running...
     * 
     * @type void
     */
    this.stop = function()
    {
        if( _running )
        {
            _cancelAnimationFrame( _id );
            _id      = undefined;
            _running = false;
        }
    }
    
    /**
     * Adds one ore many functions to the queue
     * 
     * @param func array|function - The function, or an array of functions, we
     * wish to add to the queue
     * @exception Only functions are allowed in the queue
     * @type void
     */
    this.addToQueue = function( func )
    {
        switch( typeof func )
        {
            case 'function':
                _queue.push( func );
                break;
                
            case 'object':
                if( func instanceof Array )
                {
                    for( var i = 0, l = func.length; i < l; i++ )
                        _animator.addToQueue( func[ i ] );
                    
                    break;
                }
                
            default :
                throw 'Only functions are allowed in the queue';
        }
    }
    
    /**
     * Removes a function from the queue
     * 
     * @param func function - The function we wish to remove from the queue
     * @type void
     */
    this.removeFromQueue = function( func )
    {
        for( var i = 0; i < _queue.length; i++ )
            if( _queue[ i ] == func )
                _animator.removeIndexFromQueue( i-- );
    }
    
    /**
     * Removes an item from the queue depending on specified index
     * 
     * @param index integer - The index we wish to remove
     * @type void
     */
    this.removeIndexFromQueue = function( index )
    {
        _queue.splice( Math.floor( index ), 1 );
    }
    
    /**
     * Returns the current queue
     * 
     * @type array
     */
    this.getQueue = function()
    {
        return _queue;
    }
    
    /**
     * Clears the old queue and sets a new one
     * 
     * @exception Only functions are allowed in the queue
     * @param queue array - The queue new queue
     * @type void
     */
    this.setQueue = function( queue )
    {
        _animator.clearQueue();
        _animator.addToQueue( queue );
    }
    
    /**
     * Unsets the queue
     * 
     * @type void
     */
    this.clearQueue = function()
    {
        _queue = [];
    }
}