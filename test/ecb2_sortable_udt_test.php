/* ecb2_sortable_udt_test
 returns an array of options to display
  in field listsortable: "value=label,value=label,..."
  and in field dropdown_from_udt
 NOTE return of non-scalars from UDT's is a security risk, and may be
  deprecated and then disabled, in future
 UDT stored in ECB2/test/ecb2_sortable_udt_test.php
 - copy into database UDT table as 'ecb2_sortable_udt_test'
*/
return array(
 'option1' => 'Test Option 1',
 'option2' => 'Test 2222222',
 'option3' => 'Test number 3',
 'option4' => 'Test 4444444',
 'option5' => 'Test LAST #5'
);
