import React from 'react';
import { TextStyle } from 'react-native';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const EmailIcon = (style: TextStyle) => (
  <FontistoIcon style={style} name='email' size={25} />
);

export const EyeIcon = (style: TextStyle) => (
  <EntypoIcon style={style} name='eye'/>
);

export const DropDownIcon = (style: TextStyle) => (
  <MaterialIconsIcon style={style} name='arrow-drop-down'/>
);

export const CurrentLocationIcon = (style: TextStyle) => (
  <MaterialIconsIcon style={style} name='my-location'/>
);

export const EyeOffIcon = (style: TextStyle) => (
  <EntypoIcon style={style} name='eye-with-line'/>
);

export const FacebookIcon = (style: TextStyle) => (
  <FontAwesomeIcon style={style} name='facebook'/>
);

export const GoogleIcon = (style: TextStyle) => (
  <AntDesignIcon style={style} name='google'/>
);

export const PersonIcon = (style: TextStyle) => (
  <AntDesignIcon style={style} name='user'/>
);

export const TwitterIcon = (style: TextStyle) => (
  <AntDesignIcon style={style} name='twitter'/>
);

export const CameraIcon = (style: TextStyle) => (
  <AntDesignIcon style={style} name='camera'/>
);

export const FileIcon = (style: TextStyle) => (
  <AntDesignIcon style={style} name='file'/>
);

export const ImageIcon = (style: TextStyle) => (
  <AntDesignIcon style={style} name='image'/>
);

export const MicIcon = (style: TextStyle) => (
  <FontAwesomeIcon style={style} name='microphone'/>
);

export const PaperPlaneIcon = (style: TextStyle) => (
  <FeatherIcon style={style} name='send'/>
);

export const PeopleIcon = (style: TextStyle) => (
  <AntDesignIcon style={style} name='people'/>
);

export const PinIcon = (style: TextStyle) => (
  <AntDesignIcon style={style} name='pin'/>
);

export const PlusIcon = (style: TextStyle) => (
  <AntDesignIcon style={style} name='plus'/>
);

export const ArrowIosBackIcon = (style: TextStyle) => (
  <AntDesignIcon style={style} name='arrow-ios-back'/>
);

export const DoneAllIcon = (style: TextStyle) => {
  return (
    <AntDesignIcon style={[style, {width: 16, height: 16, color: "#2699FB"}]} name='check'/>
  );
};

export const SearchIcon = (style: TextStyle) => (
  <FeatherIcon style={style} name='search'/>
);
