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
*}

{cgjs_require lib='jquery'}
{cgjs_require jsfile='assets/js/bootstrap.bundle.min.js'}
{cgjs_require jsfile='assets/js/slick.min.js'}
{cgjs_require jsfile='assets/js/main.js'}

<!DOCTYPE html>
<html lang="en">
<head>
   {cms_stylesheet}
   <style>{literal}.pre {font-family:monospace; white-space:pre-wrap; word-wrap:break-word;
      background-color:#DDD; padding:1em;}{/literal}</style>
</head>

<body class="page-{$page_alias}">

{*global_content name='header'*}

<div class="main">
   <div class="container">
      <div class="row">
         <div class="col-12">

<h1>ECB2 Test Page 1</h1>
{content oneline=1}

<h2>file_selector 1</h2>
<p>selected file:'{content_module module="ECB2" field="file_selector" block="test1" label="Test 1: file_selector" dir="images" filetypes="gif,png,jpg" excludeprefix="thumb_" description="file_selector: Test description (optional) can be shown here"}'<p>

<h2>file_selector 1A - recurse</h2>
<p>selected file:'{content_module module="ECB2" field="file_selector" block="test1a" label="Test 1A: file_selector - recursive" dir="images" filetypes="gif,png,jpg" excludeprefix="thumb_" recurse=1 description="file_selector: Test description (optional) can be shown here"}'<p>

<h2>file_selector 1B - image preview</h2>
<p>selected file:'{content_module module="ECB2" field="file_selector" block="test1b" label="Test 1B: file_selector - image preview (no description)" dir="images" filetypes="gif,png,jpg" excludeprefix="thumb_" preview=1}'<p>

<h2>color_picker</h2>
{content_module module="ECB2" field="color_picker" block="test2" label="Test 2: color_picker" default_value="#CCCCCC" assign=test2 description="Test description - short"}
<p style="color:#FFF; background-color:{$test2};">colour:'{$test2}'</p>

<h2>color_picker #2A</h2>
{content_module module="ECB2" field="color_picker" block="test2_2A" label="Test 2-2A: color_picker" default_value="#5c51a5" assign=test2_2A description="Test description - short - 5c51a5"}
<p style="color:#FFF; background-color:{$test2_2A};">colour:'{$test2_2A}'</p>

<h2>color_picker #2c</h2>
{content_module module="ECB2" field="color_picker" block="test2_2c" label="Test 2-2c: color_picker default RED" default_value="#FF0000" assign=test2_2c}
<p style="color:#FFF; background-color:{$test2_2c};">colour:'{$test2_2c}'</p>

<h2>color_picker - promo_bgcolor</h2>
{$promo_bgcolor="{content_module module='ECB2' field='color_picker' block='promo_bgcolor' label='Background Color' default_value='transparent'}" scope=global}
<p style="color:#FFF; background-color:{$promo_bgcolor};">colour:'{$promo_bgcolor}'</p>

<h2>Test 3: dropdown</h2>
<p>{content_module module="ECB2" field="dropdown" block="test3" label="Test 3: dropdown" values="Apple=apple,Orange=orange" first_value="select fruit" description="Test description (optional) can be shown here"}</p>

<h2>Test 3A: dropdown - multiple</h2>
<p>{content_module module="ECB2" field="dropdown" block="test3A" label="Test 3A: dropdown - multiple" values="Apple=apple,Orange=orange,Banana,Pineapple,Test number 5,Test 6,Test7,Test8,test9,test10,test11" multiple=1 description="Test description (optional) can be shown here"}</p>

<h2>Test 3B: dropdown - multiple & compact</h2>
<p>{content_module module="ECB2" field="dropdown" block="test3B" label="Test 3B: compact dropdown - multiple" values="Apple=apple,Orange=orange,Banana,Pineapple,Test number 5,Test 6,Test7,Test8,test9,test10,test11" multiple=1 compact=1 description="Test description (optional) can be shown here"}</p>

<h2>Test4: dropdown_from_udt</h2>
<p>Section 1 Layout Style:'{content_module module='ECB2' field='dropdown_from_udt' block='test4' label='Test 4: dropdown_from_udt' udt='ecb2_sortable_udt_test' description="Test description (optional) can be shown here"}'</p>

<p>Section 1 Layout Style (with first_value):'{content_module module='ECB2' field='dropdown_from_udt' block='test4a' label='Test 4a: dropdown_from_udt (with first_value)' udt='ecb2_sortable_udt_test' first_value="=select=" multiple=1 description="Test description (optional) can be shown here"}'</p>

<p>Section 1 Layout Style - compact:'{content_module module='ECB2' field='dropdown_from_udt' block='test4b' label='Test 4b: dropdown_from_udt - compact' udt='ecb2_sortable_udt_test' multiple=1 compact=1 description="Test description (optional) can be shown here"}'</p>

<h2>checkbox</h2>
<p>{content_module module="ECB2" field="checkbox" block="test5a" label="Test 5: Checkbox - no default" default_value="0" description="Test description (optional) can be shown here"}</p>
<p>{content_module module="ECB2" field="checkbox" block="test5b" label="Test 5b: Checkbox - default NOT Checked" default_value="0"}</p>
<p>{content_module module="ECB2" field="checkbox" block="test5c" label="Test 5c: Checkbox - default Checked" default_value="1"}</p>

<h2>module_link</h2>
<p>{content_module module="ECB2" field="module_link" label="Test 6: module_link:Gallery" block="test6" mod="Gallery" text="Edit Galleries" description="Test description (optional) can be shown here"}</p>

<h2>link</h2>
<p>{content_module module="ECB2" field="link" label="Test 7: link" block="test7" target="_blank" link="http://www.bing.com" text="bing search" description="Test description (optional) can be shown here"}</p>

<h2>timepicker</h2>
<p>{content_module module="ECB2" field="timepicker" label="Test 8: timepicker" block="test8" description="Test description (optional) can be shown here"}</p>

<h2>datepicker</h2>
<p>{content_module module="ECB2" field="datepicker" label="Test 9: datepicker" block="test9" description="Test description (optional) can be shown here"}</p>

<h2>Test 10: input</h2>
<p>{content_module module="ECB2" field="input" label="Test 10: input" block="test10" size=55 max_length=55 default_value="fill it" description="Test description (optional) can be shown here"}</p>

<h2>Test 10A: input no default value</h2>
<p>{content_module module="ECB2" field="input" label="Test 10: input" block="test10A" size=55 max_length=55 description="Test description (optional) can be shown here"}</p>

<h2>Test 11: textarea</h2>
<p>{content_module module="ECB2" field="textarea" label="Test 11: textarea" block="test11" rows=10 cols=40 default_value="fill it" description="Test description (optional) can be shown here"}</p>

<h2>editor</h2>
<p>{content_module module="ECB2" field="editor" label="Test 12: editor" block="test12" rows=10 cols=40 default_value="fill it" description="Test description (optional) can be shown here"}</p>

<h2>Test 13: text</h2>
{content_module module="ECB2" field="text" label="Test 13: text" block="test13" text="Hello word!" description="Test description (optional) can be shown here"}

<h2>pages</h2>
<p>{content_module module="ECB2" field="pages" label="Test 14: pages" block="test14" description="Test description (optional) can be shown here"}</p>

<h2>hr</h2>
<p>{content_module module="ECB2" field="hr" label="Test 15: hr" block="test15" description="Test description (optional) can be shown here"}</p>

<h2>sortablelist</h2>
{content_module module='ECB2' field='sortablelist' block='test16' udt='ecb2_sortable_udt_test' label='test16:sortablelist' label_left='Selected Widgets' label_right='Available Widgets' description="Test description (optional) can be shown here, using 'udt' option"}

<h2>sortablelist 2</h2>
{content_module module='ECB2' field='sortablelist' block='test16a' values='apple=Apple,orange=Orange,green=Green,value=Label' label='test16a:sortablelist' description="Test using default labels, 2nd sortable - so should be no lib output, uses values (not udt)"}

<h2>radio</h2>
{content_module module="ECB2" field="radio" block="test17a" label="Test 17"  values="Apple=apple,Orange=orange,Kiwifruit=kiwifruit" default_value='Orange' description="Test description (optional) can be shown here"}

<h2>input</h2>
<p>{content_module module="ECB2" field="input" label="Test 17b: no description" block="test17b" size=55 max_length=55 default_value="check for no description on this field"}</p>

<h2>hidden</h2>
<p>{content_module module='ECB2' field='hidden' block='test18' assign='test18hidden' label='hidden' description='Hidden: would not normally use a description field!' value="markervalue"}</p>

<h2>Test 19: gallery_picker</h2>
<p>{content_module module='ECB2' field='gallery_picker' block='test19' dir='on-page-galleries' assign='test19' label='Test 19: gallery_picker' description="Test description (optional) can be shown here"}</p>
{if !empty($test19)}
<div class="col-4">
   A functioning gallery should be shown below:<br>
   {Gallery dir=$test19}
</div>
{/if}<br>

<h2>Test 20: get_dropdown_from_customgs</h2>
<p>{content_module module='ECB2' field='dropdown_from_customgs' customgs_field='Section Styles' block='test20' assign='test20' label='Test 20: dropdown_from_customgs' description="Test description (optional) can be shown here"}</p>
<div>selected: '{$test20}'</div>

<h2>Test 20A: get_dropdown_from_customgs - Compact display of selection</h2>
<p>Multiple Select with compact display of options & edit</p>
<p>{content_module module='ECB2' field='dropdown_from_customgs' customgs_field='Section Styles' dir='on-page-galleries' block='test20A' assign='test20A' label='Test 20A: dropdown_from_customgs' compact=1 description='Multiple Select with compact display of options & edit' multiple=1 size=0}</p>
<div>selected: '{$test20A}'</div>

<h2>Test 21: Test for error - field not specified or not correctly named</h2>
<p>{content_module module='ECB2' block='test21' assign='test21' label='Test 21: Test for error - field not specified or not correctly named'}</p>
<div>selected: '{$test21}'</div>

<h2>Test 22: input_repeater</h2>
<p>{$input_repeater_test="||"|explode:"{content_module module='ECB2' field='input_repeater' label='Test 22: input_repeater' block='test22' size=100 max_length=255 default_value='fill it' description='Press (+) and (-) to add and remove additional input fields'}" scope=global}</p>
<div class="pre">$input_repeater_test:{$input_repeater_test|print_r}</div>

<br><br><p>That's it. All Tests done :)</p>


         </div>
      </div>
   </div>
</div><!-- main-->


{*global_content name='footer'*}

{cgjs_render addkey='19Oct18'}

</body>
</html>
