// TabContainer, Tab components
// set of components to allow for generic, reusable tab functionality with smooth transitions
// TabContainer is parent component which conditionally renders Tab based matching props.target with child name
// Tab is child component which contains arbitrary children

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

const TAB_SWITCH_DURATION = 300;
/**
 * TabContainer component
 * @param {boolean} props.instant whether switches between active tab should be instant (without transition)
 * @param {string} props.target name of child which will be treated as active tab
 */
function TabContainer(props) {
  // set tabSwitchDuration based on props.instant
  const tabSwitchDuration = props.instant
    ? 0
    : TAB_SWITCH_DURATION;
  const [target, setTarget] = useState(props.target);
  const [fade, setFade] = useState("in");

  // on switching props.target
  // first fade out current tab
  // set timeout to, after tabSwitchDuration, change tab target and fade back in
  useEffect(() => {
    setFade('out');
    const fadeTimeout = setTimeout(() => {
      setFade('in');
      setTarget(props.target)
    }, tabSwitchDuration);
    // clean-up
    return() => {
      clearTimeout(fadeTimeout);
    }
  }, [props.target, tabSwitchDuration])

  // find active tab by matching props.target to child name
  const activeTab = props.children.filter(child => child.props.name === target)[0];
  // render only activeTab
  return <Tab {...activeTab.props} switchDuration={tabSwitchDuration} fade={fade}>{activeTab.props.children}</Tab>
}

/**
 * TabContainer component
 * @param {boolean} props.instant whether switches between active tab should be instant (without transition)
 * @param {string} props.target name of child which will be treated as active tab
 */
function Tab(props) {
  return (<TabWrapper switchDuration={props.switchDuration} fade={props.fade}>
    {props.children}
  </TabWrapper>)
}

const TabWrapper = styled.div `
  opacity: ${props => props.fade === "out"
  ? 0
  : 1};
  transition: opacity ${props => props.switchDuration}ms;
`

export {
  Tab,
  TabContainer
};
