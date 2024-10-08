<?php
#---------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016-2024 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/LICENCE or <http://www.gnu.org/licenses/gpl-3.0.html>
#---------------------------------------------------------------------

namespace ECB2;

use CMSMS\App as CmsApp; // CMSMS3 disable for CMSMS2
use const CMS_DB_PREFIX;
use function NewDataDictionary;

class Blocks
{
    // private $content_id;
    // private $properties;

    /**
     *  to be used for module install/upgrade only
     */
    public function create_database()//: void
    {
        //  create module_ecb2_blocks table
        $db = CmsApp::get_instance()->GetDb();
        $dict = NewDataDictionary($db);
        $taboptarray = ['mysqli' => 'ENGINE=MyISAM', 'mysql' => 'ENGINE=MyISAM'];
        $fields = '
            id       I KEY AUTO,
            type     C(25) NOTNULL,
            name     C(255) NOTNULL,
            group_id I4,
            attribs  X,
            position I2
        ';
        $sqlarray = $dict->CreateTableSQL(CMS_DB_PREFIX.'module_ecb2_blocks', $fields, $taboptarray);
        $res = $dict->ExecuteSQLArray($sqlarray);
    }

    /**
     *  to be used for module uninstall only
     */
    public function remove_database()//: void
    {
        $db = CmsApp::get_instance()->GetDb();
        $dict = NewDataDictionary($db);
        $sqlarray = $dict->DropTableSQL(CMS_DB_PREFIX.'module_ecb2_blocks');
        $dict->ExecuteSQLArray($sqlarray);
    }
}
