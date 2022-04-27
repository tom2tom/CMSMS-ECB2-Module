{* ECB2_Test_Template - v1.8
 - v1.8 - 20Apr22 - omit header, footer gcb's
 - v1.7 - 30May20 - extra tests for dropdown & dropdown_from_udt
 - v1.6 - 20Dec19 - extra file_selector tests
 - v1.5 - 16Feb19 - added inputer_repeater
 - v1.4 - 04Feb19 - updated for BS4 and latest templates
 - v1.3 - 18Apr17

 Template stored in ECB2/templates/ECB2_Test_Template.tpl
  - create a simple core:page template 'ECB2_Test' with just 1 line:
   {include file='module_file_tpl:ECB2;ECB2_Test_Template.tpl'}
  - create 'ECB2 Test' page, using that template.
  OR
  - create a new page
  - add the contents of the <body/> element below into the main
     content-block of that page
*}
<!DOCTYPE html>
<html lang="en">
<head>
   {cms_stylesheet}
   <style>{literal}.pre {font-family:monospace; white-space:pre-wrap; word-wrap:break-word;
      background-color:#DDD; padding:1em;}{/literal}</style>
   {cms_jquery}
</head>

<body class="page-{$page_alias}">

<div class="main">
   <div class="container">
      <div class="row">
         <div class="col-12">

<h1>ECB2 Test Page 1</h1>
{content oneline=1}

<h2>1. file_selector</h2>
<p>selected file:'{content_module module=ECB2 field=file_selector block=test1 label="Test 1: file_selector" dir="images" filetypes="gif,png,jpg" excludeprefix="thumb_" description="file_selector: Test description (optional)"}'</p>

<h2>2. file_selector - recurse</h2>
<p>selected file:'{content_module module=ECB2 field=file_selector block=test2 label="Test 2: file_selector - recursive" dir="images" filetypes="gif,png,jpg" excludeprefix="thumb_" recurse=1 description="file_selector: Test description (optional)"}'</p>

<h2>3. file_selector - image preview</h2>
<p>selected file:'{content_module module=ECB2 field=file_selector block=test3 label="Test 3: file_selector - image preview (no description)" dir="images" filetypes="gif,png,jpg" excludeprefix="thumb_" preview=1}'</p>

<h2>4A. color_picker</h2>
{content_module module=ECB2 field=color_picker block=test4a label="Test 4A: color_picker" assign=assn4a description="Test description - no value"}
<p style="color:#FFF; background-color:{$assn4a};">colour: '{$assn4a}'</p>

<h2>4B. color_picker #2</h2>
{content_module module=ECB2 field=color_picker block=test4b label="Test 4B: color_picker" default_value="#CCC" assign=assn4b description="Test description - short"}
<p style="color:#FFF; background-color:{$assn4b};">colour: '{$assn4b}'</p>

<h2>4C. color_picker #3</h2>
{content_module module=ECB2 field=color_picker block=test4c label="Test 4C: color_picker" default_value="#5c51a5" assign=assn4c description="Test description - hex"}
<p style="color:#FFF; background-color:{$assn4c};">colour: '{$assn4c}'</p>

<h2>4D. color_picker #5</h2>
{content_module module=ECB2 field=color_picker block=test4d label="Test 4D: color_picker" default_value="red" assign=assn4d description="Test description - named"}
<p style="color:#FFF; background-color:{$assn4d};">colour: '{$assn4d}'</p>

<h2>4E. color_picker #5 smarty assignment</h2>
{$promo_bgcolor="{content_module module=ECB2 field=color_picker block=test4e label='Background Color' default_value='transparent'}" scope=global}
<p style="color:#FFF; background-color:{$promo_bgcolor};">colour: '{$promo_bgcolor}'</p>

<h2>5A. dropdown</h2>
<p>{content_module module=ECB2 field=dropdown block=test5a label="Test 5A: dropdown" values="Apple=apple,Orange=orange" first_value="select fruit" description="Test description (optional)"}</p>

<h2>5B. dropdown - multiple</h2>
<p>{content_module module=ECB2 field=dropdown block=test5b label="Test 5B: dropdown - multiple" values="Apple=apple,Orange=orange,Banana,Pineapple,Test number 5,Test 6,Test7,Test8,test9,test10,test11" multiple=1 description="Test description (optional)"}</p>

<h2>5C. dropdown - multiple &amp; compact</h2>
<p>{content_module module=ECB2 field=dropdown block=test5c label="Test 5C: compact dropdown - multiple" values="Apple=apple,Orange=orange,Banana,Pineapple,Test number 5,Test 6,Test7,Test8,test9,test10,test11" multiple=1 compact=1 description="Test description (optional)"}</p>

<h2>7. gallery_picker</h2>
<p>{content_module module=ECB2 field=gallery_picker block=test7 dir='on-page-galleries' assign=assn7 label='Test 7: gallery_picker' description="Test description (optional)"}</p>
{if !empty($assn7)}
<div class="col-4">
   A functioning gallery should be shown below:<br>
   {*TODO prevent crash if $assn7 is error message i.e. module N/A Gallery dir=$assn7*}
</div>
{/if}<br>

<h2>8. get_module</h2>
<p>{content_module module=ECB2 field=module block=test8 assign=assn8 label='Test 8: module selector' description="Test description (optional)"}</p>

<h2>9. get_dropdown_from_customgs</h2>
<p>{content_module module=ECB2 field=dropdown_from_customgs customgs_field='Section Styles' block=test9 assign=assn9 label='Test 9: dropdown_from_customgs' description="Test description (optional)"}</p>
<div>selected: '{$assn9}'</div>

<h2>10. get_dropdown_from_customgs - Compact display</h2>
<p>Multiple select with compact display of options & edit</p>
<p>{content_module module=ECB2 field=dropdown_from_customgs customgs_field='Section Styles' dir='on-page-galleries' block=test10 assign=assn10 label='Test 10: dropdown_from_customgs' compact=1 description='Multiple Select with compact display of options & edit' multiple=1 size=0}</p>
<div>selected: '{$assn10}'</div>

<h2>11. dropdown_from_udt</h2>
<p>(i) Style default:'{content_module module=ECB2 field=dropdown_from_udt block=test11a label='Test 11A: dropdown_from_udt' udt='ecb2_sortable_udt_test' description="Test description (optional)"}'</p>
<p>(ii) Style with first_value:'{content_module module=ECB2 field=dropdown_from_udt block=test11b label='Test 11B: dropdown_from_udt (with first_value)' udt='ecb2_sortable_udt_test' first_value="=select=" multiple=1 description="Test description (optional)"}'</p>
<p>(iii) Style compact:'{content_module module=ECB2 field=dropdown_from_udt block=test11c label='Test 11C: dropdown_from_udt - compact' udt='ecb2_sortable_udt_test' multiple=1 compact=1 description="Test description (optional)"}'</p>

<h2>12. checkbox</h2>
<p>{content_module module=ECB2 field=checkbox block=test12a label="Test 12A: checkbox - no choice" default_value="1" description="Test description (optional)"}</p>
<p>{content_module module=ECB2 field=checkbox block=test12b label="Test 12B: checkbox - not checked" value="0" default_value="1"}</p>
<p>{content_module module=ECB2 field=checkbox block=test12c label="Test 12C: checkbox - checked" value="1" default_value="1"}</p>

<h2>13. radio</h2>
<p>{content_module module=ECB2 field=radio block=test13a label="Test 13A: radio - no choice" values="Apple=apple,Orange=orange,Kiwifruit=kiwifruit" description="Test description (optional)"}</p>
<p>{content_module module=ECB2 field=radio block=test13b label="Test 13B: radio" values="Apple=apple,Orange=orange,Kiwifruit=kiwifruit" default_value='Orange' description="Test description (optional)"}</p>

<h2>14. module_link</h2>
<p>{content_module module=ECB2 field=module_link label="Test 14: module_link:Gallery" block=test14 mod="Gallery" text="Edit Galleries" description="Test description (optional)"}</p>

<h2>15. link</h2>
<p>{content_module module=ECB2 field=link label="Test 15: link" block=test15 target="_blank" link="http://www.bing.com" text="bing search" description="Test description (optional)"}</p>

<h2>16. timepicker</h2>
<p>{content_module module=ECB2 field=timepicker label="Test 16: timepicker" block=test16 description="Test description (optional)"}</p>

<h2>17. datepicker</h2>
<p>{content_module module=ECB2 field=datepicker label="Test 17: datepicker" block=test17 description="Test description (optional)"}</p>

<h2>18. input</h2>
<p>{content_module module=ECB2 field=input label="Test 18: input" block=test18 size=55 max_length=55 default_value="fill it" description="Test description (optional)"}</p>

<h2>19. input without default value</h2>
<p>{content_module module=ECB2 field=input label="Test 19: input without default" block=test19 size=55 max_length=55 description="Test description (optional)"}</p>

<h2>20. textarea</h2>
<p>{content_module module=ECB2 field=textarea label="Test 20: textarea" block=test20 rows=10 cols=40 default_value="fill it" description="Test description (optional)"}</p>

<h2>21. editor</h2>
<p>{content_module module=ECB2 field=editor label="Test 21: html editor" block=test21 rows=10 cols=40 default_value="fill it" description="Test description (optional)"}</p>

<h2>22. text</h2>
{content_module module=ECB2 field=text label="Test 22: specified text" block=test22 text="Hello word!" description="Test description (optional)"}

<h2>23. pages</h2>
<p>{content_module module=ECB2 field=pages label="Test 23: pages" block=test23 description="Test description (optional)"}</p>

<h2>24. hr</h2>
<p>{content_module module=ECB2 field=hr label="Test 24: hr" block=test24 description="Test description (optional)"}</p>

<h2>25. sortablelist</h2>
{content_module module=ECB2 field=sortablelist block=test25 udt='ecb2_sortable_udt_test' label='Test25: sortablelist' label_left='Selected Widgets' label_right='Available Widgets' description="Test description (optional), using 'udt' option"}

<h2>26. sortablelist 2</h2>
{content_module module=ECB2 field=sortablelist block=test26 values='apple=Apple,orange=Orange,green=Green,value=Label' label='Test26: sortablelist' description="Test using default labels, 2nd sortable - so should be no lib output, uses values (not udt)"}

<h2>27. input without description</h2>
<p>{content_module module=ECB2 field=input label="Test 27: no description" block=test27 size=55 max_length=55 default_value="check for no description on this field"}</p>

<h2>28. hidden input</h2>
<p>{content_module module=ECB2 field=hidden block=test28 label='Test 28: hidden input' description='Hidden: would not normally use a description field!' value="markervalue"}</p>

<h2>29. input_repeater</h2>
<p>{$input_repeater_test="||"|explode:"{content_module module=ECB2 field=input_repeater label='Test 29: input_repeater' block=test29 size=100 max_length=255 default_value='fill it' description='Click (+) or (-) to add or remove field'}" scope=global}</p>
<div class="pre">$input_repeater_test:{$input_repeater_test|print_r}</div>

<h2>30. error - invalid field</h2>
<p>{content_module module=ECB2 block=test30a assign=assn30a label='Test 30A: error - field not specified'}</p>
<div>selected: '{$assn30a}'</div>
<p>{content_module module=ECB2 block=test30b field=woowoo assign=assn30b label='Test 30B: error - field misnamed'}</p>
<div>selected: '{$assn30b}'</div>

<br><br><p>All tests done :)</p>

         </div>
      </div>
   </div>
</div><!-- main-->

</body>
</html>
