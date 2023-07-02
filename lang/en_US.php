<?php

$lang['about'] = 'About';
$lang['add_item'] = 'Add item';
$lang['add_line'] = 'Add line';
$lang['admin_only_help'] = 'Admin only fields';
$lang['admin_only_help_intro'] = 'The following fields are only used to format and add content to the admin pages. They do not provide any useful content for the frontend website pages.';
//the hard-coded admin menu sections in CMSMS2 are:
// main,content,layout,files,usersgroups,extensions,preferences,siteadmin,myprefs,ecommerce
//these are the corresponding 'public' versions of those section names. Their order in this string is critical
$lang['adminSectionOptions'] = 'Main,Content,Layout,Files,UsersGroups,Extensions,Preferences,SiteAdmin,MyPreferences,ECommerce';

$lang['content_block_label_selected'] = 'Selected';
$lang['content_block_label_available'] = 'Available';
$lang['customgs_field_error'] = "Please create field '%s' in CustomGS";

$lang['drop_items'] = 'No items selected - drop selected items here';
$lang['drop_required_items'] = 'Drop %s required items here';

$lang['error_assign_required'] = 'The assign parameter is required to correctly output multiple values.';
$lang['error_filename'] = 'The file \'%s\' for the \'%s\' parameter could not be found.';

$lang['error_sub_field_type_missing'] = 'A sub field type has not been provided.';
$lang['error_sub_field_type_not_allowed'] = 'The sub field type \'%s\' is not supported.';
$lang['error_sub_field_name_missing'] = 'The sub field type \'%s\' requires a valid name to be provided.';
$lang['error_sub_field_name_format'] = 'The sub field name \'%s\', for the field \'%s\' is incorrect. The name must start with a letter followed by any number of letters, numbers or underscores \'_\'.';
$lang['error_no_sub_fields'] = 'No sub fields defined.';
$lang['extended_content_blocks'] = 'Field Types';

$lang['fields'] = 'Fields';
$lang['field_error'] = 'Please specify a correct field parameter for the ECB2 content block \'%s\'.';
$lang['field_types'] = 'Field types';
$lang['friendlyname'] = 'Extended Content Blocks';

$lang['gallery_module_error'] = 'Gallery module is not installed.';

$lang['help_thumbnailWidth'] = 'Provides the default width for all ECB2-generated thumbnails. If this width is not set, the ratio of the image will be used to calculate it.<br>
If neither width nor height is set, the site settings for thumbnail width &amp; height will be used.<br>
Thumnbail width &amp; height can also be set by each content block.';
$lang['help_thumbnailHeight'] = 'Provides the default height for all ECB2-generated thumbnails. If this height is not set, the ratio of the image will be used to calculate it.<br>
If neither width nor height is set, the site settings for thumbnail width &amp height will be used.<br>
Thumnbail width &amp; height can also be set by each content block.';
$lang['hide'] = 'Hide';

$lang['installed'] = 'Module version %s installed.';

$lang['max_files_text'] = 'You have already uploaded the maximum of %s files';
$lang['max_files_unlimited_text'] = 'You have already uploaded the maximum of unlimited files';
$lang['module_description'] = 'Simply add customised elements to pages and page templates';
$lang['module_error'] = 'The \'%s\' module is not available.';

$lang['need_permission'] = 'You need permission to use this module';
$lang['none_selected'] = '--- none ---';

$lang['options'] = 'Options';
$lang['options_saved'] = 'Options saved';

$lang['parameter_missing'] = 'Please specify a \'%s\' parameter for the ECB2 content block \'%s\'.';
$lang['postinstall'] = 'Extended Content Blocks was successfully installed';
$lang['postuninstall'] = 'Extended Content Blocks was successfully uninstalled';

$lang['really_uninstall'] = 'Really? Are you sure you want to uninstall the ECB2 module?';
$lang['remove'] = 'Remove';
$lang['remove_line'] = 'Remove line';

$lang['save_options'] = 'Save Options';
$lang['selected'] = 'Selected';
$lang['select'] = 'Select';

