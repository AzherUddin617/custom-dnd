import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { ItemTypes } from './ItemTypes'

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

export interface CardProps {
  id: any
  text: string
  index: number
  moveCard: (dragIndex: number, hoverIndex: number, onBoard: boolean) => void,
  cardDrop: (id: number, index: number, onBoard: boolean) => void,
}

interface DragItem {
  index: number
  id: string
  type: string
}

let onBoard = false;

export const Card: FC<CardProps> = ({ id, text, index, moveCard, cardDrop }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
    //   if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //     return
    //   }

      // Dragging upwards
    //   if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //     return
    //   }

      onBoard = ref.current.parentElement?.classList.contains('drop') ?? false;
      console.log('onBoard :>> ', onBoard);

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex, onBoard)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
        const isBoard = ref.current?.parentElement?.classList.contains('drop') ?? true
        cardDrop(item.id, item.index, onBoard && !isBoard)
    },
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      {text}
    </div>
  )
}