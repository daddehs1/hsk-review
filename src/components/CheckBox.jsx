// CheckBox component
// a simple checkbox wrapper for InputBox component

import React from 'react';
import InputBox from './InputBox';

function CheckBox(props) {
  return <InputBox {...props} type={'checkbox'}></InputBox>
}

export default CheckBox;
