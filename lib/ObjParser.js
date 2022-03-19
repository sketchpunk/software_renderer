/* Excuse the crappy obj parser, built it quickly to use with the tutorial, its gets the job done */

export default class ObjParser{
    constructor(){
        this.txt    = '';
        this.idx    = 0;
        this.verts  = [];
        this.faces  = [];
    }

    computeBounding(){
        let xmin = Infinity;
        let ymin = Infinity;
        let zmin = Infinity;
        let xmax = -Infinity;
        let ymax = -Infinity;
        let zmax = -Infinity;

        for( let v of this.verts ){
            if( v[0] > xmax )       xmax = v[0];
            else if( v[0] < xmin )  xmin = v[0];
            
            if( v[1] > ymax )       ymax = v[1];
            else if( v[1] < ymin )  ymin = v[1];
            
            if( v[2] > zmax )       zmax = v[2];
            else if( v[2] < zmin )  zmin = v[2];
        }

        return {
            min:[ xmin, ymin, zmin ],
            max:[ xmax, ymax, zmax ],
        };
    }

    iterFaces(){
        const result  = { value:[ null, null, null ], done:false };
        const len     = this.faces.length;
        let   i       = 0;
        let   f;

        const next    = ()=>{
            if( i >= len ) result.done = true;
            else{
                f = this.faces[ i ];
                result.value[ 0 ] = this.verts[ f[0] ];
                result.value[ 1 ] = this.verts[ f[1] ];
                result.value[ 2 ] = this.verts[ f[2] ];
                i++;
            }
            return result;
        };
    
        return { [Symbol.iterator](){ return { next }; } };
    }

    fetch( url ){
        return fetch( url )
            .then( res=>res.text() )
            .then( txt=>{ this.txt = txt; } );
    }

    load(){
        let v;
        while( ( v = this.nextLine() ) != null );
    }

    parseLine( a, b ){
        let stack = null;
        let fn    = null;

        switch( this.txt[a] ){
            case 'v':
                if( this.txt[a+1] != ' ' ) return '';
                stack = this.verts;
                fn    = this.toFloats;
                break;
            case 'f':
                stack = this.faces;
                fn    = this.toInts;
                break;
            default:
                return '';
        }

        const s   = this.txt.substring( a+1, b ).trim();
        const ary = fn( s );
        stack.push( ary );
        return ary;
    }

    toFloats( str ){
        const ary = str.split( ' ' );
        for( let i=0; i < ary.length; i++ ){
            ary[ i ] = parseFloat( ary[ i ] );
        }
        return ary;
    }

    toInts( str ){
        const ary = str.split( ' ' );
        for( let i=0; i < ary.length; i++ ){
            ary[ i ] = parseInt( ary[ i ] ) - 1; // OBJ Index starts at 1, so -1 to match 0 indexing of js
        }
        return ary;
    }

    nextLine(){
        const i = this.txt.indexOf( '\n', this.idx );
        if( i == -1 ){
            if( this.idx < this.txt.length ){
                const v = this.parseLine( this.idx, i );
                this.idx = this.txt.length;
                return v;
            }
            return null;
        }

        const v = this.parseLine( this.idx, i );
        this.idx = i+1;
        return v;
    }
}