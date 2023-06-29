{* help.ecb2fd_textarea.tpl *}
<p>The textarea field creates either a simple textarea input, for paragraphs of text, or optionally a full WYSIWYG editor to create formatted html.</p>

<fieldset>
{$fielddef->get_demo_input(['rows'=>3, 'cols'=>100, 'default'=>'a sample textarea'])}
</fieldset>

<pre>{literal}{content_module module=ECB2 field=textarea label='Textarea' block=test6 rows=3 cols=100 default='a sample textarea'}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - '<b>textarea</b>', or alias: '<b>editor</b>' (sets wysiwyg=true)</li>
    <li>block (required) - the name of the content block</li>
    <li>assign (required for repeater*) - the name of the content block</li>
    <li>rows (optional) - sets the height of the textarea. May be overridden by css - default 20</li>
    <li>cols (optional) - sets the width of the textarea. May be overridden by css - default 80</li>
    <li>repeater (optional) - enables 1 or more textarea fields to be created and sorted by clicking & dragging. Note: assign must be used to correctly supply the multiple values to the page template as an array.</li>
    <li>max_blocks (optional) - the maximum number of repeater fields that can be created</li>
    <li>wysiwyg (optional) - enables a wysiwyg editor on the textarea - default false</li>
    <li>default (optional) - (alias: '<b>default_value</b>') - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>

<fieldset>
    <legend>Sample textarea with wysiwyg - use 'wysiwyg=1' </legend>
    {$fielddef->get_demo_input(['default'=>"a sample wysiwyg textarea", 'wysiwyg'=>1, 'rows'=>2])}
</fieldset>

<fieldset>
    <legend>Sample textarea with wysiwyg & repeater - use repeater & max_blocks - use 'repeater=1 max_blocks=4 assign=tmp wysiwyg=1' </legend>
    {$fielddef->get_demo_input(['default'=>"a sample wysiwyg textarea", 'wysiwyg'=>1, 'rows'=>3,
        'repeater'=>1, 'max_blocks'=>4, 'assign'=>'tmp'])}
</fieldset>