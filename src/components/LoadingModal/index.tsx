import React from 'react';
import { ActivityIndicator } from 'react-native';

import { useTheme } from 'styled-components';

import { Container, Content, ModalView } from './styles';

interface IProps {
  modalVisible: boolean;
}

const LoadingModal: React.FC<IProps> = ({ modalVisible }) => {
  const theme = useTheme();

  return (
    <Container
      animationType="fade"
      visible={modalVisible}
      transparent
      onRequestClose={() => {
        return null;
      }}
    >
      <Content>
        <ModalView>
          <ActivityIndicator size="large" color="#999591" />
        </ModalView>
      </Content>
    </Container>
  );
};

export { LoadingModal };
