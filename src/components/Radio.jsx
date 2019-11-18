// CheckBox component
// a simple checkbox wrapper for InputBox component

import React from 'react';
import InputBox from './InputBox';

function Radio(props) {
  return <InputBox {...props} type={'radio'}></InputBox>
}

export default Radio;
