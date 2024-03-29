import React, { useCallback, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { RFPercentage } from 'react-native-responsive-fontsize';

import { Image } from 'react-native-compressor';

import * as Yup from 'yup';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import axios, { AxiosError } from 'axios';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Content,
  BackButton,
  UserAvatarButton,
  UserAvatar,
  Title,
} from './styles';
import { noImage } from '../../utils/Utils';
import { ChooseTakePhotoModal } from '../../components/ChooseTakePhotoModal';
import { LoadingModal } from '../../components/LoadingModal';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);

  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const [isOpenTakePhotoModal, setIsOpenTakePhotoModal] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const toggleOpenTakePhotoModal = useCallback(() => {
    setIsOpenTakePhotoModal(oldState => !oldState);
  }, []);

  const handleSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val: string | any[]) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val: string | any[]) => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, old_password, password, password_confirmation } =
          data;

        const formData = {
          name,
          email,
          ...(data.old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar o perfil, tente novamente',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTakePhotoCamera = useCallback(async () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
        cameraType: 'back',
      },
      async response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode === 'permission') {
          Alert.alert('GoBarber', 'Permissão para acesso a galeria necessária');
          return;
        }
        if (response.assets) {
          if (response.assets[0].uri) {
            toggleOpenTakePhotoModal();

            try {
              setIsLoadingModal(true);

              const responseImage = await Image.compress(
                response.assets[0].uri,
                {
                  maxWidth: RFPercentage(100),
                  quality: 0.8,
                  output: 'jpg',
                },
              );

              const formData = new FormData();

              formData.append('avatar', {
                name: `${user.id}.jpg`, // CPF ca be unique information.
                type: 'image/*',
                uri: responseImage,
              });

              const responseApi = await api.patch('/users/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                transformRequest: data => data,
              });

              if (responseApi.status === 200) {
                const customerData = responseApi.data;
                updateUser(customerData);
                setIsLoadingModal(false);
              }
            } catch (err) {
              if (axios.isAxiosError(err)) {
                const errorAxios = err as AxiosError;
                if (errorAxios.response) {
                  Alert.alert('GoBarber', 'Não foi possível atualizar a foto!');
                }
              } else {
                setIsLoadingModal(false);
                Alert.alert('GoBarber', 'Não foi possível atualizar a foto!');
              }
            }
          }
        }
      },
    );
  }, [toggleOpenTakePhotoModal, updateUser, user.id]);

  const handleTakePhotoGallery = useCallback(async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      },
      async response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode === 'permission') {
          Alert.alert('GoBarber', 'Permissão para acesso a galeria necessária');
          return;
        }
        if (response.assets) {
          if (response.assets[0].uri) {
            toggleOpenTakePhotoModal();

            try {
              setIsLoadingModal(true);

              const responseImage = await Image.compress(
                response.assets[0].uri,
                {
                  maxWidth: RFPercentage(100),
                  quality: 0.8,
                  output: 'jpg',
                },
              );

              const formData = new FormData();

              formData.append('avatar', {
                name: `${user.id}.jpg`, // CPF ca be unique information.
                type: 'image/*',
                uri: responseImage,
              });

              const responseApi = await api.patch('/users/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                transformRequest: data => data,
              });

              if (responseApi.status === 200) {
                const customerData = responseApi.data;
                updateUser(customerData);
                setIsLoadingModal(false);
              }
            } catch (err) {
              if (axios.isAxiosError(err)) {
                const errorAxios = err as AxiosError;
                if (errorAxios.response) {
                  Alert.alert('GoBarber', 'Não foi possível atualizar a foto!');
                }
              } else {
                setIsLoadingModal(false);
                Alert.alert('GoBarber', 'Não foi possível atualizar a foto!');
              }
            }
          }
        }
      },
    );
  }, [toggleOpenTakePhotoModal, updateUser, user.id]);

  return (
    // <KeyboardAvoidingView
    //   style={{ flex: 1 }}
    //   behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    //   enabled
    // >
    <Container>
      <BackButton onPress={handleGoBack}>
        <Icon name="chevron-left" size={24} color="#999591" />
      </BackButton>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Content>
          {user ? (
            <UserAvatarButton onPress={toggleOpenTakePhotoModal}>
              <UserAvatar
                source={{
                  uri: user.avatar_url ? user.avatar_url : noImage(user.name),
                }}
              />
            </UserAvatarButton>
          ) : (
            <UserAvatarButton>
              <Icon name="user" size={30} color="#fff" />
            </UserAvatarButton>
          )}
          <Title>Meu perfil</Title>

          <Form
            initialData={{ name: user.name, email: user.email }}
            ref={formRef}
            onSubmit={handleSignUp}
          >
            <Input
              autoCapitalize="words"
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
            />

            <Input
              ref={emailInputRef}
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={() => {
                oldPasswordInputRef.current?.focus();
              }}
            />

            <Input
              ref={oldPasswordInputRef}
              secureTextEntry
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
              textContentType="newPassword"
              returnKeyType="next"
              containerStyle={{ marginTop: 16 }}
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />

            <Input
              ref={passwordInputRef}
              secureTextEntry
              name="password"
              icon="lock"
              placeholder="Nova senha"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => {
                confirmPasswordInputRef.current?.focus();
              }}
            />

            <Input
              ref={confirmPasswordInputRef}
              secureTextEntry
              name="password_confirmation"
              icon="lock"
              placeholder="Confirmar senha"
              textContentType="newPassword"
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
            />
          </Form>
          <Button
            onPress={() => {
              formRef.current?.submitForm();
            }}
          >
            Confirmar mudanças
          </Button>
        </Content>
      </ScrollView>

      {/* MODALS */}
      <ChooseTakePhotoModal
        isOpenModal={isOpenTakePhotoModal}
        handleCloseModal={toggleOpenTakePhotoModal}
        handleTakePhotoCamera={handleTakePhotoCamera}
        handleTakePhotoGallery={handleTakePhotoGallery}
      />
      <LoadingModal modalVisible={isLoadingModal} />
    </Container>
    // </KeyboardAvoidingView>
  );
};

export default Profile;
