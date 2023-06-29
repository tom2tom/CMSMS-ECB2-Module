<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------


class ecb2fd_sortablelist extends ecb2_FieldDefBase 
{

	public function __construct($mod, $blockName, $value, $params, $adding, $id=0) 
	{	
		parent::__construct($mod, $blockName, $value, $params, $adding, $id);

        $this->get_values($value);              // common FieldDefBase method

        $this->set_field_parameters();

        $this->initialise_options($params);     // common FieldDefBase method
        
	}



    /**
     *  sets the allowed parameters for this field type
     *
     *  $this->default_parameters - array of parameter_names => [ default_value, filter_type ]
     *      FILTER_SANITIZE_STRING, FILTER_VALIDATE_INT, FILTER_VALIDATE_BOOLEAN, FILTER_SANITIZE_EMAIL 
     *      see: https://www.php.net/manual/en/filter.filters.php
     *  $this->restrict_params - optionally allow any other parameters to be included, e.g. module calls
     */
    public function set_field_parameters() 
    {
        $this->restrict_params = FALSE;    // default: TRUE - needed for module call
        $this->parameter_aliases = [
            'default_value' => 'default'
        ];
        $this->default_parameters = [
            'values'            => ['default' => '',    'filter' => FILTER_SANITIZE_STRING], 
            'default'           => ['default' => '',    'filter' => FILTER_SANITIZE_STRING], 
            'allowduplicates'   => ['default' => FALSE,    'filter' => FILTER_SANITIZE_STRING],
            'max_selected'      => ['default' => -1,    'filter' => FILTER_VALIDATE_INT],
            'max_number'        => ['default' => '',    'filter' => FILTER_VALIDATE_INT], 
            'required_number'   => ['default' => '',    'filter' => FILTER_VALIDATE_INT], 
            'label_left'        => ['default' => '',    'filter' => FILTER_SANITIZE_STRING],
            'label_right'       => ['default' => '',    'filter' => FILTER_SANITIZE_STRING],
            'flip_values'       => ['default' => FALSE, 'filter' => FILTER_VALIDATE_BOOLEAN],
            'mod'               => ['default' => '',    'filter' => FILTER_SANITIZE_STRING],
            'udt'               => ['default' => '',    'filter' => FILTER_SANITIZE_STRING],
            'template'          => ['default' => '',    'filter' => FILTER_SANITIZE_STRING],
            'customgs_field'    => ['default' => '',    'filter' => FILTER_SANITIZE_STRING],
            'admin_groups'  => ['default' => '',    'filter' => FILTER_SANITIZE_STRING],
            'description'       => ['default' => '',    'filter' => FILTER_SANITIZE_STRING]
        ];

    }


