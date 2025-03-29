// styles
import './NewGameCard.css';

// react
import { useState, useEffect, useRef, useCallback } from 'react';

// context
import { useAudio } from '../../../context/AudioContext';

// images
import imageCardPart1 from '../../../assets/images/menu/cards/new_game/greyed_1.png';
import imageCardPart2 from '../../../assets/images/menu/cards/new_game/greyed_2.png';
import imageCardPart3 from '../../../assets/images/menu/cards/new_game/greyed_3.png';
import imageCardPart4 from '../../../assets/images/menu/cards/new_game/greyed_4.png';
import imageCardPart5 from '../../../assets/images/menu/cards/new_game/greyed_5.png';
import imageCardPart6 from '../../../assets/images/menu/cards/new_game/greyed_6.png';
import imageCardPart7 from '../../../assets/images/menu/cards/new_game/greyed_7.png';
import imageCardPart8 from '../../../assets/images/menu/cards/new_game/greyed_8.png';
import imageCardPart9 from '../../../assets/images/menu/cards/new_game/greyed_9.png';
import imageCardPart10 from '../../../assets/images/menu/cards/new_game/greyed_10.png';

// sounds
import glitch from '../../../assets/sounds/glitch.wav';

// translation
import { useTranslation } from 'react-i18next';

const NewGameCard = ({ setIsGlitchy }) => {
    const audioRef = useRef();
    const { volume } = useAudio();
    const [blurImage, setBlurImage] = useState(null);
    const [intervalId, setIntervalId] = useState(0);
    const setGlitchy = setIsGlitchy;
    const { t } = useTranslation();

    const imageParts = [
        imageCardPart1, imageCardPart2, imageCardPart3, imageCardPart4, imageCardPart5, imageCardPart6, imageCardPart7, imageCardPart8, imageCardPart9, imageCardPart10
    ];

    // This function handles the click event when the new card is disabled. It plays a glitch sound and puts a glitch background for 250ms.
    const handleClickNewCardDisabled = () => {
        const audioGlitch = new Audio(glitch);
        audioGlitch.volume = volume / 100;
        audioGlitch.play();
        setIsGlitchy(true);
        setTimeout(() => {
            setGlitchy(false);
        }, 250);
    }

    // This function is responsible for setting a interval of 500ms to blur an part of the new game image. It's also responsible for defining which part of the image will be blurred and how much time between each blur will occur.
    const setupInterval = useCallback(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        const interval = Math.random() * 1000 + 250;
        const intervalFunc = () => {
            const randomIndex = Math.floor(Math.random() * 10);
            setBlurImage(randomIndex + 1);
            setTimeout(() => setBlurImage(0), interval);
        };
        setIntervalId(setInterval(intervalFunc, 500));
    }, [intervalId]);

    // This use effect is responsible for calling the function to blur a part of the new card image and clearing the interval.
    useEffect(() => {
        if (blurImage !== 0) {
            setupInterval();
            return () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
        }
    }, [blurImage, setupInterval, intervalId]);

    return (<>
        <div className='menu_card_new_game_images_container' ref={audioRef} onClick={handleClickNewCardDisabled}>
        {imageParts.map((image, index) => (
                <img className={`menu_card_new_game_image ${blurImage === (index + 1) ? 'menu_card_new_game_image_blur' : ''}`}
                    key={index} src={image}
                    alt={t('new_game_card_part')} loading='lazy' />
            ))}
        </div>
    </>);
}

export default NewGameCard;