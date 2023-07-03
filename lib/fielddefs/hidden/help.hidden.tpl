{* help.hidden.tpl *}
<p>This type of field creates a simple hidden input, for storing a single string.</p>

<fieldset>
    <legend>nothing to see here!</legend>
    {$fielddef->get_demo_input()}
</fieldset>

<pre>{literal}{ECB2 field=hidden block=test label='Test' default='fill it'}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'hidden'</li>
    <li>block (required) - the name of the content block</li>
    <li>label (optional) - Tip: If you add label='&nbsp;' the label will be hidden</li>
    <li>value (optional) - sets the value</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>