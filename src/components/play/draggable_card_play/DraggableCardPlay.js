import React, { useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CardHeader } from './CardHeader';
import { CardFooter } from './CardFooter';
import './DraggableCardPlay.css';

export const DraggableCardPlay = ({ id, card, deckClickedTurn }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        disabled: !deckClickedTurn || card.isDisabled
    });

    const fontSize = useMemo(() => `calc(1.1rem - ${card.name.length / 3}px)`, [card.name.length]);

    const bodyStyle = useMemo(() => ({
        background: `url('/images/backgrounds/${card?.imageType}.png')`,
        marginLeft: `calc(${!card.inDroppable && card.lengthCard >= 15 ? 15 + (0.02 * card.lengthCard) : card.inDroppable ? 2.5 : card.lengthCard} * -0.25rem - 0.4vw)`,
        transform: CSS.Translate.toString(transform),
        transition: transform ? "none" : "transform 0.3s"
    }), [transform, card.imageType, card.lengthCard, card.inDroppable]);

    return (
        <div className={`draggable_card_play_container draggable_card_play_container_${card.isDisabled}`}
            ref={setNodeRef} style={bodyStyle}
            {...listeners} {...attributes}
            id={`draggable_card_play_container_${id}`}>
            
            <CardHeader fontSize={fontSize} imageType={card.imageType} />
            <img className="draggable_card_play_image"
                src={require(`../../../assets/images/card/image_type/${card?.imageType?.toLowerCase() || "squirrel"}.png`)} alt=""/>
            <CardFooter power={card.power} health={card.health} imageType={card.imageType} />
        </div>
    );
};