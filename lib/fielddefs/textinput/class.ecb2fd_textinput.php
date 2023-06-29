<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------


class ecb2fd_textinput extends ecb2_FieldDefBase 
{

	public function __construct($mod, $blockName, $value, $params, $adding, $id=0) 
	{	
		parent::__construct($mod, $blockName, $value, $params, $adding, $id);

        // set use_json_format (if necessary) before get_values()
        if ( !empty($params['repeater']) || 
             ( isset($params['field_alias_used']) && $params['field_alias_used']=='input_repeater') ) {
            $this->use_json_format = TRUE;
        }

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
        $this->parameter_aliases = [
            'default_value' => 'default'
        ];
        $this->default_parameters = [
            'default'       => ['default' => '',    'filter' => FILTER_SANITIZE_STRING], 
            'label'         => ['default' => '',    'filter' => FILTER_SANITIZE_STRING], 
            'size'          => ['default' => 30,    'filter' => FILTER_VALIDATE_INT],
            'max_length'    => ['default' => 255,   'filter' => FILTER_VALIDATE_INT],
            'repeater'      => ['default' => FALSE, 'filter' => FILTER_VALIDATE_BOOLEAN],
            'max_blocks'    => ['default' => 0,    'filter' => FILTER_VALIDATE_INT],
            'description'   => ['default' => '',    'filter' => FILTER_SANITIZE_STRING],
            'admin_groups'  => ['default' => '',    'filter' => FILTER_SANITIZE_STRING],
            'assign'        => ['default' => '',    'filter' => FILTER_SANITIZE_STRING]
        ];
        // $this->restrict_params = FALSE;    // default: true
        // $this->use_json_format = TRUE;    // default: FALSE - can override e.g. 'groups' type



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

        if ( $this->field_alias_used=='input_repeater' ) {
            $this->options['repeater'] = TRUE;
            if ( empty($this->values) ) {
                $this->values = explode('||', $this->value);
            }
        }
        if ( $this->options['repeater'] && empty($this->values) ) $this->values[] = NULL;

        $class = '';
        $smarty = \CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate( 'string:'.$this->get_template(), null, null, $smarty );
        $tpl->assign( 'mod', $this->mod );
        $tpl->assign( 'block_name', $this->block_name );
        $tpl->assign( 'type', $this->field );
        $tpl->assign( 'label', $this->options['label'] );
        $tpl->assign( 'value', $this->value );
        $tpl->assign( 'values', $this->values );
        $tpl->assign( 'size', $this->options['size'] );
        $tpl->assign( 'max_length', $this->options['max_length'] );
        $tpl->assign( 'repeater', $this->options['repeater'] );
        $tpl->assign( 'max_blocks', $this->options['max_blocks'] );
        $tpl->assign( 'description', $this->options['description'] );
        $tpl->assign( 'assign', $this->options['assign'] );
        $tpl->assign( 'field_alias_used', $this->field_alias_used );
        $tpl->assign( 'use_json_format', $this->use_json_format );
        $tpl->assign( 'is_sub_field', $this->is_sub_field );
        if ( $this->is_sub_field ) {
            $tpl->assign( 'sub_row_number', $this->sub_row_number );
            $tpl->assign( 'subFieldName', $this->sub_parent_block.'[r_'.$this->sub_row_number.']['.
                $this->block_name.']' );
            $tpl->assign( 'subFieldId', $this->sub_parent_block.'_r_'.$this->sub_row_number.'_'.
                $this->block_name );
            $class .= ' repeater-field';
        }
        $tpl->assign('class', $class);  
        return $tpl->fetch();
   
    }


}