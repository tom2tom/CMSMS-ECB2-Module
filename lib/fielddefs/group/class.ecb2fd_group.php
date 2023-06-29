<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------


class ecb2fd_group extends ecb2_FieldDefBase 
{

	public function __construct($mod, $blockName, $value, $params, $adding, $id=0) 
	{	
		parent::__construct( $mod, $blockName, $value, $params, $adding, $id );

        $this->get_values( $value );              // common FieldDefBase method

        $this->set_field_parameters();

        $this->initialise_options( $params );     // common FieldDefBase method

        $this->create_sub_fields( $params );      // common FieldDefBase method
        
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
        $this->default_parameters = [
            'max_blocks'    => ['default' => 0,       'filter' => FILTER_VALIDATE_INT],
            'layout'        => ['default' => 'table', 'filter' => FILTER_SANITIZE_STRING],
            'remove_empty'  => ['default' => 0,       'filter' => FILTER_VALIDATE_BOOLEAN],
            'description'   => ['default' => '',      'filter' => FILTER_SANITIZE_STRING],
            'admin_groups'  => ['default' => '',      'filter' => FILTER_SANITIZE_STRING],
            'assign'        => ['default' => '',      'filter' => FILTER_SANITIZE_STRING]
        ];
        // $this->parameter_aliases = [ 'alias' => 'parameter' ];
        $this->restrict_params = FALSE;    // default: true
        $this->use_json_format = TRUE;     // default: FALSE - can override e.g. 'groups' type
        $this->allowed_sub_fields = [
            'textinput',
            'textarea',
            'dropdown',
            'checkbox',
            'radio',
            'color_picker',
            'date_time_picker',
            'file_selector',
            // 'file_picker',
            'page_picker',
            'gallery_picker',
            'module_picker'     
        ];
        $this->sub_fields_ignored_params = [
            'assign',
            'repeater',
            'max_blocks'
        ];
        // $this->sub_fields_ignored_names = [];
        $this->sub_fields_required = TRUE;
        $this->layout_options = ['table','block'];  // block, grid ...

    }



    /**
     *  some extra tweaks to options in addition to standard initialisation (FieldDefBase)
     */
    protected function initialise_options($params)
    {
		parent::initialise_options($params);

        if ( !in_array($this->options['layout'], $this->layout_options) ) {
            $this->options['layout'] = $this->default_parameters['layout']['default'];
        }

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

        if ( empty($this->values) ) $this->values[] = NULL;

        if ($this->error) return $this->mod->error_msg($this->error);

        $smarty = \CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate( 'string:'.$this->get_template(), null, null, $smarty );
        $tpl->assign( 'block_name', $this->block_name );
        // $tpl->assign( 'value', $this->value );
        $tpl->assign( 'mod', $this->mod );
        $tpl->assign( 'block_name', $this->block_name );
        $tpl->assign( 'type', $this->field );
        $tpl->assign( 'values', $this->values );      // sub_field values
        $tpl->assign( 'sub_fields', $this->sub_fields );
        $tpl->assign( 'max_blocks', $this->options['max_blocks'] );
        $tpl->assign( 'description', $this->options['description'] );
        $tpl->assign( 'layout', $this->options['layout'] );
        $tpl->assign( 'assign', $this->options['assign'] );
        return $tpl->fetch();
   
    }



    /**
     *  Data entered by the editor is processed before its saved in props table
     *  This method,  overides the parent class method, to enable additional processing 
     *  before the data is saved.
     *
     *  @return string formatted json containing all field data ready to be saved & output
     */
    public function get_content_block_value( $inputArray ) 
    {
        // if remove_empty option set - remove any empty groups (where all sub_fields empty)
        // or if only 1 group and it's empty return and empty 'sub_fields' object
        $remove_rows = [];
        if ( is_array($inputArray) && ( count($inputArray)==1 || $this->options['remove_empty'] ) ) {
            foreach ($inputArray as $row_number => $groupArray) {
                if ( self::is_empty_group($groupArray) ) $remove_rows[] = $row_number;
            }
        }
        foreach ($remove_rows as $row_number) {
            unset( $inputArray[$row_number] );
        }
        if ( empty($inputArray) ) $inputArray = array('sub_fields' => []);

        $this->field_object = $this->create_field_object( $inputArray );
    
        return $this->ECB2_json_encode_field_object(); 
    }



    /**
     *  @param array groupArray - an array of all sub_fields for one group row
     *
     *  @return boolean true if group is empty
     */
    public function is_empty_group( $groupArray=[] ) 
    {
        $isEmpty = TRUE;
        foreach ($groupArray as $value) {
            if ( !empty($value) ) {
                $isEmpty = FALSE;
                break;
            }
        }
        return $isEmpty;

    }



}