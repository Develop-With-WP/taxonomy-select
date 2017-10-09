(function() {
  var select = document.getElementById( 'taxonomy-select' );

  if ( ! select) {
    return false;
  }

  var selectInput = document.getElementById( 'taxonomy-select-input' );
  var selectList = document.getElementById( 'taxonomy-select-list' );
  var selectbtn = document.getElementById( 'taxonomy-select-submit' );

  selectbtn.addEventListener( 'click', function(e) {
    e.preventDefault();
    createTaxonomy();
  } );

  selectInput.addEventListener( 'keydown', function(e) {
    if ( 13 === e.keyCode ) {
      e.preventDefault();
      createTaxonomy();
    }
  } );

  function createTaxonomy() {
    var slug = createSlug(selectInput.value);
    var endpoint = TaxonomySelect.baseURL + '/wp-json/wp/v2/categories';

    fetch( endpoint, {
      method: 'POST',
      headers: {
        'X-WP-NONCE': TaxonomySelect.nonce,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: selectInput.value,
        slug: slug
      }),
      credentials: 'same-origin'
    }).then( function(response) {
      if ( response.ok ) {
        return response.json().then( function( json ) {
          addItem( json.id, json.name );
          selectInput.value = '';
        } )
      }
    }).catch(function(e) {
      console.log(e);
    } );
  }

  function createSlug( sliderName ) {
    sliderName = sliderName.replace(/^\s+|\s+$/g, '');
    sliderName = sliderName.toLowerCase();

    sliderName = sliderName.replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');

    return sliderName;
  }

  function addItem(id, name) {
    var option = document.createElement( 'option' );
    option.value = id;
    option.selected = true;
    option.innerHTML = name;
    selectList.appendChild( option );
  }
})()
