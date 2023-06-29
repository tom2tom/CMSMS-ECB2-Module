<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------
# A fork of module: Extended Content Blocks (ECB)
# Original Author: Zdeno Kuzmany (zdeno@kuzmany.biz) / kuzmany.biz  / twitter.com/kuzmany
#---------------------------------------------------------------------------------------------------
# CMS - CMS Made Simple is (c) 2011 by Ted Kulp (wishy@cmsmadesimple.org)
# Project's homepage is: http://www.cmsmadesimple.org
# Module's homepage is: http://dev.cmsmadesimple.org/projects/ecb2
#---------------------------------------------------------------------------------------------------
# This program is free software; you can redistribute it and/or modify it under the terms of the
# GNU General Public License as published by the Free Software Foundation; either version 3
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
# without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along with this program.
# If not, see <http://www.gnu.org/licenses/>.
#---------------------------------------------------------------------------------------------------

class ECB2 extends \CMSModule {

    const MODULE_VERSION = '2.3';
    const MANAGE_PERM = 'manage_ecb2';      // duplicated in upgrade action

    const FIELD_TYPES = [
        'textinput',
        'textarea',
        'dropdown',
        'sortablelist',
        'checkbox',
        'radio',
        'gallery',
        'color_picker',
        'date_time_picker',
        'file_selector',
        'file_picker',
        'page_picker',
        'gallery_picker',
        'module_picker',
        'hidden',
        'group',
            // admin only fields below here... (only because of a help subheading)
        'admin_fieldset_start',
        'admin_fieldset_end',
        'admin_hr',
        'admin_image',
        'admin_link',
        'admin_module_link',
        'admin_text'
    ];
    const FIRST_ADMIN_ONLY_FIELD = 'admin_fieldset_start';    // only to trigger help subheading
    const FIELD_ALIASES = [
        'input' => 'textinput',
        'editor' => 'textarea',
        'select' => 'dropdown', 
        'dropdown_from_module' => 'dropdown', 
        'dropdown_from_udt' => 'dropdown',
        'dropdown_from_gbc' => 'dropdown', 
        'dropdown_from_customgs' => 'dropdown',
        'timepicker' => 'date_time_picker',
        'datepicker' => 'date_time_picker',
        'pages' => 'page_picker',
        'module' => 'module_picker',
        'fieldset_start' => 'admin_fieldset_start',
        'fieldset_end' => 'admin_fieldset_end',
        'hr' => 'admin_hr',
        'text' => 'admin_text',
        'link' => 'admin_link',
        'module_link' => 'admin_module_link',
        'image' => 'admin_image',
        'input_repeater' => 'textinput',
        'image' => 'gallery'
    ];
    const OUTPUT_FORMAT_DEFAULT = 'string';
    const OUTPUT_FORMAT = [ // 'string' (default), 'array', 'array_or_string' or 'object'.
        'gallery' => 'object',
        'group' => 'object',
        'textinput' => 'array_or_string',
        'input' => 'array_or_string',
        'textarea' => 'array_or_string',
        'editor' => 'array_or_string',
        'input_repeater' => 'string_separated'
    ];

    const FIELD_DEF_PREFIX = 'ecb2fd_';
    const FIELD_DEF_CLASS_PREFIX = 'class.';
    const INPUT_TEMPLATE_PREFIX = 'input.';
    const HELP_TEMPLATE_PREFIX = 'help.';
    const DEMO_BLOCK_PREFIX = 'demo_';

    public function GetName() { return 'ECB2';  }
    public function GetFriendlyName() { return $this->Lang('friendlyname'); }
    public function GetVersion() { return self::MODULE_VERSION; }
    public function MinimumCMSVersion() { return '2.0'; }
    public function LazyLoadFrontend() { return true; }         // ??????????????
    public function GetAuthor() { return 'Chris Taylor'; }
    public function GetAuthorEmail() { return 'chris@binnovative.co.uk'; }
    public function GetChangeLog() { return $this->ProcessTemplate('admin_changelog.tpl'); }
    public function GetDescription() { return $this->Lang('module_description'); }
    public function GetHelp() { return $this->get_admin(TRUE); }
    public function HasAdmin() { return true;}
    public function VisibleToAdminUser() { return ( $this->CheckPermission(self::MANAGE_PERM) ); }
    public function GetHeaderHTML() { return $this->get_admin_css_js(); }
    public function InstallPostMessage() { return $this->Lang('postinstall');}
    public function UninstallPostMessage() { return $this->Lang('postuninstall');}
    public function UninstallPreMessage() { return $this->Lang('really_uninstall');}



