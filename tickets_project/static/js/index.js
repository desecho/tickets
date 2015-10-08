function get_ticket_list() {
  $.getJSON(url_ajax_get_ticket_list,
    function(data) {
      $('#results').html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="results_table"></table>');
      $('#results_table').dataTable( {
        "aaData": data.data,
        "aaSorting": [[0,'desc']],
        "iDisplayLength": 100,
        "aoColumns": [
          { "sTitle": "Id" },
          { "sTitle": "Ticket<br>type" },
          { "sTitle": "Team" },
          { "sTitle": "Subscriber<br>type" },
          { "sTitle": "Contract #" },
          { "sTitle": "Name" },
          { "sTitle": "Address" },
          { "sTitle": "Duration" },
          { "sTitle": "Date/Time" },
          { "sTitle": "Action" },
        ],
      });
    }
  ).error(function() {
    displayMessage('Error displaying tickets', true);
  });
}

function applyFilter(filter, update) {
  $.post(url_ajax_apply_filter, {'filter': JSON.stringify(filter)},
    function(data) {
      if (update) {
          get_ticket_list();
      }
    }
  ).error(function() {
    displayMessage('Error applying filter.', true);
  });
}

function resetFilters() {
  function removeFilterIfExists(element) {
    if ($(element).val() != '') {
      $(element).val('');
      //applyFilterGeneral(element);
    }
  }
  $('.filter').each(function() {
    removeFilterIfExists(this);
  });
  $("#date_from").datepicker("option", "maxDate", null);
  $("#date_to").datepicker("option", "minDate", null);
  applyFilter({'clear': true}, true);
}

function applyDateRangeFilter(update) {
  update = typeof update !== 'undefined' ? update : false;
  from = $("#date_from").val();
  to = $("#date_to").val();
  from_bool = Boolean(from);
  to_bool = Boolean(to);
  if (from_bool && to_bool) {
    applyFilter({'date_range': JSON.stringify({'from': from, 'to': to})}, update);
  }
  if (!from_bool && !to_bool) {
    applyFilter({'date_range': null}, update);
  }
}

function applyFilterGeneral(element, update) {
  update = typeof update !== 'undefined' ? update : false;
  date_range_filters = ["date_from", "date_to"];
  if ($.inArray($(element).attr('id'), date_range_filters) == -1){
    filter = {};
    filter[$(element).attr('name')] = $(element).val();
    applyFilter(filter, update);
  } else {
    applyDateRangeFilter(update);
  }
}

function createReport() {
  team_id = $('#team').val();
  if (team_id) {
    window.open(url_create_report + team_id);
  } else {
    displayMessage('Choose a team');
  }
}

$(function() {
  $(document).ajaxStart(function(){
    $("#results").html('<div class="loading"></div>');
  });
  get_ticket_list();
  $('#date').datepicker();
  $("#date_from").datepicker({
    onSelect: function( selectedDate ) {
      $("#date_to").datepicker("option", "minDate", selectedDate);
      applyDateRangeFilter(true);
    }
  });
  $("#date_to").datepicker({
    onSelect: function( selectedDate ) {
      $("#date_from").datepicker("option", "maxDate", selectedDate);
      applyDateRangeFilter(true);
    }
  });
  $('.filter').each(function() {
    $(this).change(function(){
      applyFilterGeneral(this, true);
     });
  });
});