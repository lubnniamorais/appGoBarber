import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.Modal``;

export const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  background-color: #121214e6;
`;

export const ModalView = styled.View`
  margin: ${RFValue(20)}px;

  padding: ${RFValue(35)}px;

  align-items: center;
`;
