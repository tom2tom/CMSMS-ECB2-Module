<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------

class ecb2_FileUtils 
{

    const ECB2_IMAGE_DIR = '_ecb2_images';
    const ECB2_IMAGE_TEMP_DIR = '_tmp';     // sub dir of ECB2_IMAGE_DIR
    const THUMB_PREFIX = 'thumb_'; 


    /**
     *  @return string path to ECB2 images temp sub dir: /ECB2_IMAGE_DIR/ECB2_IMAGE_TEMP_DIR
     */
    public static function ECB2ImagesTempPath() 
    {
        $config = cmsms()->GetConfig();
        return cms_join_path( $config['image_uploads_path'], self::ECB2_IMAGE_DIR, 
            self::ECB2_IMAGE_TEMP_DIR ).DIRECTORY_SEPARATOR;
    }



    /**
     *  @return string path to unique ECB2 images sub dir: /ECB2_IMAGE_DIR/blockname_module_id
     *  @param string $blockname - name of props blockname
     *  @param string $id - content id - i.e. page id
     *  @param string $module - if not Content page (default) - not actually used yet
     *  @param string $uploads_dir - if set is a subdir of /uploads to use
     */
    public static function ECB2ImagesPath( $blockname, $id='', $module='', $uploads_dir='' ) 
    {
        $config = cmsms()->GetConfig();
        if ( !empty($uploads_dir) ) {
            $imagesPath = cms_join_path( $config['image_uploads_path'], $uploads_dir );
            return $imagesPath.DIRECTORY_SEPARATOR;
        }

        if ( empty($blockname) ) return FALSE;

        $imagesPath = cms_join_path( $config['image_uploads_path'], self::ECB2_IMAGE_DIR );
        $dirname = munge_string_to_url( $blockname. ($module ? '_'.$module : '') . ($id ? '_'.$id : '') );
        return $imagesPath.DIRECTORY_SEPARATOR.$dirname.DIRECTORY_SEPARATOR;
    }



    /**
     *  @return string url to either a subdir of /uploads, or a unique ECB2 images sub dir: 
     *                   /ECB2_IMAGE_DIR/blockname_module_id
     *  @param string $blockname - name of props blockname
     *  @param string $id - content id - i.e. page id
     *  @param string $module - if not Content page (default) - not actually used yet
     *  @param string $uploads_dir - if set is a subdir of /uploads to use
     */
    public static function ECB2ImagesUrl( $blockname, $id, $module='', $uploads_dir='' ) 
    {
        $config = cmsms()->GetConfig();
        if ( !empty($uploads_dir) ) {
            $ecb2Url = cms_join_path( $config['image_uploads_url'], $uploads_dir );
            return $ecb2Url.DIRECTORY_SEPARATOR;
        }

        if ( empty($blockname) ) return FALSE;

        $ecb2Url = cms_join_path( $config['image_uploads_url'], self::ECB2_IMAGE_DIR ).DIRECTORY_SEPARATOR;
        $dirname = munge_string_to_url( $blockname. ($module ? '_'.$module : '') . ($id ? '_'.$id : '') );
        return $ecb2Url.$dirname.DIRECTORY_SEPARATOR;
    }



    /**
     *  @return string url relative to the website root to either a subdir of /uploads, or a unique 
     *                 ECB2 images sub dir:  /ECB2_IMAGE_DIR/blockname_module_id
     *  @param string $blockname - name of props blockname
     *  @param string $id - content id - i.e. page id
     *  @param string $module - if not Content page (default) - not actually used yet
     *  @param string $uploads_dir - if set is a subdir of /uploads to use
     */
    public static function ECB2ImagesRelativeUrl( $blockname, $id, $module='', $uploads_dir='' ) 
    {
        $config = cmsms()->GetConfig();
        $relativeUploadsDir = str_replace(CMS_ROOT_URL, '', $config['image_uploads_url']);
        if ( !empty($uploads_dir) ) {
            $ecb2Url = cms_join_path( $relativeUploadsDir, $uploads_dir );
            return $ecb2Url.DIRECTORY_SEPARATOR;
        }

        if ( empty($blockname) ) return FALSE;

        $ecb2Url = cms_join_path( $relativeUploadsDir, self::ECB2_IMAGE_DIR ).DIRECTORY_SEPARATOR;
        $dirname = munge_string_to_url( $blockname. ($module ? '_'.$module : '') . ($id ? '_'.$id : '') );
        return $ecb2Url.$dirname.DIRECTORY_SEPARATOR;
    }



