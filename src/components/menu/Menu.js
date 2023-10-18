// styles
import "./Menu.css"

// react
import { useRef, useState } from "react";

// images
import continueText from '../../assets/images/menu/texts/continue.png'
import optionsText from '../../assets/images/menu/texts/options.png'

// json
import en from '../../assets/locales/en.json'

// external
import { DraggableCard } from '../draggable_card/DraggableCard';
import { DroppableArea } from "../droppable_area/DroppableArea";
import { DndContext } from '@dnd-kit/core';

const Menu = () => {
    const [textSelected, setTextSelected] = useState(null);
    const [parent, setParent] = useState(null);

    const json = en.menu;

    function handleDragEnd({ over }) {
        if (over) {
            setParent(over.id);
        } else {
            setParent(null);
        }
    }

    return (<>
        <DndContext onDragEnd={handleDragEnd}>
            <div className="menu_container">
                <div className="menu_header">
                    {textSelected && (
                        <img className="menu_card_text_selected" src={textSelected} alt={json.text_selected} />
                    )}
                </div>
                <div className="menu_body_container">
                    <div className="menu_body">
                        <DroppableArea id="droppable">
                            {parent === "droppable" && (
                                <DraggableCard className="menu_cards" id={parent}
                                    text={parent === "droppable" ? continueText : optionsText}
                                    textSelected={textSelected}
                                    setTextSelected={setTextSelected}
                                />
                            )}
                        </DroppableArea>
                    </div>
                </div>
                <div className="menu_footer">
                    {parent === "droppable" ? (<>
                        <DraggableCard className="menu_cards"
                            id="general_draggable"
                            text={continueText}
                            textSelected={textSelected}
                            setTextSelected={setTextSelected}
                        />
                    </>) : (<>
                        <DraggableCard className="menu_cards"
                            id="continue_draggable"
                            text={continueText}
                            textSelected={textSelected}
                            setTextSelected={setTextSelected}
                        />
                        <DraggableCard className="menu_cards"
                            id="options_draggable"
                            text={optionsText}
                            textSelected={textSelected}
                            setTextSelected={setTextSelected}
                        />
                    </>)}
                </div>
            </div>
        </DndContext>
    </>);
}

export default Menu;
