import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const acceptedFormatsRegex =
    /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#](?:jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/g;

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: fileList =>
          fileList[0].size < 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: fileList =>
          acceptedFormatsRegex.test(fileList[0].type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  };

  async function postImage(formData: any){
    const {url, title, description} = formData 

    return api.post(`/api/images`, {url, title, description}).then(response => response.data).catch(err => console.error(err));
  }

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (formData : any) => {return postImage(formData)},
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['images']);
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if(!imageUrl){
        toast({title:'Imagem não adicionada', description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',  status: 'error'});
        return;
      }
      const postData = {
        url: imageUrl,
        title: data?.title,
        description: data?.description
      }
      const images = await mutation.mutateAsync(postData);

      if(images)
      toast({title: 'Imagem cadastrada', description: 'Sua imagem foi cadastrada com sucesso.', status: 'success'});
      
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      // TODO EXECUTE ASYNC MUTATION
      // TODO SHOW SUCCESS TOAST
    } catch {
      toast({title: 'Falha no cadastro', description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.', status: 'error'});
    } finally {
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
