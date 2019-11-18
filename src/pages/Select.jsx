// Select Page
// first screen that user sees
// user selects options for the flashcard review

import React, {useCallback, useState, useEffect} from 'react';
import {connect} from "react-redux";
import {resetState, setReviewOptions} from "../redux/actions";
import {withRouter} from 'react-router-dom'
import styled from 'styled-components';
import CheckBox from '../components/CheckBox'
import Radio from '../components/Radio'
import NumberInput from '../components/NumberInput'
import IconButton from '../components/IconButton'

// set up initial form state for user to select review options
const initialFormState = {
  // HSK Levels: should include vocabulary from this HSK level in flashcard review
  HSK1: false,
  HSK2: false,
  HSK3: false,
  HSK4: false,
  HSK5: false,
  HSK6: false,
  // number of cards that will be included in review
  numCards: 25,
  // flag for determining whether to re-review incorrectly answered flashcards after first round review
  reviewIncorrect: true,
  // flag for determining whether Mandarin pronunciations should be displayed to user in Zhuyin (bopomofo)
  useZhuyin: false,
  // flag for determining whether Chinese characters should be displayed to user using traditional characters
  useTraditionalCharacters: false
}

/**
 * custom hook to manage maintaining a form-state
 * essentially a wrapper for useState hook that simplifies mutation of state from form input
 * @return {[Object, Function]}
 * [0] Object representing the form state
 * [1] event handler used to mutate state based on input events
 */
function useFormState() {
  // uses useState hook internally to maintain state
  const [formState, setFormState] = useState(initialFormState);
  /**
   * Callback for handling form input and using it to modify form state
   * @param  {event} event The input event, passed through from input "on" event
   * @param  {Number} [customValue] A custom value to set form state to
   *   used e.g. to reset numCards to 25 if invalid user input
   */
  const handleFormInput = useCallback((event, customValue) => {
    var newValue;
    // select newValue based on the type of input
    switch (event.target.type) {
      default:
      case 'checkbox':
        newValue = event.target.checked;
        break;
      case 'radio':
        newValue = parseInt(event.target.value);
        break;
      case 'number':
        newValue = parseInt(event.target.value);
        break;
    }
    // set the form state property based on the input's name
    // set to either customValue if provided, or newValue determined from input checked/value
    setFormState({
      ...formState,
      [event.target.name]: customValue || newValue
    })
  }, [formState]);
  return [formState, handleFormInput];
}

/**
 * Select component
 * -- Mapped from Dispatch --
 *  @param  {Function} setReviewOptions pushes currently selected reviewOptions to redux state
 *  TODO it would be better to just have redux state be single source of truth rather than have a local state in the component and then push to redux on submit
 */
