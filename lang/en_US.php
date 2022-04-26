<?php
$lang['about'] = 'About';
$lang['add_line'] = 'Add line';

$lang['clear'] = 'Clear';
$lang['content_block_label_available'] = 'Available';
$lang['content_block_label_selected'] = 'Selected';
$lang['customgs_field_error'] = 'Please create option \'%s\' in CustomGS';

$lang['drop_items'] = 'No items selected - drop selected items here';
$lang['drop_required_items'] = 'Drop %s required items here';

$lang['field_error'] = 'Please specify a correct field parameter for the ECB2 content block.';
$lang['fields'] = 'Fields';
$lang['friendlyname'] = 'Extended Content Blocks 2';

$lang['general'] = 'General';

$lang['installed'] = 'Module version %s installed.';

$lang['module_description'] = 'This module enables extra types of content block for page templates';
$lang['module_error'] = 'The \'%s\' module is not available.';

$lang['none_selected'] = '--- none ---';

$lang['postinstall'] = 'Extended Content Blocks 2 was successfully installed';
$lang['postuninstall'] = 'Extended Content Blocks 2 was uninstalled';

$lang['really_uninstall'] = 'Really? Are you sure you want to uninstall this module?';
$lang['refresh'] = 'Refresh';
$lang['remove_line'] = 'Remove line';
$lang['remove'] = 'Remove';

$lang['select'] = 'Select';
$lang['selected'] = 'Selected';

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

$lang['general_c'] = <<<'EOD'
<h3>What Does This Do?</h3>
<p>This module enables aditional content blocks for CMS Made Simple v2+. This is a fork of the original ECB module that worked with CMSMS v1.</p>
<p>It supports content blocks having the following field types:<br>
<ol>
  <li>checkbox</li>
  <li>color_picker</li>
  <li>datepicker</li>
  <li>dropdown</li>
  <li>dropdown_from_customgs</li>
  <li>dropdown_from_module</li>
  <li>dropdown_from_udt</li>
  <li>editor</li>
  <li>fieldset_end()
  <li>fieldset_start</li>
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
</p><br>
<p>If you like this module please <a href="http://www.cmsmadesimple.org/about-link/donations/" target="_blank" style="font-weight:bold;">donate to CMSMS</a></p><br>
EOD;

$lang['about_c'] = <<<'EOD'
<h3>Usage</h3>
<p>For site-page (frontend) use, include 
<pre><code>{ECB2}</code></pre>
in the header of page-templates which use extended content block(s) supported by this module.<br>
That tag initiates inclusion of css and/or javascript relevant to the content blocks which are used.</p>

<h3>Upgrade from ECB</h3>
<p>After installing the ECB2 module, change the "module" parameter in each content_module tag to module="ECB2" (was "ECB"). Then ECB can be uninstalled.</p><br>

<h3>Support</h3>
<p>As per the GPL licence, this module is provided as is. Please read the text of the license for the full disclaimer.
The module author is not obliged to provide support for this module. However you might get support through the following:</p>
<ul>
  <li>first <strong>search</strong> the <a href="https://forum.cmsmadesimple.org">CMS Made Simple Forum</a>, for issues with the module similar to those you are finding.</li>
  <li>then, if necessary, open a <strong>new forum topic</strong> to request help, with a thorough description of your issue, and steps to reproduce it.</li>
</ul><br>

If you find a bug you can <a href="https://dev.cmsmadesimple.org/bug/list/1366">submit a bug report</a>.<br>
You can <a href="https://dev.cmsmadesimple.org/feature_request/list/1366">submit a feature request</a> for improvements.<br>
If you find the module useful, shout out to the author on Twitter <a href="https://twitter.com/KiwiChrisBT">@KiwiChrisBT</a>.<br>

<h3>Copyright &amp; Licence</h3>
<p>Copyright &copy; 2016-2022 CMS Made Simple Foundation. All rights reserved.</p><br>
<p>This module has been released under the GNU General Public License v.3, and may not be distributed or used otherwise than in accord with that licence,
or a later version of that licence granted by the module distributor.
<br>
EOD;

$lang['fields_c'] = <<<'EOD'

<h3>Fields</h3>

