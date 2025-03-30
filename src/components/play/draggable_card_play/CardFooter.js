import React from 'react';

export const CardFooter = ({ power, health, imageType }) => {
    const FOOTER_STYLES = {
        amalgam: require('../../../assets/images/card/footer/avian_canine_hooved_reptile_insect_footer_rare.png'),
        greatwhite: require('../../../assets/images/card/footer/blood_footer.png'),
        thesmoke: require('../../../assets/images/card/footer/smoke_footer.png'),
        greatersmoke: require('../../../assets/images/card/footer/smoke_footer.png'),
        uruyali: require('../../../assets/images/card/footer/footer_rare.png'),
        amoeba: require('../../../assets/images/card/footer/footer_rare.png'),
        moleman: require('../../../assets/images/card/footer/footer_rare.png'),
        strangelarva: require('../../../assets/images/card/footer/footer_rare.png'),
        strangepupa: require('../../../assets/images/card/footer/footer_rare.png'),
        mothman: require('../../../assets/images/card/footer/footer_rare.png'),
        mantisgod: require('../../../assets/images/card/footer/footer_rare.png'),
        geck: require('../../../assets/images/card/footer/footer_rare.png'),
        ouroboros: require('../../../assets/images/card/footer/footer_rare.png'),
        child13: require('../../../assets/images/card/footer/footer_rare.png'),
        default: require('../../../assets/images/card/footer/footer.png')
    }

    const footerStyle = {
        backgroundImage: `url(${FOOTER_STYLES[imageType?.toLowerCase()] || FOOTER_STYLES.default})`
    }

    return (
        <div className="draggable_card_play_footer" style={footerStyle}>
            <span className="draggable_card_play_power">{power}</span>
            <span className="draggable_card_play_health">{health}</span>
        </div>
    );
}