<?php
$lang['about'] = 'About';
$lang['add_line'] = 'Add line';

$lang['cancel'] = 'Cancel';
$lang['change'] = 'Change';
$lang['choose'] = 'Choose';
$lang['clear'] = 'Clear';
$lang['content_block_label_available'] = 'Available';
$lang['content_block_label_selected'] = 'Selected';
$lang['customgs_field_error'] = 'Please create option \'%s\' in CustomGS';

$lang['detail'] = 'Details';
$lang['drop_items'] = 'No item selected - drop selected items here';
$lang['drop_required_items'] = 'Drop %s required items here';

$lang['field_error'] = 'Please specify a correct field parameter for the ECB2 content block \'%s\'.';
$lang['friendlyname'] = 'Extended Content Blocks 2';

$lang['hide'] = 'Hide';

$lang['installed'] = 'Module version %s installed.';

$lang['less'] = 'Less';
$lang['longdays'] = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday';
$lang['longmonths'] = 'January,February,March,April,May,June,July,August,September,October,November,December';

$lang['meridiem'] = 'AM,PM';
$lang['module_description'] = 'This module enables extra types of content block for page templates';
$lang['module_error'] = 'The \'%s\' module is not available.';
$lang['more'] = 'More';

$lang['none_selector'] = '--- none ---';
$lang['none_selected1'] = 'Nothing Selected';
$lang['none_selected2'] = 'No Color Selected';

$lang['parameter_missing'] = 'Please specify a \'%s\' parameter for the ECB2 content block \'%s\'.';
$lang['postinstall'] = 'Extended Content Blocks 2 was successfully installed';
$lang['postuninstall'] = 'Extended Content Blocks 2 was uninstalled';

$lang['really_uninstall'] = 'Really? Are you sure you want to uninstall this module?';
$lang['refresh'] = 'Refresh';
$lang['remove_line'] = 'Remove line';
$lang['remove'] = 'Remove';

$lang['select'] = 'Select';
$lang['selected'] = 'Selected';
$lang['summary'] = 'Summary';

$lang['today'] = 'Today';

$lang['udt_error'] = 'User Defined Tag \'%s\' does not exist';
$lang['uninstalled'] = 'Module uninstalled.';
$lang['upgraded'] = 'Module upgraded to version %s.';

###    ###   #########   ###        #########
###    ###   #########   ###        #########
###    ###   ###         ###        ###   ###
##########   #########   ###        #########
##########   #########   ###        #########
###    ###   ###         ###        ###
###    ###   #########   #########  ###
###    ###   #########   #########  ###

$lang['about_c'] = <<<'EOD'
<h3>What Does This Do?</h3>
<p>Ultimately, this module generates small pieces of content for website pages using CMS Made Simple v2+. Such content will in most cases be somewhat configurable from within the site admin console, and might be displayable, or used to tailor displayable elements, or used in page-related javascript.<br>
This is a fork of the ECB module that worked with CMSMS v1.</p><br>

<h3>Usage</h3>
<p>Include in page-content-blocks, or in other-module action-templates, or in form-build components, appropriate content-block tag(s) like the following and as described on adjacent tabs.</p>
<pre><code>{content_module module=ECB2 field=sometype block='some name' ...}</code></pre></p>
<p>To initiate provision of css and/or javascript relevant to the content blocks which are used,
include in the header of corresponding page-templates:</p>
<pre><code>{ECB2}</code></pre></p>

<h3>Upgrade from ECB</h3>
<p>After installing the ECB2 module, change the 'module' parameter in each content_module tag to module='ECB2' (was 'ECB'). Then the ECB module can be uninstalled.</p><br>

<h3>Support</h3>
<p>As per the module licence, this module is provided as is. Please read the text of the licence for the full disclaimer.
 The module author is not obliged to provide support for this module. However you might get support through the following:</p>
<ul>
  <li>first, search the <a href="https://forum.cmsmadesimple.org">CMS Made Simple Forum</a> for issues with the module similar to those you are finding.</li>
  <li>then, if necessary, <a href="https://forum.cmsmadesimple.org/posting.php?mode=post&f=7">open a new forum topic</a> to request help, with a thorough description of your issue, and steps to reproduce it.</li>
</ul><br>

