{* ECB2 admin_changelog.tpl *}

<h3>Version 2.4 - 24Jul23</h3>
<ul>
    <li>Support tags like {literal}{ECB2 ...params}{/literal}</li>
    <li>PHP 8.2 (and probably 8.3) compatibility</li>
    <li>Namespacing for all ECB2-related classes</li>
    <li>Bug fixes
    <ul>
      <li>admin panel popup help</li>
      <li>menu-section selector</li>
      <li>ajax processing</li>
      <li>compatible PHP method signature</li>
    </ul>
    </li>
</ul>
<br>

<h3>Version 2.3 - 24Jun23</h3>
<ul>
    <li>NEW field type: file_picker - implements the core FilePicker but with the addition of a thumbnail</li>
    <li>minor help tweaks</li>
    <li>Bug fix - make output values more robust, including handling change of field type and options, e.g. input_repeater to input.</li>
    <li>Bug fix - 'dropdown' compact option - update selection on change + minor layout tweak</li>
    <li>Bug fix - 'group' sub field labels - tweaked css to stop them wrapping</li>
    <li>Bug fix - 'file_selector' field - fix showing thumbnails if no image selected or non-image file type</li>
    <li>Bug Fix - when upgrading from older ECB2 version (< v1.99.3)</li>
</ul>
<br>


<h3>Version 2.2.1 - 05Apr23</h3>
<ul>
    <li>'gallery' Bug Fix - when using multiple gallery fields on the one page the upload dialog now adds the image/s to the correct gallery</li>
</ul>
<br>


<h3>Version 2.2 - 27Feb23</h3>
<ul>
    <li>'gallery' file_location changed to relative dir, when a page is next saved. This makes saved values more portable when moving from one domain to another. This should not cause an issue - if it does please contact me and I'll help find a solution.</li>
    <li>tweak 'gallery' type help text</li>
    <li>Bug fix for 'dropdown' multiple for output to be comma separated list as previously (was broken in v2.0 when group type added).</li>
</ul>
<br>


<h3>Version 2.1 - 01Feb23</h3>
<ul>
    <li>gallery field - images can now be reordered by dragging and dropping</li>
    <li>gallery field - images can now have multiple sub-fields, e.g. title, description, etc.</li>
    <li>Additions to help files based on user questions</li>
    <li>Added group file 'remove_empty' option - if set will remove any groups where all sub_fields are 'empty'</li>
    <li>textarea, rows default changed to 3 - was 20</li>
    <li>Bug fix for upgrade - will no longer fail if field type not valid</li>
    <li>Bug fix for multiple galleries on one page</li>
    <li>Bug fix removing 1st image when max_files=1 - can now add another one</li>
</ul>
<br>



<h3>Version 2.0 - 10Jan23</h3>
<ul>
    <li>NEW: gallery field type - enables multiple images to added by dragging and dropping or uploading. Thumbnails of the images are displayed and created on the server and images can optionally be automatically resized before they are uploaded.</li>
    <li>NEW: groups field type - creates a group of one or more sub fields. An unlimited number of groups can added by the editors, sorted or deleted. Can be displayed in table or block layout.</li>
    <li>Added 'admin_groups' option to most field types. To restrict which users can view and edit which fields.</li>
    <li>bug fix for using a module call 'mod' parameter - if any parameters being passed through to the module contain a space it would probably cause an error. Fixed.</li>
    <li>added database to store ecb2_block definitions (not yet used)</li>
    <li>added repeater functionality - sortable content blocks, optionally limited by 'max_blocks'</li>
    <li>improved admin layout & added module custom icons</li>
    <li>input_repeater is now an alias of textinput (fully compatible)</li>
    <li>bug fix for using 'select' as alias of textinput</li>
    <li>textinputs now correctly escape quotes</li>
    <li>other minor bug fixes</li>
    <li>restructured field_def methods - improve clarity and flexibility</li>
</ul>
<br>


<h3>Version 1.99.3 - 06Jul22</h3>
<ul>
   <li>add in module 'Manage' permissions for access to module admin page</li>
   <li>admin_image - bug fix</li>
</ul>
<br>


<h3>Version 1.99.1 - 06Jul22</h3>
<ul>
   <li>about tweaks</li>
   <li>admin_image - error message added if image file not found plus add in sample image for help page.</li>
</ul>
<br>


<h3>Version 1.99 - 05Jul22</h3>
<ul>
   <li>Significantly refactored module, to enable future development of the module and simplify use. Is fully compatible with all previous usage. Please report any issues you may find.</li>
   <li>Expanded help content, with example tags and demo content blocks for all field types.</li>
   <li>Some field types have been renamed, to make their use more obvious. All previous field types are fully supported as an alias for the new field name</li>
   <li>'textinput' field replaces 'input', field=input is a fully supported alias</li>
   <li>'textarea' field replaces 'editor', with a wysiwyg option added (default=false). field=editor is a fully supported alias</li>
   <li>'dropdown' field now replaces 'dropdown_from_module', 'dropdown_from_udt', 'dropdown_from_customgs' & 'dropdown_from_gbc', plus has a new alias 'select'. A new 'template' parameter enables dropdown values to be retrieved from a smarty template ('gcb' parameter is as alias). A sample LISE module template added into help</li>
   <li>'checkbox' - added an inline_label option</li>
   <li>'radio' - added 'flip_values' option - swaps the dropdowns values <-> text</li>
   <li>'date_time_picker' field replaces 'datepicker' and 'timepicker' with both fully supported as aliases</li>
   <li>parameter 'default' now used instead of 'default_value', ('default_value' parameter is an alias) - for all fields that can have a default</li>
   <li>'page_picker', renamed from the now alias: 'pages'</li>
   <li>'module_picker', renamed from the now alias: 'module'</li>
   <li>'admin_fieldset_start', renamed from the now alias: 'fieldset_start'</li>
   <li>'admin_fieldset_end', renamed from the now alias: 'fieldset_end'</li>
   <li>'admin_hr', renamed from the now alias: 'hr'</li>
   <li>'admin_image', renamed from the now alias: 'image'</li>
   <li>'admin_link', renamed from the now alias: 'link'</li>
   <li>'admin_module_link', renamed from the now alias: 'module_link'</li>
   <li>'admin_text', renamed from the now alias: 'text'</li>
   <li>added sample LISE template into help</li>
