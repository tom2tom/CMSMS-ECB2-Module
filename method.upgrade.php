<?php
#---------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016-2024 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#   see /ECB2/LICENCE or <http://www.gnu.org/licenses/gpl-3.0.html>
#---------------------------------------------------------------------

use ECB2\Blocks;
use ECB2\Utils;

if (!isset($gCms)) {
    exit;
}

//$db = $this->GetDb();
if (version_compare($oldversion, '1.4') < 0) {
    // remove permission USE_ECB2
    define('USE_ECB2', 'Use Extended Content Blocks');
    $this->RemovePermission(USE_ECB2);
}
$module_path = $this->GetModulePath();
if (version_compare($oldversion, '1.8') < 0) {
    // remove sub dirs
    $dirsToRemove = ['/lib/js/images', '/icons'];
    foreach ($dirsToRemove as $delDir) {
        recursive_delete($module_path.$delDir);
    }
    // individual files to remove
    $filesToRemove = ['/lib/js/mColorPicker.min.js', '/changelog.inc', '/lib/js/jquery-ui-timepicker-addon.js',
        '/lib/js/colpick.js'];
    foreach ($filesToRemove as $delFile) {
        @unlink($module_path.$delFile);
    }
}

if (version_compare($oldversion, '2.0') < 0) {
    // remove sub dirs
    $dirsToRemove = ['/lib/fielddefs/input_repeater'];
    foreach ($dirsToRemove as $delDir) {
        recursive_delete($module_path.$delDir);
    }
    // individual files to remove
    $filesToRemove = [
        '/lib/class.ecb2_tools.php',
        '/test/ecb2_sortable_udt_test.php',
        '/templates/colorpicker_template.tpl',
        '/templates/datepicker_template.tpl',
        '/templates/image_template.tpl',
        '/templates/input_repeater_template.tpl',
        '/templates/select_template.tpl',
        '/templates/sortablelist_template.tpl',
        '/templates/_help.tpl',
        '/templates/_changelog.tpl',
        '/action.refresh.php'
    ];
    foreach ($filesToRemove as $delFile) {
        @unlink($module_path.$delFile);
    }

    Utils::CreateImagesDir();
}

if (version_compare($oldversion, '1.99.3') < 0) {
    $this->CreatePermission(ECB2::MANAGE_PERM, 'Extended Content Blocks 2 - Manage');
}

if (version_compare($oldversion, '1.99.5') < 0) {
    //  create module_ecb2_blocks table
    $blocks_table = new Blocks();
    $blocks_table->create_database();
}

if (version_compare($oldversion, '2.3') <= 0) {
    $dirsToRemove = ['/test'];
    foreach ($dirsToRemove as $delDir) {
        if (file_exists($module_path.$delDir)) {
            recursive_delete($module_path.$delDir);
        }
    }
    $filesToRemove = ['/templates/ECB2_Test_Template.tpl'];
    foreach ($filesToRemove as $delFile) {
        @unlink($module_path.$delFile);
    }
}

if (version_compare($oldversion, '2.4') <= 0) {
    // support simple-format tags
    $this->RegisterModulePlugin(true);
}

