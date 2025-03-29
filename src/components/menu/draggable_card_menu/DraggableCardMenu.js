// styles
import './DraggableCardMenu.css';

// react
import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// components
import NewGameCard from '../new_game_card/NewGameCard';

// context
import { useAudio } from '../../../context/AudioContext';

// sounds
import menuHoverCard from '../../../assets/sounds/menu_hover_card.wav';
import menuChosenCard from '../../../assets/sounds/menu_chosen_card.wav';

// external
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export const DraggableCardMenu = ({ props }) => {
    const id = props.id;
    const text = props.text;
    const type = props.type;
    const textSelected = props.textSelected;
    const setTextSelected = props.setTextSelected;
    const isDisabled = props.isDisabled;
    const isOnTop = props.isOnTop;
    const setIsGlitchy = props.setIsGlitchy;
    const setIsFadingOut = props.setIsFadingOut;
    const clickedCard = props.clickedCard;
    const navigate = useNavigate();
    const { volume } = useAudio();
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        disabled: isDisabled,
    });
    const style = { transform: CSS.Translate.toString(transform) }
    const audioRef = useRef(null);

    // This useEffect handles with the actions chosen by the user when put a card from below on the center area.
    // It's also responsible by the sound that's played when chosen.
    useEffect(() => {
        if (isOnTop) {
            if (audioRef.current) {
                audioRef.current.pause();
                // Restart the sound
                audioRef.current.currentTime = 0;
            }
            // Create and play the new sound
            const audioChosen = new Audio(menuChosenCard);
            audioChosen.volume = volume / 100 * 0.2;
            // Store the sound reference
            audioRef.current = audioChosen;
            audioChosen.play();

            setTimeout(() => {
                if (type === "continue") {
                    setIsFadingOut(true);
                    setTimeout(() => {
                        navigate("/play");
                    }, 1500);
                } else if (type === "quit") {
                    window.open("about:blank", "_self");
                    window.close();
                }
            }, 500);
        }
    }, [isOnTop, navigate, setIsFadingOut, type, volume]);

    // This function handles with the hover of a card from below, when not on the center.
    const handleHoverCard = useCallback((currentText) => {
        // Verifica se a carta atual é diferente da carta selecionada
        if (textSelected !== currentText) {
            const audioHover = new Audio(menuHoverCard);
            audioHover.volume = volume / 100 * 0.4;
            audioHover.play();

            // Atualiza o estado com a nova carta selecionada
            setTextSelected(currentText);
        }
    }, [textSelected, setTextSelected, volume]);

    return (<>
        <div className={`draggable_menu_cards ${(textSelected === text && !clickedCard) && "draggable_menu_on_hover_card_mouse"} ${(clickedCard) && "draggable_menu_on_click_card_mouse"} ${isOnTop ? "draggable_menu_top_card" : ""}`}
            ref={setNodeRef} style={style}
            {...listeners} {...attributes}
            id={`draggable_menu_${type}_card`}
            onMouseEnter={() => handleHoverCard(text)}>
            {isDisabled && <NewGameCard setIsGlitchy={setIsGlitchy} />}
        </div>
    </>);
}