    /**
     *  @return string complete content block 
     */
    public function get_content_block_input() 
    {
        if ( !empty($this->options['admin_groups']) && 
             !$this->is_valid_group_member($this->options['admin_groups']) ) {
            return $this->ecb2_hidden_field(); 
        }

        // get the dropdown values/options
        if ( $this->options['mod'] ) {  
            // call module to get values (comma separated list)
            $exclude_options = ['size','multiple','values','default_value','first_value','description',
                'compact','field','mod','flip_values','template','udt','gbc','customgs_field'];

            $exclude_options = ['values','udt','default_value','first_value','description','label_left','label_right','max_number','required_number','mod','flip_values','compact','field','allowduplicates','max_selected'];
            
            $options = $this->get_values_from_module($this->options['mod'], [], $exclude_options);            


        } elseif ( $this->options['udt'] ) {  
            // run UDT to get values (array or comma separated list)
            $options = $this->get_values_from_udt( $this->options['udt'] );
            if ($this->error) return $this->mod->error_msg($this->error);
            if ( $options ) $options = array_flip($options);

        } elseif ( $this->options['template'] ) {  
            // smarty template to get values (array or comma separated list)
            $options = $this->get_values_from_template( $this->options['template'] );
            if ($this->error) return $this->mod->error_msg($this->error);

        } elseif ( $this->options['customgs_field'] ) {  
            // CustomGS field to get values from (newline or comma separated list)
            $options = $this->get_values_from_customgs( $this->options['customgs_field'] );
            if ($this->error) return $this->mod->error_msg($this->error);

        } else { 
            // use provided 'values' (comma separated list)
            $options = $this->get_array_from_csl( $this->options['values'] );
            if ( $options ) $options = array_flip($options);
        
        }

        // apply some other parameters
        if ( $this->options['flip_values'] && !empty($options) ) { 
            $options = array_flip($options);
        }
        $selectedList = explode(',', $this->value);
        $available = $options;
        $selected = array();
        foreach ($selectedList as $item) {
            if ( !empty($available) && array_key_exists($item, $available) ) {
                $selected[$item] = $available[$item];
                unset($available[$item]);
            }
        }
        if ($this->options["max_number"]) // max_number takes precidence if both set
            $this->options["required_number"] = "";

        
        $smarty = \CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate( 'string:'.$this->get_template(), null, null, $smarty );
        $tpl->assign( 'mod', $this->mod );
        $tpl->assign( 'block_name', $this->block_name );
        $tpl->assign( 'description', $this->options['description'] );

        $tpl->assign( 'selected', $this->value );

    $tpl->assign('selectarea_prefix',$this->block_name);
    $tpl->assign('selected_str',$this->value);
    $tpl->assign('selected',$selected);
    $tpl->assign('available', $available);
    $tpl->assign('description', $this->options['description']);
    $tpl->assign('labelLeft', $this->options["label_left"]);
    $tpl->assign('labelRight', $this->options["label_right"]);
    $tpl->assign('maxNumber', $this->options["max_number"]);
    $tpl->assign('requiredNumber', $this->options["required_number"]);

        $tpl->assign('options', $options );
        return $tpl->fetch();
   


        // $mod = cms_utils::get_module('ECB2');
        // $options = array();
        // $tmp = array();

        // if ( $this->options['mod'] ) {
        //     // call module to get values
        //     $exclude_options = ['values','udt','default_value','first_value','description','label_left','label_right','max_number','required_number','mod','flip_values','compact','field','allowduplicates','max_selected'];
        //     $params = [];
        //     foreach ($this->options as $key => $value) {
        //         if ( !in_array($key, $exclude_options) ) $params[$key] = $value;
        //     }
        //     $module = cms_utils::get_module( $this->options['mod'] );
        //     if ( $module ) { 
        //         $tmp_action = isset($this->options['action']) ? $this->options['action'] : '';
        //         $cms_module_call = "{cms_module module=".$this->options['mod'];
        //         foreach ($params as $key => $value) {
        //             $cms_module_call .= " $key=$value";
        //         };
        //         $cms_module_call .= "}";
        //         $smarty = \CmsApp::get_instance()->GetSmarty();
        //         $this->options["values"] = strip_tags($smarty->fetch('string:'.$cms_module_call));
        //     }
        // }




        // if ( $this->options['udt'] ) {
        //     $options = UserTagOperations::get_instance()->CallUserTag($this->options['udt'], $tmp);
        // }
        // // create $optionsarray of key => text from comma separated string of 'key=text,key2=text2'
        // $optionsarray = explode(',', $this->options["values"]);
        // if (empty($optionsarray)) return;
        // foreach ($optionsarray as $option) {
        //     if ($option!='') {
        //         $key_val = explode('=', $option);
        //         $options[$key_val[0]] = $key_val[1];
        //     }
        // }
        // if ( $this->options['mod'] ) {  // format reversed in module output for sortablelist
        //     $options = array_flip($options);
        // }
        // if ( $this->options['flip_values'] ) { 
        //     $options = array_flip($options);
        // }
        // if (empty($this->options['first_value']) == false)
        //     $options = array($this->options['first_value'] => '') + $options;


        // $selectedList = explode(',', $this->value);
        // $available = $options;
        // $selected = array();
        // foreach ($selectedList as $item) {
        //     if ( array_key_exists($item, $available) ) {
        //         $selected[$item] = $available[$item];
        //         unset($available[$item]);
        //     }
        // }
        // if ($this->options["max_number"]) // max_number takes precidence if both set
        //     $this->options["required_number"] = "";
        // $smarty = Smarty_CMS::get_instance();
        // $tpl = $smarty->CreateTemplate($mod->GetTemplateResource('sortablelist_template.tpl'), null, null, $smarty);
        // $tpl->assign('selectarea_prefix',$this->block_name);
        // $tpl->assign('selected_str',$this->value);
        // $tpl->assign('selected',$selected);
        // $tpl->assign('available', $available);
        // $tpl->assign('description', $this->options['description']);
        // $tpl->assign('labelLeft', $this->options["label_left"]);
        // $tpl->assign('labelRight', $this->options["label_right"]);
        // $tpl->assign('mod',$mod);
        // $tpl->assign('maxNumber', $this->options["max_number"]);
        // $tpl->assign('requiredNumber', $this->options["required_number"]);
        // return $this->options['description'].$tpl->fetch();


    }


}