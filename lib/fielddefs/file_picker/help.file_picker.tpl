{* help.file_picker.tpl *}
<p>This type of field enables the editor to select an image (or file) from specified directory, to use on a page. Plus a thumbnail of the selected image is shown (if an image is selected).</p>
<p>This functionality is provided by the core FilePicker module, with the addition of the thumbnail. If you don't want the thumbnail it's better to just use the FilePicker content block: <code>{literal}{content_module module=FilePicker block=string [profile=string]}{/literal}</code> See the FilePicker module for details.</p>
<p>Note: this field type can not yet be used as a sub_field in a 'group' or 'gallery'.</p>

<fieldset>
    {$fielddef->get_demo_input([])}
</fieldset>

<pre>{literal}{ECB2 field=file_picker block=test}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'file_picker'</li>
    <li>block (required) - the name of the content block</li>
    <li>profile (optional) - The name of the file picker profile to use. The profile must exist within the selected file picker module, or a default profile will be used</li>
    <li>top (optional) - A top directory, relative to the uploads directory. This overrides any top value already specified in the profile.</li>
    <li>type (optional) - An indication of the file type that can be selected. Possible values are: image,audio,video,media,xml,document,archive,any</li>
    <li>preview (optional) - default: true, set to false to not show a thumbnail (recommed you use FilePicker content block instead!)</li>
    <li>thumbnail_width (optional) - sets thumbnail width for this fields thumbnails. If thumbnail_width is set, but thumbnail_height is not, the ratio of the image will be used to calculate thumbnail_height. These settings will default to the ECB2 Thumbnail Width & Height options, or CMSMS Thumbnail Width & Height settings.</li>
    <li>thumbnail_height (optional) - sets thumbnail height for this fields thumbnails. If thumbnail_height is set, but thumbnail_width is not, the ratio of the image will be used to calculate thumbnail_width. These settings will default to the ECB2 Thumbnail Width & Height options, or CMSMS Thumbnail Width & Height settings.</li>
    <li>default_value (optional) - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>