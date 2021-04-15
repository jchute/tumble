/*
 * Tumble
 * Version: 0.2
 * License: MIT License
 * Author: Jonathan Chute
 * 
 */

class Tumble {
  
  constructor( element, props ) {

    // Break Early if Error
    if ( ! ( element && element.nodeType === 1 ) ) {
      console.warn( `Tumble can only be applied to an HTMLElement object. Target received: ${element}` );
      return;
    }

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
      initialSlide: 0,
      rotate: true,
      showControls: true,
      showPagination: true,
      timeout: 5000,
      ...props
    };

    this.build();

  }

  build() {
    this.addHTML();
    this.setSlides();
    this.addEvents();
  }

  destroy() {
    this.removeHTML();
    this.unsetSlides();
    this.removeEvents();
    clearTimeout( this.automate );
  }

  createElementFromHTML( html ) {
    const container = document.createElement( 'div' );
    container.innerHTML = html;
    return container.children[0];
  }

  addHTML() {
    this.addClasses();
    this.addControls();
  }

  removeHTML() {
    this.removeClasses();
    this.removeControls();
  }

  addClasses() {
    // Add class to main element
    this.element.classList.add( this.props.class );

    // Add class to each slide
    Array.from( this.element.children ).forEach( ( child, i ) => {
      child.classList.add( this.props.classSlide );
    } );
  }

  removeClasses() {
    // Remove class from main element
    this.element.classList.remove( this.props.class );

    // Remove class from each slide
    Array.from( this.element.children ).forEach( child => {
      child.classList.remove( this.props.classSlide );
      child.classList.remove( this.props.classSlideActive );
    } );
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
      
      let index = 0;
      Array.from( this.element.children ).forEach( child => {
        if ( child.classList.contains( this.props.classSlide ) ) {
          const li = document.createElement( 'li' );
          const button = document.createElement( 'button' );
          button.setAttribute( 'aria-label', `${this.props.controlPaginationLabel} ${++index}` );
          li.appendChild( button );
          this.page.appendChild( li );
        }
      } );

      this.element.appendChild( this.page );
    }
  }

  removeControls() {
    if ( this.prev ) {
      this.prev.remove();
    }

    if ( this.next ) {
      this.next.remove();
    }

    if ( this.page ) {
      this.page.remove();
    }
  }

  setSlides() {
    this.slides = this.element.querySelectorAll( `.${this.props.classSlide}` );

    this.slides.forEach( ( slide, index ) => {
      slide.dataset.slide = index;
    } );

    if ( this.dots ) {
      this.dots = this.page.querySelectorAll( 'button' );

      this.dots.forEach( ( dot, index ) => {
        dot.dataset.slide = index;
      } );
    }

    this.setActiveSlide( this.props.initialSlide );
  }

  unsetSlides() {
    this.slides.forEach( slide => {
      delete slide.dataset.slide;
    } );

    this.activeSlide = null;
  }

  addEvents() {
    if ( this.prev ) {
      const tumble = this;
      this.prev.addEventListener( 'click', this.prevSlide = function() {
        tumble.setActiveSlide( this.dataset.slide );
      } );
    }

    if ( this.next ) {
      const tumble = this;
      this.next.addEventListener( 'click', this.nextSlide = function() {
        tumble.setActiveSlide( this.dataset.slide );
      } );
    }

    if ( this.page ) {
      const tumble = this;
      let index = 0;
      this.pageSlide = [];
      this.page.querySelectorAll( 'button' ).forEach( button => {
        button.addEventListener( 'click', this.pageSlide[index++] = function() {
          tumble.setActiveSlide( this.dataset.slide );
        } );
      } );
    }
  }

  removeEvents() {
    if ( this.prev ) {
      this.prev.removeEventListener( 'click', this.prevSlide );
      delete this.prevSlide;
    }

    if ( this.next ) {
      this.next.removeEventListener( 'click', this.nextSlide );
      delete this.nextSlide;
    }

    if ( this.page ) {
      let index = 0;
      this.page.querySelectorAll( 'button' ).forEach( button => {
        button.removeEventListener( 'click', this.pageSlide[index++] );
      } );
      delete this.pageSlide;
    }
  }

  getSlide( id ) {
    let found = null;
    this.slides.forEach( slide => {
      if ( slide.dataset.slide == id ) {
        found = slide;
      }
    } );
    return found;
  }

  getDot( id ) {
    let found = null;
    this.dots.forEach( button => {
      if ( button.dataset.slide == id ) {
        found = button;
      }
    } );
    return found;
  }

  setActiveSlide( id ) {
    if ( id == this.activeSlide || ! this.getSlide( id ) ) {
      return false;
    }

    const currentSlide = this.getSlide( this.activeSlide );
    const updatedSlide = this.getSlide( id );

    if ( currentSlide ) {
      currentSlide.classList.remove( this.props.classSlideActive );
    }

    updatedSlide.classList.add( this.props.classSlideActive );

    if ( this.props.showPagination ) {
      const currentDot = this.getDot( this.activeSlide );
      const updatedDot = this.getDot( id );

      if ( currentDot ) {
        currentDot.parentElement.classList.remove( this.props.classPaginationActive );
      }

      updatedDot.parentElement.classList.add( this.props.classPaginationActive );
    }

    // Update the slide for the Next/Prev button to switch into
    if ( this.props.showControls ) {
      this.prev.dataset.slide = id == 0 ? this.slides.length - 1 : parseInt( id ) - 1;
      this.next.dataset.slide = id == this.slides.length - 1 ? 0 : parseInt( id ) + 1;
    }

    this.activeSlide = id;

    if ( this.props.rotate ) {
      this.setAutomate();
    }

    return updatedSlide;
  }

  setAutomate() {
    clearTimeout( this.automate );
    this.automate = setTimeout( () => {
      this.setActiveSlide( this.next.dataset.slide );
    }, this.props.timeout );
  }
}
