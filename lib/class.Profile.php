<?php
#---------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, TODOchris@cmsmadesimple.org
# Licence: GNU General Public License version 3
#          see /ECB2/LICENCE or <http://www.gnu.org/licenses/#GPL>
#---------------------------------------------------------------------

namespace ECB2;

use ArrayAccess;
use CMSMS\DataException as CmsDataException; // for CMSMS3
//use CmsDataException; // for CMSMS2
use CMSMS\Utils as cms_utils; // for CMSMS3
//use cms_utils; // for CMSMS2
use ECB2; // module class in global namespace
use LogicException;
use RuntimeException;
use UnexpectedValueException;
use function cms_to_bool;

class Profile implements ArrayAccess
{
	//these are verbatim from Microtiny - to be tailored
	const KEYS = [
		'allowcssoverride',
		'allowimages',
		'allowresize',
		'allowtables',
		'dfltstylesheet',
		'formats',
		'label',
		'menubar',
		'name',
		'showstatusbar',
		'system',
	];
	// static properties here
	private static $_module = null;

	private $_data = [];

	public function __construct(array $data = [])
	{
		if( $data ) {
			foreach( $data as $key => $value ) {
				$this->_data[$key] = $value;
			}
		}
	}

	#[\ReturnTypeWillChange]
	public function offsetGet(/*mixed */$key)// : mixed
	{
		switch( $key ) {
		case 'menubar':
		case 'allowimages':
		case 'allowtables':
		case 'showstatusbar':
		case 'allowresize':
		case 'allowcssoverride':
		case 'system':
			if( isset($this->_data[$key]) ) return (bool)$this->_data[$key];
			return false;

		case 'formats':
			if( isset($this->_data[$key]) ) return $this->_data[$key];
			return [];

		case 'name':
		case 'dfltstylesheet':
			if( isset($this->_data[$key]) ) return trim($this->_data[$key]);
			return '';

		case 'label':
			if( isset($this->_data[$key]) ) return $this->_data[$key];
			if( isset($this->_data['name']) ) return trim($this->_data['name']);
			return '';

		default:
			throw new LogicException("'$key' is not a property of ".__CLASS__.' objects');
		}
	}

	#[\ReturnTypeWillChange]
	public function offsetSet(/*mixed */$key,$value)// : void
	{
		switch( $key ) {
		case 'menubar':
		case 'allowtables':
		case 'allowimages':
		case 'showstatusbar':
		case 'allowresize':
		case 'allowcssoverride':
		case 'system':
			$this->_data[$key] = cms_to_bool($value);
			break;

		case 'formats':
			if( is_array($value) ) $this->_data[$key] = $value;
			break;

		case 'dfltstylesheet':
		case 'name':
		case 'label':
			$value = trim($value);
			if( $value ) $this->_data[$key] = $value;
			break;

		default:
			throw new LogicException("'$key' is not a property of ".__CLASS__.' objects');
		}
	}

	#[\ReturnTypeWillChange]
	public function offsetExists(/*mixed */$key)// : bool
	{
		if( in_array($key, self::KEYS) ) return isset($this->_data[$key]);

		throw new LogicException("'$key' is not a property of ".__CLASS__.' objects');
	}

	#[\ReturnTypeWillChange]
	public function offsetUnset(/*mixed */$key)// : void
	{
		switch( $key ) {
		case 'menubar':
		case 'allowtables':
		case 'allowimages':
		case 'showstatusbar':
		case 'allowresize':
		case 'allowcssoverride':
		case 'dfltstylesheet':
		case 'formats':
		case 'label':
			unset($this->_data[$key]);
			break;

		case 'system':
		case 'name':
			throw new LogicException("Cannot unset '$key' property of ".__CLASS__.' objects');

		default:
			throw new LogicException("'$key' is not a property of ".__CLASS__.' objects');
		}
	}

	public function save()// : void
	{
		if( !isset($this->_data['name']) || $this->_data['name'] == '' ) {
			throw new CmsDataException('No name provided for ECB2 profile');
		}

		$data = json_encode($this->_data,JSON_NUMERIC_CHECK|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
		self::_get_module()->SetPreference('profile_'.$this->_data['name'],$data);
	}

	public function delete()// : void
	{
		if( $this['name'] == '' ) return;
		self::_get_module()->RemovePreference('profile_'.$this['name']);
		unset($this->_data['name']);
	}

	private static function _load_from_data($data)// : Profile
	{
		if( !$data || !is_array($data) ) { throw new LogicException('Invalid data provided to '.__METHOD__); }

		$obj = new self();
		foreach( $data as $key => $value ) {
			if( !in_array($key,self::KEYS) ) { throw new LogicException("$key is not a valid property of ".__CLASS__.' objects, in '.__FUNCTION__); }
			$obj->_data[$key] = trim($value);
		}
		return $obj;
	}

	public static function set_module(ECB2 $module)// : void
	{
		self::$_module = $module;
	}

	private static function _get_module()// : ECB2
	{
		if( !is_object(self::$_module) ) {
			self::$_module = cms_utils::get_module('ECB2');
			if( !is_object(self::$_module) ) {
				// module not yet installed - hack for installation
				self::$_module = new ECB2();
			}
		}
		return self::$_module;
	}

	/**
	 *
	 * @param string $name
	 * @return mixed self|null
	 * @throws UnexpectedValueException
	 */
	public static function load($name)// : mixed
	{
		if( $name == '' ) return;
		$data = self::_get_module()->GetPreference('profile_'.$name);
		if( !$data ) throw new UnexpectedValueException('Unknown ECB2 profile '.$name);
		$props = json_decode($data,true);
		if( !$props ) throw new RuntimeException('Invalid data for ECB2 profile '.$name);

		$obj = new self();
		$obj->_data = $props;
		return $obj;
	}

	public static function list_all()// : array
	{
		$prefix = 'profile_';
		return self::_get_module()->ListPreferencesByPrefix($prefix);
	}
} //class
