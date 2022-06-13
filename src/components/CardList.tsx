import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const { isOpen, onOpen, onClose} = useDisclosure();

  // TODO SELECTED IMAGE URL STATE
  const [selectedImage, setSelectedImage] = useState(null);

  // TODO FUNCTION HANDLE VIEW IMAGE
  function handleViewImage(data){
    setSelectedImage(data);
    onOpen();
    return data;
  }

  return (
    <>
    <SimpleGrid columns={3} spacing="40px">
      {cards ? cards?.map(card => <Card key={card?.title} data={card} viewImage={() => handleViewImage(card.url)} />):""}
    </SimpleGrid>

    {selectedImage ? <ModalViewImage onClose={onClose} isOpen={isOpen} imgUrl={selectedImage}/> : ""}
    </>
  );
}
