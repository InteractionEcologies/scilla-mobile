// @flow
import {} from 'react-native';
import React from 'react';
import { MonoText, AppText } from '../StyledText';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<AppText>Snapshot test!</AppText>).toJSON();

  expect(tree).toMatchSnapshot();
});
