// css
import './MainTitle.css';

// react
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// images
import title from '../../../assets/images/menu/title/title.png';
import titleSpade from '../../../assets/images/menu/title/title_spade.png';

// sounds
import titleRattle from '../../../assets/sounds/title_rattle.wav';

// translation
import { useTranslation } from "react-i18next";

// context
import { useAudio } from '../../../context/AudioContext';

const Title = ({setIsInTitleScreen, audioRef}) => {
    const navigate = useNavigate();
    const { volume } = useAudio();
    const isFirstAction = useRef(true);
    const spadeLeftRef = useRef();
    const titleRef = useRef();
    const spadeRightRef = useRef();
    const subtitleRef = useRef();
    const [animationSpeed, setAnimationSpeed] = useState('');
    const { t } = useTranslation();

    // This function play the 'rattle' sound when pressed any button.
    const playClickSound = useCallback(() => {
        if (isFirstAction.current) {
            const audio = new Audio(titleRattle);
            audio.volume = volume / 100;
            audio.play();
            isFirstAction.current = false;
        }
    }, [isFirstAction, volume])

    // This use effect was made to handle when the user presses a key, calling a click sound function and doing a animation with the title.
    useEffect(() => {
        const handleUserAction = () => {
            audioRef.current.play();
            playClickSound();
            setAnimationSpeed('fast');
            setTimeout(() => {
                if (spadeLeftRef.current && titleRef.current && spadeRightRef.current && subtitleRef.current) {
                    spadeLeftRef.current.id = "main_title_image_spade_left_animation";
                    titleRef.current.id = "main_title_image_animation";
                    spadeRightRef.current.id = "main_title_image_spade_right_animation";
                    subtitleRef.current.id = "main_press_to_start_text_animation"
                }
                setTimeout(() => {
                    setIsInTitleScreen(false);
                }, 500);
            }, 1500);
        }
        document.addEventListener('click', handleUserAction);
        document.addEventListener('keydown', handleUserAction);

        return () => {
            document.removeEventListener('click', handleUserAction);
            document.removeEventListener('keydown', handleUserAction);
        }
    }, [navigate, audioRef, playClickSound, setIsInTitleScreen]);

    return (<>
        <div className='main_title_container'>
            <img className={`main_title_image_spade_left`} src={titleSpade} alt={t('title_spade')} ref={spadeLeftRef} />
            <img className='main_title_image' src={title} alt={t('title')} ref={titleRef} />
            <img className={`main_title_image_spade_right`} src={titleSpade} alt={t('title_spade')} ref={spadeRightRef} />
        </div>
        <p className={`main_press_to_start_text main_press_to_start_text_${animationSpeed}`} ref={subtitleRef}>
            {t('press_to_start')}
        </p>
    </>)
}

export default Title;