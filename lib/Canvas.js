export default class Canvas{
    constructor(){
        this.elm    = document.createElement( 'canvas' );
        this.ctx    = this.elm.getContext( '2d' );
        this.width  = 0;
        this.height = 0;
    }

    appendTo( elm ){
        elm.appendChild( this.elm );
        return this;
    }

    initPixel(){
        this.imageData	= this.ctx.getImageData( 0, 0, this.width, this.height );	// Get Image Data object
        this.pixels	    = this.imageData.data;										// Then its raw RGBA Array
        return this;
    }

    _pxIdx( x, y ){ return ( y * this.width + x ) * 4 ; }

    setPixel( x, y, bin, doUpdate=false ){
        const r = (bin >> 16) & 255;
        const g = (bin >> 8) & 255;
        const b = bin & 255;
        const i = this._pxIdx( x, y );

        this.pixels[ i ]    = r;
        this.pixels[ i+1 ]  = g;
        this.pixels[ i+2 ]  = b;
        this.pixels[ i+3 ]  = 255;

        if( doUpdate ) this.updatePixels();
        return this;
    }

    updatePixels(){ this.ctx.putImageData( this.imageData, 0, 0 ); return this; }

    setSize( w=500, h=500 ){
        let dpi					= window.devicePixelRatio;
        this.elm.width			= w * dpi;
        this.elm.height			= h * dpi;
        this.elm.style.width	= w + "px";
        this.elm.style.height	= h + "px";
        this.width				= w;
        this.height				= h;

        this.ctx.scale( dpi, dpi );
        return this;
    }
}