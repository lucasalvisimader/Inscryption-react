// styles
import './DraggableCardPlay.css';

// react
import { useMemo } from 'react';

// translation
import { useTranslation } from 'react-i18next';

// external
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';


export const DraggableCardPlay = ({ id, card, deckClickedTurn, setDeckClickedTurn }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, disabled: !deckClickedTurn || card.isDisabled });
    const { t } = useTranslation();

    const fontSize = useMemo(() => `calc(1.1rem - ${card.name.length / 3}px)`, [card.name.length]);
    const style = useMemo(() => ({
        background: `url('/images/backgrounds/${card?.imageType}.png')`,
        marginLeft: `calc(${!card.inDroppable && card.lengthCard >= 15 ? 15 + (0.02 * card.lengthCard) : card.inDroppable ? 2.5 : card.lengthCard} * -0.25rem - 0.4vw)`,
        transform: CSS.Translate.toString(transform),
        transition: transform ? "none" : "transform 0.3s"
    }), [transform, card.imageType, card.lengthCard, card.inDroppable]);

    const footerStyle = useMemo(() => {
        if (card?.imageType?.toLowerCase() === "amalgam") {
            return { backgroundImage: `url(${require('../../../assets/images/card/footer/avian_canine_hooved_reptile_insect_footer_rare.png')})` };
        } else if (card?.imageType?.toLowerCase() === "greatwhite") {
            return { backgroundImage: `url(${require('../../../assets/images/card/footer/blood_footer.png')})` };
        } else if (card?.imageType?.toLowerCase() === "thesmoke" || card?.imageType?.toLowerCase() === "greatersmoke") {
            return { backgroundImage: `url(${require('../../../assets/images/card/footer/smoke_footer.png')})` };
        } else if (
            ["uruyali", "amoeba", "amalgam", "moleman", "strangelarva", "strangepupa", "mothman", "mantisgod", "geck", "ouroboros", "child13"].includes(card?.imageType?.toLowerCase())
        ) {
            return { backgroundImage: `url(${require('../../../assets/images/card/footer/footer_rare.png')})` };
        } else {
            return { backgroundImage: `url(${require('../../../assets/images/card/footer/footer.png')})` };
        }
    }, [card.imageType]);

    const handleDragAttempt = () => {
        if (!deckClickedTurn) {
            alert(t('drag_not_allowed_alert'));
        }
    }

    const CardHeader = ({ fontSize }) => (
        <div className={`draggable_card_play_header`}>
            <span className='draggable_card_play_name' style={{ fontSize }}>
                {card.name}
            </span>
        </div>
    );
    
    const CardImage = ({ altText }) => (
        <img className='draggable_card_play_image' 
            src={require(`../../../assets/images/card/image_type/${card?.imageType?.toLowerCase() || "squirrel"}.png`)} 
            alt={altText} 
        />
    );
    
    const CardFooter = () => (
        <div className={`draggable_card_play_footer`} style={footerStyle}>
            <span className='draggable_card_play_power'>{card.power}</span>
            <span className='draggable_card_play_health'>{card.health}</span>
        </div>
    );

    return (
        <div className={`draggable_card_play_container draggable_card_play_container_${card.isDisabled}`}
            ref={setNodeRef} style={style} 
            {...listeners} {...attributes} 
            id={`draggable_card_play_container_${id}`}
            onMouseDown={handleDragAttempt}>
            <CardHeader fontSize={fontSize} />
            <CardImage altText={t('card_image')} />
            <CardFooter />
        </div>
    );
}