// ecb2_admin.js - v1.2 - 16Feb19
//
//    - v1.2 - 16Feb19 - ecb_repeater added
//                     - began consolidating all js into this file
//    - v1.1 - 11Jul17 - updated for max_number & required_number & updateECB2Placeholder()
//    - v1.0 - 18Apr17 - initial js file
//
//    enables drag-n-drop selection of list items, requires jquery ui sortable
//
//**************************************************************************************************
$(function() {


   // ecb_file_selector
   $('.ecb_file_selector_select select').change( function() {
      var imgtag = $(this).parent().next();
      imgtag.attr('src', imgtag.data('uploadsurl')+'/'+$(this).val());
   });



   // ecb_multiple_select
   $('.ecb_multiple_select select').change(function() {
      var selectedValues = $(this).val() ? $(this).val().join(',') : '';
      $(this).siblings('.ecb_select_input').val( selectedValues );
      // then update summary text - if it exists
      var $selectSummary = $(this).siblings('.ecb_select_summary');
      if ( $selectSummary.length>0 ) {
         var selectedText = $(this).children('option:selected').map(function() {
               return $(this).text();
            }).get().join(', ');
         $(this).siblings('.ecb_select_summary').val( selectedText );
         var $summaryText = $(this).siblings('.ecb_select_summary').children('.ecb_select_text');
         if ( selectedText=='' ) {
            $selectSummary.children('.ecb_select_text').html( $summaryText.data('empty') );
         } else {
            $selectSummary.children('.ecb_select_text').html( selectedText );
         }
      }
   });

   // ecb_compact - show & hide the full select & update summary text
   $('.ecb_compact .ecb_select_edit').click( function(e) {
      e.preventDefault();
      $(this).closest('.ecb_compact').toggleClass('show');
   });



   // ecb_repeater
   $('.ecb_repeater').on('change', '.repeater-field', function(e) {
      update_repeater( $($(this).data('repeater')) );
   });

   $('.ecb_repeater').on('click', '.ecb2-repeater-add', function(e) {
      e.preventDefault();
      var $fieldWrapper = $(this).closest('.repeater-wrapper');
      $fieldWrapper.clone().insertAfter( $fieldWrapper ).find('.repeater-field').val('');
      update_repeater( $($(this).data('repeater')) );
   });
   $('.ecb_repeater').on('click', '.ecb2-repeater-remove', function(e) {
      e.preventDefault();
      var $fieldWrapper = $(this).closest('.repeater-wrapper'),
          $repeater = $($(this).data('repeater'))
      $fieldWrapper.remove();
      update_repeater( $repeater );
   });



   function update_repeater( $repeater ) {
      var $parent = $( $repeater.data('parent') ),
          $fields = [];
      $repeater.find('.repeater-field').each(function(i){
         $fields.push( $(this).val() );
      })
      $parent.val( $fields.join('||') );
   }



   // sortable lists
   $('ul.sortable-ecb2-list').each(function() {
        var $parent = $(this).closest('.ecb2-cb');
        var $selected = $parent.find('ul.selected-items');
        $(this).sortable({
            connectWith: $selected,
            delay: 150,
            revert: 300,
            placeholder: 'ui-state-highlight',
            items: 'li:not(.no-sort)',
            helper: function(event, ui) {
                if (!ui.hasClass('selected')) {
                    ui.addClass('selected')
                        .siblings()
                        .removeClass('selected');
                }
                var elements = ui.parent()
                    .children('.selected')
                    .clone(),
                    helper = $('<li/>');
                ui.data('multidrag', elements).siblings('.selected').remove();
                return helper.append(elements);
            },
            stop: function(event, ui) {
                var elements = ui.item.data('multidrag');
                var $ulSelected = $(ui.item).parent();
                ui.item.after(elements).remove();
                updateECB2CBInput($ulSelected);
            },
            receive: function(event, ui) {
                var elements = ui.item.data('multidrag');
                if ($(this).data('max-number') && $(this).children().length - 1 > $(this).data('max-number')) {
                    $(ui.sender).sortable('cancel');
                } else {
                    updateECB2Placeholder($(this));
                    $(elements).removeClass('selected ui-state-hover')
                        .find('.sortable-remove').removeClass('hidden');
                }
            }
        });
    });

    // remove from selected list - by dragging back to available
    $('ul.selected-items').each(function() {
        var $parent = $(this).closest('.ecb2-cb');
        var $available = $parent.find('ul.available-items');
        $(this).sortable({
            connectWith: $available,
            delay: 150,
            revert: 300,
            placeholder: 'ui-state-highlight',
            stop: function(event, ui) {
                var $ulSelected = $(ui.item).closest('.ecb2-cb').find('.selected-items');
                $(ui.item).removeClass('selected')
                $(ui.item).children('.sortable-remove').addClass('hidden');
                updateECB2CBInput($ulSelected);
                updateECB2Placeholder($ulSelected);
            }
        });
    });

    // remove from selected list - by clicking remove icon
    $(document).on('click', '#selected-items .sortable-remove', function(e) {
        e.preventDefault();
        var $ulSelected = $(this).closest('ul.selected-items');
        var $ulAvailable = $(this).closest('.ecb2-cb').find('.available-items');
        $(this).addClass('hidden')
            .parent('li').removeClass('no-sort')
            .appendTo($ulAvailable);
        updateECB2CBInput($ulSelected);
        updateECB2Placeholder($ulSelected);
    });

    function updateECB2CBInput($ulSelected) {
        var $allSelected = $ulSelected.children('li:not(.placeholder)');
        var $targetInput = $('#' + $ulSelected.data('cmsms-cb-input'));
        var selectedStr = '';
        var requiredNumber = $ulSelected.data('required-number');
        if (requiredNumber && $allSelected.length != requiredNumber) {
            $targetInput.val(''); // set to empty

        } else {
            $allSelected.each(function() {
                if (selectedStr == '') {
                    selectedStr = $(this).data('cmsms-item-id');
                } else {
                    selectedStr = selectedStr + ',' + $(this).data('cmsms-item-id');
                }
            });
            $targetInput.val(selectedStr);
        }
    }

    function updateECB2Placeholder($ulSelected) {
        var requiredNumber = $ulSelected.data('required-number');
        var numberSelected = $ulSelected.children().length - 1; // exclude placeholder
        if ((!requiredNumber && numberSelected > 0) || (requiredNumber > 0 && numberSelected == requiredNumber)) {
            $ulSelected.children('.placeholder').addClass('hidden');
        } else {
            $ulSelected.children('.placeholder').removeClass('hidden');
        }


    }

});