If you find a bug you can <a href="http://dev.cmsmadesimple.org/bug/list/1366">submit a bug report</a>.<br>
You can <a href="http://dev.cmsmadesimple.org/feature_request/list/1366">submit a feature request</a> to suggest improvement.<br>
If you find the module useful, shout out to the author <a href="https://twitter.com/KiwiChrisBT">@KiwiChrisBT</a>.<br><br>

<h3>Copyright &amp; Licence</h3>
<p>Copyright &copy; 2016-2022 CMS Made Simple Foundation. All rights reserved.</p><br>
<p>This module has been released under the <a href="https://www.gnu.org/licenses/gpl-3.0.txt">GNU General Public License v3</a>,
and may not be distributed or used otherwise than in accord with that licence,
or a later version of that licence granted by the module distributor.</p>
EOD;

$lang['summary_c'] = <<<'EOD'
<p>This module supports the following field types:<br>
<ol>
  <li>checkbox</li>
  <li>color_picker</li>
  <li>datepicker</li>
  <li>dropdown</li>
  <li>dropdown_from_customgs</li>
  <li>dropdown_from_module</li>
  <li>dropdown_from_gcb</li>
  <li>dropdown_from_udt</li>
  <li>editor</li>
  <li>fieldset_start</li>
  <li>fieldset_end</li>
  <li>file_selector</li>
  <li>gallery_picker</li>
  <li>hidden</li>
  <li>hr</li>
  <li>input</li>
  <li>input_repeater</li>
  <li>link</li>
  <li>module</li>
  <li>module_link</li>
  <li>pages</li>
  <li>radio</li>
  <li>sortablelist</li>
  <li>text</li>
  <li>textarea</li>
  <li>timepicker</li>
</ol>
</p>
EOD;

$lang['detail_c'] = <<<'EOD'
<p>Extended content-block tags using the following fields <strong>must</strong> include module='ECB2', field='sometype' and block='somename', and most such tags <em>may</em> include alias='elemid', label='something', description='whatever', among their parameters.<br>
Parameter 'alias' is used for the displayed element's id attribute. Parameter 'default' is an alternate for 'default_value'.</p>
<p>As usual in Smarty tags, single-word strings do not have to be quoted e.g. field=checkbox is sufficient. All field-names are single-word, but are shown quoted here.</p><br>
<p>Some field-types are, in effect, just html-for-newbies. As such, the corresponding html may be included directly in templates.<br>
The selector field-types can be used with associated javascript to tailor the display of content at runtime.<br>
Input and selector field-types can be used in stand alone forms, or form-builder components.<br>
Arguably some of the selector field-types (e.g. all modules, all pages) are not practical for casual use.</p><br>
<p><strong>checkbox</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='checkbox' block='test11' label='Checkbox' default_value='1'}</code></pre></p>
<p>Parameters:<br>
 default_value (optional) - default 0
</p><br>

<p><strong>color_picker</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='color_picker' block='test1' label='Color' default_value='#000000'}</code></pre></p>
<p>Parameters:<br>
 default_value (optional) - default #f00<br>
 size (optional) - default 10
</p><br>

<p><strong>datepicker</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='datepicker' label='Date' block='test44'}</code></pre></p>
<p>Parameters:<br>
 size (optional) default 100<br>
 date_format (optional) uses PHP's date() formats, default y-m-d<br>
 time (optional) - also enable time-picking, default false<br>
 time_format (optional) uses PHP's date() formats, default H:i<br>
 max_length (optional) default 10
</p><br>

<p><strong>dropdown</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='dropdown' block='test5' label='Fruit' values='Apple=apple,Orange=orange' first_value='select fruit'}</code></pre></p>
<p>Parameters:<br>
 values (required) - single or comma separated. Example: Apple=apple,Orange=orange,Green=green<br>
 default_value (optional) - value of selected item<br>
 first_value (optional) - value of extra initial item<br>
 multiple (optional) - add multiple option select support, default false<br>
 size (optional) - multiple enabled only<br>
 compact (optional) - default:false - if set, a summary of the selected options is displayed and the full select is shown/hidden when 'edit/hide' is clicked
</p><br>

<p><strong>dropdown_from_customgs</strong></p>
<p>Provides a single or multiple select using the content set in a CustomGS Module field.</p>
<p>Requires the CustomGS module and to have a field of type 'text area'.</p>
<p>Example:
 <pre><code>{content_module module='ECB2' field='dropdown_from_customgs' customgs_field='Section_Styles' block='style1' label='Section 1 Layout Style' assign='style1'}</code></pre></p>
