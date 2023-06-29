<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------


if ( !defined('CMS_VERSION') ) exit;

if ( !empty($_FILES['file']) ) {

    $result = [];
    foreach ($_FILES['file']['error'] as $key => $error) {
        $new_filename = FALSE;
        $original_filename = $_FILES['file']['name'][$key];
        if ( $error==UPLOAD_ERR_OK ) {
            $tmp_filename = $_FILES['file']['tmp_name'][$key];
            $success = ecb2_FileUtils::ECB2MoveUploadedFile( $original_filename, $tmp_filename );
        }
//  $success = FALSE;     // only for testing!
        $result[] = [
            'name' => $original_filename,
            'success' => $success    
        ];
    }

    header('Content-type: application/json');
    echo json_encode($result);
    exit();

}

