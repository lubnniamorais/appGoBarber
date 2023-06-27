import React, { useRef, useEffect, useCallback } from 'react';
import { Modalize } from 'react-native-modalize';

import FeatherIcons from 'react-native-vector-icons/Feather';

import { useTheme } from 'styled-components';

import {
  Content,
  BoxClose,
  CloseButton,
  BoxOptionsPhoto,
  TakePhotoButton,
  Divisor,
  TakePhotoGalleryButton,
} from './styles';

interface IProps {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  handleTakePhotoCamera: () => void;
  handleTakePhotoGallery: () => void;
}

const ChooseTakePhotoModal: React.FC<IProps> = ({
  isOpenModal,
  handleCloseModal,
  handleTakePhotoCamera,
  handleTakePhotoGallery,
}) => {
  const theme = useTheme();

  const modalizeRef = useRef<Modalize>(null);

  const openModal = useCallback(() => {
    modalizeRef.current?.open();
  }, []);

  const closeModal = useCallback(() => {
    modalizeRef.current?.close();
  }, []);

  useEffect(() => {
    if (isOpenModal) {
      openModal();
    } else {
      closeModal();
    }
  }, [isOpenModal, closeModal, openModal]);

  return (
    <Modalize
      adjustToContentHeight
      childrenStyle={{ height: 130 }}
      ref={modalizeRef}
      // snapPoint={130}
      closeOnOverlayTap={false}
      panGestureEnabled={false}
    >
      <Content>
        <BoxClose>
          <CloseButton onPress={handleCloseModal}>
            <FeatherIcons name="x" size={30} color="red" />
          </CloseButton>
        </BoxClose>

        <BoxOptionsPhoto>
          <TakePhotoButton onPress={handleTakePhotoCamera}>
            <FeatherIcons name="camera" size={50} color="black" />
          </TakePhotoButton>

          <Divisor />

          <TakePhotoGalleryButton onPress={handleTakePhotoGallery}>
            <FeatherIcons name="image" size={50} color="black" />
          </TakePhotoGalleryButton>
        </BoxOptionsPhoto>
      </Content>
    </Modalize>
  );
};

export { ChooseTakePhotoModal };
