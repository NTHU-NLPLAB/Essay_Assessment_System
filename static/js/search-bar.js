const SearchBar = {

    init: function() {
      let brandIcon = $('.linggle.navbar .navbar-brand');
      let searchBar = $('.linggle #search-bar');
      let searchBarBtn = $('#search-bar-btn');
  
      // Register events
      brandIcon.click(this.handleOnClickBrandIcon);
      searchBar.focus(this.handleOnFocus);
      searchBar.blur(this.handleOnBlur);
      searchBar.on('input', this.query);
      searchBarBtn.click(this.handleOnClickSearchBarBtn);
  
      $('form:has(#search-bar)').submit(function(e) {
        SearchBar.query();
        // return false to prevent default and stop propagation
        return false;
      });
    },
  
    handleOnFocus: function(e) {
      let landingPage = $('.linggle.landing');
      let searchResultPage = $('.linggle.search-result');
  
      // toggle visibility
      landingPage.hide();
      searchResultPage.fadeIn(200);
    },
  
    handleOnBlur: function(e) {
      let landingPage = $('.linggle.landing');
      let searchResultPage = $('.linggle.search-result');
      let searchBar = $('.linggle #search-bar');
  
      // no input text
      if(!searchBar.val().trim()) {
        // toggle visibility
        landingPage.fadeIn(200);
        searchResultPage.hide();
      }
    },
  
    handleOnClickBrandIcon: function(e) {
      let searchBar = $('.linggle #search-bar');
      let landingPage = $('.linggle.landing');
      let searchResultPage = $('.linggle.search-result');
  
      // clear input text
      searchBar.val('');
      // clear search results
      SearchResult.clear();
      // toggle visibility
      landingPage.fadeIn(200);
      searchResultPage.hide();
    },
  
    handleOnClickSearchBarBtn: function(e) {
      SearchBar.query();
    },
  
    query: function() {
      let searchBar = $('#search-bar');
      let query = searchBar.val();
      //console.log(query)
  
      if (query) {
        SearchResult.query(query);
      }
    }
  };
  