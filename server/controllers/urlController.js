const validUrl = require('valid-url');
const shortid = require('shortid');

const models = require('../database/models');

exports.getUrl = async (req, res) => {
  const { code } = req.params;

  const shortUrl = await models.Shorturl.findOne({ where: { urlCode: code } });

  if (!shortUrl)
    return res.status(404).json({
      status: 'fail',
      message: 'Url code not found!'
    });

  const { ip } = req.ipInfo;
  const refererUrl = req.headers.referer;

  shortUrl.clicks += 1;
  await shortUrl.save();

  if (refererUrl) {
    const track = await models.Track.findOne({
      where: { ipAddress: ip, refererUrl }
    });
    if (track) {
      track.updatedAt = new Date();
      await track.save();
    } else {
      await models.Track.create({
        ipAddress: ip,
        refererUrl,
        shorturlId: shortUrl.id
      });
    }
  }

  return res.redirect(shortUrl.url);
};

exports.postUrl = async (req, res) => {
  const { url } = req.body;
  const baseUrl = process.env.BASE_URL;

  if (!validUrl.isUri(baseUrl))
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid base url!'
    });

  if (!validUrl.isUri(url))
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid long url!'
    });

  try {
    let item = await models.Shorturl.findOne({ where: { url } });

    if (item) {
      return res.status(200).json({
        status: 'success',
        data: {
          item
        }
      });
    }

    const urlCode = shortid.generate();
    const shortUrl = `${baseUrl}/api/${urlCode}`;

    // 1 indicates anonymous
    let userId = 1;
    if (req.user) userId = req.user.id;

    item = await models.Shorturl.create({
      urlCode,
      shortUrl,
      url,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return res.status(200).json({
      status: 'success',
      data: {
        item
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Server error!'
    });
  }
};

exports.getTrack = async (req, res) => {
  const shorturlId = req.params.urlId;

  const tracks = await models.Track.findAll({
    where: { shorturlId }
  });

  return res.status(200).json({
    status: 'success',
    data: {
      tracks
    }
  });
};

exports.getHistory = async (req, res) => {
  const shorturls = await models.Shorturl.findAll({
    where: { userId: req.user.id }
  });

  return res.status(200).json({
    status: 'success',
    data: {
      shorturls
    }
  });
};

exports.getStats = async (req, res) => {
  // PENDING
  return res.status(200).json({
    status: 'success',
    data: {
      result
    }
  });
};
