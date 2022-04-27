<?php
/*
 * ECB2 - Extended content blocks 2
 * Copyright (C) 2016-2022 CMS Made Simple Foundation <foundation@cmsmadesimple.org>
 * Thanks to Chris Tatlor and all other contributors from the CMSMS Development Team.
 * This is a fork of module: Extended Content Blocks (ECB)
 * Original Author: Zdeno Kuzmany (zdeno@kuzmany.biz) / kuzmany.biz / twitter.com / kuzmany
 *
 * CMS Made Simple is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of that license, or
 * (at your option) any later version.
 *
 * CMS Made Simple is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of that license along with CMS Made Simple.
 * If not, see <https://www.gnu.org/licenses/>.
 */
class ECB2 extends CMSModule
{
    protected $utils; // fields-generator class object

    public function GetAuthor() { return 'Chris Taylor'; }
    public function GetAuthorEmail() { return 'chris@cmsmadesimple.org'; }
    public function GetChangeLog() { return '' . @file_get_contents(__DIR__.DIRECTORY_SEPARATOR.'changelog.htm'); }
    public function GetDescription() { return $this->Lang('module_description'); }
    public function GetFriendlyName() { return $this->Lang('friendlyname'); }
    public function GetName() { return 'ECB2'; }
    public function GetVersion() { return '1.7'; }
    public function HasAdmin() { return false; }
    public function InstallPostMessage() { return $this->Lang('postinstall'); }
    public function LazyLoadFrontend() { return true; }
    public function MinimumCMSVersion() { return '2.0'; }
    public function UninstallPostMessage() { return $this->Lang('postuninstall'); }
    public function UninstallPreMessage() { return $this->Lang('really_uninstall'); }

    public function GetHelp()
    {
        $smarty = cmsms()->GetSmarty();
        $smarty->assign('mod', $this);
        return $this->ProcessTemplate('_help.tpl');
    }

    public function HasCapability($capability, $params = array())
    {
        switch ($capability) {
           case 'contentblocks': //aka CoreCapabilities::CONTENT_BLOCKS
               return true;
           default:
               return false;
        }
    }

    /**
     * Get page content representing the UI for a module-content-block
     * @param string $blockName
     * @param mixed $value Might be null
     * @param array $params
     * @param boolean $adding flag whether this a new page is being processed
     * @param object $content_obj the page properties
     * @return string
     */
    public function GetContentBlockFieldInput($blockName, $value, $params, $adding, $content_obj)
    {
        // workaround $adding not set in ContentManager v1.0 action admin_editcontent
        if (!$adding && version_compare(CMS_VERSION, '2.1') < 0 && $content_obj->Id() == 0) {
           $adding = true;
        }
        if (empty($this->utils)) {
            // processing the first ECB2 content block in the request
            require_once(__DIR__.DIRECTORY_SEPARATOR.'lib'.DIRECTORY_SEPARATOR.'class.ecb2_tools.php');
            $this->utils = new ecb2_tools($this);

            $base_url = $this->GetModuleURLPath();
            $js = $this->utils->insert_top("<link rel=\"stylesheet\" type=\"text/css\" href=\"$base_url/css/module.min.css\" />");
            if ($js) {
                echo $js;
            }
            $js = $this->utils->insert_bottom("<script type=\"text/javascript\" src=\"$base_url/lib/js/module.min.js\"></script>");
            if ($js) {
                echo $js;
            }
        }
        return $this->utils->get_content_block_input($blockName, $value, $params, $adding);
    }
}
