// jQuery validator extention, check the tree nodes contain the control value.
$.validator.addMethod('tree', function (value, element, params) {
    var node_id = parseInt(value, 10);
    if (isNaN(node_id)) {
        return false;
    }
    return EDEN_TREE.Contain(parseInt(params.treeid, 10), node_id);
});

$.validator.unobtrusive.adapters.add("tree", ['treeid'], function (options) {
    options.rules['tree'] = {
        treeid: options.params.treeid
    };
    options.messages["tree"] = options.message;
});

// jQuery Validation default does not check hidden input elements.
$.validator.setDefaults({
    onkeyup: false,
    onblur: true,
    focusCleanup: true,
    ignore: ".js-ignore-validate"
});


$(function () {
    // Patch for jQuery Validation
    // jQuery unobtrusive validation does not accept hyphen for date formatting in safari/IE10.
    $.validator.methods.date = function (value, element) {
        var s = value.replace(/\-/g, '/');
        return this.optional(element) || !/Invalid|NaN/.test(new Date(s));
    };
});


