(function() {
  var select = document.getElementById( 'taxonomy-select' );

  if ( ! select ) {
    return false;
  }

  var selectInput = document.getElementById( 'taxonomy-select-input' );
  var selectList = document.getElementById( 'taxonomy-select-list' );
  var selectbtn = document.getElementById( 'taxonomy-select-submit' );

  selectbtn.addEventListener( 'click', function(e) {
    e.preventDefault();

    createTaxonomy( selectInput.value, selectList, selectInput );

  } );

  selectInput.addEventListener( 'keydown', function(e) {
    if ( 13 === e.keyCode ) {
      e.preventDefault();

      createTaxonomy( selectInput.value, selectList, selectInput );
    }
  } );

  function createTaxonomy( taxonomyName, selectList, selectInput ) {
    const slug = createSlug( taxonomyName );
    const endpoint = `${TaxonomySelect.baseURL}/wp-json/wp/v2/categories`;

    fetch( endpoint, {
        method: 'POST',
        headers: {
          'X-WP-NONCE': TaxonomySelect.nonce,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( {
          name: taxonomyName,
          slug: slug
        } ),
        credentials: 'same-origin'

      }).then( function( response ) {
        if( response.ok ) {
          return response.json().then( function( json ) {
            addSlider(json.id, json.name, selectList );
            selectInput.value = '';
          } );
        } else {
          return response.json().then( function( json ) {
            console.log( json.message );
          } );
        }
      }).catch( function( e ) {
        console.log( e );
      });
  }

  function addSlider( slug, name, selectList ) {
    var option = document.createElement( 'option' );
    //Needs to be term id
    option.value = slug;
    option.selected = true
    option.innerHTML = name;
    selectList.appendChild( option );
  }

  function createSlug( sliderName ) {
    sliderName = sliderName.replace(/^\s+|\s+$/g, '');
    sliderName = sliderName.toLowerCase();

    sliderName = sliderName.replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');

    return sliderName;
  }
})();
