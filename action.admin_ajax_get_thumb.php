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

// mimic deprecated filter_var( ,FILTER_SANITIZE_STRING)
// unlike strip_tags(), this does not remove unclosed tags unless they're PHP tags
// see also ECB2\FieldDefBase::sanitize_string()
$sanitize_fn = function($value)
{
    if ($value) {
        $tmp = preg_replace(['/<[^>]*>/','/<\s*\?\s*php.*$/i','/<\s*\?\s*=.*$/'], ['','',''], $value);
        return strtr($tmp, ["\0"=>'', "'"=>'&#39;', '"'=>'&#34;']);
    }
    return (string)$value;
};

$file_name = $sanitize_fn(get_parameter_value($_POST, 'file_name'));
if (!$file_name || strtolower($_SERVER['REQUEST_METHOD']) != 'post') {
    exit;
}

$top_dir = $sanitize_fn(get_parameter_value($_POST, 'top_dir'));
if (!$top_dir) {
    $top_dir = '';
}
$thumbnail_width = filter_var(get_parameter_value($_POST, 'thumbnail_width'), FILTER_SANITIZE_NUMBER_INT);
if (!$thumbnail_width) {
    $thumbnail_width = 0;
}
$thumbnail_height = filter_var(get_parameter_value($_POST, 'thumbnail_height'), FILTER_SANITIZE_NUMBER_INT);
if (!$thumbnail_height) {
    $thumbnail_height = 0;
}

$config = cmsms()->GetConfig();
$img_src = cms_join_path($config['uploads_path'], $top_dir, $file_name);

$thumbnail_url = FileUtils::get_thumbnail_url($img_src, $thumbnail_width, $thumbnail_height);

$n = count(ob_list_handlers());
for ($cnt = 0; $cnt < $n; $cnt++) {
    ob_end_clean();
}
echo $thumbnail_url; // '' if no thumbnail
