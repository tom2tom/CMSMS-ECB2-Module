<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------


if (!isset($gCms)) exit;


if (!isset($params['block_name']) || !isset($params['value']) || !isset($params['adding']))
    return;

$blockName = $params['block_name'];
$value = $params['value'];
$adding = $params['adding'];


$ecb2 = new ecb2_tools($blockName, $value, $params, $adding);
echo $ecb2->get_content_block_input();

?>