<p><strong>file_selector</strong></p>
<p>Example:  {content_module module="ECB2" field="file_selector" block="test10" dir="images" filetypes="jpg,gif,png" excludeprefix="thumb_"}        </p>
<p>Parameters:
filetypes - comma separated<br>
dir (optional) - default uploads/<br>
excludeprefix (optional)<br>
recurse (optional) - default false, recurse=1 will show all files in subfolders
sortfiles (optional)<br>
preview (optional) - only for images<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>color_picker</strong></p>
<p>Example:  {content_module module="ECB2" field="color_picker" block="test1" label="Color" default_value="#000000"}</p>
<p>Parameters:
default_value (optional)<br>
size (optional) - default 10<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>dropdown</strong></p>
<p>Example: {content_module module="ECB2" field="dropdown" block="test5" label="Fruit"  values="Apple=apple,Orange=orange" first_value="select fruit"}</p>
<p>Parameters:
values (required) - comma separated. Example: Apple=apple,Orange=orange,Green=green <br>
first_value (optional)<br>
multiple (optional) - add multiple option select support<br>
size (optional) - multiple enabled only<br>
description (optional) - adds additional text explanation for editor<br>
compact (optional) - default:false - if set, a summary of the selected options is displayed and the full select is shown/hidden when 'edit/hide' is clicked
</p><br>

<p><strong>dropdown_from_udt</strong></p>
<p>Example: {content_module module="ECB2" field="dropdown_from_udt" block="test2" label="Gallery" udt="mycustomudt"  first_value="=select="}</p>
<p>Ouput from UDT must be array() - example: return array("label"=>"value", "label 2 "=>"value 2")</p>
<p>Parameters:
udt (required) - udt name<br>
first_value (optional) <br>
multiple (optional) - add multiple option select support<br>
size (optional) - multiple enabled only<br>
description (optional) - adds additional text explanation for editor<br>
compact (optional) - default:false - if set, a summary of the selected options is displayed and the full select is shown/hidden when 'edit/hide' is clicked
</p>
<p><strong>Examples UDT</strong>:
<br>
<a href="https://gist.github.com/kuzmany/6779c193b8104aa6abfe">Gallery list from Gallery module</a> <br>
<a href="https://gist.github.com/kuzmany/464276e16f3b74c07555">Group list from FEU</a> <br>
<a href="https://gist.github.com/kuzmany/51583c6439cb041679a6">Users list from FEU</a>
</p><br>

<p><strong>dropdown_from_customgs</strong> <span style="color:red;">new</span></p>
<p>Provides a single or multiple select using the content set in a CustomGS Module field.</p>
<p>Requires the CustomGS module and to have a field of type 'text area'.</p>
<p>Example:
      {content_module module='ECB2' field='dropdown_from_customgs' customgs_field='Section_Styles' block=style1 label='Section 1 Layout Style' assign=style1}</p>
<p>Parameters:</p>
<ul>
   <li>customgs_field (required) - name of customgs_field to retrieve (with underscores not spaces)</li>
   <li>description (optional) - an optional description of the field</li>
   <li>multiple (optional) - an option if set, to ouput a multi-select box rather than a single select drowndown</li>
   <li>size (optional) - an option to set the size of a multi-select box</li>
   <li>compact (optional) - default:false - if set, a summary of the selected options is displayed and the full select is shown/hidden when 'edit/hide' is clicked</li>
</ul>
<br>

