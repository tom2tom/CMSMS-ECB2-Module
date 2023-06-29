{* ECB2_Test_Template - v1.6+ - 20Dec19

   - v1.7 - 30May20 - extra tests for dropdown & dropdown_from_udt
   - v1.6 - 20Dec19 - extra file_selector tests
   - v1.5 - 16Feb19 - added inputer_repeater
   - v1.4 - 04Feb19 - updated for BS4 and latest templates
   - v1.3 - 18Apr17

   Template stored in ECB2/templates/ECB2_Test_Template.tpl
      - create a very simple core:page template 'ECB2_Test' with just the 1 line:
            {include file='module_file_tpl:ECB2;ECB2_Test_Template.tpl'}
      - create 'ECB2 Test' page, using the above template.

********************************************************************************************}{strip}
{process_pagedata}

{cgjs_require lib='jquery'}
{cgjs_require jsfile='assets/js/bootstrap.bundle.min.js'}
{cgjs_require jsfile='assets/js/slick.min.js'}
{cgjs_require jsfile='assets/js/main.js'}


{/strip}<!DOCTYPE html>
<html lang="en">
<head>
   {cms_stylesheet}
   <style>{literal}.pre {font-family:monospace; white-space:pre-wrap; word-wrap:break-word;
      background-color:#DDD; padding:1em;}{/literal}</style>
</head>

<body class="page-{$page_alias}">

<div class="main">
   <div class="container">
      <div class="row">
         <div class="col-12">

<h1>ECB2 Test Page 1</h1>
{content oneline=1}



<h2>1: textinput</h2>
<p>{ECB2 field=textinput label="1: textinput" block="test1" size=30 max_length=101 default_value="fill it" description="Test description (optional) can be shown here"}</p>

<h2>1a: input no default value</h2>
<p>{ECB2 field="input" label="1a: input" block="test1a" size=100 max_length=101 description="Test description (optional) can be shown here"}</p>



<h2>2: textarea</h2>
<p>{ECB2 field="textarea" label="2: textarea" block="test2" wysiwyg=1 rows=10 cols=40 default_value="fill it" description="Test description (optional) can be shown here"}</p>

<h2>2a: textarea as 'editor'</h2>
<p>{ECB2 field="editor" label="2a: editor" block="test2a" rows=10 cols=40 default_value="fill it" description="Test description (optional) can be shown here"}</p>



<h2>3: dropdown</h2>
<p>{ECB2 field="dropdown" block="test3" label="3: dropdown" values="Apple=apple,Orange=orange" first_value="select fruit" description="Test description (optional) can be shown here" default_value=orange}</p>


<h2>3a: dropdown - multiple</h2>
<p>{ECB2 field="dropdown" block="test3a" label="3a: dropdown - multiple" values="Apple=apple,Orange=orange,Banana,Pineapple,Test number 5,Test 6,Test7,Test8,test9,test10,test11" multiple=1 description="Test description (optional) can be shown here" size=10}</p>

<h2>3b: dropdown - multiple & compact</h2>
<p>{ECB2 field="dropdown" block="test3b" label="3b: compact dropdown - multiple" values="Apple=apple,Orange=orange,Banana,Pineapple,Test number 5,Test 6,Test7,Test8,test9,test10,test11" multiple=1 compact=1 description="Test description (optional) can be shown here"}</p>


<h2>3c: dropdown - using dropdown from module</h2>
<p>{$tempVals="Apple=apple,Orange=orange,Banana,Pineapple,Test number 5,Test 6,Test7,Test8,test9,test10,test11"}{ECB2 field="dropdown" block=test3c label="3c: dropdown - from module" mod="LISEProjects" template_summary="item_dropdown" description="Test description (optional) can be shown here" pagelimit=20}</p>

<h2>3d: dropdown - using dropdown from module - with flip_values</h2>
<p>{$tempVals="Apple=apple,Orange=orange,Banana,Pineapple,Test number 5,Test 6,Test7,Test8,test9,test10,test11"}{ECB2 field="dropdown_from_module" block="test3d" label="3d: dropdown - from module - with flip_values" mod="LISEProjects" template_summary="item_dropdown" description="Test description (optional) can be shown here" pagelimit=20 flip_values=1}</p>

<h2>3e: dropdown from udt</h2>
<p>Section 1 Layout Style:'{content_module module='ECB2' field='dropdown_from_udt' block='test3e' label='3e: dropdown from udt' udt='ecb2_test_udt_options' description="Test description (optional) can be shown here"}'</p>


<h2>3f: dropdown from template</h2>
<p>Section 1 Layout Style:'{ECB2 field=dropdown block='test3f' label='3f: dropdown from template' template=ECB2_test_template_options description="Test description (optional) can be shown here"}'</p>


<h2>3g: dropdown from customgs</h2>
<p>Section 1 Layout Style:'{ECB2 field=dropdown block='test3g' label='3g: dropdown from customgs' customgs_field='Section Styles' description="Test description (optional) can be shown here"}'</p>




<h2>4: sortablelist - using values</h2>
{ECB2 field=sortablelist block=test4 values='apple=Apple,orange=Orange,green=Green,value=Label' label='4: sortablelist' description="sortablelist - using values"}


<h2>4a: Sortable List - from module</h2>
{ECB2 field=sortablelist block=test4a label="4a: Sortable List - from module" mod=LISEProjects template_summary='item_dropdown' pagelimit=10}


<h2>4b: sortablelist - using udt</h2>
{ECB2 field=sortablelist block=test4b udt='ecb2_test_udt_options' label="4b: Sortable List - from udt"}


<h2>4c: sortablelist - from template: ECB2_test_template_options</h2>
{ECB2 field=sortablelist block=test4c template='ECB2_test_template_options' label='4c: Sortable List - from template: ECB2_test_template_options' label_left='Selected items from template' label_right='Available items from template'}


<h2>4d: sortablelist - from CustomGS</h2>
{ECB2 field=sortablelist block=test4d customgs_field='Section Styles' label="4d: Sortable List - from CustomGS"}

<h2>4e: sortablelist - from CustomGS - OTHER TESTS</h2>
{ECB2 field=sortablelist block=test4e values='apple=Apple,orange=Orange,green=Green,value=Label' label="4e: Sortable List - from values - OTHER TESTS" default_value='orange' description='adds additional text explanation for editor'}


<h2>5: checkbox</h2>
<p>{ECB2 field="checkbox" block="test5" label="Test 5: Checkbox - no default" default_value="0" description="Test description (optional) can be shown here"}</p>
<p>{ECB2 field="checkbox" block="test5b" label="Test 5b: Checkbox - default NOT Checked" default_value="0"}</p>
<p>{ECB2 field="checkbox" block="test5c" label="Test 5c: Checkbox - default Checked" default_value="1"}</p>
<p>{ECB2 field="checkbox" block="test5d" default_value="1" label='&nbsp;' inline_label='can now have an inline label here :)' description="5d: no label set?"}</p>



<h2>6:radio</h2>
{ECB2 field="radio" block="test6" label="6: radio" values="Apple=apple,Orange=orange,Kiwifruit=kiwifruit" default_value='orange' description="Test description (optional) can be shown here"}



<h2>7: color_picker</h2>
{ECB2 field="color_picker" block="test7" label="7: color_picker" default_value="#CCCCCC" assign=test2 description="Test description - short"}
<p style="color:#FFF; background-color:{$test2};">colour:'{$test2}'</p>

<h2>7a: color_picker</h2>
{ECB2 field="color_picker" block="test7_2A" label="7a: color_picker" default_value="#5c51a5" assign=test7a description="Test description - short - 5c51a5"}
<p style="color:#FFF; background-color:{$test7a};">colour:'{$test7a}'</p>

<h2>7b: color_picker #2c</h2>
{ECB2 field="color_picker" block="test7_2c" label="7b: color_picker default RED" default_value="#FF0000" assign=test7_2c}
<p style="color:#FFF; background-color:{$test7_2c};">colour:'{$test7_2c}'</p>

<h2>7c: color_picker #2d</h2>
{ECB2 field="color_picker" block="test7c" label="7c: color_picker no-hash" no_hash=1 assign=test7c}
<p style="color:#FFF; background-color:{$test7c};">colour:'{$test7c}'</p>

<h2>7d: color_picker #2e</h2>
{ECB2 field="color_picker" block="test7d" label="7d: color_picker clear_css_cache" clear_css_cache=1 assign=test7d}
<p style="color:#FFF; background-color:{$test7d};">colour:'{$test7d}'</p>

<h2>7e: color_picker - promo_bgcolor clear_css_cache</h2>
{$promo_bgcolor="{content_module module='ECB2' field='color_picker' block='test7e' label='7e: Background Color & clear_css_cache' clear_css_cache=1}" scope=global}
<p style="color:#FFF; background-color:{$promo_bgcolor};">colour:'{$promo_bgcolor}'</p>




<h2>8: date_time_picker</h2>
<p>{ECB2 field=date_time_picker block="test8" label="8: date_time_picker" description="Test description (optional) can be shown here"}</p>

<h2>8a: datepicker - with time</h2>
<p>{ECB2 field=datepicker time=1 block="test8a" label="8a: datepicker - with time" description="Test description (optional) can be shown here"}</p>

<h2>8b: datepicker</h2>
<p>{ECB2 field=datepicker block="test8b" label="8b: datepicker" description="Test with options: change_month, change_year, year_range='1990:2050, and time" change_month=true change_year=1 year_range='1990:2050' time=1}</p>

<h2>8c: timepicker</h2>
<p>{ECB2 field=timepicker block="test8c" label="8c: timepicker" description="Test description (optional) can be shown here"}</p>


<h2>9: file_selector</h2>
<p>selected file:'{ECB2 field="file_selector" block="test9" label="9: file_selector" dir="images" filetypes="gif,png,jpg" excludeprefix="thumb_" description="file_selector: Test description (optional) can be shown here"}'<p>

<h2>9a: file_selector - recurse</h2>
<p>selected file:'{ECB2 field="file_selector" block="test9a" label="9a: file_selector - recursive" dir="images" filetypes="gif,png,jpg" excludeprefix="thumb_" recurse=1 description="file_selector: Test description (optional) can be shown here"}'<p>

<h2>9b: file_selector - image preview</h2>
<p>selected file:'{ECB2 field="file_selector" block="test9b" label="9b: file_selector - image preview (no description)" dir="images" filetypes="gif,png,jpg" excludeprefix="thumb_" preview=1}'<p>


<h2>10: page_picker</h2>
<p>{ECB2 field=page_picker label="Select a page" block="test10"}</p>

<h2>11: gallery_picker</h2>
<p>{content_module module='ECB2' field='gallery_picker' block='test11' dir='on-page-galleries' assign='test11' label='11: gallery_picker' description="Test description (optional) can be shown here"}</p>
{if !empty($test11)}
<div class="col-4">
   A functioning gallery should be shown below:<br>
   {Gallery dir=$test11}
</div>
{/if}<br>


<h2>12: module_picker</h2>
</p>{ECB2 field='module' block=test12 label='12: module_picker' default_value=FormBuilder}<p>


<h2>13: hidden</h2>
<p>{ECB2 field=hidden block='test13' assign='test13hidden' label='&nbsp;' description='Hidden: would not normally use a description field!' value="markervalue"}</p>



<h2>14: input_repeater</h2>
<p>{$input_repeater_test="||"|explode:"{content_module module='ECB2' field='input_repeater' label='14: input_repeater' block='test14' size=100 max_length=255 default_value='fill it' description='Press (+) and (-) to add and remove additional input fields'}" scope=global}</p>
<div class="pre">$input_repeater_test:{$input_repeater_test|print_r}</div>

<h2>15: fieldset_start</h2>
{ECB2 field=fieldset_start block="test15" label="&nbsp;" legend='Legend for this fieldset'}

    <p>can put some text of fields inside this fieldset :)</p>

<h2>16: fieldset_end</h2>
{ECB2 field=fieldset_end block="test16" label='&nbsp;'}


<h2>17: admin_hr</h2>
{ECB2 field=admin_hr block="test17" description='Can also add a description in here :)'}


<h2>18: admin_hr</h2>
{ECB2 field=admin_text label="18: admin_text" block="test18" text="Hello word!"}


<h2>19: admin_link</h2>
<p>{ECB2 field=admin_link block="test19" target="_blank" link="http://www.bing.com" text="bing search" label="19: admin_link" description="Test description (optional) can be shown here"}</p>


<h2>20: module_link</h2>
<p>{ECB2 field="module_link" label="20: module_link:Gallery" block="test20" mod="Gallery" text="Edit Galleries" description="Test description (optional) can be shown here" target='_blank'}</p>

<h2>21: admin_image</h2>
{ECB2 field=admin_image label="21: admin_image" block="test21" image='images/photo-coming-soon-4-3.jpg' description="This is an admin only image"}




<br><br><p>That's it. All Tests done :)</p>


         </div>
      </div>
   </div>
</div><!-- main-->

</body>
</html>