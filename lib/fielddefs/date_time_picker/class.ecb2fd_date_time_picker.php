<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------


class ecb2fd_date_time_picker extends ecb2_FieldDefBase 
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
        $this->default_parameters = [
            'size'              => ['default' => 20,        'filter' => FILTER_VALIDATE_INT],
            'label'             => ['default' => '',        'filter' => FILTER_SANITIZE_STRING],
            'max_length'        => ['default' => 20,        'filter' => FILTER_VALIDATE_INT],
            'date_format'       => ['default' => 'yy-mm-dd','filter' => FILTER_SANITIZE_STRING],
            'time_format'       => ['default' => 'HH:mm',   'filter' => FILTER_SANITIZE_STRING],
            'time'              => ['default' => '',        'filter' => FILTER_SANITIZE_STRING],
            'change_month'      => ['default' => FALSE,     'filter' => FILTER_VALIDATE_BOOLEAN],
            'change_year'       => ['default' => FALSE,     'filter' => FILTER_VALIDATE_BOOLEAN],
            'year_range'        => ['default' => '',        'filter' => FILTER_SANITIZE_STRING],
            'show_time'         => ['default' => FALSE,     'filter' => FILTER_VALIDATE_BOOLEAN],
            'date_only'         => ['default' => FALSE,     'filter' => FILTER_VALIDATE_BOOLEAN],
            'time_only'         => ['default' => FALSE,     'filter' => FILTER_VALIDATE_BOOLEAN],
            'admin_groups'  => ['default' => '',    'filter' => FILTER_SANITIZE_STRING],
            'description'       => ['default' => '',        'filter' => FILTER_SANITIZE_STRING]
        ];
        $this->parameter_aliases = [ 'time' => 'show_time' ];
        // $this->restrict_params = FALSE;    // default: true

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

        // set $class to 'datetimepicker' (default), 'datepicker' or 'timepicker' 
        $class = 'datetimepicker';
        if ( ( isset($this->field_alias_used) && $this->field_alias_used=='timepicker' ) ||
                $this->options['time_only'] ) {
            $class = 'timepicker';
        } elseif ( ( isset($this->field_alias_used) && $this->field_alias_used=='datepicker' && 
                !$this->options['show_time'] ) || $this->options['date_only'] ) {
            $class = 'datepicker';
        }
    
        $smarty = \CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate( 'string:'.$this->get_template(), null, null, $smarty );
        $tpl->assign('block_name', $this->block_name );
        $tpl->assign('value', $this->value );
        $tpl->assign('size', $this->options['size']);
        $tpl->assign('max_length', $this->options['max_length']);
        $tpl->assign('time_format', $this->options['time_format']);
        $tpl->assign('change_month', $this->options['change_month']);
        $tpl->assign('change_year', $this->options['change_year']);
        $tpl->assign('year_range', $this->options['year_range']);
        $tpl->assign('description', $this->options['description'] );
        $tpl->assign( 'label', $this->options['label'] );
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