<p><strong>checkbox</strong></p>
<p>Example: {content_module module="ECB2" field="checkbox" block="test11" label="Checkbox" default_value="1"}</p>
<p>Parameters:
default_value (optional)<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>module_link</strong></p>
<p>Example: {content_module module="ECB2" field="module_link" label="Module edit" block="test3" mod="Cataloger" text="Edit catalog" }</p>
<p>Parameters:
mod (required) <br>
text (required) <br>
target (optional) - default _self<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>link</strong></p>
<p>Example: {content_module module="ECB2" field="link" label="Search" block="test4" target="_blank" link="http://www.bing.com" text="bing search"}</p>
<p>Parameters:
link (required) <br>
text (required) <br>
target (optional) - default _self<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>timepicker</strong></p>
<p>Example: {content_module module="ECB2" field="timepicker" label="Time" block="test45"}</p>
<p>Parameters:
size (optional) default 100<br>
time_format (optional) default HH::ss<br>
max_length (optional) default 10<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>datepicker</strong></p>
<p>Example: {content_module module="ECB2" field="datepicker" label="Date" block="test44"}</p>
<p>Parameters:
size (optional) default 100<br>
date_format (optional) default yy-mm-dd<br>
time (optional) - add time picker default 0<br>
time_format (optional) default HH::ss<br>
max_length (optional) default 10 <br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>input</strong></p>
<p>Example: {content_module module="ECB2" field="input" label="Text" block="test5" size=55 max_length=55 default_value="fill it"}</p>
<p>Parameters:
size (optional) default 30<br>
max_length (optional) default 255 <br>
default_value (optional) - default value for input<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>textarea</strong></p>
<p>Example: {content_module module="ECB2" field="textarea" label="Textarea" block="test6" rows=10 cols=40 default_value="fill it"}</p>
<p>Parameters:
rows (optional) default 20<br>
cols (optional) default 80 <br>
default_value (optional) - default value for textarea<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>editor (textarea with wysiwyg)</strong></p>
<p>Example: {content_module module="ECB2" field="editor" label="Textarea" block="test7" rows=10 cols=40 default_value="fill it"}</p>
<p>Parameters:
rows (optional) default 20<br>
cols (optional) default 80 <br>
default_value (optional) - default value for textarea<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>text </strong></p>
<p>Example: {content_module module="ECB2" field="text" label="Text" block="test8" text="Hello word!"}</p>
<p>Parameters:
text (required) text in admin (add information for users)<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>pages </strong></p>
<p>Example: {content_module module="ECB2" field="pages" label="Page" block="test10"}</p>
<p>Parameters:
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>hr (horizontal line)</strong></p>
<p>Example: {content_module module="ECB2" field="hr" label="Other blocks" block="blockname"}<p>
Parameters:
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>sortablelist</strong></p>
<p>Example: {content_module module="ECB2" field="sortablelist" block="testsortablelist" label="Choose fruit" udt="mydut"}</p>
<p>Parameters:
values (optional) - comma separated. Example: \'Apple=apple,Orange=orange,Green=green,value=Label\' <br>
udt (optional) - name of udt that returns an array in the format \'value\' => \'Label\',<br>
first_value (optional)<br>
label_left (optional)<br>
label_right (optional)<br>
max_number (optional) - limits the maximum number of items that can be selected<br>
required_number (optional) - sets a specific number of items that must be selected (or none)<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>radio</strong> </p>
<p>Example: {content_module module="ECB2" field="radio" block="test17" label="Fruit" values="Apple=apple,Orange=orange,Kiwifruit=kiwifruit" default_value="Orange"}</p>
<p>Parameters:
values (required) - comma separated. Example: Apple=apple,Orange=orange,Kiwifruit=kiwifruit<br>
default_value (optional) - default is first choice - set to default value e.g. "Orange"
inline (optional) - if set displays admin radio buttons inline<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>hidden</strong></p>
<p>Example: {content_module module='ECB2' block='test18hidden' assign='testhidden' field='hidden' value='markervalue'}<br>
Can be used to set a page attribute that can then be accessed (e.g. from a Navigator-Template), using {page_attr page=$node->alias key='testhidden'}</p>
<p>Parameters:
value (required) - hidden value to be saved<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>fieldset_start</strong></p>
<p>Example: {content_module module='ECB2' field='fieldset_start' label='& nbsp;' block='test19fieldset' assign='test19fieldset' legend='Fieldset Test Legend' description='Can add a description in here'}<br>
Creates the start of a fieldset for grouping relavant admin fields together. Note: a matching 'fieldset_end' block is required for each fieldset_start.<br>
TIP: set label='& nbsp;' to not show the field label.</p>
<p>Parameters:
legend (optional) - adds an optional legend (default = no legend)<br>
description (optional) - adds additional text explanation for editor
</p><br>

<p><strong>fieldset_end</strong></p>
<p>Example: {content_module module='ECB2' field='fieldset_end' label='& nbsp;' block='test19fieldsetend' assign='test19fieldsetend' }<br>
Creates the end of a fieldset for grouping relavant admin fields together. Note: a matching 'fieldset_start' block is required for each fieldset_end.<br>
TIP: set label='& nbsp;' to not show the field label.
</p><br>

<p><strong>gallery_picker</strong> <span style="color:red;">new</span></p>
<p>Provides a gallery picker for the Gallery module.</p>
<p>Example:
      {content_module module='ECB2' field='gallery_picker' block=pageTopGallery label='Page Top Gallery' dir='page-top-galleries'}</p>
<p>Parameters:</p>
<ul>
   <li>dir (optional) - only returns galleries that are sub-galleries of this gallery dir, default is all galleries, excluding default top level gallery</li>
   <li>description (optional) - a description of the field</li>
</ul>
<br>

<p><strong>input_repeater</strong> <span style="color:red;">new</span></p>
<p>Provides one or more text inputs that can be added or removed by the editor.</p>
<p>The content block output is a string with each input field's contents delimiter by '||'. To make the output a more useful array use 'explode', e.g. {"||"|explode:$content_block_name}</p>
<p>Example:
      {$input_repeater_test="||"|explode:"{content_module module='ECB2' field='input_repeater' label='Test 22: input_repeater' block='test22' size=50 max_length=255 description='Press (+) and (-) to add and remove additional input fields'}" scope=global}</p>
<p>To use: {$input_repeater_test|print_r}</p>
<br>
EOD;