<p>Parameters:<br>
 customgs_field (required) - name of customgs_field to retrieve (with underscores not spaces)<br>
 first_value (optional) - value of extra initial item<br>
 multiple (optional) - if set, output a multi-select box rather than a single select drowndown<br>
 size (optional) - the size of a multi-select box<br>
 compact (optional) - if set, a summary of the selected options is displayed and the full select is shown/hidden when 'edit/hide' is clicked
</p><br>

<p><strong>dropdown_from_module</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='dropdown_from_module' block='uniquename' mod='modname'...}</code></pre></p>
<p>Parameters:<br>
 mod (required) - name of module<br>
 first_value (optional) - value of extra initial item<br>
 default_value (optional) - value of selected item<br>
</p><br>

<p><strong>dropdown_from_gcb</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='dropdown_from_gcb' block='myblock' gcb='templatename'...}</code></pre></p>
<p>Output from the template must be a string like Apple=apple[,Orange=orange,Green=green...]</p>
<p>Parameters:<br>
 gcb (required) - name of Smarty template<br>
 first_value (optional) - value of extra initial item<br>
 default_value (optional) - value of selected item<br>
 multiple (optional) - add multiple option select support<br>
 size (optional) - multiple enabled only<br>
 compact (optional) - default:false - if set, a summary of the selected options is displayed and the full select is shown/hidden when 'edit/hide' is clicked
</p><br>

<p><strong>dropdown_from_udt</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='dropdown_from_udt' block='test2' label='Gallery' udt='mycustomudt' first_value='=select='}</code></pre></p>
<p>More examples:<br>
 <a href="https://gist.github.com/kuzmany/6779c193b8104aa6abfe">Gallery list from Gallery module</a><br>
 <a href="https://gist.github.com/kuzmany/464276e16f3b74c07555">Group list from FEU</a><br>
 <a href="https://gist.github.com/kuzmany/51583c6439cb041679a6">Users list from FEU</a>
</p>
<p>Output from the tag must be an array() e.g. return array('label'=>'value', 'label 2'=>'value 2')</p>
<p>Parameters:<br>
 udt (required) - User Defined Tag name<br>
 first_value (optional) - value of extra initial item<br>
 multiple (optional) - add multiple option select support<br>
 size (optional) - multiple enabled only<br>
 compact (optional) - default:false - if set, a summary of the selected options is displayed and the full select is shown/hidden when 'edit/hide' is clicked
</p><br>

<p><strong>editor (textarea with WYSIWYG)</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='editor' label='Textarea' block='test7' rows=10 cols=40 default_value='fill it'}</code></pre></p>
<p>Parameters:<br>
 rows (optional) default 20<br>
 cols (optional) default 80<br>
 default_value (optional)
</p><br>

<p><strong>fieldset_start</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='fieldset_start' label='This group' block='test19fieldset' assign='test19fieldset' legend='Fieldset Test Legend' description='Can add a description in here'}</code></pre><br>
 Creates the start of a fieldset for grouping relavant admin fields together. Note: a matching 'fieldset_end' block is required for each fieldset_start.<br>
 TIP: set label='&nbsp;' to not show the field label.</p>
<p>Parameters:<br>
 legend (optional) - legend default = none
</p><br>

<p><strong>fieldset_end</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='fieldset_end' block='test19fieldsetend' assign='test19fieldsetend'}</code></pre><br>
 Creates the end of a fieldset for grouping relavant fields together. Note: a matching 'fieldset_start' block is required for each fieldset_end.<br>
</p><br>

<p><strong>file_selector</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='file_selector' block='test10' dir='images' filetypes='jpg,gif,png' excludeprefix='thumb_'}</code></pre></p>
<p>Parameters:<br>
 filetypes - comma separated<br>
 dir (optional) - default uploads/<br>
 excludeprefix (optional)<br>
 recurse (optional) - default false, recurse=1 will show all files in subfolders<br>
 sortfiles (optional)<br>
 preview (optional) - only for images
</p><br>

<p><strong>gallery_picker</strong></p>
<p>Provides a gallery picker for the Gallery module.</p>
<p>Example:
 <pre><code>{content_module module='ECB2' field='gallery_picker' block=pageTopGallery label='Page Top Gallery' dir='page-top-galleries'}</code></pre></p>
<p>Parameters:<br>
 dir (optional) - only returns galleries that are sub-galleries of this gallery dir, default is all galleries, excluding default top level gallery
</p><br>

