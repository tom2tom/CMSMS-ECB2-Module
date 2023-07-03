{* help.color_picker.tpl *}
<p>This type of field provides a simple option for selecting a HEX color code.</p>

<fieldset>
    {$fielddef->get_demo_input([ 'default'=>'#3338c4'])}
</fieldset>

<pre>{literal}{ECB2 field=color_picker block=test7 label='Color' default='#3338c4'}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'color_picker'</li>
    <li>block (required) - the name of the content block</li>
    <li>size (optional) - default 10</li>
    <li>no_hash (optional) - if set the hex value displayed and returned does not include a '#'</li>
    <li>clear_css_cache (optional) - if set the css cache is refreshed if the color is changed</li>
    <li>default (optional) - (alias: '<b>default_value</b>') - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>
