const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const status = await getStatus();
  res.render('index', { status });
});

async function getStatus() {
  const status = {
    allstar: 'unknown',
    echolink: 'unknown',
    hoip: 'unknown',
    dmr: 'unknown',
    ysf: 'unknown',
    p25: 'unknown'
  };

  // Allstar status
  try {
    const allstarResponse = await axios.get('https://stats.allstarlink.org/api/stats/mapData');
    if (allstarResponse.data.includes('61462')) {
      status.allstar = 'working';
    } else {
      status.allstar = 'not working';
    }
  } catch (error) {
    console.error('Error fetching Allstar status:', error);
  }


  // Echolink Status
  try {
    const allstarResponse = await axios.get('https://www.echolink.org/logins.jsp');
    if (allstarResponse.data.includes('N0DYG-R')) {
      status.echolink = 'working';
    } else {
      status.echolink = 'not working';
    }
  } catch (error) {
    console.error('Error fetching Echolink status:', error);
  }

  // HOIP status
  try {
    const hoipResponse = await axios.get('https://hamsoverip.com/phonebook');
    if (hoipResponse.data.includes('15031')) {
      status.hoip = 'working';
    } else {
      status.hoip = 'not working';
    }
  } catch (error) {
    console.error('Error fetching HOIP status:', error);
  }

  // DMR status
  try {
    const dmrResponse = await axios.get('https://api.tgif.network/dmr/talkgroups/json');
    if (dmrResponse.data.includes('KOTA-LINK')) {
      status.dmr = 'working';
    } else {
      status.dmr = 'not working';
    }
  } catch (error) {
    console.error('Error fetching DMR status:', error);
  }

  exec('systemctl status mmdvm_bridge', (error, stdout, stderr) => {
    if (!error && stdout.includes('active (running)')) {
      status.dmr = 'working';
    } else {
      status.dmr = 'not working';
    }
  });

  // YSF status
  exec('systemctl status mmdvm_bridge 2', (error, stdout, stderr) => {
    if (!error && stdout.includes('active (running)')) {
      status.ysf = 'working';
    } else {
      status.ysf = 'not working';
    }
  });

  // P25 status
  exec('systemctl status usrp2p25', (error, stdout, stderr) => {
    if (!error && stdout.includes('active (running)')) {
      status.p25 = 'working';
    } else {
      status.p25 = 'not working';
    }
  });

  exec('systemctl status p25gateway', (error, stdout, stderr) => {
    if (!error && stdout.includes('active (running)')) {
      status.p25 = 'working';
    } else {
      status.p25 = 'not working';
    }
  });

  return status;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
