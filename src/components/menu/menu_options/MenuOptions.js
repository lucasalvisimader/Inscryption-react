// styles
import "./MenuOptions.css";

// react
import { useEffect, useState, useCallback } from "react";

// images
import continueText from '../../../assets/images/menu/texts/continue.png';
import optionsText from '../../../assets/images/menu/texts/options.png';
import newGameText from '../../../assets/images/menu/texts/newgame_greyed.png';
import quitText from '../../../assets/images/menu/texts/quit.png';
import backgroundGlitch from '../../../assets/images/screen/background_new_game.gif';

// translation
import { useTranslation } from "react-i18next";

// external
import { DraggableCardMenu } from '../draggable_card_menu/DraggableCardMenu';
import { DroppableAreaMenu } from "../droppable_area_menu/DroppableAreaMenu";
import { DndContext } from '@dnd-kit/core';

const Menu = () => {
    const [textSelected, setTextSelected] = useState(null);
    const [parent, setParent] = useState(null);
    const [isGlitchy, setIsGlitchy] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [clickedCard, setClickedCard] = useState(false);
    const [startedDrag, setStartedDrag] = useState(null);
    const [animatedCards, setAnimatedCards] = useState([]);
    const { t } = useTranslation();

    // Funções de drag-and-drop
    const handleDragStart = () => {
        setClickedCard(true);
        setStartedDrag(true);
    }

    const handleDragEnd = (result) => {
        setClickedCard(false);
        setStartedDrag(false);
        if (result.active && result.over) {
            setParent(result.active.id);
        } else {
            setParent(null);
        }
    }

    // Dados das cartas
    const cardData = {
        new_game: {
            id: "menu_new_game_draggable",
            text: newGameText,
            type: "new_game",
            isDisabled: "true"
        },
        continue: {
            id: "menu_continue_draggable",
            text: continueText,
            type: "continue"
        },
        options: {
            id: "menu_options_draggable",
            text: optionsText,
            type: "options"
        },
        quit: {
            id: "menu_quit_draggable",
            text: quitText,
            type: "quit"
        }
    }

    // Geração de props para as cartas
    const generateDraggableCardProps = (card, name, isOnTop) => {
        return {
            id: card.id,
            key: name,
            text: card.text,
            type: card.type,
            textSelected: textSelected,
            setTextSelected: setTextSelected,
            onClick: () => setParent(null),
            clickedCard: clickedCard,
            isDisabled: card.isDisabled,
            isOnTop: isOnTop,
            setIsGlitchy: setIsGlitchy,
            setIsFadingOut: setIsFadingOut
        };
    }

    // Geração das cartas
    const generateCard = (cardKey = [], isOnTop) => {
        return cardKey.map((name) => {
            const props = generateDraggableCardProps(cardData[name], name, isOnTop);
            return (<DraggableCardMenu key={props.id} className="menu_cards" props={props} />);
        });
    }

    // Cartas abaixo
    const switchGenerateCardFromBelow = useCallback(() => {
        switch (parent) {
            case "menu_continue_draggable":
                return ["new_game", "options", "quit"];
            case "menu_options_draggable":
                return ["new_game", "continue", "quit"];
            case "menu_new_game_draggable":
                return ["continue", "options", "quit"];
            case "menu_quit_draggable":
                return ["new_game", "continue", "options"];
            default:
                return ["new_game", "continue", "options", "quit"];
        }
    }, [parent]); // Memoizar com base em `parent`

    const cardsFromBelow = () => {
        const cardKeys = switchGenerateCardFromBelow();
        return cardKeys.map((name) => {
            const isAnimated = animatedCards.includes(name);
            return (
                <div className={`menu_card ${!isAnimated ? "menu_card_initial" : "menu_card_animate"}`}
                    key={name}>
                    {generateCard([name])}
                </div>
            );
        });
    }

    // UseEffect para animar as cartas
    useEffect(() => {
        const cardKeys = switchGenerateCardFromBelow();
        const timeoutIds = cardKeys.map((name, index) => {
            if (!animatedCards.includes(name)) {
                // Delay progressivo com intervalo fixo
                const delay = 200 + 150 * index; 
                return setTimeout(() => {
                    setAnimatedCards((prev) => {
                        if (!prev.includes(name)) {
                            return [...prev, name];
                        }
                        return prev;
                    });
                }, delay);
            }
            return null;
        });

        // Limpar timeouts ao desmontar o componente
        return () => {
            timeoutIds.forEach((timeoutId) => {
                if (timeoutId) clearTimeout(timeoutId);
            });
        };
    }, [parent, animatedCards, switchGenerateCardFromBelow]);

    // Carta no centro
    const cardCenter = () => {
        if (parent) {
            const cardKey = parent.replace("menu_", "").replace("_draggable", "");
            const cardOnTop = generateCard([cardKey], true);
            return cardOnTop;
        }
        return null;
    }

    return (<>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="menu_container">
                <div className="menu_header">
                    {textSelected && <img className="menu_card_text_selected" src={textSelected} alt={t('text_selected')} />}
                </div>
                <div className="menu_body_container">
                    <div className="menu_body">
                        <DroppableAreaMenu id="menu_droppable" startedDrag={startedDrag} setStartedDrag={setStartedDrag}>
                            {cardCenter()}
                        </DroppableAreaMenu>
                    </div>
                </div>
                <div className="menu_footer">
                    {cardsFromBelow()}
                </div>
                {isGlitchy && <img className="menu_card_new_game_image_glitch" src={backgroundGlitch} alt={t('background_glitch')} />}
                {isFadingOut && <div className="menu_card_fade_out" />}
            </div>
        </DndContext>
    </>);
};

export default Menu;