</ul>
<br>


<h3>Version 1.8 - 22Jun22</h3>
<ul>
   <li>dropdown & sortablelist - 'mod' option added - can load options directly from a modules template</li>
   <li>dropdown & sortablelist - 'flip_values' option added - swaps the dropdowns values <-> text. Can simplify using data from another source.</li>
   <li>undocumented & non-functioning method get_dropdown_from_module removed.</li>
   <li>bug fix for v1.7 - color_picker had stopped working</li>
   <li>time_picker & colour_picker js moved into single file ecb2_admin.js</li>
   <li>force refresh of css & js files after module update</li>
</ul>
<br>


<h3>Version 1.7 - 20Jun22</h3>
<ul>
   <li>color_picker - changed to use colpick for consistency with LISE & CustomGS, added options: clear_css_cache & no_hash</li>
   <li>image - added field type for displaying an image on an admin page only. Usefully to provide extra guidance to editors.</li>
</ul>
<br>


<h3>Version 1.6.2 - 19Jan22</h3>
<ul>
   <li>datepicker - add options for change_month, change_year, year_range</li>
   <li>datepicker & timepicker - move ouput into smarty template 'datepicker_template.tpl', move custom js from inline into ecb2_admin.js</li>
   <li>bug fix for is_datepicker_lib_load - so it's only loaded once</li>
</ul>
<br>


<h3>Version 1.6.1 - 27Jul20</h3>
<ul>
   <li>move help & changelog into templates</li>
   <li>Bug fix: for 'checkbox' using default of true (checked) - work around for core bug</li>
</ul>
<br>


<h3>Version 1.6 - 03Jun20</h3>
<ul>
   <li>all 'dropdown' content blocks now have the option for a 'compact' display on the admin page. Set "compact=1" in the parameters a summary of the selected options is displayed and the full select is shown/hidden when 'edit/hide' is clicked</li>
   <li>file_selector content block - updated now uses core method instead of CGExtensions</li>
   <li>removed CGExtensions dependancy</li>
   <li>Bug fix: default value now works for checkbox, input, textarea & editor content blocks</li>
</ul>
<br>


<h3>Version 1.5.3 - 17Jun19</h3>
<ul>
   <li>minor bug fix in help</li>
</ul>
<br>


<h3>Version 1.5.2 - 19Feb19</h3>
<ul>
   <li>bug fix - admin js updated - fixes v1.5.1 multiple select's & input_repeater not working - please update</li>
</ul>
<br>

<h3>Version 1.5.1 - 18Feb19</h3>
<ul>
   <li>gallery_picker - bug fix</li>
</ul>
<br>

<h3>Version 1.5 - 16Feb19</h3>
<ul>
   <li>input_repeater content block - added - thanks to Simon Radford</li>
   <li>gallery_picker content block - added</li>
   <li>dropdown_from_customgs content block - added</li>
   <li>added error message for missing or incorrectly spelt field paramater - BR#11557 - thanks Ludger</li>
   <li>removed Admin page that only showed help - redundant as help easily visible from within Module Manager</li>
   <li>removed Permission 'Use ECB2' - also redundant</li>
   <li>code tidy up - consolidate js & css into separate external files</li>
</ul>
<br>

<h3>Version 1.3.1 - 12Jul17</h3>
<ul>
   <li>minor bug fix</li>
</ul>
<br>

<h3>Version 1.3 - 11Jul17</h3>
<ul>
   <li>sortablelist - added max_number and required_number options</li>
   <li>Added 'fieldset_start' and 'fieldset_end' fields</li>
</ul>
<br>

<h3>Version 1.2.2 - 05Jul17</h3>
<ul>
   <li>test for and display warning in admin if UDT does not exist</li>
</ul>
<br>

<h3>Version 1.2.1 - 19Apr17</h3>
<ul>
   <li>bug fix for color_picker, default_value - BR#11354 - thanks Stuart</li>
   <li>color_picker - tweaked layout</li>
   <li>sortablelist - now use jquery sortable instead of CGExtensions. Parameters removed: 'template'. Parameters not operational: 'max_selected', 'allowduplicates' (please advise if you require these). Plus some bug fixes.</li>
</ul>
<br>

<h3>Version 1.2 - 07Nov16</h3>
<ul>
   <li>Added 'description' parameter for all fields (optional) - adds additional text explanation for editor</li>
   <li>Added 'hidden' field - Can be used to set a page attribute that can then be accessed (e.g. from a Navigator-Template), using {ldelim}page_attr page=$node->alias key='testhidden'{rdelim}</li>
   <li>Bug fix - for php notice</li>
</ul>
<br>

<h3>Version 1.1 - 15Apr16</h3>
<ul>
    <li>Bug fix</li>
</ul>
<br>

<h3>Version 1.0 - 15Apr16</h3>
<ul>
    <li>Initial release. A fork of ECB module v1.6, that is compatible with CMSMS v2+</li>
    <li>Added radio field - to provide radio buttons on an admin page</li>
</ul>
<br>
