// styles
import './Play.css';

// react
import { useState, useEffect, useRef } from 'react';

// components
import { DraggableCardPlay } from '../../components/play/draggable_card_play/DraggableCardPlay';
import { DroppableAreaPlay } from '../../components/play/droppable_area_play/DroppableAreaPlay';
// import { Inventory } from '../../components/play/inventory_container/Inventory';

// images
import backDeck from '../../assets/images/card/back/back.png';
import backSquirrelDeck from '../../assets/images/card/back/back_squirrel.png';
import cardQueue from '../../assets/images/game/slots/card_queue_slot.png';
import cardUpcoming from '../../assets/images/game/slots/card_slot_upcoming.png';

// scale images
// import minusTest from '../../assets/images/menu/options/minus_enable.png';
// import plusTest from '../../assets/images/menu/options/plus_enable.png';
// import scaleStatic from '../../assets/images/game/scale/scale_static.png';
// import scalePlayer1 from '../../assets/images/game/scale/scale_player_1.png';
// import scaleEnemy1 from '../../assets/images/game/scale/scale_enemy_1.png';
// import scalePlayer2 from '../../assets/images/game/scale/scale_player_2.png';
// import scaleEnemy2 from '../../assets/images/game/scale/scale_enemy_2.png';
// import scalePlayer3 from '../../assets/images/game/scale/scale_player_3.png';
// import scaleEnemy3 from '../../assets/images/game/scale/scale_enemy_3.png';
// import scalePlayer4 from '../../assets/images/game/scale/scale_player_4.png';
// import scaleEnemy4 from '../../assets/images/game/scale/scale_enemy_4.png';
// import scalePlayer5 from '../../assets/images/game/scale/scale_player_5.png';
// import scaleEnemy5 from '../../assets/images/game/scale/scale_enemy_5.png';

// json
import json from '../../assets/jsons/cards.json';

// translation
import { useTranslation } from 'react-i18next';

