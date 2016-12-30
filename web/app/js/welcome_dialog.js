$("#dialogChooseLang").attr('title', _('Welcome to QP'));
$("#dialogChooseLang p").text(_('Please select language'));

$( function() {
    $( "#dialogChooseLang" ).dialog({
        dialogClass: "no-close",
        position: { my: "center top", at: "center bottom", of: $("nav") },
        modal: true
    });
} );

$("#dialogChooseLang a").on({
    click: function(){
        $.ajax({
            url: "?ajax=saveLang&lang="+this.name+"&uid=" + TheUser.id + "&secure=" + TheUser.secure,
            success: function() {
                location.reload();
            },
            error: function(xhr,status,error){
                alert(_('Oops! Error: %1, %2', error, status));
            }
        });
        $( "#dialogChooseLang" ).dialog('close');
    }
})
