{* help.date_time_picker.tpl *}
<p>This type of field creates a popup for selecting a date, a time, or both.</p>

<fieldset>
    {$fielddef->get_demo_input()}
</fieldset>

<pre>{literal}{ECB2 field=date_time_picker block='test8' label='Date Time Picker'}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'date_time_picker', or alias: '<b>datepicker</b>', '<b>timepicker</b>'</li>
    <li>block (required) - the name of the content block</li>
    <li>size (optional) - sets the width of the html input - default: 20</li>
    <li>max_length (optional) - maximum number of characters - default: 10</li>
    <li>show_time (optional) - (alias: '<b>time</b>') add time picker - default: true</li>
    <li>date_only (optional) - only show date picker - default: false</li>
    <li>time_only (optional) - only show time picker - default: false</li>
    <li>date_format (optional) - default: 'yy-mm-dd'</li>
    <li>time_format (optional) - default: 'HH::ss'</li>
    <li>change_month (optional) - whether the month should be rendered as a dropdown instead of text - default: false.</li>
    <li>change_year (optional) - whether the year should be rendered as a dropdown instead of text. Use the year_range option to control which years are made available for selection - default: false</li>
    <li>year_range (optional) - the range of years displayed in the year drop-down: either relative to today's year ("-nn:+nn"), relative to the currently selected year ("c-nn:c+nn"), absolute ("nnnn:nnnn"), or combinations of these formats ("nnnn:-nn") - default: 'c-10:c+10'</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>

<fieldset>
    <legend>date_time_picker with date_only - use 'date_only=1'</legend>
    {$fielddef->get_demo_input(['date_only'=>1])}
</fieldset>

<fieldset>
    <legend>date_time_picker with time_only - use 'time_only=1'</legend>
    {$fielddef->get_demo_input(['time_only'=>1])}
</fieldset>