{* help.admin_image.tpl *}
<p>This type of field displays an image on an admin page only. Useful to provide extra guidance to editors.</p>

<fieldset>
    {$fielddef->get_demo_input(['image'=>'sample_admin_only_image.png', 'description'=>"This is an admin only image"])}
</fieldset>

<pre>{literal}{ECB2 field=admin_image image='sample_admin_only_image.png' block=test24 label="24: admin_image" description="This is an admin only image"}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'admin_image', alias: '<b>image</b>'</li>
    <li>block (required) - the name of the content block</li>
    <li>image (required) - path and filename relative to the uploads directory</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>