$(function() {
  var ns = window.SOKENBICHA;
  var api = ns.api;
  var modal = ns.modal;

  $('.js-cancel').on('click', onCancelClick);
  return;


  function onCancelClick(e) {
    e.preventDefault();

    api.cancelSns().done(function(result) {
      if ( !result || result.isError ) {
        modal.open(modal.type.ERROR);
        return;
      }

      modal.open(modal.type.CANCEL_SNS);
      modal.on('close', function() {
        location.reload();
      });
    });
  }
});
