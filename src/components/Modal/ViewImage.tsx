import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return(
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset='slideInBottom' >
      <ModalOverlay />
      <ModalContent maxH="600px" maxW="900px" w="auto">
        <ModalBody bg="#353431" padding={0} display="flex" alignItems="center" justifyContent="center">
          <Image src={imgUrl} maxH="600px" maxW="900px" />
        </ModalBody>
        <ModalFooter bg="#353431" padding={2} justifyContent="flex-start" borderRadius="0px 0px 8px 8px">
          <Link href={imgUrl}>Abrir original</Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
