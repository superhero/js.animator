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
    _queue    = [],
    
    // A flag that determines if the loop is running
    _running  = false,
    
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
    })();
    
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
            
            ( function loop()
            {
                if( _running )
                {
                    _requestAnimationFrame( loop, _animator.getElement() );
                    
                    var queue = _animator.getQueue();

                    for( var i = 0, l = queue.length; i < l; i++ )
                        queue[ i ]();
                }
            })();
        }
        
        return _animator;
    }
    
    /**
     * Stops/Pauses the animation loop, if running...
     * 
     * @type void
     */
    this.stop = function()
    {
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
     * Adds one ore many functions to the queue
     * 
     * @param fn array|function - The function, or an array of functions, we
     * wish to add to the queue
     * @exception 'Only functions are allowed in the queue'
     * @type void
     */
    this.addToQueue = function( fn )
    {
        switch( typeof fn )
        {
            case 'function':
                _queue.push( fn );
                break;
                
            case 'object':
                if( fn instanceof Array )
                {
                    for( var i = 0, l = fn.length; i < l; i++ )
                        _animator.addToQueue( fn[ i ] );
                    
                    break;
                }
                
            default :
                throw 'Only functions are allowed in the queue';
        }
        
        return _animator;
    }
    
    /**
     * Removes a function from the queue
     * 
     * @param fn function - The function we wish to remove from the queue
     * @type void
     */
    this.removeFromQueue = function( fn )
    {
        for( var i = 0; i < _queue.length; i++ )
            if( _queue[ i ] == fn )
                _animator.removeIndexFromQueue( i-- );
        
        return _animator;
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
        
        return _animator;
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
     * @exception 'Only functions are allowed in the queue'
     * @param queue array - The queue new queue
     * @type void
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
     * @type void
     */
    this.clearQueue = function()
    {
        _queue = [];
        
        return _animator;
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
     * @param element Element - [optional] The element we render in
     * @exception 'Unrecognized element'
     * @type void
     */
    this.setElement = function( element )
    {
        if( element == undefined )
            _animator.removeElement();

        else if( element instanceof Element )
            _element = element;
            
        else if( element instanceof jQuery )
            _element = element.get( 0 );

        else
            throw 'Unrecognized element';
        
        return _animator;
    }
    
    /**
     * Removes the specified Element we render in
     * 
     * @type void
     */
    this.removeElement = function()
    {
        _element = undefined;
        
        return _animator;
    }
}