    /**
     *  creates the unique ECB2 images sub dir - if it doesn't already exist: 
     *          /ECB2_IMAGE_DIR/blockname_module_id
     *      or the ECB2_IMAGE_DIR/ECB2_IMAGE_TEMP_DIR if params all empty
     *  @param string $blockname - name of props blockname
     *  @param string $id - content id - i.e. page id
     *  @param string $module - if not Content page (default) - not actually used yet
     *  @param string $uploads_dir - if set is a subdir of /uploads/images to use (default)
     */
    public static function CreateImagesDir( $blockname='', $id='', $module='', $uploads_dir='' )
    {
        $success = false;
        if ( !empty($uploads_dir) || !empty($blockname) ) {
            $ecb2_images_dir = self::ECB2ImagesPath( $blockname, $id, $module, $uploads_dir );
        } else {
            $ecb2_images_dir = self::ECB2ImagesPath( self::ECB2_IMAGE_TEMP_DIR );
        }

        if ( $ecb2_images_dir && !file_exists($ecb2_images_dir) ) {
            $success = mkdir($ecb2_images_dir, 0755, true);
        }
        return $success;
    }



    /** NB: NOT CURRENTLY USED...
     *  unique filename for ECB2 images, if filename already exists, it has _x 
     *      appended before the suffix, e.g. 'new_image_1.jpg', then 'new_image_2.jpg' 
     *
     *  @return string unique filename 
     *  @param string $uploaded_filename - original filename to make unique
     *  @param string $dir - directory to check for unique filename
     */
    public static function ECB2UniqueFilename( $uploaded_filename, $dir='' ) 
    {
        if ( empty($uploaded_filename) ) return;

        $dir_to_check = ( !empty($dir) ) ? $dir : self::ECB2ImagesPath();
        $tmp_filename = basename($uploaded_filename);   // may prevent filesystem traversal attacks
        $filename_only = pathinfo($tmp_filename, PATHINFO_FILENAME);
        $extension_only =  pathinfo($tmp_filename, PATHINFO_EXTENSION);
        $FileCounter = 0;

        while ( file_exists($dir_to_check.$tmp_filename) ) {
            $FileCounter++;
            $tmp_filename = $filename_only.'_'.$FileCounter.'.'.$extension_only;
        }

        return $tmp_filename;
    }



    /**
     *  upload file into ECB2ImagesTempPath
     *
     *  @return boolean $success
     *  @param string $original_filename - original filename of uploaded file
     *  @param string $tmp_filename - temp filename of the file on the server
     */
    public static function ECB2MoveUploadedFile( $original_filename, $tmp_filename  ) 
    {
        if ( empty($original_filename) || empty($tmp_filename) ) return false;

        $ecb2_images_path = self::ECB2ImagesTempPath();
        $success = cms_move_uploaded_file( $tmp_filename, $ecb2_images_path.$original_filename );
        return $success;

    }



    /**
     *  move files from _tmp into $dir, deleting any unwanted files
     *  existing files with same name will not be overwritten
     *
     *  @param array $values - filenames of all files in the gallery
     *  @param string $dir - directory to be updated with set gallery images
     *  @param boolean $auto_add_delete - if set delete any unused images & thumbnails
     *  @param boolean $thumb_width - thumbnail width set for this content block
     *  @param boolean $thumb_height - thumbnail height set for this content block
     */
    public static function updateGalleryDir( $values, $dir, $auto_add_delete, $thumb_width=0, 
        $thumb_height=0 )
    {
        if ( empty($values) && !$auto_add_delete ) return;

        $tmp_dir = self::ECB2ImagesTempPath();
        // create $dir if it doesn't exist
        if ( $dir && !file_exists($dir) ) {
            $success = mkdir($dir, 0755, true);
        }
        foreach ($values as $filename) {
            if ( !file_exists($dir.$filename) && file_exists($tmp_dir.$filename)) {
                rename( $tmp_dir.$filename, $dir.$filename );   // moves file from _tmp
            }
        }

        // delete any thumbnails that are not the correct size
        self::get_required_thumbnail_size( $thumb_width, $thumb_height );
        foreach ( glob( $dir.self::THUMB_PREFIX.'*.*' ) as $thumbfilename) {
            $tmp_thumbfilename = basename($thumbfilename);
            list($width, $height) = getimagesize($thumbfilename);
            if ( ($thumb_width>0 && $width!=$thumb_width) || 
                 ($thumb_height>0 && $height!=$thumb_height) ) {
                unlink($thumbfilename);
            }
        }

        // create any new thumbnails
        foreach ( $values as $filename) {
            if ( !file_exists($dir.self::THUMB_PREFIX.$filename) ) {
                self::create_thumbnail( $dir.$filename, $thumb_width, $thumb_height );
            }
        }

        // remove any unused files & their thumbnails 
        if ($auto_add_delete) {    
            $filesAndThumbs = $values;
            foreach ( $values as $filename) {
                $filesAndThumbs[] = self::THUMB_PREFIX.$filename;
            }
            foreach ( glob( $dir.'*.*' ) as $filename) {
                $tmp_filename = basename($filename);
                if ( !in_array($tmp_filename, $filesAndThumbs) ) unlink($filename);
            }
        }
    
    }