    function HasCapability( $capability, $params = [] ) 
    {
        switch ($capability) {
            case 'contentblocks':
                return TRUE;

            default:
                return FALSE;
        }
    }



    public function __construct() 
    {
        parent::__construct();

        spl_autoload_register( array($this, '_autoloader') );

        \CMSMS\HookManager::add_hook( 'Core::ContentEditPre', [ $this, 'ContentEditPre' ] );

    }



    /**
     *  Internal autoloader
     */
    private function _autoloader($classname)
    {
        $parts = explode('\\', $classname);
        $classname = end($parts);
        $fielddef_dir = str_replace(self::FIELD_DEF_PREFIX, '', $classname);
        $fn = cms_join_path( $this->GetModulePath(), 'lib', 'fielddefs', $fielddef_dir,
            self::FIELD_DEF_CLASS_PREFIX.$classname.'.php' );
        if (file_exists($fn)) require_once($fn);
    }



    public function InitializeFrontend() 
    {
        $this->RegisterModulePlugin();

    }



    /**
     *  @param boolean $help_only - only output the help tabs
     *  @return string admin page content - uses smarty templates
     */
    public function get_admin( $help_only=FALSE )
    {
        $this->get_admin_css_js( TRUE );
        $output = '';
        $smarty = \CmsApp::get_instance()->GetSmarty();

        $tpl = $smarty->CreateTemplate( $this->GetTemplateResource('admin_default.tpl'), null, null, $smarty );
        $tpl->assign('mod', $this);
        $tpl->assign('help_only', $help_only);
        $output .= $tpl->fetch();

        $tpl = $smarty->CreateTemplate( $this->GetTemplateResource('admin_content_blocks.tpl'), null, null, $smarty );
        $tpl->assign('mod', $this);
        $tpl->assign('field_types', self::FIELD_TYPES);
        $tpl->assign('first_admin_only_field', self::FIRST_ADMIN_ONLY_FIELD);
        $field_help = [];
        foreach(self::FIELD_TYPES as $field_type) {
            $type = self::FIELD_DEF_PREFIX.$field_type;
            if ( class_exists($type) ) {    // stops errors with old field types on upgrade
                $ecb2 = new $type($this, $this::DEMO_BLOCK_PREFIX.$field_type, NULL, ['field' => $field_type], TRUE);
                $field_help[$field_type] = $ecb2->get_field_help();
            }
        }
        $tpl->assign('field_help', $field_help);
        $output .= $tpl->fetch();

        if (!$help_only) {
            $tpl = $smarty->CreateTemplate( $this->GetTemplateResource('admin_options.tpl'), null, null, $smarty );
            $tpl->assign('mod', $this);
            $tpl->assign( 'customModuleName', $this->GetPreference('customModuleName', $this->Lang('extended_content_blocks')) );
            $tpl->assign( 'adminSection', $this->GetPreference('adminSection', 'extensions') );
            $tpl->assign( 'adminSectionOptions', $this->Lang('adminSectionOptions') );
            $tpl->assign( 'thumbnailWidth', $this->GetPreference('thumbnailWidth', '') );
            $tpl->assign( 'thumbnailHeight', $this->GetPreference('thumbnailHeight', '') );
            $output .= $tpl->fetch();
        }

        $smarty = \CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate( $this->GetTemplateResource('admin_about.tpl'), null, null, $smarty );
        $tpl->assign('mod', $this);
        $output .= $tpl->fetch();

        return $output;
    }



    /**
     *  load ECB2 admin js & css - but only once! - e.g. if first ECB2 content block on the page
     *  all js & css should be in these combined files (for now)
     *  @return string - html to load js & css
     */
    public function get_admin_css_js( $echo_now = FALSE )
    {
        if (cms_utils::get_app_data('ECB2_js_css_loaded')) return;
        $path = $this->GetModuleURLPath();
        $admin_css_js = '
            <link rel="stylesheet" type="text/css" href="'.$path.'/lib/css/ecb2_admin.css?v'.self::MODULE_VERSION.'">
            <script language="javascript" src="'.$path.'/lib/js/ecb2_admin.js?v'.self::MODULE_VERSION.'"></script>';
        cms_utils::set_app_data('ECB2_js_css_loaded', 1);
        if ( $echo_now ) {
            echo $admin_css_js;
        } else {
            return $admin_css_js;
        }
    }



