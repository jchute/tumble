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
    };

    // Break Early if Error
    if ( ! ( element && element.nodeType === 1 ) ) {
      console.warn( `Tumble can only be applied to an HTMLElement object. Target received: ${element}` );
      return;
    }

    this.build();

  }

  build() {
    this.addClasses();
    this.addControls();
  }

  destroy() {
    this.removeData();
  }

  createElementFromHTML( html ) {
    const container = document.createElement( 'div' );
    container.innerHTML = html;
    return container.children[0];
  }

  addClasses() {
    this.element.classList.add( this.props.class );
    Array.from( this.element.children ).forEach( ( child, i ) => {
      child.classList.add( this.props.classSlide );
      child.dataset.slide = i;
    } );
    this.element.children[0].classList.add( this.props.classSlideActive );
  }

  removeData() {
    this.element.classList.remove( this.props.class );
    Array.from( this.element.children ).forEach( child => {
      child.classList.remove( this.props.classSlide );
      child.classList.remove( this.props.classSlideActive );
      delete child.dataset.slide;
    } );
    this.element.children[0].classList.add( this.props.classSlideActive );
  }

  addControls() {

    // Add Next/Prev Controls
    if ( this.props.showControls ) {
      this.prev = this.createElementFromHTML( this.props.controlPrev );
      this.next = this.createElementFromHTML( this.props.controlNext );
      this.element.appendChild( this.prev );
      this.element.appendChild( this.next );
    }

    // Add Pagination Controls 
    if ( this.props.showPagination ) {
      this.page = document.createElement( 'ul' );
      this.page.classList.add( this.props.classPagination );
      
      let index = 1;
      Array.from( this.element.children ).forEach( child => {
        if ( child.classList.contains( this.props.classSlide ) ) {
          const li = document.createElement( 'li' );
          const button = document.createElement( 'button' );
          button.setAttribute( 'aria-label', `${this.props.controlPaginationLabel} ${index}` );
          button.dataset.slide = index;
          li.appendChild( button );
          this.page.appendChild( li );
          index++;
        }
      } );
      this.page.children[0].classList.add( this.props.classPaginationActive );

      this.element.appendChild( this.page );
    }

  }
}
