{* help.gallery.tpl *}
<p>This type of field enables multiple images to added by dragging and dropping or uploading. Thumbnails of the images are displayed and created on the server and images can optionally be automatically resized before they are uploaded. Each image can also have multiple sub-fields. If more than 1 image is uploaded they can also be dragged and dropped to reorder the images.</p>

<fieldset>
    {$fielddef->get_demo_input(['assign' => 'test20a',
        'sub1_field' => 'textinput', 'sub1_name' => 'title', 'sub1_label' => 'Title',
        'sub2_field' => 'editor', 'sub2_name' => 'description', 'sub2_label' => 'Description',
        'sub3_field' => 'page_picker', 'sub3_name' => 'link_to', 'sub3_label' => 'Select a page'
    ])}
</fieldset>

<pre>{literal}{ECB2 field=gallery block=test20a label='A sample Gallery' assign=test20a
sub1_field=textinput sub1_name=title sub1_label='Title'
sub2_field=editor sub2_name=description sub2_label='Description'
sub3_field=page_picker sub3_name=link_to sub3_label='Select a page'}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'gallery'</li>
    <li>block (required) - the name of the content block</li>
    <li>dir (optional) - a sub directory of the uploads directory, if not set a unique directory is created for this content block.</li>
    <li>resize_width (optional) - if set, images will be resized to this width before being uploaded. If only one of resize_width or resize_height is set, the original aspect ratio of the image is preserved.</li>
    <li>resize_height (optional) - if set, images will be resized to this height before being uploaded. If only one of resize_width or resize_height is set, the original aspect ratio of the image is preserved.</li>
    <li>resize_method (optional) - 'contain' (default), or 'crop' can be used.</li>
    <li>thumbnail_width (optional) - sets thumbnail width for this fields thumbnails. If thumbnail_width is set, but thumbnail_height is not, the ratio of the image will be used to calculate thumbnail_height. These settings will default to the ECB2 Thumbnail Width & Height options, or CMSMS Thumbnail Width & Height settings. Recommended minimum width 104 (px).</li>
    <li>thumbnail_height (optional) - sets thumbnail height for this fields thumbnails. If thumbnail_height is set, but thumbnail_width is not, the ratio of the image will be used to calculate thumbnail_width. These settings will default to the ECB2 Thumbnail Width & Height options, or CMSMS Thumbnail Width & Height settings.</li>
    <li>max_files (optional) - sets a maximum number of files that can be uploaded</li>
    <li>auto_add_delete (optional) default:true - will automatically delete unused files & thumbnails from the directory</li>
    <li>default_value (optional) - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul><br>

<p>Sub field parameters:</p>
<p>Each image can have multiple sub fields, that can be specified using 'subX_yyyyy' parameters where X is a number and yyyyy is the parameter. e.g. 'sub1_name=textinput'. Each sub fields has required and optional parameters</p>
<ul>
    <li>subX_field (required) - must be one of the supported sub field types:<br>
        {foreach $fielddef->allowed_sub_fields as $allowed_types}{$allowed_types}, {/foreach}
    </li>
    <li>subX_name (required) - used reference the sub field - must start with a letter followed by any number of letters, numbers or underscores '_'.</li>
    <li>subX_<i>parameter</i> (optional) - where '<i>parameter</i>' is any of the parameters that work with that field type. e.g. for textinput sub field the following can be used:<br>
        <pre>sub1_field=textinput sub1_name=text1 sub1_size=20 sub1_max_length=50</pre>
    </li>

</ul>

<p>Output format:</p>
<pre>{literal}
{if !empty($test20a->sub_fields)}{* test if any data exists *}
    {foreach $test20a->sub_fields as $sub_field}
        {foreach $sub_field as $name => $value}
            {$name}: {$value}
        {/foreach}
        {* or directly access each sub_field *}
        Height is:{$sub_field->height}
        Fruit is:{$sub_field->fruit}
    {/foreach}
{/if}
{/literal}</pre><br>

<p>Notes & tips:</p>
<ol>
    <li>change the order of the subX_ parameters to change the order of the fields in the admin page.</li>
    <li>the default PHP limit for inputs on one page is 1000. This is set by max_input_vars in php.ini. If you may need more than this on a single page you can increase max_input_vars. Each sub field in each group row is 1 input, plus all other fields on the page.</li>
    <li>sub field parameters like 'repeater', 'max-blocks' and 'assign' are ignored.</li>
    <li>if only one group is added and all it's values are empty the ->sub_fields object will be empty</li>
</ol>

