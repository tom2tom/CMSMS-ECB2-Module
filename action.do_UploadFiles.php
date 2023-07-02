<?php
#-----------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, TODOchris@cmsmadesimple.org
# Licence: GNU General Public License version 3
#          see /ECB2/LICENCE or <http://www.gnu.org/licenses/#GPL>
#-----------------------------------------------------------------------------

use ECB2\FileUtils;

if (!defined('CMS_VERSION')) {
    exit;
}

if (!empty($_FILES['file'])) {
    $result = [];
    foreach ($_FILES['file']['error'] as $key => $error) {
        $new_filename = false;
        $original_filename = $_FILES['file']['name'][$key];
        if ($error == UPLOAD_ERR_OK) {
            $tmp_filename = $_FILES['file']['tmp_name'][$key];
            $success = FileUtils::ECB2MoveUploadedFile($original_filename, $tmp_filename);
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