    /**
     *  adds any additional files in $dir into $values object ($this->values) 
     *
     *  @param array $values - filenames of already selected files in the dir
     *  @param string $dir - directory to be used for this gallery
     */
    public static function autoAddDirImages( &$values, $dir, $thumbnail_width=0, $thumbnail_height=0)
    {
        $all_filenames = [];
        foreach ($values as $gallery_item) {
            if ( !empty($gallery_item->filename) ) $all_filenames[] = $gallery_item->filename;
        }
        
        foreach ( glob( $dir.'*.*' ) as $filename) {
            $tmp_filename = basename($filename);
            if ( !self::isECB2Thumb($tmp_filename) && !in_array($tmp_filename, $all_filenames) ) {
                $new_item = new stdClass();
                $new_item->filename = $tmp_filename;
                $values[] = $new_item;
                self::create_thumbnail($filename, $thumbnail_width, $thumbnail_height);
            }
        }

    }



    /**
     * @return boolean true if $haystack starts with self::THUMB_PREFIX ('thumb_')
     */
    public static function isECB2Thumb( $haystack ) 
    {
        $length = strlen( self::THUMB_PREFIX );
        return substr( $haystack, 0, $length ) === self::THUMB_PREFIX;
    }



    /**
     *  Creates a thumbnail for the $src file if it doesn't already exist, or is not the required size
     *
     *  @param string $src - filename of file to create thumbnail for
     *  @param int $thumb_width - width of thumbnail to be created (default: module pref, sitepref)
     *  @param int $thumb_height - height of thumbnail to be created (default: module pref, sitepref)
     *  @param string $dest - alternative filename for new thumbnail
     *  @param boolean $force - if set to TRUE will overwrite any existing thumbnail filename
     *  @return boolean true if new thumbnail created
     *  based on FileManager > class.filemanager_utils
     */
    public static function create_thumbnail($src, $thumb_width=0, $thumb_height=0, $dest=NULL, $force=FALSE)
    {
        if ( !file_exists($src) || !is_file($src) ) return FALSE;
        if ( !$dest ) {
            $bn = basename($src);
            $dn = dirname($src);
            $dest = $dn.DIRECTORY_SEPARATOR.self::THUMB_PREFIX.$bn;
        }

        if ( !$force && (file_exists($dest) && !is_writable($dest) ) ) return FALSE;
        
        $info = getimagesize($src);
        if ( !$info || !isset($info['mime']) ) return FALSE;
        $src_width = $info[0];
        $src_height = $info[1];
        $src_x = 0; 
        $src_y = 0;

        self::get_thumbnail_size($src_width, $src_height, $thumb_width, $thumb_height, $src_x, $src_y);

        // if thumbnail exists and is of correct size - leave as is, unless $force set
        $thumb_info = getimagesize($dest);
        if ( !$force || !$thumb_info || !isset($thumb_info['mime']) ) {
            if ( $thumb_info[0]==$thumb_width && $thumb_info[1]==$thumb_height ) {
                return true;
            }
        }

        // create new thumbnail
        $i_src = imagecreatefromstring(file_get_contents($src));
        $i_dest = imagecreatetruecolor($thumb_width, $thumb_height);
        imagealphablending($i_dest, FALSE);
        $color = imageColorAllocateAlpha($i_src, 255, 255, 255, 127);
        imagecolortransparent($i_dest, $color);
        imagefill($i_dest, 0, 0, $color);
        imagesavealpha($i_dest, TRUE);
        imagecopyresampled($i_dest, $i_src, 0,0, $src_x, $src_y, $thumb_width, $thumb_height, $src_width, $src_height);

        $res = null;
        switch( $info['mime'] ) {
        case 'image/gif':
            $res = imagegif($i_dest,$dest);
            break;
        case 'image/png':
            $res = imagepng($i_dest,$dest,9);
            break;
        case 'image/jpeg':
            $res = imagejpeg($i_dest,$dest,100);
            break;
        }

        if ( !$res ) return FALSE;
        return TRUE;
    }



