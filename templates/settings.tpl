{* settings.tpl *}
{*<div id="options_c">*}
  {form_start action=defaultadmin}
    <div class="pageoverflow">
      <label class="pagetext" for="twid">{$mod->Lang('title_thumbnailWidth')}:</label>
      <p class="pageinput">
        <input type="text" id="twid" name="{$actionid}thumbnailWidth" value="{$thumbnailWidth}" size="5">
        {cms_help realm='ECB2' key='help_thumbnailWidth' title='Thumbnail Width'}
      </p>
    </div>
    <div class="pageoverflow">
      <label class="pagetext" for="thigt">{$mod->Lang('title_thumbnailHeight')}:</label>
      <p class="pageinput">
        <input type="text" id="thigt" name="{$actionid}thumbnailHeight" value="{$thumbnailHeight}" size="5">
        {cms_help realm='ECB2' key='help_thumbnailHeight' title='Thumbnail Height'}
      </p>
    </div>
    <div class="pageoverflow">
      <label class="pagetext" for="tname">{$mod->Lang('title_customModuleName')}:</label>
      <p class="pageinput">
        <input type="text" id="tname" name="{$actionid}customModuleName" value="{$customModuleName}" size="50">
      </p>
    </div>
    <div class="pageoverflow">
      <label class="pagetext" for="ssect">{$mod->Lang('title_adminSection')}:</label>
      <p class="pageinput" id="ssect">
        {html_options name="{$actionid}adminSection" options=$adminSectionOptions selected=$adminSection}
      </p>
    </div>
    <br>
    <div class="pageoverflow">
      <p class="pageinput">
        <input type="submit" name="{$actionid}submit" value="{$mod->Lang('save')}">
        <input type="submit" name="{$actionid}cancel" value="{lang('cancel')}">
      </p>
    </div>
  {form_end}
{*</div>*}