<p><strong>hidden</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' block='test18hidden' assign='testhidden' field='hidden' value='markervalue'}</code></pre><br>
 Can be used to set a page attribute that can then be accessed (e.g. from a Navigator-Template), using {page_attr page=$node->alias key='testhidden'}</p>
<p>Parameters:<br>
 value (required) - hidden value to be used
</p><br>

<p><strong>hr (horizontal line)</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='hr' label='Other blocks' block='blockname'}</code></pre></p>
<p>Parameters:<br>
</p><br>

<p><strong>input</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='input' label='Text' block='test5' size=55 max_length=55 default_value='fill it'}</code></pre></p>
<p>Parameters:<br>
 size (optional) default 30<br>
 max_length (optional) default 255<br>
 default_value (optional) - default value for input
</p><br>

<p><strong>input_repeater</strong></p>
<p>Provides one or more text inputs that can be added or removed by the editor.</p>
<p>The content block output is a string with each input field's contents delimited by '||'. To make the output a more useful array use 'explode', e.g. {"||"|explode:$content_block_name}</p>
<p>Example:
 <pre><code>{$input_repeater_test="||"|explode:"{content_module module='ECB2' field='input_repeater' label='Test 22: input_repeater' block='test22' size=50 max_length=255 description='Press (+) and (-) to add and remove additional input fields'}" scope=global}</code></pre></p>
<p>To use: <pre><code>{$input_repeater_test|print_r}</code></pre></p>

<p><strong>link</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='link' label='Search' block='test4' target='_blank' link='http://www.bing.com' text='bing search'}</code></pre></p>
<p>Parameters:<br>
 link (required) - the anchor URL<br>
 text (required) - the displayed text<br>
 target (optional) - default _self
</p><br>

<p><strong>module</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='module' ...}</code></pre></p>
<p>Parameters:<br>
 link - the anchor URL TBA<br>
 text - the displayed text TBA<br>
 default_value (optional) - value of selected item
</p><br>

<p><strong>module_link</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='module_link' label='Module edit' block='test3' mod='Cataloger' text='Edit catalog'}</code></pre></p>
<p>Parameters:<br>
 mod (required) - name of module<br>
 text (required) - the displayed text<br>
 target (optional) - link target default _self
</p><br>

<p><strong>pages</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='pages' label='Page' block='test10'}</code></pre></p>
<p>Parameters:<br>
</p><br>

<p><strong>radio</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='radio' block='test17' label='Fruit' values='Apple=apple,Orange=orange,Kiwifruit=kiwifruit' default_value='Orange'}</code></pre></p>
<p>Parameters:<br>
 values (required) - comma separated. Example: Apple=apple,Orange=orange,Kiwifruit=kiwifruit<br>
 default_value (optional) - the initial selected value, default is the first value e.g. 'Apple'<br>
 delimiter (optional) - html content to be placed between buttons e.g. something for formatting 
 inline (optional) - if true and delimiter is not set, displays the buttons side-by-side
</p><br>

<p><strong>sortablelist</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='sortablelist' block='testsortablelist' label='Choose fruit' udt='mydut'}</code></pre></p>
<p>Parameters:<br>
 values (optional) - comma separated. Example: \'Apple=apple,Orange=orange,Green=green,value=Label\'<br>
 udt (optional) - name of udt that returns an array in the format \'value\' => \'Label\',<br>
 first_value (optional) - value of extra initial item<br>
 label_left (optional)<br>
 label_right (optional)<br>
 max_number (optional) - the maximum number of items that can be selected<br>
 required_number (optional) - a specific number of items that must be selected (or none)
</p><br>

<p><strong>text</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='text' label='Do you know' block='test8' text='This is great!'}</code></pre></p>
<p>Parameters:<br>
 text (required) text displayed in the admin console, generally information for users
</p><br>

<p><strong>textarea</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='textarea' label='Textarea' block='test6' rows=10 cols=40 default_value='fill it'}</code></pre></p>
<p>Parameters:<br>
 rows (optional) default 20<br>
 cols (optional) default 80<br>
 default_value (optional)
</p><br>

<p><strong>timepicker</strong></p>
<p>Example: <pre><code>{content_module module='ECB2' field='timepicker' label='Time' block='test45'}</code></pre></p>
<p>Parameters:<br>
 size (optional) default 10<br>
 max_length (optional) default 10<br>
 time_format (optional) default H:i
</p>
EOD;