    /**
     *  sets provided parameters thumb_width & thumb_height
     *  based on the provided values, defaulting to module preferences, or global siteprefs
     *
     *  @param string $thumb_width - width of thumbnail to be created (default: module pref, sitepref)
     *  @param string $thumb_height - height of thumbnail to be created (default: module pref, sitepref)
     */
    public static function get_required_thumbnail_size( &$thumb_width=0, &$thumb_height=0 )
    {
        $thumb_width = (int) $thumb_width;
        $thumb_height = (int) $thumb_height;
        if ( $thumb_width==0 && $thumb_height==0 ) { 
            $module = cms_utils::get_module( 'ECB2' );
            $ecb2_thumb_width = $module->GetPreference('thumbnailWidth', '');
            $ecb2_thumb_height = $module->GetPreference('thumbnailHeight', '');
            if ( !empty($ecb2_thumb_width) || !empty($ecb2_thumb_height) ) { // use module preferences
                $thumb_width = (int)$ecb2_thumb_width;
                $thumb_height = (int)$ecb2_thumb_height;

            } else {    // use CMSMS preferences
                $thumb_width = (int)cms_siteprefs::get('thumbnail_width',96);
                $thumb_height = (int)cms_siteprefs::get('thumbnail_height',96);
            }
        }
    }



    /**
     *  sets provided parameters thumb_width & thumb_height, src_y, & src_y
     *  based on the provided values, defaulting to module preferences, or global siteprefs
     *  if only width or height set (params or module pref) then height or width 100% (respectively)
     *  thumbnail cropped to retain image ratio
     *
     *  @param array $src_width - width of the src image 
     *  @param array $src_height - height of the src image
     *  @param string $thumb_width - width of thumbnail to be created (default: module pref, sitepref)
     *  @param string $thumb_height - height of thumbnail to be created (default: module pref, sitepref)
     *  @param string $src_x - 0 or set if width cropping required
     *  @param boolean $src_y - 0 or set if height cropping required
     *  based on FileManager > class.filemanager_utils
     */
    public static function get_thumbnail_size( &$src_width, &$src_height, &$thumb_width=0, &$thumb_height=0, &$src_x=0, &$src_y=0 )
    {
        self::get_required_thumbnail_size( $thumb_width, $thumb_height );

        // if one dimension not set calculate width/height ratio
        if ( $thumb_width!=0 && $thumb_height!=0 ) {
            $thumb_width = (int)$thumb_width;
            $thumb_height = (int)$thumb_height;

        } elseif ( $thumb_width==0 ) {  // but not $thumb_height
            $thumb_width = (int)($src_width / $src_height * $thumb_height);

        } else { // $thumb_height==0 but not $thumb_width
            $thumb_height = (int)($src_height / $src_width * $thumb_width);

        }

        // set $src_x/$src_y to crop width/height if required & set $src_width/$src_height
        if ( $src_height==0 || $thumb_height==0) return;
        $ratio_src = $src_width / $src_height;
        $ratio_thumb = $thumb_width / $thumb_height;
        if ($ratio_src > $ratio_thumb) {    // src_wider_than_thumb
            $src_x = (int)(($src_width - $src_height * $ratio_thumb) / 2); 
            $src_width = (int)($src_height * $ratio_thumb); 

        } else {                            // src_taller_than_thumb
            $src_y = (int)(($src_height - $src_width / $ratio_thumb) / 2); 
            $src_height = (int)($src_width / $ratio_thumb);

        }

    }



    /**
     *  converts File system path to URL
     *  
     *  @return string url to access given $file
     */
    public static function path2url($file, $Protocol='https://') 
    {
        return $Protocol.$_SERVER['HTTP_HOST'].str_replace($_SERVER['DOCUMENT_ROOT'], '', $file);
    }



    /**
     *  provides thumbnail url for $src file, it's created if it doesn't already exist & correct size
     *
     *  @param string $src - filename of file to create thumbnail for
     *  @param int $thumb_width - width of thumbnail to be created (default: module pref, sitepref)
     *  @param int $thumb_height - height of thumbnail to be created (default: module pref, sitepref)
     *  @param string $dest - alternative filename for new thumbnail
     *  @param boolean $force - if set to TRUE will overwrite any existing thumbnail filename
     *  @return string thumbnail url for given $src image or '' if it doesn't exist
     */
    public static function get_thumbnail_url($src, $thumb_width=0, $thumb_height=0, $dest=NULL, $force=FALSE)
    {
        $created = self::create_thumbnail($src, $thumb_width, $thumb_height, $dest, $force);

        if ( !$created ) return '';

        if ( !$dest ) {
            $bn = basename($src);
            $dn = dirname($src);
            $dest = $dn.DIRECTORY_SEPARATOR.self::THUMB_PREFIX.$bn;
        }
        if ( !file_exists($dest) ) return '';

        return self::path2url($dest);

    }



}