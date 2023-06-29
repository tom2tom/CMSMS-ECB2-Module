<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------


class ecb2fd_gallery extends ecb2_FieldDefBase 
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
     *  Overides parent class
     *  sets $this->value or $this->values from $value saved for the content block - json or string
     *
     *  @param array $value - saved content block value
     */
    protected function get_values($value) 
    {
        if ( empty($value) ) return;

        $json_data = json_decode($value);
        if ( json_last_error()===JSON_ERROR_NONE && !is_integer($json_data) && 
             isset($json_data->sub_fields) ) {
            // JSON is valid - gallery uses $json_data->sub_fields
            $this->json_data = $json_data;
            $this->use_json_format = TRUE;
            $this->values = $json_data->sub_fields;

        } else { // but JSON not valid
            $this->values[] = $value;

        } 
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
            'dir'               => ['default' => '',     'filter' => FILTER_SANITIZE_STRING],
            'resize_width'      => ['default' => 0,      'filter' => FILTER_VALIDATE_INT],
            'resize_height'     => ['default' => 0,      'filter' => FILTER_VALIDATE_INT],
            'resize_method'     => ['default' => '',     'filter' => FILTER_SANITIZE_STRING],
            'thumbnail_width'   => ['default' => 0,      'filter' => FILTER_VALIDATE_INT],
            'thumbnail_height'  => ['default' => 0,      'filter' => FILTER_VALIDATE_INT],
            'max_files'         => ['default' => 0,      'filter' => FILTER_VALIDATE_INT],
            'auto_add_delete'   => ['default' => true,   'filter' => FILTER_VALIDATE_BOOLEAN],
            'default_value'     => ['default' => '',     'filter' => FILTER_SANITIZE_STRING], 
            'admin_groups'      => ['default' => '',     'filter' => FILTER_SANITIZE_STRING],
            'description'       => ['default' => '',     'filter' => FILTER_SANITIZE_STRING]
        ];
        // $this->parameter_aliases = [ 'alias' => 'parameter' ];
        $this->restrict_params = FALSE;    // default: true
        $this->use_json_format = TRUE;     // default: FALSE - can override e.g. 'groups' type
        $this->allowed_sub_fields = [
                'textinput',
                'textarea',
                'dropdown',
                'checkbox',         // working - indented :)
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
        $this->sub_fields_ignored_names = [
            'filename',
            'file_location'
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

        $location = ecb2_FileUtils::ECB2ImagesUrl( $this->block_name, $this->id, '', $this->options['dir'] );
        $dir = ecb2_FileUtils::ECB2ImagesPath( $this->block_name, $this->id, '', $this->options['dir'] );
        if ( $this->options['auto_add_delete'] ) {
            ecb2_FileUtils::autoAddDirImages( $this->values, $dir, $this->options['thumbnail_width'], $this->options['thumbnail_height']);
        }
        $resize_method = ($this->options['resize_method']=='crop') ? 'crop' : ''; // default: 'contain'
        $thumbnail_width = $this->options['thumbnail_width'];
        $thumbnail_height = $this->options['thumbnail_height'];
        ecb2_FileUtils::get_required_thumbnail_size( $thumbnail_width, $thumbnail_height );
        $max_files = $this->options['max_files'];
        if ( $max_files>0 ) {
            $max_files_text = $this->mod->Lang( 'max_files_text', $max_files );
        } else {
            $max_files_text = $this->mod->Lang( 'max_files_unlimited_text' );
        }

        $actionparms = [];
        $action_url = $this->mod->create_url( 'm1_', 'do_UploadFiles', '', $actionparms);
        $filenames = [];
        foreach ($this->values as $gallery_item) {
            if ( !empty($gallery_item->filename) ) $filenames[] = $gallery_item->filename;
        }
        $json_filenames = json_encode($filenames, JSON_HEX_APOS);

        if ($this->error) return $this->mod->error_msg($this->error);

        $smarty = \CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate( 'string:'.$this->get_template(), null, null, $smarty );
        $tpl->assign( 'block_name', $this->block_name );
        $tpl->assign( 'values', $this->values );
        $tpl->assign( 'json_filenames', $json_filenames );
        $tpl->assign( 'sub_fields', $this->sub_fields );
        $tpl->assign( 'location', $location );
        $tpl->assign( 'resize_width', $this->options['resize_width'] );
        $tpl->assign( 'resize_height', $this->options['resize_height'] );
        $tpl->assign( 'resize_method', $resize_method );
        $tpl->assign( 'thumbnail_width', $thumbnail_width );
        $tpl->assign( 'thumbnail_height', $thumbnail_height );
        $tpl->assign( 'max_files', $max_files );
        $tpl->assign( 'max_files_text', $max_files_text );
        $tpl->assign( 'thumbnail_prefix', ecb2_FileUtils::THUMB_PREFIX );
        $tpl->assign( 'type', $this->field );
        $tpl->assign( 'action_url', $action_url );
        $tpl->assign( 'description', $this->options['description'] );
        return $tpl->fetch();
   
    }



    /**
     *  Data entered by the editor is processed before its saved in props table
     *  Method can be overidden by this class (usually also calls parent class)
     *  
     *  @return string formatted json containing all field data ready to be saved & output
     */
    public function get_content_block_value( $inputArray ) 
    {
        if ( is_array($inputArray) ) {
            // if a gallery item does not include filename (should not happen) or
            //      key is 'empty' remove that gallery item
            foreach ($inputArray as $row_number => $galleryArray) {
                if ( empty($galleryArray['filename']) || $row_number=='empty' ) {
                    unset( $inputArray[$row_number] );
                }
            }
        }
        if ( empty($inputArray) ) $inputArray = array('sub_fields' => []);

        $this->field_object = $this->create_field_object( $inputArray );
        // add 'file_location' field to all gallery items
        if ( !empty($this->field_object->sub_fields) ) {
            $galleryRelativeUrl = ecb2_FileUtils::ECB2ImagesRelativeUrl( $this->block_name, $this->id, '', 
                $this->options['dir'] );
            foreach ($this->field_object->sub_fields as &$row) {
                if ( !empty($row['filename']) ) $row['file_location'] = $galleryRelativeUrl;
            }
        }

        // handle moving files from _tmp into galleryDir, create thumbnails & delete any unwanted files
        $galleryDir = ecb2_FileUtils::ECB2ImagesPath( $this->block_name, $this->id, '', 
            $this->options['dir'] );
        $filenames = [];
        foreach ($this->field_object->sub_fields as $fileArray) {
            if ( !empty($fileArray['filename']) ) $filenames[] = $fileArray['filename'];
        }
        ecb2_FileUtils::updateGalleryDir( $filenames, $galleryDir, $this->options['auto_add_delete'], 
            $this->options['thumbnail_width'], $this->options['thumbnail_height'] );
    
        return $this->ECB2_json_encode_field_object(); 
    }



}