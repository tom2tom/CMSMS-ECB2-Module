<?php
/*
 * Extended Content Blocks 2 class: ecb2_tools
 * Copyright (C) 2016-2022 CMS Made Simple Foundation <foundation@cmsmadesimple.org>
 * Thanks to Chris Tatlor and all other contributors from the CMSMS Development Team.
 *
 * This file is a component of CMS Made Simple module Extended Content Blocks 2.
 * CMS Made Simple is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of that license, or
 * (at your option) any later version.
 *
 * CMS Made Simple is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of that license along with CMS Made Simple.
 * If not, see <https://www.gnu.org/licenses/>.
 */
 class ecb2_tools
 {
    /**
     * @var static int
     * incrementing counter
     */
    protected static $ctr = 0;

    /**
     * @var object
     * ECB2 module
     */
    protected $mod;

    /**
     * @var array
     * multi-load blockers
     */
    private $loaded = [];

    /**
     * @var bool
     * whether header-additions have been started
     */
    private $firsthead = false;

    public function __construct($mod = null)
    {
        if ($mod) {
            $this->mod = $mod;
        } else {
            $this->mod = cms_utils::get_module('ECB2');
        }
    }

    /**
     * Get a content block of the specified type
     * @param string $blockName
     * @param mixed $value
     * @param array $params Appropriate block parameters
     * @param boolean $adding Optional flag whether processing a new page. Default false
     * @return string, html maybe with associated js, or maybe an error/warning or empty
     */
    public function get_content_block_input($blockName, $value, $params, $adding = false)
    {
        $options = $this->init($blockName, $value, $params, $adding);
        if (!empty($options['field'])) {
            $fname = 'get_' . strtolower($options['field']);
            if (method_exists($this, $fname)) {
                return $this->$fname($options);
            }
            return '<div class="pageerror">' . $this->mod->Lang('field_error', $blockName) . '</div><br>';
        }
        return '<div class="pageerror">' . $this->mod->Lang('parameter_missing', 'field', $blockName) . '</div><br>';
    }

    /**
     * Get a hidden input
     * @param array $options
     * @return string
     */
    public function get_hidden($options)
    {
        $tmp = '<input type="hidden" name="%s" value="%s">';
        return sprintf($tmp, $options['block_name'], $options['value']);
    }

    /**
     * Get a fieldset start
     * @param array $options
     * @return string
     */
    public function get_fieldset_start($options)
    {
        $tmp = <<<'EOS'
<fieldset name="%s">
 <legend>%s</legend>

EOS;
        $out  = sprintf($tmp, $options['block_name'], $options['legend']);
        if ($options['description']) {
            $out .= "\n<div>" . nl2br($options['description']) . "</div>\n";
        }
        return $out;
    }

    /**
     * Get the fieldset end to finalize get_fieldset_start()
     * @return string
     */
    public function get_fieldset_end()
    {
        return <<<'EOS'
</fieldset>

EOS;
    }

    /**
     * Get a gallery_picker content block
     *
     * @param array $options
     *  'dir' - only return galleries that are sub-galleries of this gallery dir,
     *    default is all galleries, excluding default top-level gallery
     * @return string an select input of galleries 'gallery title' => 'gallery-dir', home gallery is excluded
     */
    public function get_gallery_picker($options)
    {
        $mod = cms_utils::get_module('Gallery');
        if (!is_object($mod)) {
            return '<div class="pageerror">' . $this->mod->Lang('module_error', 'Gallery') . '</div><br>';
        }

        $dir = $options['dir'].DIRECTORY_SEPARATOR; // default dir (needs trailing sep)
        $galleries = Gallery_utils::GetGalleries();
        $galleryArray = array($this->mod->Lang('none_selector') => '');

        foreach ($galleries as $gallery) {
            if ($gallery['filename'] != '') {    // ignores default gallery
                if ($dir != DIRECTORY_SEPARATOR) {
                    // only select sub-galleries of $dir
                    $isSubDir = stripos($gallery['filepath'], $dir);

                    if ($isSubDir !== false && $isSubDir == 0) {
                        $gallery_dir = $gallery['filepath'].rtrim($gallery['filename'], '/');
                        $galleryArray[$gallery['title']] = $gallery_dir;
                    }
                } else {
                    // select all galleries
                    $gallery_dir = $gallery['filepath'].rtrim($gallery['filename'], '/');
                    $galleryArray[$gallery['title']] = $gallery_dir;
                }
            }
        }
        return $options['description'] .
          $this->mod->CreateInputDropdown('', $options['block_name'], $galleryArray, -1, $options['value']);
    }

    /**
     * Get a textarea block
     * @param array $options
     * @return string
     */
    private function get_textarea($options)
    {
        $tmp = '<textarea name="%s" rows="%d" cols="%d">%s</textarea>';
        $value = $options['value'] ? $options['value'] : $options['default'];
        return $options['description'] . sprintf($tmp, $options['block_name'], (int)$options['rows'], (int)$options['cols'], $value);
    }

    /**
     * Get a page-selector block
     * @param array $options
     * @return string
     */
    private function get_pages($options)
    {
        $contentOps = ContentOperations::get_instance();
        return $options['description'] .
          $contentOps->CreateHierarchyDropdown(0, $options['value'], $options['block_name'], 1, 1);
    }

    /**
     * Get a text editor block
     * @param array $options
     * @return string
     */
    private function get_editor($options)
    {
        $value = $options['value'] ? $options['value'] : $options['default'];
        return $options['description'] .
          $this->mod->CreateTextArea(true, '', $value, $options['block_name'], '', '', '', '', $options['cols'], $options['rows']);
    }

    /**
     *
     * @param array $options
     * @return string
     */
    private function get_input($options)
    {
        $tmp = '<input type="text" name="%s" size="%d" maxlength="%d" value="%s" />';
        $value = $options['value'] ? $options['value'] : $options['default'];
        return $options['description'] .
          sprintf($tmp, $options['block_name'], (int)$options['size'], (int)$options['max_length'], $value);
    }

    /**
     * Get a time-selector block
     * @param array $options
     * @return string
     */
    private function get_timepicker($options)
    {
        if (!isset($this->loaded['datepick_lib'])) {
            $this->loaded['datepick_lib'] = true;
            $base_url = $this->mod->GetModuleURLPath();
            $js1 = $this->insert_top("<link rel=\"stylesheet\" type=\"text/css\" href=\"$base_url/css/zebra_datepicker.min.css\" />");
            $js2 = $this->insert_bottom("<script type=\"text/javascript\" src=\"$base_url/lib/js/zebra_datepicker.min.js\"></script>");
        } else {
            $js1 = '';
            $js2 = '';
        }

        $id = !empty($options['alias']) ? $options['alias'] : 'tpick' . ++ self::$ctr;
        $s = $this->mod->Lang('clear');
        if (!empty($options['time_format'])) {
            $X = "    format: '" . $options['time_format'] . "',";
        } else {
            $X = '';
        }
//TODO other picker options per https://github.com/stefangabos/Zebra_Datepicker#configuration-options
//rtl: true
//icon_margin: '0.75em', BUT top margin bug
// btn label Lang for 'Pick a time'
        $js2 .= $this->insert_bottom(<<<EOS
<script type="text/javascript">
$(function() {
  $('#$id').Zebra_DatePicker({
    enabled_ampm: ['am','pm'],
    lang_clear_date: '$s',
$X
    show_icon: false,
    view: 'time'
  });
});
</script>
EOS
        );
        $tmp = '<input type="text" class="timepicker" id="%s" name="%s" size="%d" maxlength="%d" value="%s" />';
        return $js1 . $options['description'] .
          sprintf($tmp, $id, $options['block_name'], (int)$options['size'], (int)$options['max_length'], $options['value']) .
          PHP_EOL . $js2;
    }

    /**
     * Get a date[/time]-selector block
     * @param array $options
     * @return string
     */
    private function get_datepicker($options)
    {
        if (!isset($this->loaded['datepick_lib'])) {
            $this->loaded['datepick_lib'] = true;
            $base_url = $this->mod->GetModuleURLPath();
            $js1 = $this->insert_top("<link rel=\"stylesheet\" type=\"text/css\" href=\"$base_url/css/zebra_datepicker.min.css\" />");
            $js2 = $this->insert_bottom("<script type=\"text/javascript\" src=\"$base_url/lib/js/zebra_datepicker.min.js\"></script>");
        } else {
            $js1 = '';
            $js2 = '';
        }
        $id = !empty($options['alias']) ? $options['alias'] : 'dpick'  . ++ self::$ctr;
        $D = str_replace(',' , "','", $this->mod->Lang('longdays'));
        $M = str_replace(',' , "','", $this->mod->Lang('longmonths'));
        $s1 = $this->mod->Lang('clear'); // no need for json_encode()
        $s2 = $this->mod->Lang('today');
        if (!empty($options['date_format'])) {
            $X = "    format: '".$options['date_format'];
            if (!empty($options['time']) && !empty($options['time_format'])) {
               $X .= ' '.$options['time_format'];
            }
            $X .= "',";
        } else {
            $X = '';
        }
        if (empty($options['time'])) {
           $Y = '    disable_time_picker: true,';
        } else {
           $Y = '';
        }
        //TODO other picker options per https://github.com/stefangabos/Zebra_Datepicker#configuration-options
        //icon_margin: '0.75em', BUT top margin bug
        //$this->mod->Lang('meridiem') 'AM,PM' rtl: true
        // btn label Lang for 'Pick a date'
        $js2 .= $this->insert_bottom(<<<EOS
<script type="text/javascript">
$(function() {
  $('#$id').Zebra_DatePicker({
    first_day_of_week: 0,
    days: ['$D'],
    months: ['$M'],
    enabled_ampm: ['am','pm'],
    lang_clear_date: '$s1',
    show_icon: false,
    show_select_today: '$s2',
$X
$Y
    select_other_months: true
  });
});
</script>

EOS
        );
        $tmp = '<input type="text" class="datepicker" id="%s" name="%s" size="%d" maxlength="%d" value="%s" />';
        return $js1 . $options['description'] .
          sprintf($tmp, $id, $options['block_name'], (int)$options['size'], (int)$options['max_length'], $options['value']) .
          PHP_EOL . $js2;
    }

    /**
     * Get a color-selector block
     * @param array $options
     * @return string
     */
    private function get_color_picker($options)
    {
        if (!isset($this->loaded['color_picker'])) {
            $this->loaded['color_picker'] = true;
            $base_url = $this->mod->GetModuleURLPath();
            $js1 = $this->insert_top("<link rel=\"stylesheet\" type=\"text/css\" href=\"$base_url/css/spectrum.min.css\" />");
            $js2 = $this->insert_bottom("<script type=\"text/javascript\" src=\"$base_url/lib/js/spectrum.min.js\"></script>");
        } else {
            $js1 = '';
            $js2 = '';
        }
        $id = !empty($options['alias']) ? $options['alias'] : 'cpick' . ++ self::$ctr;
        $first = !empty($options['value']) ? "'".$options['value']."'" : 'false';
        //TODO prefer native translation if present for current locale
        //locale: 'something supported' or directly set the following
        $s1 = $this->mod->Lang('cancel');
        $s2 = $this->mod->Lang('choose');
        $s3 = $this->mod->Lang('clear');
        $s4 = $this->mod->Lang('more');
        $s5 = $this->mod->Lang('less');
        $s6 = $this->mod->Lang('none_selected2');
        // non-default picker options per https://seballot.github.io/spectrum
        $js2 .= $this->insert_bottom(<<<EOS
<script type="text/javascript">
$(function() {
  $('#$id').spectrum({
    color: $first,
    showInput: true,
    showInitial: true,
    togglePaletteOnly: true,
    cancelText: '$s1',
    chooseText: '$s2',
    clearText: '$s3',
    togglePaletteMoreText: '$s4',
    togglePaletteLessText: '$s5',
    noColorSelectedText: '$s6'
  });
});
</script>

EOS
        );
        $tmp = '<input name="%s" id="%s" size="%d" value="%s" />';
        $txt = sprintf($tmp, $options['block_name'], $id, (int)$options['size'], $first);
        return $js1 . $options['description'] . $txt . PHP_EOL . $js2;
    }

    /**
     * Get checkbox block
     * @param array $options
     * @return string
     */
    private function get_checkbox($options)
    {
        $tmp = isset($options['default']) ? $options['default'] : 1; // might be falsy e.g. ''
        if (isset($options['value'])) {
            $tmp2 = $options['value'];
        } elseif (!is_numeric($tmp)) {
            $tmp2 = $tmp.'##';
        } else {
            $tmp2 = intval(!(bool)$tmp);
        }
        if ($tmp == $tmp2) {
            $tmp3 = ($tmp) ? 0 : 1;
        } else {
            $tmp3 = $tmp2;
        }
        return $this->mod->CreateInputHidden('', $options['block_name'], $tmp3) .
          $options['description'] .
          $this->mod->CreateInputCheckbox('', $options['block_name'], $tmp, $tmp2);
    }

    /**
     *
     * @param array $options
     * @return string
     */
    private function get_file_selector($options)
    {
        $config = cmsms()->GetConfig();

        // Get the directory contents
        if ($options['dir']) {
            $adddir = $options['dir'];
        } else {
            $adddir = get_site_preference('contentimage_path');
        }

        $dir = cms_join_path($config['uploads_path'], $adddir);
        $filetypes = $options['filetypes'];
        if ($filetypes != '') {
            $filetypes = explode(',', $filetypes);
        }

        $excludes = $options['excludeprefix'];
        if ($excludes != '') {
            $excludes = explode(',', $excludes);
            for ($i = 0, $n = count($excludes); $i < $n; ++$i) {
                $excludes[$i] = $excludes[$i] . '*';
            }
        }
        $maxdepth = ($options['recurse']) ? -1 : 0;
        $fl = get_recursive_file_list($dir, $excludes, $maxdepth, 'FILES');

        // Remove prefix
        $filelist = array();
        for ($i = 0, $n = count($fl); $i < $n; ++$i) {
            if (in_array(pathinfo($fl[$i], PATHINFO_EXTENSION), $filetypes)) {
                $filelist[] = str_replace($dir, '', $fl[$i]);
            }
        }

        // Sort
        if (is_array($filelist) && $options['sortfiles']) {
            sort($filelist);
        }

        // Create select options
        $fopts = array();
        $url_prefix = $adddir;
        for ($i = 0, $n = count($filelist); $i < $n; ++$i) {
            $opts[$filelist[$i]] = $url_prefix . $filelist[$i];
        }
        $fopts = array('' => '') + $fopts;

        $preview = '';
        if ($options['preview']) {
            if ($options['value']) {
                $preview = '<img class="file_selector_preview" data-uploadsurl="' . $config['uploads_url'] . '" src="' . $config['uploads_url'] . '/' . $options['value'] . '" alt="">';
            } else {
                $preview = '<img class="file_selector_preview" alt="" data-uploadsurl="' . $config['uploads_url'] . '">';
            }
        }
        return $options['description'] .
          '<div class="ecb_file_selector_select">' . $this->mod->CreateInputDropdown('', $options['block_name'], $opts, -1, $options['value']) . '</div>' .
          $preview;
    }

    /**
     *
     * @param array $options
     * @return string
     */
    private function get_sortablelist(&$options)
    {
        //TODO $options['allowduplicates'] usage ?
        $optionsarray = explode(',', $options['values']);
        if (empty($optionsarray)) {
            return '';
        }

        $detail = 'list' . ++ self::$ctr; // block differentiator
        $js2 = $this->insert_bottom(<<<EOS
<script type="text/javascript">
$(function() {
 var l = $('.$detail.selected-items');
 updateECB2Placeholder(l);
 l.sortable({
  cursor: 'move',
  connectWith: '.$detail.available-items',
  items: '> li:not(.placeholder)',
  revert: 300,
  receive: function(ev, ui) {
   if (ECB2CBInputlength(l)) {
    updateECB2Placeholder(l);
    updateECB2CBInput(l);
   } else {
    l.sortable('cancel');
   }
  },
  remove: function(ev, ui) {
   if (ECB2CBInputlength(l)) {
    updateECB2Placeholder(l);
    updateECB2CBInput(l);
   } else {
    l.sortable('cancel');
   }
  },
  stop: function(ev, ui) {
   updateECB2CBInput(l);
  }
 });
 $('.$detail.available-items').sortable({
  cursor: 'move',
  connectWith: '.$detail.selected-items',
  items: '> li',
  revert: 300
 });
});
</script>

EOS
        );
        $fopts = array();
        if ($options['udt']) { //see also: get_dropdown_from_udt()
            $tmp = array();
            //TODO a UDT should never deliver executable PHP code!
            $fopts = UserTagOperations::get_instance()->CallUserTag($options['udt'], $tmp);
            if (!$fopts) {
                $fopts = array();
            } elseif (!is_array($fopts)) {
                //TODO interpret string into array members
                $fopts = array($fopts);
            }
        }
        foreach ($optionsarray as $option) {
            if ($option != '') {
                $key_val = explode('=', $option);
                $fopts[$key_val[0]] = $key_val[1];
            }
        }
        if (!empty($options['first_value'])) {
            $fopts = array($options['first_value'] => '') + $fopts;
        }
        $selectedList = explode(',', $options['value']);
        $available = $fopts;
        $selected = array();
        foreach ($selectedList as $item) {
            if (array_key_exists($item, $available)) {
                $selected[$item] = $available[$item];
                unset($available[$item]);
            }
        }
        if ($options['max_number']) { // max_number takes precedence if both set
            $options['required_number'] = 0;
        }
        $smarty = cmsms()->GetSmarty();
        $tpl = $smarty->CreateTemplate($this->mod->GetTemplateResource('sortablelist_template.tpl'), null, null, $smarty);
        $tpl->assign('detail', $detail);
        $tpl->assign('selectarea_prefix', $options['block_name']);
        $tpl->assign('selected_str', $options['value']);
        $tpl->assign('selected', $selected);
        $tpl->assign('available', $available);
        $tpl->assign('description', $options['description']);
        $tpl->assign('labelLeft', $options['label_left']);
        $tpl->assign('labelRight', $options['label_right']);
        $tpl->assign('mod', $this->mod);
        $tpl->assign('maxNumber', $options['max_number']);
        $tpl->assign('requiredNumber', $options['required_number']);
        return $options['description'] . $tpl->fetch() . PHP_EOL . $js2;
    }

    /**
     * Get a (fixed) text string
     * @param array $options
     * @return string, maybe empty
     */
    private function get_text($options)
    {
        if (!$options['text']) {
            return '';
        }
        return $options['description'] . $options['text'];
    }

    /**
     * Get a horizontal rule element block
     * @return string
     */
    private function get_hr()
    {
        return '<hr class="ecb_rule" />';
    }

    /**
     * Get an anchor link element block
     * @param array $options
     * @return string, maybe empty
     */
    private function get_link($options)
    {
        if (!$options['link'] || !$options['text']) {
            return '';
        }
        return $options['description'] .
          '<a target="' . $options['target'] . '" href="' . $options['link'] . '">' . $options['text'] . '</a>';
    }

    /**
     * Get a content block with a link to a module's defaultadmin action
     * @param array $options
     * @return string
     */
    private function get_module_link($options)
    {
/* CT comment out
        $userid = get_userid();
        $userops = cmsms()->GetUserOperations();
        $adminuser = $userops->UserInGroup($userid, 1);

        $tmp = '<input id="mt_' . $options['block_name'] . '" ' . ($adminuser ? 'type="text"' : 'type="hidden"') . ' name="' . $options['block_name'] . '" value="' . ($options['value'] ? $options['value'] : $options['default']) . '"  size="%d" maxlength="%d" />';
        $tmp = sprintf($tmp, (int)$options['size'], (int)$options['max_length']);
*/
        if ($options['mod']) {
            $mod = cms_utils::get_module($options['mod']);
            if (!is_object($mod)) {
                return '<div class="pageerror">' . $this->mod->Lang('module_error', 'Custom Global Settings') . '</div><br>';
            }
            // original CT edit
            return $options['description'] .
              $mod->CreateLink('', 'defaultadmin', '', $options['text'], [], '', false, 0, 'target="' . $options['target'] . '"');
        } else {
            return $options['description'] . $this->mod->Lang('parameter_missing', 'mod', $options['block']);
        }
    }

    /**
     * Generate select-element content
     * @internal
     * @param array $options
     * @param array $fopts
     * @return string
     */
    private function create_select($options, $fopts)
    {
        $smarty = cmsms()->GetSmarty();
        $tpl = $smarty->CreateTemplate($this->mod->GetTemplateResource('select_template.tpl'), null, null, $smarty);
        $tpl->assign('block_name', $options['block_name']);
        $tpl->assign('description', $options['description']);
        $tpl->assign('multiple', (bool)$options['multiple']);
        $tpl->assign('compact', (bool)$options['compact']);
        $tpl->assign('none_selected', $this->mod->Lang('none_selected1'));
        if ($options['compact']) {
            $tpl->assign('show_text', $this->mod->Lang('change'));
            $tpl->assign('hide_text', $this->mod->Lang('hide'));
        }

        $tpl->assign('options', $fopts);

        if (isset($options['size']) && $options['size'] > 0) {
            $size = (int)$options['size'];
        } elseif ($options['compact']) {
            $size = count($fopts);
            if (!empty($options['first_value'])) {
                $size++;
            }
        } else {
            $size = 5; // default
        }
        $tpl->assign('size', $size);

        if (!empty($options['first_value'])) {
            $fopts = array($options['first_value'] => '') + $fopts;
        }

        $tpl->assign('selected', $options['value']);
        if ($options['multiple']) {
            $selected_values = explode(',', $options['value']);
            $selected_text = array();
            foreach ($selected_values as $value) {
                $selected_text[] = array_search($value, $fopts);
            }
            $selected_text = implode(', ', $selected_text);
            $tpl->assign('selected_values', $selected_values);  // array
            $tpl->assign('selected_text', $selected_text); // text
        }
        return $tpl->fetch();
    }

    /**
     * Get a dropdown content block with specified values as choices
     *
     * @param array $options
     * @return string representing a select, or empty
     */
    private function get_dropdown($options)
    {
        if (!$options['values']) {
            return '';
        }

        $fopts = array();
        $tmpOptions = explode(',', $options['values']);
        foreach ($tmpOptions as $option) {
            $key_val = explode('=', $option);
            if (count($key_val) > 1) {
                $fopts[$key_val[0]] = $key_val[1];
            } else {
                $fopts[$key_val[0]] = $key_val[0];
            }
        }
        return $this->create_select($options, $fopts);
    }

    /**
     * Get a dropdown content block with choices derived from a UDT
     *
     * @param array $options
     * @return string representing a select, or empty
     */
    private function get_dropdown_from_udt($options)
    {
        if (!$options['udt']) {
            return '';
        }

        if (UserTagOperations::get_instance()->UserTagExists($options['udt'])) {
            $tmp = array();
            //TODO a UDT should never deliver executable PHP code!
            $fopts = UserTagOperations::get_instance()->CallUserTag($options['udt'], $tmp);
            if (!$fopts) {
                $fopts = array();
            } elseif (!is_array($fopts)) {
                //TODO interpret string into array members
                $fopts = array($fopts);
            }
            if (!empty($options['first_value'])) {
                $fopts = array($options['first_value'] => '') + $fopts;
            }
            return $this->create_select($options, $fopts);
        } else {
            $msg = $this->mod->Lang('udt_error', $options['udt']);
            return '<div class="pageerror">'.$msg.'</div>';
        }
    }

    /**
     * Get dropdown content block with choices from a template-sourced list
     * @since CMSMS 2 (i.e. no GCB's) a corresponding template (if any) is used
     * @param array $options
     * @return string representing a select, or empty, or error message
     */
    private function get_dropdown_from_gbc($options)
    {
        if (!$options['gbc']) {
            return '';
        }

        $smarty = cmsms()->GetSmarty();
        // TODO migrated gcb's have template-type CORE::generic
        $optionsgbc = $smarty->fetch('cms_template:' . $options['gbc']);
        if ($optionsgbc === null) {
            $msg = 'Invalid template name \''. $options['gbc'] .'\' for field type \'dropdown_from_gbc\'';
            return '<div class="pageerror">' . $msg . '</div>';
        }
        if ($optionsgbc) {
            $optionsarray = explode(',', $optionsgbc);
        }
        if (!$optionsgbc || !$optionsarray) {
            $msg = 'No selector-choices provided by \''. $options['gbc'] .'\'';
            return '<div class="pagewarn">' . $msg . '</div>';
        }

        $fopts = array();
        foreach ($optionsarray as $option) {
            $key_val = explode('=', $option);
            $fopts[$key_val[0]] = $key_val[1];
        }

        if (!empty($options['first_value'])) {
            $fopts = array($options['first_value'] => '') + $fopts;
        }
        return $this->create_select($options, $fopts);
    }

    /**
     * Get dropdown content block with choices from a module-action
     * @param array $options
     * @return string, maybe empty
     */
    private function get_dropdown_from_module($options)
    {
        if (!$options['mod']) {
            return '';
        }

        $data = $this->mod->ProcessTemplateFromData('{' . $options['mod'] . '}');

        $optionsarray = explode(',', $data);
        if (empty($optionsarray)) {
            return '';
        }

        $fopts = array();
        foreach ($optionsarray as $option) {
            $key_val = explode('=', $option);
            $fopts[$key_val[0]] = $key_val[1];
        }
        if (!empty($options['default'])) {
            $fopts = array($options['default'] => '') + $fopts;
        }
        return $options['description'] .
          $this->mod->CreateInputDropdown('', $options['block_name'], $fopts, -1, $options['value']);
    }

    /*
     * Get a dropdown with choices from a Custom Global Settings-module field
     * NOTE: that field should be a plain textarea, with either
     * newlines or commas separating each name-value pair
     * @param array $options
     * @return string
     */
    public function get_dropdown_from_customgs($options)
    {
        $mod = cms_utils::get_module('CustomGS');
        if (!is_object($mod)) {
            return '<div class="pageerror">' . $this->mod->Lang('module_error', 'Custom Global Settings') . '</div><br>';
        }

        $fopts = array();
        $selectOptions = $mod->GetField($options['customgs_field']);
        if (empty($selectOptions['value'])) {
            $msg = '<div class="pageerror">' . $this->mod->Lang('customgs_field_error', $options['customgs_field']) . '</div><br>';
        } else {
            $msg = '';
            // use either newlines or commas to separate each title-value pair
            $selectOptions = str_replace(PHP_EOL, ',', $selectOptions['value']);
            $selectLines = explode(',', $selectOptions);
            foreach ($selectLines as $oneOption) {
                $opt = explode('=', trim($oneOption));
                $fopts[$opt[0]] = isset($opt[1]) ? $opt[1] : $opt[0];
            }
        }
        return $msg . $this->create_select($options, $fopts);
    }

    /**
     * Get dropdown content block with loadable modules as choices
     * @param array $options
     * @return string
     */
    private function get_module($options)
    {
        $modops = cmsms()->GetModuleOperations();
        $modules = $modops->GetInstalledModules();
        $modulesarray = array();
        foreach ($modules as $module) {
            $mod = cms_utils::get_module($module);
            if (is_object($mod)) {
                $key = $mod->GetFriendlyName();
                if (!$key) $key = $module;
                $modulesarray[$key] = $module;
            }
        }
        if (class_exists('Collator')) {
            $coll = new Collator('en_US'); // TODO default locale always ok?
            uksort($modulesarray, function($a, $b) use ($coll) {
                return collator_compare($coll, $a, $b);
            });
        }
        return $options['description'] .
          $this->mod->CreateInputDropdown('', $options['block_name'], $modulesarray, -1, $options['value']);
    }

    /**
     * Get radio-group content block
     * @param array $options
     * @return string maybe empty
     */
    private function get_radio($options)
    {
        if (!$options['values']) {
            return '';
        }

        $optionsarray = explode(',', $options['values']);
        if (empty($optionsarray)) {
            return '';
        }

        $fopts = array();
        foreach ($optionsarray as $option) {
            $key_val = explode('=', $option);
            $fopts[$key_val[0]] = $key_val[1];
        }

        if (isset($options['value'])) {
            if (isset($fopts[$options['value']])) {
                $selectedValue = $fopts[$options['value']];
            } else {
                $selectedValue = reset($fopts);
            }
        } elseif ($options['default'] == '-1') {
            $selectedValue = reset($fopts);
        } elseif (isset($fopts[$options['default']])) {
            $selectedValue = $fopts[$options['default']];
        } else {
            $selectedValue = reset($fopts);
        }

        $delimiter = (!empty($options['delimiter'])) ? $options['delimiter'] :
            (($options['inline']) ? '&nbsp;&nbsp;&nbsp;&nbsp;' : '<br>');
        return $options['description'] .
          $this->mod->CreateInputRadioGroup('', $options['block_name'], $fopts, $selectedValue, '', $delimiter);
    }

    /**
     * Get a repeating text content block
     * @param array $options
     * @return string
     */
    private function get_input_repeater($options)
    {
        $block_name = $options['block_name'];
        $title2 = $this->mod->Lang('remove_line');
        $js = <<<EOS
<script type="text/javascript">
$(function() {
 var el, r, v;
 $('[id^="repeater-add-$block_name"]').on('click', function(e) {
  e.preventDefault();
  var p = $(this).closest('.ecb2_repeater');
  var c = p.find('.repeater-wrapper');
  var s = c.length + 1;
  p = $(this).parent();
  c = p.clone(true, true);
  if(c[0].children.length == 2) {
   // add a remove-button, replicating template
   var btn = (c[0].children[1]).cloneNode(true);
   btn.id = btn.id.replace('add','remove');
   btn.title = '$title2';
   btn.innerHTML = '&minus;';
   $(btn).appendTo(c).on('click', function(e) {
    e.preventDefault();
    var r = $($(this).data('repeater'));
    $(this).parent().remove();
    //ETC
    update_repeater(r); //see module.js
    return false;
   });
  }
  c.children().each(function(){
    var n = this.id.replace(/\-\d+$/, '-');
    this.id = n + s;
  });
  p.after(c);
  var r = $($(this).data('repeater'));
  update_repeater(r);
  return false;
 });
 $('[id^="repeater-remove-$block_name"]').on('click', function(e) {
  e.preventDefault();
  var r = $($(this).data('repeater'));
  $(this).parent().remove();
//ETC
  update_repeater(r); //see module.js
  return false;
 });
});
</script>

EOS;
        $fields = explode('||', $options['value']);
        $smarty = cmsms()->GetSmarty();
        $tpl = $smarty->CreateTemplate($this->mod->GetTemplateResource('input_repeater_template.tpl'), null, null, $smarty);
        $tpl->assign('block_name', $block_name);
        $tpl->assign('fields', $fields);
        $tpl->assign('size', $options['size']);
        $tpl->assign('max_length', $options['max_length']);
        $tpl->assign('value', $options['value']);
        $tpl->assign('description', $options['description']);
        $tpl->assign('title_add_line', $this->mod->Lang('add_line'));
        $tpl->assign('title_remove_line', $title2);
        return $tpl->fetch() . PHP_EOL. $js;
    }

    /**
     * Migrate date/time format to PHP date() compatible from jQueryUI widget format
     * @see https://api.jqueryui.com/datepicker and js Date() & related
     * Named formats 'ATOM'...'W3C' are ignored
     * @since 1.7
     * @deprecated since 1.7
     * @internal
     * @param string $str
     * @param bool $asdate Flag, true for a date format, false for time format
     * @return string
     */
    private function reformat($str, $asdate)
    {
        $s = addcslashes($str, 'aAFgGijlnsUvYz');
        $symbols = array(
         //day
         'dd' => '\1',
         'd' => 'j',
         'DD' => '\2',
         'oo' => '\3', //ignore 0-padding
         'o' => '\3',
         //month
         'mm' => '\4', //or minutes if !$asdate
         'm' => 'n',
         'MM' => 'F',
         //year
         'yy' => 'Y',
         //time
         'hh' => 'G',
         'h' => 'g',
         'HH' => '\5',
         'H' => 'h',
         'ss' => 's',
         'tt' => 'a',
         't' => 'a',
         'TT' => 'A',
         'T' => 'A',
         'z' => 'Z',
         'c' => 'v',
         'l' => 'v',
         '@' => 'U',
         '!' => '?',
         //text
         "''" => '\6',
         "'" => ''
        );
        $from = array_keys($symbols);
        $to = array_values($symbols);
        $s = str_replace($from, $to, $s); // no re-ordering

        $symbols = array(
         '\1' => 'd',
         '\2' => 'l', //lower L
         '\3' => 'z',
         '\4' => ($asdate) ? 'm' : 'i',
         '\5' => 'H',
         '\6' => "'"
        );
        return strtr($s, $symbols);
    }

    /**
     * Initialization
     * @param string $blockName
     * @param mixed $value
     * @param array $params
     * @param boolean $adding Optional new-page flag. Default false
     * @return array
     */
    private function init($blockName, $value, $params, $adding = false)
    {
        $field = !empty($params['field']) ? strtolower($params['field']) : '';
        $options = array(
          'adding' => $adding,
          'block_name' => $blockName,
          'field' => $field
        );
        if ($value !== null) {
            $options['value'] = $value;
            unset($params['value']); // do not overwrite
        } elseif (isset($params['value'])) {
            $options['value'] = 1; // ensure this is recorded
        }
        $options += $this->get_default_options($field);
        foreach ($params as $key => $val) {
            if (isset($options[$key])) {
                $options[$key] = $val;
            }
        }
        if (empty($params['alias'])) {
            $options['alias'] = munge_string_to_url($blockName, true);
        }
        if (isset($params['default_value'])) {
            $options['default'] = $params['default_value'];
            unset($options['default_value']);
        }
        if (isset($params['txt'])) {
            $options['text'] = $params['txt'];
            unset($options['txt']);
        }
        if (!empty($params['date_format'])) {
            $options['date_format'] = $this->reformat($params['date_format'], true);
        }
        if (!empty($params['time_format'])) {
            $options['time_format'] = $this->reformat($params['time_format'], false);
        }
        if (!empty($options['description'])) {
            $options['description'] .= '<br>';
        }
        // in some cases, ensure a 'value' option (regardless of $adding)
        switch ($field) {
            //for some field-types, absence of 'value' is effectively the value
            case 'checkbox':
            case 'radio':
//            case 'color_picker':
                break;
            default:
                if (!isset($options['value'])) {
                    $options['value'] = isset($options['default']) ? $options['default'] : '';
                }
        }
        return $options;
    }

    /**
     * More initialization
     * @param string $field
     * @return array
     */
    private function get_default_options($field)
    {
        $default_options = array('description' => '');
        switch ($field) {
            case 'color_picker':
                $default_options['size'] = 20;
                $default_options['default'] = '';
                break;
            case 'module_link':
                $default_options['mod'] = '';
                $default_options['text'] = '';
                $default_options['target'] = '_self';
                $default_options['default'] = '';
                $default_options['size'] = 30;
                $default_options['max_length'] = 255;
                break;
            case 'link':
                $default_options['text'] = '';
                $default_options['target'] = '_self';
                $default_options['link'] = '';
                break;
            case 'module':
                $default_options['default'] = '';
                $default_options['first_value'] = '';
                $default_options['text'] = '';
                $default_options['link'] = '';
                break;
            case 'dropdown_from_module':
                $default_options['mod'] = '';
                $default_options['default'] = '';
                $default_options['first_value'] = '';
                break;
            case 'file_selector':
                $default_options['filetypes'] = '';
                $default_options['excludeprefix'] = '';
                $default_options['recurse'] = false;
                $default_options['sortfiles'] = false;
                $default_options['dir'] = '';
                $default_options['preview'] = false;
                break;
            case 'dropdown':
                $default_options['size'] = 5;
                $default_options['multiple'] = false;
                $default_options['values'] = '';
                $default_options['default'] = '';
                $default_options['first_value'] = '';
                $default_options['compact'] = false;
                break;
            case 'dropdown_from_udt':
                $default_options['size'] = 5;
                $default_options['multiple'] = false;
                $default_options['values'] = '';
                $default_options['default'] = '';
                $default_options['first_value'] = '';
                $default_options['udt'] = '';
                $default_options['compact'] = false;
                break;
            case 'dropdown_from_gbc':
                $default_options['size'] = 5;
                $default_options['multiple'] = false;
                $default_options['values'] = '';
                $default_options['default'] = '';
                $default_options['first_value'] = '';
                $default_options['gbc'] = '';
                $default_options['compact'] = false;
                break;
            case 'dropdown_from_customgs':
                $default_options['size'] = 5;
                $default_options['multiple'] = false;
                $default_options['first_value'] = '';
                $default_options['customgs_field'] = '';
                $default_options['compact'] = false;
                break;
            case 'textarea':
                $default_options['default'] = '';
                $default_options['rows'] = 20;
                $default_options['cols'] = 80;
                break;
            case 'editor':
                $default_options['default'] = '';
                $default_options['rows'] = 20;
                $default_options['cols'] = 80;
                break;
            case 'input':
                $default_options['default'] = '';
                $default_options['size'] = 30;
                $default_options['max_length'] = 255;
                break;
            case 'sortablelist':
                $default_options['values'] = '';
                $default_options['first_value'] = '';
                $default_options['allowduplicates'] = false;
                $default_options['max_selected'] = -1;
                $default_options['label_left'] = '';
                $default_options['label_right'] = '';
                $default_options['udt'] = '';
                $default_options['max_number'] = 0;
                $default_options['required_number'] = 0;
                break;
            case 'text':
                $default_options['text'] = '';
                $default_options['execute'] = '';
                break;
            case 'pages':
                $default_options['default'] = '';
                break;
            case 'checkbox':
                $default_options['default'] = 1;
                break;
            case 'timepicker':
                $default_options['size'] = 8;
                $default_options['max_length'] = 10;
                $default_options['time_format'] = 'H:i';
                break;
            case 'datepicker':
                $default_options['size'] = 15;
                $default_options['max_length'] = 20;
                $default_options['date_format'] = 'y-m-d';
                $default_options['time_format'] = 'H:i';
                $default_options['time'] = false;
                break;
            case 'radio':
                $default_options['values'] = '';
                $default_options['default'] = -1;
                $default_options['delimiter'] = '';
                $default_options['inline'] = false;
                break;
            case 'hr':
                unset($default_options['description']);
                break;
            case 'image_picker':
                break;
            case 'hidden':
                $default_options['value'] = '';
                break;
            case 'fieldset_start':
                $default_options['legend'] = '';
                break;
            case 'gallery_picker':
                $default_options['dir'] = '';
                break;
            case 'input_repeater':
                $default_options['default'] = '';
                $default_options['size'] = 50;
                $default_options['max_length'] = 255;
                break;
            default:
                return array();
        }
        return $default_options;
    }

    public function insert_bottom($str) {
        if (function_exists('add_page_foottext')) {
            add_page_foottext($str);
            return '';
        } else {
            $tmp = rtrim($str);
            $tmp = addcslashes($tmp, "'");
            $tmp = $this->jsmunge($tmp);
            return <<<EOS
<script type="text/javascript">
 $('body').append('$tmp');
</script>

EOS;
        }
    }

    public function insert_top($str) {
        $after = stripos($str, 'script>') !== false;
        if (function_exists('add_page_headtext')) {
            add_page_headtext($str, $after);
            return '';
        } else {
            $tmp = rtrim($str);
            $tmp = addcslashes($tmp, "'");
            if (!($after && $this->firsthead)) {
                $i = strpos($tmp, ' ');
                $tmp = substr_replace($tmp, ' id="ecb2first" ', $i, 1);
            }
            $tmp = $this->jsmunge($tmp);
            if ($after) {
                $inner = "$('head').append('$tmp');";
            } elseif ($this->firsthead) {
                $inner = "$('head > #ecb2first').before('$tmp');";
            } else {
                $this->firsthead = true;
                $inner = "$('head').append('$tmp');";
            }
            return <<<EOS
<script type="text/javascript">
 $inner
</script>

EOS;
        }
    }

    /*
     * Munge supplied string to suit js and specifically to prevent
     * the browser attempting immediate execution
     * @internal
     * @param string $str
     * @return string
     */
    private function jsmunge($str)
    {
        while(($i = stripos($str, 'link')) !== false) {
           $str = substr($str, 0, $i+2) . "' + '" .  substr($str, $i+2);
        }
        while(($i = stripos($str, 'script')) !== false) {
           $str = substr($str, 0, $i+3) . "' + '" .  substr($str, $i+3);
        }
        $str = str_replace("\n", "' +\n'", $str); //support for js `` not assumed
        return $str;
    }
}
