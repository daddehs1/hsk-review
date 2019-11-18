// NumberInput component
// a generic, reusable number input + label component

import React from 'react';
import styled from 'styled-components';

/**
 * FlashcardTicker component
 * @param {string} props.label label to display next to input
 * @param {string} props.name name to pass down to input
 * @param {string} props.value value to pass down to input
 * @param {Function} props.onChange event handler for onChange to pass on to input
 */
function NumberInput(props) {
  return <NumberInputWrapper>
    <Label>
      {props.label}
    </Label>
    <Input name={props.name} pattern="\d*" type="number" value={props.value} onChange={props.onChange}/>
  </NumberInputWrapper>
}

const NumberInputWrapper = styled.div `
  display: flex;
  align-items: center;
`

const Input = styled.input `
  background-color: transparent;
  border: 2px solid transparent;
  border-radius: 0;
  border-bottom-color: white;
  color: white;
  padding: .5rem;
  margin-bottom: .5rem;
  font-size: calc(1.5 * ${props => props.theme.baseFontSize});
  width: calc(2 * ${props => props.theme.checkBoxSize});
  text-align: center;
  font-weight: 600;

${ ''/* remove some default input styling */}
  &:focus {
    outline: none;
    ${ ''/* border: 2px solid white; */}
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type=number] {
      -moz-appearance:textfield; /* Firefox */
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

export default NumberInput;
