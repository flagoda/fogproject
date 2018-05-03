(function($) {
    var deleteSelected = $('#deleteSelected'),
        createnewBtn = $('#createnew'),
        createnewModal = $('#createnewModal'),
        createForm = $('#group-create-form'),
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
            [0, 'asc']
        ],
        columns: [
            {data: 'mainlink'},
            {data: 'members'}
        ],
        rowId: 'id',
        columnDefs: [
            {
                responsivePriority: -1,
                targets: 0,
            },
            {
                responsivePriority: 0,
                targets: 1
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

    // Create new group
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

    Common.registerModal(createnewModal, createFormModalShow, createFormModalHide);

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

    // Delete groups
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