$lang['template_error'] = 'Invalid template name \'%s\'';
$lang['title_customModuleName'] = 'Custom Module Name';
$lang['title_adminSection'] = 'Module Admin-Menu Section';
$lang['title_thumbnailWidth'] = 'Thumbnail Width';
$lang['title_thumbnailHeight'] = 'Thumbnail Height';

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
<p>The Extended Content Blocks (ECB2) module facilitates website page and template construction. Many tailored html components can be simply applied.</p>
<br>
<h3>Usage</h3>
<p>Use a tag like the following to add each ECB2 field to any page's main-content-area or template.</p>
<pre>{ECB2 field=some_field_type block='some name' ...}</pre>
<p>or use an equivalent CMSMS core <b>{content_module}</b> tag instead.</p>
<pre>{content_module module=ECB2 field=some_field_type block='some name' ...}</pre>
<p>All ECB2 tags must, or may, include the following parameters:</p>
<ul>
    <li>module (required if using {content_module} - 'ECB2'</li>
    <li>field (required) - one of ECB2 field types below</li>
    <li>block (required) - the name of the content block</li>
    <li>label (optional) - A label for the content block for use when editing the page.</li>
    <li>required (optional) - Allows specifying that the content block must contain some text.</li>
    <li>tab (optional) - The desired tab to display this field on in the edit form.<br>Use the following to show on a core tab: tab='zz_1nav_tab__', 'zz_2logic_tab__', or 'zz_3options_tab__'.</li>
    <li>priority (optional) integer - Allows specifying an integer priority for the block within the tab.</li>
    <li>assign (optional) string - Assign the results to a Smarty variable with that name.</li>
</ul>

<p><b>Smarty tips</b>: parameter values that are single-word strings do not have to be quoted e.g. field=checkbox is the same as field='checkbox'. If parameter values have double quotes, simple Smarty variables or tags may be included, like var="test $foo {counter} test".<br>See <a href="//www.smarty.net/docs/en/language.syntax.quotes.tpl" target="_blank">Smarty docs</a> for details.</p>

<br><br>
EOD;

$lang['about_c'] = <<<'EOD'
<p>ECB2 provides additional Content Blocks for use in page templates for CMS Made Simple v2+.</p>

<p>Thanks to Matt @DIGI3 & Simon @Simon66, for the sponsorship of this module that have supported the development of these new features.</p>
<p>Thanks to Tom Phane @tomph, for his code improvements, optimisations, and help content (especially a great simple smarty tip).</p>
<p>The ECB2 module is a fork of the module Extended Content Blocks (ECB), for CMSMS v1, developed by Zdeno Kuzmany.</p>
<br><br>

<h3>Upgrading from ECB</h3>
<p>Install ECB2 module and change all "module" parameters in content_module tags from "ECB" to "ECB2". Then ECB can be uninstalled.</p><br>

<h3>Upgrading from CGContentUtils</h3>
<p>Install ECB2 and change all "module" parameters in content_module tags from "CGContentUtils" to "ECB2".</p>
<p>Parameters:</p>
<ul>
    <li>block (required) - must stay the same</li>
    <li>field (required) - choose the appropriate ECB2 field
    <li>other parameters will be required depending on the field and previous options set in CGContentUtils</li>
</ul>
<p>Check all are working as expected, then CGContentUtils can be uninstalled.</p>
<br>

<h3>Implementation</h3>
<p>ECB2 uses the core content blocks to save all field values, including more complex 'group' and 'gallery' fields with multiple sub-fields and rows. All such data is stored by core functions and retrieved with minimal overhead. Only a json_decode is required for each field for frontend actions.</p>
<p>Each ECB2 field is stored in the '_content_props' table, using the 'longtext' data type that can store up to 4GB.</p>
<p>Content saved in ECB2 fields is automatically indexed by the Search and Admin Search functions.</p>
<br>

<h3>Support</h3>
<p>As per the GPL licence, this software is provided as is. Please read the text of the license for the full disclaimer.
The module author is not obligated to provide support for this code. However you might get support through the following:</p>
<ul>
    <li>For support, first <strong>search</strong> the <a href="//forum.cmsmadesimple.org">CMS Made Simple Forum</a>, for issues with the module similar to those you are finding.</li>
    <li>Then, if necessary, open a <strong>new forum topic</strong> to request help, with a thorough description of your issue, and steps to reproduce it.</li>
    <li>Ask a question on the <a href="//cms-made-simple.slack.com" target="_blank">CMS Made Simple Slack channel</a>, or just share you thoughts if you found the Module useful. <a href="//www.cmsmadesimple.org/support/documentation/chat" target="_blank">Join CMSMS on Slack</a></li>
    <li>If you find a bug you can <a href="http://dev.cmsmadesimple.org/bug/list/1366" target="_blank">submit a Bug Report</a>.</li>
    <li>For any good ideas you can <a href="http://dev.cmsmadesimple.org/feature_request/list/1366" target="_blank">submit a Feature Request</a>.</li>
</ul><br>

<h3>Sponsor Development</h3>
<p>If you would like a new field or feature added to this module, please contact me. You can sponsor development from £50.</p><br>

<h3>Copyright &amp; Licence</h3>
<p>Copyright © 2019-2023, Chris Taylor < chris at cmsmadesimple dot org >. All rights reserved.</p><br>
<p>This module has been released under the GNU General Public License v3.</p><br>
<br>
EOD;
