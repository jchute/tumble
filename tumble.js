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
      class: 'tumble',
      classControls: 'tumble__controls',
      classPagination: 'tumble__pagination',
      classPaginationActive: 'tumble__pagination--active',
      classSlide: 'tumble__slide',
      classSlideActive: 'tumble__slide--active',
      controlNext: '<button class="tumble__controls--next" aria-label="Next Slide">Next</button>',
      controlPrev: '<button class="tumble__controls--prev" aria-label="Previous Slide">Previous</button>',
      controlPaginationLabel: 'Show Slide',
      enableCSS: true,
      showControls: true,
      showPagination: true,
      ...props
    }

    // Break Early if Error
    if ( ! ( element && element.nodeType === 1 ) ) {
      console.warn( `Tumble can only be applied to an HTMLElement object. Target received: ${element}` );
      return;
    }

    this.build();

  }

  build() {
    this.addClasses( this.element, this.props );
    this.addControls( this.element, this.props );
  }

  destroy() {
    this.controls.remove();
    this.removeClasses( this.element, this.props );
  }

  addClasses( element, props ) {
    // Add Classes
    element.classList.add( props.class );
    element.firstElementChild.classList.add( props.classSlideActive );

    Array.from( element.children ).forEach( ( child, i ) => {
      child.classList.add( props.classSlide );
      child.dataset.slide = i;
    } );
  }

  removeClasses( element, props ) {
    element.classList.remove( props.class );
    element.firstElementChild.classList.add( props.classSlideActive );

    Array.from( element.children ).forEach( child => {
      child.classList.remove( props.classSlide );
      child.classList.remove( props.classSlideActive );
      delete child.dataset.slide;
    } );
  }

  addControls( element, props ) {
    const controls = document.createElement( 'nav' );
    controls.classList.add( props.classControls );

    // Add Pagination Controls 
    if ( props.showPagination ) {
      const ul = document.createElement( 'ul' );
      ul.classList.add( props.classPagination );

      for ( let i = 0; i < element.children.length; i++ ) {
        const li = document.createElement( 'li' );
        const button = document.createElement( 'button' );
        button.setAttribute( 'aria-label', `${props.controlPaginationLabel} ${i}` );
        button.dataset.slide = i;

        if ( i == 0 ) {
          li.classList.add( props.classPaginationActive );
        }

        li.appendChild( button );
        ul.appendChild( li );
      }

      controls.appendChild( ul );
    }

    // Add Next/Prev Controls
    if ( props.showControls ) {
      controls.innerHTML = props.controlPrev + controls.innerHTML;
      controls.innerHTML += props.controlNext;
    }

    if ( controls.children.length ) {
      this.controls = controls;
      element.appendChild( controls );
    }
  }
}
