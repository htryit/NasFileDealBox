/*
    将指定目录的照片和视频分别复制到图片视频文件夹中

*/
var fs = require("fs");
var path = require("path");

var photoexts = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", ".raw"];
var videoexts = [
  ".mp4",
  ".mov",
  ".avi",
  ".mepg",
  ".wmv",
  ".m4v",
  ".rm",
  ".rmvb",
  ".dat",
  ".mkv",
];

/*
var sourcerootpath = "D:\\Codes\\NasSyncFile\\Test\\TestMoment";
var targetphotopath = "D:\\Codes\\NasSyncFile\\Test\\TestPhoto";
var targetvideopath = "D:\\Codes\\NasSyncFile\\Test\\TestVideo";
var scriptpath = "D:\\Codes\\NasSyncFile\\logs";
*/
/* 正式*/

var sourcerootpath = "/volume2/homes/han/Drive/Moments/";
var targetphotopath = "/volume2/photo";
var targetvideopath = "/volume2/video";
var scriptpath = "/volume1/SyncTools/logs";

var arinfiles = [];
var checkcopyfile = function (fpath, username) {
  if (fpath.indexOf("@eaDir") != -1) {
    return;
  }

  //console.log(fpath);

  if (arinfiles.indexOf(fpath) == -1) {
    arinfiles.push(fpath);

    var stats = fs.statSync(fpath);

    if (stats.isFile()) {
      var finfo = path.parse(fpath);
      var extname = finfo.ext.toLowerCase();
      var fname = finfo.name + extname;
      //console.log(extname);
      var mtime = stats.mtime;
      var year = mtime.getFullYear();
      var month = mtime.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var day = mtime.getDate();
      if (day < 10) {
        day = "0" + day;
      }

      var userpath = username + "/" + year + "" + month + "" + day + "/";

      var tarpath = "";

      if (photoexts.indexOf(extname) != -1) {
        tarpath = path.join(targetphotopath, userpath);
        copytotarget(fpath, tarpath, fname);
      } else if (videoexts.indexOf(extname) != -1) {
        tarpath = path.join(targetvideopath, userpath);
        copytotarget(fpath, tarpath, fname);
      }

      var pos = arinfiles.indexOf(fpath);
      arinfiles.splice(pos, 1);
    } else {
      //文件夹
      findandcopy(fpath, username);
    }
  }
};

var log = function (fpath) {
  var logfilepath = path.join(scriptpath, getlogname());
  try {
    fs.appendFileSync(logfilepath, new Date() + ":" + fpath + "\r\n");
  } catch (err) {
    /* Handle the error */
  }
};

function getlogname() {
  var d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("") + "-pick.log";
}

var copytotarget = function (fpath, tarpath, fname) {
  var newfolder = false;
  if (!fs.existsSync(tarpath)) {
    fs.mkdirSync(tarpath);
    newfolder = true;
  }

  var tarfilepath = path.join(tarpath, fname);
  if (!fs.existsSync(tarfilepath)) {
    try {
      fs.copyFileSync(fpath, tarfilepath, fs.constants.COPYFILE_FICLONE);
      var stat = fs.statSync(fpath);
      fs.utimesSync(tarfilepath, stat.atime, stat.mtime);
      if (newfolder) {
        fs.utimesSync(tarpath, stat.atime, stat.mtime);
        newfolder = false;
      }
      log(tarfilepath);
    } catch (err) {
      //log(tarfilepath + ":" + err);
    }
  }
};

var findandcopy = function (fpath, username) {
  var files = fs.readdirSync(fpath);
  if (files.length != 0) {
    for (var i = 0; i < files.length; i++) {
      var it = files[i];
      var itpath = path.join(fpath, it);
      checkcopyfile(itpath, username);
      //console.log(itpath);
    }
  }
};

var start = function (rootpath, username) {
  var phtotuserpath = path.join(targetphotopath, username);
  var videouserpath = path.join(targetvideopath, username);
  if (!fs.existsSync(phtotuserpath)) {
    fs.mkdirSync(phtotuserpath);
  }

  if (!fs.existsSync(videouserpath)) {
    fs.mkdirSync(videouserpath);
  }

  findandcopy(rootpath, username);
};

start(sourcerootpath, "han");