    /**
     * Get admin page content representing the UI for a module-content-block
     * @param string $blockName
     * @param mixed $value Might be null
     * @param array $params
     * @param boolean $adding flag whether this a new page is being processed
     * @param object $content_obj the page properties
     * @return string
     */
    public function GetContentBlockFieldInput( $blockName, $value, $params, $adding, ContentBase $content_obj ) 
    {
        if ( empty($params['field']) ) {
            return $this->error_msg( $this->Lang('field_error', $blockName) );
        }

        // workaround $adding not set in ContentManager v1.0 action admin_editcontent
        if (!$adding && version_compare(CMS_VERSION, '2.1') < 0 && $content_obj->Id() == 0) {
            $adding = true;
        }

        $this->get_admin_css_js( TRUE );   // output css & js - but only once per page

        $this->HandleFieldAliases($params);       
        if ( !in_array($params["field"], self::FIELD_TYPES ) ) {
            return $this->error_msg( $this->Lang('field_error', $blockName) );
        }     

        $type = self::FIELD_DEF_PREFIX.$params["field"];
        $ecb2 = new $type($this, $blockName, $value, $params, $adding, $content_obj->Id());

        $ecb2_cb = $ecb2->get_content_block_input();
        return $ecb2_cb;

    }



    /**
     *  Data entered by the editor is processed here before its saved in a table
     *  This method is called from a {content_module} tag, when the content edit form is being edited.
     *  Given input parameters (i.e: via _POST or _REQUEST), this method will extract a value for the 
     *  given content block information.
     *  This method can be overridden if the module is providing content block types to the CMSMS 
     *  content objects.
     *  @param string $blockName - Content block name
     *  @param array $blockParams - Content block parameters
     *  @param array $inputParams - input parameters
     *  @param object $content_obj - The content object being edited.
     *  @return mixed|false The content block value if possible.
     */
    public function GetContentBlockFieldValue( $blockName, $blockParams, $inputParams, ContentBase $content_obj )
    {
        // returned strings are stored in the default 'content_props' table as a string
        // arrays are always stored as json in 'content_props'
        if ( !isset($inputParams[$blockName]) ) {     // prob new page
            return '';

        } elseif ( is_string($inputParams[$blockName]) && $this->OutputFormat($blockParams)=='string' ) {
            return $inputParams[$blockName];

        } 
          
        // else array of inputs returned - get fieldDef class to manipulate input values - if necessary
        $id = $content_obj->Id();
        $value = '';    // just use dummy value here, pass input array into get_content_block_value()
        $adding = ($id == 0); 
        $this->HandleFieldAliases($blockParams); 
        $type = self::FIELD_DEF_PREFIX.$blockParams['field'];
        $ecb2 = new $type($this, $blockName, $value, $blockParams, $adding, $id);

        $ecb2_value = $ecb2->get_content_block_value( $inputParams[$blockName] );
        return $ecb2_value;

    }



    /**
     *  Render the value of a module content block on the frontend of the website.
     *  This gives modules the opportunity to render data stored in content blocks differently.
     *
     *  Note: any changes to the data should be handled during the admin save operation
     *        For speed during a front end call only a json_decode is required for processing
     *
     *  @param string $blockName - Content block name
     *  @param string $value - Content block value as stored in the database
     *  @param array $blockparams - Content block parameters
     *  @param object $content_obj - The content object being edited.
     *  @return string The content block value if possible.
     */
    public function RenderContentBlockField( $blockName, $value, $blockparams, ContentBase $content_obj ) 
    {
        $json_data = json_decode($value);
        if ( json_last_error()===JSON_ERROR_NONE && $json_data!=$value ) {  
            // JSON is valid and not just a simple string (also valid JSON)
            // a hack for backwards compatibility for input_repeater - if assign not used
            switch ( $this->OutputFormat($blockparams) ) {
                case 'string':
                    return $json_data->values[0];
                    break;

                case 'string_separated':      // e.g. 'input_repeater' & 'assign' not set
                    return implode('||', $json_data->values);
                    break;

                case 'array':
                    return isset($json_data->values) ? $json_data->values : [];
                    break;

                case 'object':
                    return $json_data;
                    break;
            }

        } else {    // $value is a string 
            switch ( $this->OutputFormat($blockparams) ) {
                case 'string': 
                    return $value;
                    break;

                case 'array':
                    return explode('||', $value);
                    break;

                case 'object':
                    $field_object = new stdClass();
                    $field_object->values[] = $value;
                    return $field_object;
                    break;
            }

        }

    }



