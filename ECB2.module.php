<?php
/*
 * ECB2 - Extended content blocks 2
 * Copyright (C) 2016-2022 CMS Made Simple Foundation <foundation@cmsmadesimple.org>
 * Thanks to Chris Tatlor and all other contributors from the CMSMS Development Team.
 * This is a fork of module: Extended Content Blocks (ECB)
 * Original Author: Zdeno Kuzmany (zdeno@kuzmany.biz) / kuzmany.biz  / twitter.com/kuzmany
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
    protected $utils;
    protected $loadcss = array();
    protected $loadjs = array();

    public function GetAuthor() { return 'Chris Taylor'; }
    public function GetAuthorEmail() { return 'chris@cmsmadesimple.org'; }
    public function GetChangeLog() { return '' . @file_get_contents(__DIR__.DIRECTORY_SEPARATOR.'changelog.htm'); }
    public function GetDescription() { return $this->Lang('module_description'); }
    public function GetFriendlyName() { return $this->Lang('friendlyname'); }
    public function GetHelp() { return $this->ProcessTemplate('_help.tpl'); }
    public function GetName() { return 'ECB2'; }
    public function GetVersion() { return '1.7'; }
    public function HasAdmin() { return false; }
    public function InstallPostMessage() { return $this->Lang('postinstall'); }
    public function LazyLoadFrontend() { return true; }
    public function MinimumCMSVersion() { return '2.0'; }
    public function UninstallPostMessage() { return $this->Lang('postuninstall'); }
    public function UninstallPreMessage() { return $this->Lang('really_uninstall'); }

    public function GetHeaderHTML()
    {
        $out = $this->headercontent();
        if (function_exists('add_page_headtext')) {
            add_page_headtext($out);
            return '';
        } else {
            return $out;
        }
    }

    public function HasCapability($capability, $params = array())
    {
        switch ($capability) {
           case 'contentblocks':
           case 'plugin':
               return true;
           default:
               return false;
        }
    }

    public function InitializeFrontend()
    {
        $this->RestrictUnknownParams();
        //TODO review/rationalise these
        $this->SetParameterType('adding', CLEAN_STRING);
        $this->SetParameterType('block_name', CLEAN_STRING);
        $this->SetParameterType('compact', CLEAN_STRING);
        $this->SetParameterType('date_format', CLEAN_STRING);
        $this->SetParameterType('default_value', CLEAN_STRING);
        $this->SetParameterType('description', CLEAN_STRING);
        $this->SetParameterType('dir', CLEAN_STRING);
        $this->SetParameterType('excludeprefix', CLEAN_STRING);
        $this->SetParameterType('field', CLEAN_STRING);
        $this->SetParameterType('filetypes', CLEAN_STRING);
        $this->SetParameterType('legend', CLEAN_STRING);
        $this->SetParameterType('max_number', CLEAN_INT);
        $this->SetParameterType('maxnumber', CLEAN_INT);
        $this->SetParameterType('preview', CLEAN_STRING);
        $this->SetParameterType('recurse', CLEAN_STRING);
        $this->SetParameterType('size', CLEAN_INT);
        $this->SetParameterType('sortfiles', CLEAN_STRING);
        $this->SetParameterType('value', CLEAN_STRING);
    }

    public function headercontent()
    {
        $out = '';
        foreach ($this->loadcss as $str) {
            $out .= $str.PHP_EOL;
        }
        foreach ($this->loadjs as $str) {
            $out .= $str.PHP_EOL;
        }
        return $out;
    }

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
            $this->loadcss[] = "<link rel=\"stylesheet\" type=\"text/css\" href=\"$base_url/lib/css/ecb2_admin.min.css\" />";
            $this->loadjs[] = "<script type\"text/javascript\" src=\"$base_url/lib/js/ecb2_admin.min.js\"></script>";
        }
        //TODO frontend get accumulated header content when relevant per $this->headercontent()
        return $this->utils->get_content_block_input($blockName, $value, $params, $adding);
    }
}
