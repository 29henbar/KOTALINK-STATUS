const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');
const app = express();
const port = 3000;

const execPromise = promisify(exec);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const status = await getStatus();
    res.render('index', { status });
  } catch (error) {
    console.error('Error rendering status:', error);
    res.status(500).send('Internal Server Error');
  }
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
    const echolinkResponse = await axios.get('https://www.echolink.org/logins.jsp');
    if (echolinkResponse.data.includes('N0DYG-R')) {
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
    const dmrResponse = await axios.get('https://tgif.network/tgprofile.php?id=350');
    if (dmrResponse.data.includes('KOTA')) {
      status.dmr = 'working';
    } else {
      status.dmr = 'not working';
    }
  } catch (error) {
    console.error('Error fetching DMR status:', error);
  }


// YSF status
  try {
    const ysfResponse = await axios.get('https://www.pistar.uk/ysf_reflectors.php');
    if (ysfResponse.data.includes('57686')) {
      status.ysf = 'working';
    } else {
      status.ysf = 'not working';
    }
  } catch (error) {
    console.error('Error fetching YSF status:', error);
  }

  // P25 status
  try {
    const p25Response = await axios.get('https://www.pistar.uk/p25_reflectors.php');
    if (p25Response.data.includes('65103')) {
      status.p25 = 'working';
    } else {
      status.p25 = 'not working';
    }
  } catch (error) {
    console.error('Error fetching P25 status:', error);
  }

  return status;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} Built by Henry KD9YWF and Collin K0NNK. Well you don't know meee... But I know youuu.`);
});