    // not used     ValidateContentBlockFieldValue( $blockName, $value, $blockparams, $content_obj )
    // /**
    //  *  Validate the value for a module generated content block type.
    //  *  This method is called from a {content_module} tag, when the content edit form is being validated.
    //  *  This method can be overridden if the module is providing content block types to the CMSMS content 
    //  *  objects.
    //  *
    //  *  @param string $blockName - Content block name
    //  *  @param string $value - Content block value as stored in the database
    //  *  @param array $blockparams - Content block parameters
    //  *  @param object $content_obj - The content object being edited.
    //  *  @return string An error message if the value is invalid, empty otherwise.
    //  */
    // public function ValidateContentBlockFieldValue( $blockName, $value, $blockparams, $content_obj )
    // {
    //     return '';
    // } 



    /**
     *  clears Stylesheet cache if that option is required for an ECB2 field where the value has changed
     *      e.g. color_picker
     */
    public function ContentEditPre( $params )
    {
        $contentId = $params['content']->Id();
        $props = $params['content']->GetEditableProperties();
        $new_props = $params['content']->Properties();
        $clear_css_cache = false;

        foreach ($props as $prop) {
            if ( !$clear_css_cache && isset($prop->extra) && isset($prop->extra['module']) && 
                 $prop->extra['module']=='ECB2' && isset($prop->extra['params']['clear_css_cache']) ) {
                // test if value has changed
                $db = CmsApp::get_instance()->GetDb();
                $query = 'SELECT content FROM '.CMS_DB_PREFIX.'content_props 
                    WHERE content_id = ? AND prop_name = ?';
                $old_value = $db->GetOne( $query, [$contentId, $prop->name] );
                $new_value = $new_props[$prop->name];
                if ($new_value != $old_value) $clear_css_cache = true;
            }
        }
        if ($clear_css_cache) {
            $this->ClearStylesheetCache();
        }
    }



    /**
     *  shamelessly copied from CustomGS - thanks Rolf & Jos :)
     */
	private function ClearStylesheetCache()
	{
		foreach (glob("../tmp/cache/stylesheet_combined_*.css") as $filename) {
			touch( $filename, time() - 360000 );
		}
	}



    /**
     *  updates params if field alias has been used - also sets 'field_alias_used'
     */
    private function HandleFieldAliases( &$params ) 
    {
        if ( !in_array($params['field'], self::FIELD_TYPES) && 
              array_key_exists($params['field'], self::FIELD_ALIASES) ) {
            $params['field_alias_used'] = $params['field'];
            $params['field'] = self::FIELD_ALIASES[$params['field']];
        }
    }



    /**
     *  @return string 'string' (default), 'string_separated', 'array' or 'object'.
     *                  note: not 'array_or_string' - this method decides which is required
     *  @param array $blockparams - options set for this field block
     */
    private function OutputFormat( $blockparams )
    {
        if ( !isset(self::OUTPUT_FORMAT[ $blockparams['field'] ]) ) return self::OUTPUT_FORMAT_DEFAULT;

        switch ( self::OUTPUT_FORMAT[ $blockparams['field'] ] ) {
            case 'string':
            case 'string_separated':
            case 'array':
            case 'object':
                return self::OUTPUT_FORMAT[ $blockparams['field'] ];
                break;
            
            case 'array_or_string' :
                if ( empty($blockparams['repeater']) ) {
                    return 'string';
                } else {
                    return 'array';
                }
                break;

            default:
                return self::OUTPUT_FORMAT_DEFAULT; 
        }

    }



    /**
     *  @return string html error message
     */
    public function error_msg($msg)
    {
        return '<div class="pagewarning">'.$msg.'</div><br>';
    }



}


