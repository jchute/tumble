/*
 * Tumble
 * Version: 0.1
 * License: MIT License
 * Author: Jonathan Chute
 * 
 */

class Tumble {
  
  constructor( element, props ) {

    // Initialize Variables and Settings
    this.element = element;
    this.props = {
      // TODO: Add Options
      ...props
    }

    // Break Early if Error
    if ( ! ( element && element.nodeType === 1 ) ) {
      console.warn( `Tumble can only be applied to an HTMLElement object. Target received: ${element}` );
      return;
    }

    // TODO: Complete Initialization

  }

}