function Select(props) {
  // form state represeting the review options selected by user
  const [formState, handleFormInput] = useFormState();
  // flag for determining whether to use a user-inputted value for numCards rather than preset values
  // used deselect preset radio buttons and user-inputted value to share same state form property (numCards)
  const [usesCustomNumCards, setUsesCustomNumCards] = useState(false);
  // flag for whether the selected set of HSK Level is valid (i.e. at least one selected)
  // used in form validation, for displaying error to user if invalid
  const [HSKSetInvalid, setHSKSetInvalid] = useState(false);
  // flag for whether user has attempted to submit form
  // used in form validation, to prevent displaying error to user before initial submit attempt
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // destructure actions from props to avoid using props as dependency
  const {resetState} = props;
  // reset redux state on initial mount
  useEffect(() => {
    resetState();
  }, [resetState])

  // simple form validation
  // if user has attempted to submit form and no HSK Level has been selected, invalidate
  useEffect(() => {
    if (hasAttemptedSubmit && !(formState.HSK1 || formState.HSK2 || formState.HSK3 || formState.HSK4 || formState.HSK5 || formState.HSK6)) {
      setHSKSetInvalid(true);
    } else {
      setHSKSetInvalid(false);
    }
  }, [
    hasAttemptedSubmit,
    formState.HSK1,
    formState.HSK2,
    formState.HSK3,
    formState.HSK4,
    formState.HSK5,
    formState.HSK6
  ])

  // render
  return (<React.Fragment>
    {/* wrapper for form */}
    <OptionsForm>
      {/* group containing HSK Levels selection */}
      <FormGroup>
        {/* error is set based on form validation */}
        <FormGroupLabel error={HSKSetInvalid}>Flashcard Sets
        </FormGroupLabel>
        {/* split HSK levels into lists in two even columns */}
        <FormList>
          <FormListGroup>
            {
              // checkboxes corresponding to HSK Levels
              // checked status is based on form state, mutates formState on change
              [1, 2, 3].map((level) => <FormGroupListItem key={level}>
                <CheckBox checked={formState['HSK' + level]} name={'HSK' + level} label={'HSK ' + level} onChange={handleFormInput}/>
              </FormGroupListItem>)
            }
          </FormListGroup>
          <FormListGroup>
            {
              [4, 5, 6].map((level) => <FormGroupListItem key={level}>
                <CheckBox checked={formState['HSK' + level]} name={'HSK' + level} label={'HSK ' + level} onChange={handleFormInput}/>
              </FormGroupListItem>)
            }
          </FormListGroup>
        </FormList>
      </FormGroup>

      {/* group containing number of cards selection */}
      <FormGroup>
        <FormGroupLabel>Number of Cards</FormGroupLabel>
        <CardNumberGroup>
          {
            // preset values for number of cards
            // displayed as radio buttons, checked value is based on form state, mutates form state on change
            // if selected, clears usesCustomNumCards flag
            [25, 50, 75].map((numValue, index) => <RadioContainer key={index}>
              <Radio index={index} checked={formState.numCards === numValue} name='numCards' label={numValue} value={numValue} onChange={event => {
                  setUsesCustomNumCards(false);
                  handleFormInput(event);
                }}/>
            </RadioContainer>)
          }
        </CardNumberGroup>
        <CardNumberGroup>
          {/* text input for custom user-inputted number of cards */}

          <NumberInput
            // only display value if  usesCustomNumCards flag set
            value={usesCustomNumCards
              ? formState.numCards
              : " "} label="Other" name='numCards'
            // on change, run simple validation (must be number, must be between 1-99)
            
            // if validation fails, clear usesCustomNumCards flag and set numCards to default 25
            onChange={event => {
              const newValue = event.target.value;
              if (newValue.match(/^\d+$/)) {
                setUsesCustomNumCards(true);
                if (newValue < 1) {
                  handleFormInput(event, 1);
                } else if (newValue > 99) {
                  handleFormInput(event, 99);
                } else {
                  handleFormInput(event);
                }
              } else {
                handleFormInput(event, 25);
                setUsesCustomNumCards(false);
              }
            }}></NumberInput>
        </CardNumberGroup>
      </FormGroup>

      {/* group for other review options */}
      <FormGroup>
        <FormGroupLabel>Options</FormGroupLabel>
        <FormList>
          <FormListGroup>
            <FormGroupListItem>
              <CheckBox checked={formState['reviewIncorrect']} name='reviewIncorrect' label={'Review Incorrect After'} onChange={handleFormInput}/>
            </FormGroupListItem>

            <FormGroupListItem>
              <CheckBox checked={formState['useZhuyin']} name='useZhuyin' label={'Use Zhuyin'} onChange={handleFormInput}/>
            </FormGroupListItem>

            <FormGroupListItem>
              <CheckBox checked={formState['useTraditionalCharacters']} name='useTraditionalCharacters' label={'Use Traditional Characters'} onChange={handleFormInput}/>
            </FormGroupListItem>
          </FormListGroup>
        </FormList>
      </FormGroup>
    </OptionsForm>
    {/* container holding button to advance to next state
      on click, runs validation on form
      if validation fails, set flag to display error message to user,
      if clears, push form state to redux state and advance to review page*/
    }
    {/* TODO it would be better to just have redux state be single source of truth rather than have a local state in the component and then push to redux on submit */}
    <ButtonContainer>
      <IconButton icon='arrow-right' label='Begin' onClick={() => {
          if (!(formState.HSK1 || formState.HSK2 || formState.HSK3 || formState.HSK4 || formState.HSK5 || formState.HSK6)) {
            setHasAttemptedSubmit(true)
          } else {
            props.setReviewOptions(formState);
            props.history.replace('/review')
          }
        }}/>
    </ButtonContainer>
  </React.Fragment>);
}

const OptionsForm = styled.form `
  flex: 1;
  height: 100%;
  width: 100%;
  padding: 0 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const FormGroup = styled.div `
  width: 100%;
  padding-bottom: calc(1.5 * ${props => props.theme.baseMarginSize});
  &:not(:last-of-type) {
    border-bottom: 1px dashed white;
    margin-bottom: calc(1.5 * ${props => props.theme.baseMarginSize});
  }
  font-weight: 600;
`

const FormGroupLabel = styled.div `
  font-size: calc(1.8 * ${props => props.theme.baseFontSize});
  margin-bottom: .5rem;
  ${props => props.error && `
    &:after {
      color: ${props.theme.colors.incorrect};
      content: " *";
    }
  `}
`

const FormList = styled.ul `
  list-style: none;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: column;
`

const FormListGroup = styled.div `
  white-space:normal;
  display: inline-block;
`

const FormGroupListItem = styled.li `
  margin: 0 calc(1.5 * ${props => props.theme.baseMarginSize}) calc(1.5 * ${props => props.theme.baseMarginSize});
  &:not(:first-of-type) {
    margin-top: 1rem;
  }
`

const CardNumberGroup = styled.div `
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`

const ButtonContainer = styled.div `
    width: 100%;
`

const RadioContainer = styled.div `
  margin: 0 calc(1.5 * ${props => props.theme.baseMarginSize});
`
export default withRouter(connect(null, {resetState, setReviewOptions})(Select));
