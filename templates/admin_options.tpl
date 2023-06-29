{* admin_options.tpl *}

<div id="options_c">

    {form_start action=defaultadmin}

        <div class="pageoverflow">
            <p class="pagetext">{$mod->Lang('title_thumbnailWidth')}:</p>
            <p class="pageinput">
                <input type="text" name="{$actionid}thumbnailWidth" value="{$thumbnailWidth}" size="5"/>
                {cms_help realm='ECB2' key='help_thumbnailWidth' title='Thumbnail Width'}
            </p>
        </div>
        <div class="pageoverflow">
            <p class="pagetext">{$mod->Lang('title_thumbnailHeight')}:</p>
            <p class="pageinput">
                <input type="text" name="{$actionid}thumbnailHeight" value="{$thumbnailHeight}" size="5"/>
                {cms_help realm='ECB2' key='help_thumbnailHeight' title='Thumbnail Height'}
            </p>
        </div>
        <div class="pageoverflow">
            <p class="pagetext">{$mod->Lang('title_customModuleName')}:</p>
            <p class="pageinput">
                <input type="text" name="{$actionid}customModuleName" value="{$customModuleName}" size="50"/>
            </p>
        </div>
        <div class="pageoverflow">
            <p class="pagetext">{$mod->Lang('title_adminSection')}:</p>
            <p class="pageinput">
                {html_options name="{$actionid}adminSection" options=$adminSectionOptions selected=$adminSection}
            </p>
        </div>
        <div class="pageoverflow">
            <p>&nbsp;</p>
            <p class="pageinput">
                <input type="submit" name="{$actionid}submit" value="{$mod->Lang('save_options')}"/>
            </p>
        </div>
    {form_end}

</div>


