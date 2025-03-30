import React from 'react';

export const CardHeader = ({ fontSize, imageType }) => {
    const HEADER_STYLES = {
        amalgam: require('../../../assets/images/card/header/avian_reptile_hooved_header_rare.png'),
        thesmoke: require('../../../assets/images/card/header/smoke_header.png'),
        greatersmoke: require('../../../assets/images/card/header/smoke_header.png'),
        child13: require('../../../assets/images/card/header/hooved_header_rare.png'),
        geck: require('../../../assets/images/card/header/reptile_header_rare.png'),
        ouroboros: require('../../../assets/images/card/header/reptile_header_rare.png'),
        strangelarva: require('../../../assets/images/card/header/insect_header_rare.png'),
        strangepupa: require('../../../assets/images/card/header/insect_header_rare.png'),
        mothman: require('../../../assets/images/card/header/insect_header_rare.png'),
        mantisgod: require('../../../assets/images/card/header/insect_header_rare.png'),
        pronghorn: require('../../../assets/images/card/header/hooved_header.png'),
        moosebuck: require('../../../assets/images/card/header/hooved_header.png'),
        elkfawn: require('../../../assets/images/card/header/hooved_header.png'),
        elk: require('../../../assets/images/card/header/hooved_header.png'),
        blackgoat: require('../../../assets/images/card/header/hooved_header.png'),
        skink: require('../../../assets/images/card/header/reptile_header.png'),
        rattler: require('../../../assets/images/card/header/reptile_header.png'),
        adder: require('../../../assets/images/card/header/reptile_header.png'),
        bullfrog: require('../../../assets/images/card/header/reptile_header.png'),
        riversnapper: require('../../../assets/images/card/header/reptile_header.png'),
        stuntedwolf: require('../../../assets/images/card/header/canine_header.png'),
        wolf: require('../../../assets/images/card/header/canine_header.png'),
        wolfcub: require('../../../assets/images/card/header/canine_header.png'),
        coyote: require('../../../assets/images/card/header/canine_header.png'),
        bloodhound: require('../../../assets/images/card/header/canine_header.png'),
        alpha: require('../../../assets/images/card/header/canine_header.png'),
        turkeyvulture: require('../../../assets/images/card/header/avian_header.png'),
        sparrow: require('../../../assets/images/card/header/avian_header.png'),
        ravenegg: require('../../../assets/images/card/header/avian_header.png'),
        raven: require('../../../assets/images/card/header/avian_header.png'),
        magpie: require('../../../assets/images/card/header/avian_header.png'),
        kingfisher: require('../../../assets/images/card/header/avian_header.png'),
        stinkbug: require('../../../assets/images/card/header/insect_header.png'),
        bee: require('../../../assets/images/card/header/insect_header.png'),
        ringworm: require('../../../assets/images/card/header/insect_header.png'),
        antqueen: require('../../../assets/images/card/header/insect_header.png'),
        mantis: require('../../../assets/images/card/header/insect_header.png'),
        ant: require('../../../assets/images/card/header/insect_header.png'),
        corpsemaggots: require('../../../assets/images/card/header/insect_header.png'),
        cockroach: require('../../../assets/images/card/header/insect_header.png'),
        beehive: require('../../../assets/images/card/header/insect_header.png'),
        uruyali: require('../../../assets/images/card/header/header_rare.png'),
        amoeba: require('../../../assets/images/card/header/header_rare.png'),
        moleman: require('../../../assets/images/card/header/header_rare.png'),
        default: require('../../../assets/images/card/header/header.png')
    }

    const headerStyle = {
        backgroundImage: `url(${HEADER_STYLES[imageType?.toLowerCase()] || HEADER_STYLES.default})`
    }

    return (
        <div className="draggable_card_play_header" style={headerStyle}>
            <span className="draggable_card_play_name" style={{ fontSize }}>
                {imageType}
            </span>
        </div>
    );
}