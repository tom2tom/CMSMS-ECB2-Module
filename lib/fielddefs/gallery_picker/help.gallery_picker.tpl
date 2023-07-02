{* help.gallery_picker.tpl *}
<p>The gallery_picker creates a dropdown to choose from a selection of galleries in the Gallery module.</p>

<fieldset>
    {$fielddef->get_demo_input()}
</fieldset>

<pre>{literal}{ECB2 field=gallery_picker block=pageTopGallery label='Page Top Gallery' dir='page-top-galleries'}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'gallery_picker'</li>
    <li>block (required) - the name of the content block</li>
    <li>dir (optional) - only returns galleries that are sub-galleries of this gallery dir, default is all galleries, excluding default top level gallery</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>