// styles
import "./ModalOptionsModal.css"

// react
import { useState, useEffect, useCallback, useMemo } from "react";

// images
import languageText from '../../../assets/images/menu/texts/language.png';
import arrowEnable from '../../../assets/images/menu/options/arrow_enable.png';
import arrowDisable from '../../../assets/images/menu/options/arrow_disable.png';
import minusEnable from '../../../assets/images/menu/options/minus_enable.png';
import minusDisable from '../../../assets/images/menu/options/minus_disable.png';
import plusEnable from '../../../assets/images/menu/options/plus_enable.png';
import plusDisable from '../../../assets/images/menu/options/plus_disable.png';
import volumeOptionEnable from '../../../assets/images/menu/options/sound_icon_enable.png';
import volumeOptionDisable from '../../../assets/images/menu/options/sound_icon_disable.png';

// context
import { useAudio } from '../../../context/AudioContext';

// translation
import { useTranslation } from "react-i18next";

// external
import { Modal } from "react-bootstrap";
import Cookies from "js-cookie";

function ModalOptionsModal({ show }) {
    const languageOptions = useMemo(() => ['en', 'pt'], []);
    const [selectedOption, setSelectedOption] = useState(() => {
        const savedLanguage = Cookies.get('lan');
        return savedLanguage === 'pt' ? 1 : 0;
    });
    const [languageChosen, setLanguageChosen] = useState(languageOptions[selectedOption]);
    const [volumeChosen, setVolumeChosen] = useState(6);
    const { volume, setVolume } = useAudio();
    const { i18n, t } = useTranslation();

    useEffect(() => {
        setLanguageChosen(languageOptions[selectedOption]);
    }, [selectedOption, languageOptions]);

    // This function returns the images that serve to show the level of volume the game is set in.
    const volumeOptions = useCallback(() => {
        return [...Array(6)].map((_, i) => (
            <img className="modal_options_modal_volume_icon"
            key={i} src={volumeChosen > i ? volumeOptionEnable : volumeOptionDisable}
            alt={t('volume_option') + ' ' + i} />
        ));
    }, [volumeChosen, t])

    // This function is responsible by handling with the events when the language is changed.
    const handleChangeLanguage = useCallback((e, isPlus) => {
        e.preventDefault();
        let newSelectedOption;
        newSelectedOption = isPlus
            ? (selectedOption < languageOptions.length - 1 ? selectedOption + 1 : 0)
            : (selectedOption > 0 ? selectedOption - 1 : languageOptions.length - 1);
        setSelectedOption(newSelectedOption);
        const newLanguage = languageOptions[newSelectedOption];
        Cookies.set('lan', newLanguage);
        i18n.changeLanguage(newLanguage);
        e.target.src = arrowDisable;
        setTimeout(() => {
            e.target.src = arrowEnable;
        }, 100);
    }, [selectedOption, languageOptions, i18n])

    // This function is responsible by handling with the events when the master volume is changed.
    const handleChangeMainVolume = useCallback((e, isPlus) => {
        const extremeVolume = isPlus ? 100 : 0;
        const sumOrSubtraction = isPlus ? (volume + (100 / 6)) : (volume - (100 / 6));
        if ((sumOrSubtraction < extremeVolume && isPlus) || (sumOrSubtraction > extremeVolume && !isPlus)) {
            setVolume(sumOrSubtraction);
        } else {
            setVolume(extremeVolume);
        }
        isPlus ? setVolumeChosen(volumeChosen < 6 ? volumeChosen + 1 : 6) : setVolumeChosen(volumeChosen > 0 ? volumeChosen - 1 : 0);
        e.target.src = (isPlus ? plusDisable : minusDisable);
        setTimeout(() => {
            e.target.src = (isPlus ? plusEnable : minusEnable);
        }, 100);
    }, [volume, volumeChosen, setVolume])

    return (
        <Modal className="modal_options_modal_container" contentClassName="modal_options_container_dialog" id="modal_options_modal_container" size="lg" show={show} aria-labelledby="contained-modal-title-vcenter" backdrop={false} centered>
            <Modal.Body>
                <div className="modal_options_modal_language_container">
                    <img className="modal_options_modal_language_text" src={languageText} alt={t('language_text')} />
                    <div className="modal_options_modal_language_container_options">
                        <img className="modal_options_modal_button" src={arrowEnable} alt={t('minus_button')} onClick={(e) => handleChangeLanguage(e, false)} />
                        <span className="modal_options_modal_language_chosen">
                            {t(languageChosen)}
                        </span>
                        <img className="modal_options_modal_button_inverted" src={arrowEnable} alt={t('plus_button')} onClick={(e) => handleChangeLanguage(e, true)} />
                    </div>
                </div>
                <div className="modal_options_modal_main_volume_container">
                    <span className="modal_options_modal_main_volume_text">
                        {t('main_volume')}
                    </span>
                    <div className="modal_options_modal_language_container_options">
                        <img className="modal_options_modal_button" src={minusEnable} alt={t('minus_button')} onClick={(e) => handleChangeMainVolume(e, false)} />
                        <div className="modal_options_modal_volume_options">
                            {volumeOptions()}
                        </div>
                        <img className="modal_options_modal_button" src={plusEnable} alt={t('plus_button')} onClick={(e) => handleChangeMainVolume(e, true)} />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalOptionsModal;