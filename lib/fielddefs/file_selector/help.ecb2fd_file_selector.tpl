{* help.ecb2fd_file_selector.tpl *}
<p>The file_selector field enables a file to be selected from a set directory and can optionally show a thumbnail.</p>

<fieldset>
    {$fielddef->get_demo_input(['filetypes'=>"jpg,gif,png", 'excludeprefix'=>"thumb_", 'preview'=>1, 'recurse'=>1])}
</fieldset>

<pre>{literal}{content_module module=ECB2 field=file_selector block=test10 filetypes='jpg,gif,png' excludeprefix='thumb_' recurse=1 preview=1}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'file_selector'</li>
    <li>block (required) - the name of the content block</li>
    <li>filetypes (required) - comma separated list of file extensions to display, e.g. 'jpg,gif,png'</li>
    <li>dir (optional) - specify a sub directory of 'uploads' to use</li>
    <li>excludeprefix (optional) - exclude any files that have this prefix, e.g. 'thumb_'</li>
    <li>recurse (optional) - if set will show all files in sub directories</li>
    <li>sortfiles (optional) - will sort files by filename</li>
    <li>preview (optional) - will show a thumbnail of the image - only for images</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>
