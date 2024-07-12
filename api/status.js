// api/status.js
module.exports = (req, res) => {
    const status = {
        allstar: 'offline',
        echolink1: 'unlinked',
        echolink2: 'offline',
        echolink3: 'offline',
        analog: 'online',
        ab_mb: 'online',
        mb: 'unlinked',
        usrp2p25: 'offline',
        dmr: 'online',
        ysf: 'online',
        p25: 'offline',
    };
    res.json(status);
};
