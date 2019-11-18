// InputBox component
// generic, reusable base component for CheckBox and Radio
// stylized based on which type of input it is

import React from 'react';
import styled from 'styled-components';

/**
 * InputBox component
 * @param {string} props.type type of input (CheckBox or Radio)
 * @param {string} props.name name of the input passed on to input
 * @param {Number} [props.index] index of this input (optional, used in Radio where several components share the same name)
 * @param {boolean} props.checked whether this input is checked
 * @param {boolean} props.disabled whether this input is disabled
 * @param {Function} props.onChange onChange event handler, passed on to input
 */
function InputBox(props) {
  // id to be given to input
  // used for purposes of having a function label with "htmlFor" attribute
  const inputID = `${props.name}${props.index || ""}-target`;

  return <InputBoxWrapper>
    {/* dummy input, hidden from UI by serves functionally as input in the form */}
    <Dummy disabled={props.disabled} checked={props.checked} name={props.name} id={inputID} type={props.type} value={props.value} onChange={props.onChange}/> {/* label for this input */}
    <Label disabled={props.disabled}>
      {props.label}
    </Label>
    {/* button which serves as UI front for the hidden dummy input */}
    {/* rounded if this is a radio */}
    <InputBoxButton rounded={props.type === 'radio'} disabled={props.disabled} checked={props.checked} htmlFor={inputID}/>
  </InputBoxWrapper>
}

const InputBoxWrapper = styled.div `
  display: flex;
  align-items: center;
`

const Dummy = styled.input `
  position: absolute;
  ${ ''/* hide the dummy */}
  opacity: 0;
  height: 0;
  width: 0;
`

const InputBoxButton = styled.label `
  cursor: pointer;
  user-select: none;
  min-width: ${props => props.theme.checkBoxSize};
  min-height: ${props => props.theme.checkBoxSize};
  ${ ''/* TODO: offload disabled color to styled-components theme */}
  border: 2px solid ${props => props.disabled
  ? '#979e9e'
  : 'white'};
  ${ ''/* border radius is determined by type of input */}
  border-radius: ${props => props.rounded
    ? "100%"
    : `calc(.3 * ${props.theme.checkBoxSize})`};
  display: inline-block;
  position: relative;
  margin-left: auto;

  ${ ''/* within the input, serves as internal checkmark */}
  &:after {
    content: "";
    width: calc(.6 * ${props => props.theme.checkBoxSize});
    height: calc(.6 * ${props => props.theme.checkBoxSize});
    border-radius: ${props => props.rounded
      ? "100%"
      : `calc(.13 * ${props.theme.checkBoxSize})`};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${props => props.disabled
        ? '#979e9e'
        : 'white'};
    opacity: ${props => props.checked
          ? '1'
          : '0'};
    transition: 0.15s all;
  }
`

const Label = styled.label `
  display: inline-block;
  text-align: left;
  font-weight: 600;
  letter-spacing: 1px;
  transition: color 0.1s;
  font-size: calc(1.5 * ${props => props.theme.baseFontSize});
`

export default InputBox;
