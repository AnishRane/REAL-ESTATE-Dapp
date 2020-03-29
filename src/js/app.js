App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    
    $.getJSON('../items.json', function(data) {
      var propertyRow = $('#propertyRow');
      var propertyTemplate = $('#propertyTemplate');

      for (i = 0; i < data.length; i ++) {
        propertyTemplate.find('.property-name').text(data[i].name);
        propertyTemplate.find('img').attr('src', data[i].picture);
        propertyTemplate.find('.property-lctn').text(data[i].location);
        propertyTemplate.find('.property-price').text(data[i].price);
        
        propertyTemplate.find('.btn-buy').attr('data-id', data[i].id);

        propertyRow.append(propertyTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
    
        await window.ethereum.enable();
      } catch (error) {
        
        console.error("User denied account access")
      }
    }
    
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Buying.json', function(data) {
      
      var BuyingArtifact = data;
      App.contracts.Buying = TruffleContract(BuyingArtifact);
    
      
      App.contracts.Buying.setProvider(App.web3Provider);
    
      
      return App.markSold();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleSale);
  },

  markSold: function(buyers, account) {
    var BuyingInstance;

    App.contracts.Buying.deployed().then(function(instance) {
      BuyingInstance = instance;
    
      return BuyingInstance.getBuyers.call();
    }).then(function(buyers) {
      for (i = 0; i < buyers.length; i++) {
        if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-property').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleSale: function(event) {
    event.preventDefault();

    var itemId = parseInt($(event.target).data('id'));

    var saleInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Buying.deployed().then(function(instance) {
        saleInstance = instance;
    
        
        return saleInstance.buy(itemId, {from: account});
      }).then(function(result) {
        return App.markSold();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
