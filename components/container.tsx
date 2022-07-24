import type { FC } from 'react'
import { useCallback, useState } from 'react'

import { Card } from './card'
import { Drop } from './drop'

const style = {
  width: 400,
}

export interface Item {
  id: number
  text: string
}

export interface ContainerState {
  cards: Item[]
}

export const Container: FC = () => {
  {
    const [cards, setCards] = useState([
      {
        id: 1,
        text: 'Write a cool JS library',
      },
      {
        id: 2,
        text: 'Make it generic enough',
      },
      {
        id: 3,
        text: 'Write README',
      },
      {
        id: 4,
        text: 'Create some examples',
      },
      {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
      },
      {
        id: 6,
        text: '???',
      },
      {
        id: 7,
        text: 'PROFIT',
      },
    ])
    const [cardsOnBoard, setCardsOnBoard] = useState([
        {
            id: 0,
            text: 'empty',
        },
    ])

    const moveCard = useCallback((dragIndex: number, hoverIndex: number, onBoard: boolean) => {
        // console.log(cards[dragIndex], id, cardsOnBoard.map(card => card.id).includes(cards[dragIndex].id))
        
        if (!onBoard) {
            // setCards((prevCards: Item[]) => {
            //     const cards = [...prevCards]
            //     cards.splice(hoverIndex, 0, cards.splice(dragIndex, 1)[0]);
            //     return cards;
            // })
        } else {
            setCardsOnBoard((prevCards: Item[]) => {
                const c = [...prevCards]
                c.splice(hoverIndex, 0, c.splice(dragIndex, 1)[0]);
                // const indexOfEmpty = c.findIndex(card => card.id === 0)
                // c.splice(prevCards.length -1, 0, c.splice(indexOfEmpty, 1)[0]);
                return c;
            })
        }
    }, [])

    const cardDrop = useCallback((id: number, index: number, onBoard: boolean) => {
        console.log(id, index, onBoard)
        if (onBoard) setCardsOnBoard(prevCards => [
            ...prevCards.slice(0, -1),
            {...cards[index], id: id + 10},
            prevCards[prevCards.length - 1],
        ])
    }, [cards])

    const renderCard = useCallback(
      (card: { id: number; text: string }, index: number) => {
        if (!card) return null
        return (
          <Card
            key={card?.id + "-" + index}
            index={index}
            id={card?.id || 0}
            text={card?.text || ""}
            moveCard={moveCard}
            cardDrop={cardDrop}
          />
        )
      },
      [moveCard, cardDrop],
    )

    return (
      <>
        <div className="container">
            <div className="left">
                {cards.map((id, text) => renderCard(id, text))}
            </div>
            <div className="right drop">
                {cardsOnBoard.map((id, text) => renderCard(id, text))}
                {/* <Drop /> */}
            </div>
        </div>
        {/* <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div> */}
      </>
    )
  }
}