window.MyBootstrapTable = function(id, removeId, options) {
  this.table = $(id);
  this.remove = $(removeId);
  this.options = options;
  this.defaults = {
    height: getHeight(),
    data: [
      {
        "id": 0,
        "name": "Item 0",
        "price": "$0"
      },
      {
        "id": 1,
        "name": "Item 1",
        "price": "$1"
      },
      {
        "id": 2,
        "name": "Item 2",
        "price": "$2"
      },
      {
        "id": 3,
        "name": "Item 3",
        "price": "$3"
      },
      {
        "id": 4,
        "name": "Item 4",
        "price": "$4"
      },
      {
        "id": 5,
        "name": "Item 5",
        "price": "$5"
      },
      {
        "id": 6,
        "name": "Item 6",
        "price": "$6"
      },
      {
        "id": 7,
        "name": "Item 7",
        "price": "$7"
      },
      {
        "id": 8,
        "name": "Item 8",
        "price": "$8"
      },
      {
        "id": 9,
        "name": "Item 9",
        "price": "$9"
      }
    ]
  }
  window.operateEvents = {
    'click .like': function(e, value, row, index) {
      alert('You click like action, row: ' + JSON.stringify(row));
    },
    'click .remove': (e, value, row, index) => {
      this.table.bootstrapTable('remove', {
        field: 'id',
        values: [row.id]
      });
    }
  };
}

MyBootstrapTable.prototype.initTable = function() {
  Object.assign(this.defaults, {
    columns: [
      [
        {
          field: 'state',
          checkbox: true,
          rowspan: 2,
          align: 'center',
          valign: 'middle'
        }, {
          title: 'Item ID',
          field: 'id',
          rowspan: 2,
          align: 'center',
          valign: 'middle',
          sortable: true,
        }, {
          title: 'Item Detail',
          colspan: 3,
          align: 'center'
        }
      ],
      [
        {
          field: 'name',
          title: 'Item Name',
          sortable: true,
          align: 'center'
        }, {
          field: 'price',
          title: 'Item Price',
          sortable: true,
          align: 'center',
        }, {
          field: 'operate',
          title: 'Item Operate',
          align: 'center',
          events: operateEvents,
          formatter: operateFormatter
        }
      ]
    ]
  });
  console.log(this.defaults);
  this.table.bootstrapTable(this.defaults);
  // sometimes footer render error.
  // setTimeout(() => {
  //   this.table.bootstrapTable('resetView');
  // }, 200);
  this.table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table', () => {
      this.remove.prop('disabled', !this.table.bootstrapTable('getSelections').length);
      // save your data, here just save the current page
      selections = this.getIdSelections();
    // push or splice the selections if you want to save all data selections
    });
  this.table.on('expand-row.bs.table', function(e, index, row, $detail) {
    if (index % 2 == 1) {
      $detail.html('Loading from ajax request...');
      $.get('LICENSE', function(res) {
        $detail.html(res.replace(/\n/g, '<br>'));
      });
    }
  });
  this.table.on('all.bs.table', function(e, name, args) {
    console.log(name, args);
  });
  this.remove.click(() => {
    var ids = this.getIdSelections();
    this.table.bootstrapTable('remove', {
      field: 'id',
      values: ids
    });
    this.remove.prop('disabled', true);
  });
  $(window).resize(() => {
    this.table.bootstrapTable('resetView', {
      height: getHeight()
    });
  });
}

MyBootstrapTable.prototype.getIdSelections = function() {
  return $.map(this.table.bootstrapTable('getSelections'), function(row) {
    return row.id
  });
}

MyBootstrapTable.prototype.responseHandler = function(res) {
  $.each(res.rows, function(i, row) {
    row.state = $.inArray(row.id, selections) !== -1;
  });
  return res;
}

MyBootstrapTable.prototype.detailFormatter = function(index, row) {
  var html = [];
  $.each(row, function(key, value) {
    html.push('<p><b>' + key + ':</b> ' + value + '</p>');
  });
  return html.join('');
}

function operateFormatter(value, row, index) {
  return [
    '<a class="like" href="javascript:void(0)" title="Like">',
    '<i class="fa fa-heart-o"></i>',
    '</a>  ',
    '<a class="remove" href="javascript:void(0)" title="Remove">',
    '<i class="glyphicon glyphicon-remove"></i>',
    '</a>'
  ].join('');
}

function getHeight() {
  //return $('#main-content').height() - $('h1').outerHeight(true);
  return 600;
}
