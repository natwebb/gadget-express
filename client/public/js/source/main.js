(function(){

  'use strict';

  $(document).ready(initialize);

  var allUsers = [];
  var allGadgets = [];

  function initialize(){
    $(document).foundation();
    $('#createGadget').click(createGadget);
    $('#createUser').click(createUser);
    $('#gadgetTable > tbody').on('click', '.buyButton', clickBuyButton);
    $('#gadgetTable > tbody').on('click', '.finalizeButton', clickFinalizeButton);
    displayEverything();
  }

  function displayEverything(){
    $('#userTable > tbody').empty();
    var url = window.location.origin.replace(/(\d){4}/g, '4000') + '/users';
    $.getJSON(url, function(data){
      var users = data.users;
      _.forEach(users, function(user){
        makeUserRow(user);
      });
    });

    $('#gadgetTable > tbody').empty();
    url = window.location.origin.replace(/(\d){4}/g, '4000') + '/gadgets';
    $.getJSON(url, function(data){
      var gadgets = data.gadgets;
      _.forEach(gadgets, function(gadget){
        makeGadgetRow(gadget);
      });
    });
  }

  function createGadget(event){
    var data = $('#gadgetBox').serialize();
    var url = window.location.origin.replace(/(\d){4}/g, '4000') + '/gadgets';
    var type = 'POST';
    var success = makeGadgetRow;

    $.ajax({url:url, data:data, type:type, success:success});

    event.preventDefault();
  }

  function makeGadgetRow(data){
    allGadgets.push(data);

    var $tr = $('<tr>');

    var $id = $('<input>');
    $id.attr('type', 'hidden');
    $id.attr('name', 'id');
    $id.attr('data-id', data._id);

    var $purchase = $('<td>');
    var $buy = $('<button>');
    $buy.text('Purchase');
    $buy.addClass('small');
    $buy.addClass('buyButton');
    $purchase.append($buy);

    var $name = $('<td>');
    $name.text(data.name);

    var $cost = $('<td>');
    $cost.addClass('cost');
    $cost.text(data.cost);

    var $stock = $('<td>');
    $stock.text(data.number);

    var $users = $('<td>');
    $users.addClass('users');

    var $number = $('<td>');
    $number.addClass('numbers');

    var $finalize = $('<td>');
    $finalize.addClass('finalize');

    $tr.append($id, $purchase, $name, $cost, $stock, $users, $number, $finalize);

    $('#gadgetTable > tbody').append($tr);
  }

  function makeUserSelect(){
    var $select = $('<select>');
    _.forEach(allUsers, function(user){
      var $option = $('<option>');
      $option.text(user.name);
      $option.attr('data-id', user._id);
      $select.append($option);
    });
    return $select;
  }

  function makeNumberSelect(id){
    var $select = $('<select>');
    var gadget = _.find(allGadgets, {'_id': id});
    var numbers = _.range(1, (gadget.number + 1));
    _.forEach(numbers, function(number){
      var $option = $('<option>');
      $option.text(number);
      $select.append($option);
    });
    return $select;
  }

  function createUser(event){
    var data = $('#userBox').serialize();
    var url = window.location.origin.replace(/(\d){4}/g, '4000') + '/users';
    var type = 'POST';
    var success = makeUserRow;

    $.ajax({url:url, data:data, type:type, success:success});

    event.preventDefault();
  }

  function makeUserRow(data){
    allUsers.push(data);

    var $id = $('<input>');
    $id.attr('type', 'hidden');
    $id.attr('name', 'id');
    $id.attr('data-id', data._id);

    var $tr = $('<tr>');

    var $name = $('<td>');
    var $balance = $('<td>');
    var $purchases = $('<td>');

    $name.text(data.name);
    $balance.text(data.balance);
    $purchases.text(data.purchases.join(', '));

    $tr.append($id, $name, $balance, $purchases);

    $('#userTable > tbody').append($tr);
  }

  function clickBuyButton(){
    var id = $(this).parent().siblings('input').attr('data-id');

    var $userSelect = makeUserSelect();
    $(this).parent().siblings('.users').append($userSelect);

    var $numberSelect = makeNumberSelect(id);
    $(this).parent().siblings('.numbers').append($numberSelect);

    var $finPurch = $('<button>');
    $finPurch.addClass('finalizeButton');
    $finPurch.text('Finalize Purchase');
    $finPurch.addClass('small');
    $(this).parent().siblings('.finalize').append($finPurch);
  }

  function clickFinalizeButton(){
    var gadgetId = $(this).parent().siblings('input').attr('data-id');
    var gadget = _.find(allGadgets, {'_id':gadgetId});

    var userId = $(this).parent().siblings('.users').find('option').filter(':selected').attr('data-id');
    var user = _.find(allUsers, {'_id':userId});

    var number = $(this).parent().siblings('.numbers').find('select').val();
    var total = (number*gadget.cost);

    if(user.balance<total){alert(user.name + ' cannot afford this!');}
    else{
      var url = window.location.origin.replace(/(\d){4}/g, '4000') + '/purchases';
      var type = 'PUT';
      var success = updateAfterPurchase;
      var data = {gadget:gadget, user:user, number:number};

      $.ajax({url:url, data:data, type:type, success:success});
    }
  }

  function updateAfterPurchase(data){
    var oldGadget = _.find(allGadgets, {'_id': data.gadgetId});
    var oldUser = _.find(allUsers, {'_id': data.userId});

    oldGadget.number = data.gadget.number;
    oldUser.balance = data.user.balance;
    oldUser.purchases = data.user.purchases;

    $($('#userTable').find('[data-id="'+data.userId+'"]').siblings('td:nth-child(3)')[0]).text(data.user.balance);
    $($('#userTable').find('[data-id="'+data.userId+'"]').siblings('td:nth-child(4)')[0]).text(data.user.purchases.join(', '));

    if(data.gadget.number>0){
      $($('#gadgetTable').find('[data-id="'+data.gadgetId+'"]').siblings('td:nth-child(5)')[0]).text(data.gadget.number);
    }
    else{
      var url = window.location.origin.replace(/(\d){4}/g, '4000') + '/gadgets';
      var type = 'DELETE';
      var success = removeGadget;
      var removeData = {id:data.gadgetId};

      $.ajax({url:url, data:removeData, type:type, success:success});
    }

    for(var i=6;i<=8;i++){
      $('#gadgetTable').find('td:nth-child('+i+')').empty();
    }

  }

  function removeGadget(data){
    $('#gadgetTable').find('[data-id="'+data.gadgetId+'"]').parent().remove();
  }

})();