// external
import { v4 as uuidV4 } from 'uuid';
import { DndContext } from '@dnd-kit/core';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const Play = () => {
    const [cardsData, setCardsData] = useState([]);
    const [playerCards, setPlayerCards] = useState([]);
    const [deckCards, setDeckCards] = useState([]);
    const [deckSquirrelCards, setDeckSquirrelCards] = useState([]);
    const [deckClickedTurn, setDeckClickedTurn] = useState(false);
    const [droppableAreas, setDroppableAreas] = useState(Array.from({ length: 12 }, (_, index) => ({ key: index + 1, cards: [] })));
    const [playerPoints, setPlayerPoints] = useState(0);
    const [enemyPoints, setEnemyPoints] = useState(0);
    // const [scaleTiltedSide, setScaleTiltedSide] = useState(0);
    // const [currentScaleImage, setCurrentScaleImage] = useState(scaleStatic);
    // const [styleScale, setStyleScale] = useState({backgroundImage: `url(${currentScaleImage})`});
    const boardRef = useRef();
    const playTableContentRef = useRef();
    const playFooterRef = useRef();
    const { t } = useTranslation();
    
    useEffect(() => {
        const fetchCards = async () => {
            const encryptedCards = Cookies.get('cards');
            const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
            if (encryptedCards) {
                // Decrypting data
                const bytes = CryptoJS.AES.decrypt(encryptedCards, SECRET_KEY);
                const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                setCardsData(decryptedData);
            } else {
                const cardsGross = {
                    data: [
                        [
                            json[6],
                            json[4],
                            json[7]
                        ],
                        [
                            json[1],
                            json[2],
                            json[3]
                        ],
                        Array(10).fill(json[6])
                    ]
                }
                setCardsData(cardsGross.data);
                // Encrypting data
                const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(cardsGross.data), SECRET_KEY).toString();
                Cookies.set('cards', encryptedData, { expires: 99999999 });
            }
        }
        fetchCards();
        setDroppableAreas((prevAreas) => {
            let newAreas = [...prevAreas];
            newAreas = generateNewCards(newAreas);
            return newAreas;
        })
    }, []);

    // This is an use effect made to used to put an unique key in each one of the cards. It's also used to separate in different variables current player cards and deck cards.
    useEffect(() => {
        Cookies.get('cards') ? Cookies.get('cards') : Cookies.set(cardsData)
        if (cardsData.length) {
            const [initialPlayerCards, initialDeckCards, initialSquirrelDeckCards] = cardsData;
            const assignKeys = (cards) => cards.map(card => ({ ...card, key: uuidV4() }));
            setPlayerCards(assignKeys(initialPlayerCards));
            setDeckCards(assignKeys(initialDeckCards));
            setDeckSquirrelCards(assignKeys(initialSquirrelDeckCards));
        }
    }, [cardsData]);

    useEffect(() => {
        setTimeout(() => {
            if (playFooterRef.current) {
                playFooterRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }, [playFooterRef]);

    const handleDragStart = () => {}

    const handleDragEnd = (result) => {
        const { active, over } = result;
        if (active && over) {
            const droppableAreaKey = parseInt(over.id.split("_")[1]);
            const cardKey = active.id;
    
            const updatedDroppableAreas = droppableAreas.map((area) => {
                if (area?.key === droppableAreaKey && area?.cards?.length === 0) {
                    const draggableCard = playerCards.find((card) => card.key === cardKey);
                    if (draggableCard) {
                        const row = Math.ceil(droppableAreaKey / 4);
                        const column = droppableAreaKey % 4 || 4;
                        draggableCard.position = { row, column };
                        area.cards.push(
                            <DraggableCardPlay className="play_cards"
                                id={cardKey} key={cardKey}
                                card={{ ...draggableCard, inDroppable: true }}
                                boardRef={boardRef}
                            />
                        );
                        setPlayerCards(playerCards.filter((card) => card.key !== cardKey));
                    }
                }
                return area;
            });
            setDroppableAreas(updatedDroppableAreas);
        }
    }

    // This function is used to handle onClick actions on both deck cards.
    const handleClickDecks = (isSquirrelDeck) => {
        if (!deckClickedTurn) {
            const updatedPlayerCards = [...playerCards];
            const updatedDeckCards = isSquirrelDeck ? [...deckSquirrelCards] : [...deckCards];
            
            if (updatedDeckCards.length > 0) {
                updatedPlayerCards.push(updatedDeckCards.pop());
                setPlayerCards(updatedPlayerCards);
                isSquirrelDeck ? setDeckSquirrelCards(updatedDeckCards) : setDeckCards(updatedDeckCards);
            }
            setDeckClickedTurn(true);
        } else {
            alert("Please, play a card or skip your turn!")
        }
    }

    // This function render the props from the footer and board cards
    const renderPropsCards = (card, isDisabled) => {
        card.isDisabled = isDisabled;
        return {
            id: card.key,
            card: card,
            deckClickedTurn: deckClickedTurn
        }
    }

    // This function returns the cards the player have in their hand.
    const renderCards = () => {
        return playerCards.map((card) => {
            const props = renderPropsCards(card, false);
            return (<DraggableCardPlay className="play_cards" {...props} key={card.key} id={card.key} card={card} boardRef={boardRef}/>);
        });
    };
    
    // This function was made to render each row of the board, being the first 2 rows the enemy's side, which the player can't place a card there, and the last row the player side.
    const renderRowArea = (row) => {
        const startOfRow = (row - 1) * 4;
        return droppableAreas.slice(startOfRow, startOfRow + 4).map((area) => {
            // This arrow function makes all cards inside of the board disabled, that means the card can't be taken out of the board.
            const cards = area?.cards?.map((area) => {
                if (area && area.props && area.props.card) {
                    const card = area.props.card
                    const props = renderPropsCards(card, true);
                    return (<DraggableCardPlay className="play_cards" {...props} key={card.key} card={card}/>);
                }
                return {}
            });

            if (row !== 3) {
                const styleEnemyAreaBoard = ({
                    background: `url(${row === 2 ? cardUpcoming : cardQueue})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                });

                return (
                    <div className={`play_enemy_input_card`} style={styleEnemyAreaBoard} key={area.key} id={`play_${area.key}_droppable`}>
                        {cards}
                    </div>
                );
            }
            return (
                <DroppableAreaPlay key={area.key} id={`play_${area.key}_droppable`}>{cards}</DroppableAreaPlay>
            );
        });
    }

    // This function was made to render the board area of the game.
    const renderBoardArea = () => {
        return [...Array(3)].map((_, i) => {
            return (
                <div className={i + 1 === 1 ? 'play_enemy_upcoming_cards_container' : i + 1 === 2 ? 'play_enemy_cards_container' : 'play_player_cards_container'} key={i + 1}>
                    {renderRowArea(i + 1)}
                </div>
            );
        });
    }

    // This function was made to render the deck images and actions, verifying if it is the squirrel deck or not.
    const renderDeck = (isSquirrelDeck) => {
        const textSquirrel = isSquirrelDeck ? '_squirrel' : '';
        return (
            <div className={`play_deck${textSquirrel}_cards`} onClick={() => handleClickDecks(isSquirrelDeck)}>
                <img className={`play_deck${textSquirrel}_cards_image`} src={isSquirrelDeck ? backSquirrelDeck : backDeck} alt={isSquirrelDeck ? t('deck_image_squirrel') : t('deck_image')} />
            </div>
        );
    }

    // Função principal que chama as outras funções separadas
    const playPassTurn = () => {
        if (deckClickedTurn) {
            setDeckClickedTurn(false);
            setDroppableAreas((prevAreas) => {
                let newAreas = [...prevAreas];

                // Aplica os danos do jogador
                newAreas = applyDamage(newAreas, true);
                // Move as cartas da área "upcoming" para a área "enemy"
                newAreas = moveUpcomingToEnemy(newAreas);
                // Aplica os danos do inimigo
                newAreas = applyDamage(newAreas, false);
                // Gera novas cartas na área "upcoming"
                newAreas = generateNewCards(newAreas);
                return newAreas;
            });
        } else {
            alert("Please, buy a card or a squirrel!");
        }
    }

    // Função para mover cartas da área "upcoming" para a área "enemy"
    const moveUpcomingToEnemy = (areas) => {
        const newAreas = [...areas];
        for (let i = 0; i < 4; i++) {
            if (newAreas[i]?.cards?.length > 0) {
                const targetIndex = i + 4;
                if (newAreas[targetIndex].cards.length === 0) {
                    newAreas[targetIndex] = { ...newAreas[targetIndex], cards: newAreas[i].cards };
                    newAreas[i] = { ...newAreas[i], cards: [] };
                }
            }
        }
        return newAreas;
    }

    // Função para aplicar dano às cartas inimigas
    const applyDamage = (areas, isPlayerAttacking) => {
        const newAreas = areas.map((area) => ({ ...area }));
        let totalDirectDamage = 0;

        newAreas.forEach((area, index) => {
            const row = Math.ceil((index + 1) / 4);
    
            // Verifica se a carta está em uma linha válida para atacar
            if (area?.cards?.length > 0) {
                const attackerCard = { ...area.cards[0].props.card };
                if ((row === 3 && isPlayerAttacking) || (row === 2 && !isPlayerAttacking)) {
                    let targetAreaIndex;
                    if (isPlayerAttacking) {
                        // Ataque do jogador para a linha inimiga
                        targetAreaIndex = index - 4;
                    } else {
                        // Ataque inimigo para a linha do jogador
                        targetAreaIndex = index + 4;
                    }
                    const targetArea = { ...newAreas[targetAreaIndex] }; 
                    if (targetArea?.cards?.length > 0) {
                        const defenderCard = { ...targetArea.cards[0].props.card }; 
                        const newHealth = defenderCard.health - attackerCard.power;
    
                        if (newHealth <= 0) {
                            const upcomingAreaIndex = isPlayerAttacking ? targetAreaIndex - 4 : targetAreaIndex + 4;
                            newAreas[upcomingAreaIndex] = damageToUpcomingCards(newAreas, newHealth, upcomingAreaIndex);
                            targetArea.cards = [];
                        } else {
                            defenderCard.health = newHealth;
                            targetArea.cards = [
                                <DraggableCardPlay className="play_cards"
                                key={defenderCard.key} id={defenderCard.key}
                                    card={defenderCard} deckClickedTurn={deckClickedTurn}/>,
                            ];
                        }
                        newAreas[targetAreaIndex] = targetArea;
                    } else {
                        totalDirectDamage += (attackerCard.power);
                    }
                }
            }
        }); 
        // Se não houver alvo, aplica dano diretamente ao oponente
        if (isPlayerAttacking) {
            setPlayerPoints((prevPoints) => prevPoints + totalDirectDamage);
        } else {
            setEnemyPoints((prevPoints) => prevPoints + totalDirectDamage);
        }
        return newAreas;
    }
    
    // A carta foi destruída, verificar se há uma carta na área "upcoming"
    const damageToUpcomingCards = (newAreas, newHealth, upcomingAreaIndex) => {
        const upcomingArea = { ...newAreas[upcomingAreaIndex] };
    
        if (upcomingArea?.cards?.length > 0) {
            const upcomingCard = { ...upcomingArea.cards[0].props.card };
            const excessDamage = Math.abs(newHealth);
            const upcomingCardNewHealth = upcomingCard.health - excessDamage;
            
            if (upcomingCardNewHealth <= 0) {
                upcomingArea.cards = [];
            } else {
                upcomingCard.health = upcomingCardNewHealth;
                upcomingArea.cards = [
                    <DraggableCardPlay className="play_cards"
                    key={upcomingCard.key} id={upcomingCard.key}
                    card={upcomingCard} deckClickedTurn={deckClickedTurn}/>,
                ];
            }
            return upcomingArea;
        }
    }

    useEffect(() => {
        const difference = Math.abs(playerPoints - enemyPoints);
        if (difference >= 5) {
            if (playerPoints > enemyPoints) {
                alert("Você ganhou!");
            } else {
                alert("Você perdeu!");
            }
        }
    }, [playerPoints, enemyPoints])

    // Função para gerar novas cartas na área "upcoming"
    const generateNewCards = (areas) => {
        const newAreas = [...areas];
        const maxCardsPerTurn = 2; // Limite máximo de cartas adicionadas por turno
        const cardEntries = Object.entries(json);
        let cardsAddedThisTurn = 0;

        for (let i = 0; i < 4 && cardsAddedThisTurn < maxCardsPerTurn; i++) {
            if (newAreas[i]?.cards?.length === 0) {
                const canPlayCard = Math.random() >= 0.6; // Probabilidade de 40% de adicionar uma carta
                if (canPlayCard) {
                    const randomEntry = cardEntries[Math.floor(Math.random() * cardEntries.length)];
                    const randomCard = { ...randomEntry[1], key: uuidV4() };

                    newAreas[i] = {
                        ...newAreas[i],
                        cards: [
                            <DraggableCardPlay className="play_cards"
                                key={randomCard.key} id={randomCard.key}
                                card={randomCard} boardRef={boardRef}/>,
                        ],
                    }
                    cardsAddedThisTurn++;
                }
            }
        }
        return newAreas;
    }

    // const updateScaleImage = (playerPoints, enemyPoints) => {
    //     const diff = Math.max(playerPoints, enemyPoints) - Math.min(playerPoints, enemyPoints);
    //     const newScaleImage = (() => {
    //         switch (diff) {
    //             case 0: return scaleStatic;
    //             case 1: return playerPoints > enemyPoints ? scalePlayer1 : scaleEnemy1;
    //             case 2: return playerPoints > enemyPoints ? scalePlayer2 : scaleEnemy2;
    //             case 3: return playerPoints > enemyPoints ? scalePlayer3 : scaleEnemy3;
    //             case 4: return playerPoints > enemyPoints ? scalePlayer4 : scaleEnemy4;
    //             default: {
    //                 console.log("Você " + (playerPoints > enemyPoints ? "ganhou!" : "perdeu!"));
    //                 return playerPoints > enemyPoints ? scalePlayer5 : scaleEnemy5;
    //             }
    //         }
    //     })();
    //     setScaleTiltedSide(playerPoints > enemyPoints ? diff : diff * -1);
    //     console.log(scaleTiltedSide)
    //     setCurrentScaleImage(newScaleImage);
    //     // setStyleScale({backgroundImage: `url(${newScaleImage})`});
    // }


    const renderPoints = () => {
        return (
            <div className="play_points" style={{color: "#fff"}}>
                <div className="play_player_points">Player Points: {playerPoints}</div>
                <div className="play_enemy_points">Enemy Points: {enemyPoints}</div>
            </div>
        );
    }

    return (<>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} autoScroll={false}>
            <div className='play_container'>
                <div className='play_content'>
                    {/* <div className='play_header' ref={playHeaderRef}>
                        <div className='play_inventory'>
                            <Inventory />
                        </div>
                    </div> */}
                    <div className='play_table_content' ref={playTableContentRef}>
                        {/* <div className='play_general_actions'>
                            <div className='play_scale' style={styleScale}>
                            <div className='play_scale_points'>
                            <div className='play_scale_enemy_points' style={{top:`100%`, marginTop: `calc(${Math.abs(scaleTiltedSide) <= 5 ? scaleTiltedSide * -9.2 : (scaleTiltedSide < 0 ? -1 : 1) * 5 * -9.2}% + 10%)`}}>
                            <span className='play_scale_enemy_points_text'>{'x' + (enemyPoints <= 10 ? enemyPoints : '10+')}</span>
                            </div>
                            <div className='play_scale_player_points' style={{top:`100%`, marginTop: `calc(${Math.abs(scaleTiltedSide) <= 5 ? scaleTiltedSide * 9.2 : (scaleTiltedSide < 0 ? -1 : 1) * 5 * 9.2}% + 10%)`}}>
                            <span className='play_scale_player_points_text'>{'x' +( playerPoints <= 10 ? playerPoints : '10+')}</span>
                            </div>
                            </div>
                            </div>
                            <img className='play_minus_test' src={minusTest} alt={t('minus')}  onClick={() => addPointScale(enemyPoints + 1, false)}/>
                            <img className='play_plus_test' src={plusTest} alt={t('plus')} onClick={() => addPointScale(playerPoints + 1, true)}/>
                            </div> */}
                        <div className='play_change_turn'>
                            <button onClick={() => playPassTurn()}>Passar Turno</button>
                        </div>
                        <div className='play_board' ref={boardRef}>
                            {renderBoardArea()}
                        </div>
                        {renderPoints()}
                    </div>
                    <div className='play_footer' ref={playFooterRef}>
                        <div className='play_player_cards'>
                            {renderCards()}
                        </div>
                        <div className='play_decks'>
                            {deckCards.length > 0 && renderDeck(false)}
                            {deckSquirrelCards.length > 0 && renderDeck(true)}
                        </div>
                    </div>
                </div>
            </div>
        </DndContext>
    </>);
}

export default Play;