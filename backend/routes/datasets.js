const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const getDataForChart = (filePath, xAxis, yAxis) => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        data.push({ x: parseFloat(row[xAxis]), y: parseFloat(row[yAxis]) });
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

const calculateStats = (data) => {
  const values = data.map(item => item.y);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return { min, max, mean };
};

router.post('/chart-data', async (req, res) => {
  const { datasets, xAxis, yAxisAttributes } = req.body;

  try {
    const chartData = {};
    const statsData = {};
    let combinedXValues = [];
    for (const dataset of datasets) {
      const filePath = path.join(uploadDir, dataset);
      const data = await getDataForChart(filePath, xAxis, yAxisAttributes[dataset]);
      chartData[dataset] = data;
      statsData[dataset] = calculateStats(data);
      combinedXValues = combinedXValues.concat(data.map(item => item.x));
    }
    combinedXValues = [...new Set(combinedXValues)].sort((a, b) => a - b); // Unique and sorted x values
    res.send({ chartData, statsData, combinedXValues });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let datasetFile = req.files.dataset;
  const filePath = path.join(uploadDir, datasetFile.name);

  datasetFile.mv(filePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ fileName: datasetFile.name, filePath });
  });
});

router.get('/list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(files);
  });
});

router.delete('/delete/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(uploadDir, fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: 'File deleted successfully' });
  });
});

router.get('/attributes/:fileName', async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(uploadDir, fileName);

  try {
    const attributes = await new Promise((resolve, reject) => {
      const headers = new Set();
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headerList) => {
          headerList.forEach(header => headers.add(header));
          resolve(Array.from(headers));
        })
        .on('error', (error) => {
          reject(error);
        });
    });
    res.send(attributes);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.get('/:fileName', async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(uploadDir, fileName);

  try {
    const data = await new Promise((resolve, reject) => {
      const result = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          result.push(row);
        })
        .on('end', () => {
          resolve(result);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
    res.send(data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;
