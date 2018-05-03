(function($) {
    var deleteSelected = $('#deleteSelected'),
        createnewBtn = $('#createnew'),
        createnewModal = $('#createnewModal'),
        createForm = $('#snapin-create-form'),
        createnewSendBtn = $('#send');

    function disableButtons(disable) {
        deleteSelected.prop('disabled', disable);
    }
    function onSelect(selected) {
        var disabled = selected.count() == 0;
        disableButtons(disabled);
    }

    disableButtons(true);
    var table = Common.registerTable($('#dataTable'), onSelect, {
        order: [
            [2, 'asc']
        ],
        columns: [
            {data: 'mainlink'},
            {data: 'protected'},
            {data: 'isEnabled'},
            {data: 'packtype'}
        ],
        rowId: 'id',
        columnDefs: [
            {
                responsivePriority: -1,
                targets: 0,
            },
            {
                render: function(data, type, row) {
                    var lock = '<span class="label label-warning"><i class="fa fa-lock fa-1x"></i></span>';
                    var unlock = '<span class="label label-danger"><i class="fa fa-unlock fa-fx"></i></span>';
                    if (row.protected > 0) {
                        return lock;
                    } else {
                        return unlock;
                    }
                },
                targets: 1
            },
            {
                render: function(data, type, row) {
                    var enabled = '<span class="label label-success"><i class="fa fa-check-circle"></i></span>';
                    var disabled = '<span class="label label-danger"><i class="fa fa-times-circle"></i></span>';
                    if (row.isEnabled > 0) {
                        return enabled;
                    } else {
                        return disabled;
                    }
                },
                targets: 2
            },
            {
                responsivePriority: 0,
                render: function(data, type, row) {
                    var enabled = '<span class="label label-success"><i class="fa fa-check-circle"></i></span>';
                    var disabled = '<span class="label label-danger"><i class="fa fa-times-circle"></i></span>';
                    if (data > 0) {
                        return enabled;
                    } else {
                        return disabled;
                    }
                },
                targets: 3
            }
        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: '../management/index.php?node='+Common.node+'&sub=list',
            type: 'post'
        }
    });

    if (Common.search && Common.search.length > 0) {
        table.search(Common.search).draw();
    }

    createFormModalShow = function() {
        createForm[0].reset();
        $(':input:first').trigger('focus');
        $(':input:not(textarea)').on('keypress', function(e) {
            if (e.which == 13) {
                createnewSendBtn.trigger('click');
            }
        });
    };

    createFormModalHide = function() {
        createForm[0].reset();
        $(':input').off('keypress');
    };

    Common.registerModal(createnewModal, createFormModalShow, creaetFormModalHide);
    createnewBtn.on('click', function(e) {
        e.preventDefault();
        createnewModal.modal('show');
    });
    createnewSendBtn.on('click', function(e) {
        e.preventDefault();
        Common.processForm(createForm, function(err) {
            if (err) {
                return;
            }
            table.draw(false);
            createnewModal.modal('hide');
        });
    });

    deleteSelected.on('click', function() {
        disableButtons(true);
        Common.deleteSelected(table, function(err) {
            // if we couldn't delete the items, enable the buttons
            // as the rows still exist and are selected.
            if (err) {
                disableButtons(false);
            }
        });
    });
})(jQuery);