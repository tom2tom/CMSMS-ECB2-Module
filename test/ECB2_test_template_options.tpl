{* ECB2_test_template_options *}
{* either set the var $options & scope=global (important!) *}
{$options=[]}
{$options=[
   'option1' => 'Test Option 1',
   'option2' => 'Test 2222222',
   'option3' => 'Test number 3',
   'option4' => 'Test 4444444',
   'option5' => 'Test LAST #5'] scope=global}
{* OR use the following format to return a comma separated list *}
{*
{foreach $options2 as $opt_value => $opt_text}
{$opt_text}={$opt_value}{if !$opt_text@last},{/if}
{/foreach}
*}