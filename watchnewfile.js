/*
    1、监控指定目录的文件变化，记录变化的文件到指定文件中。
    2、定时处理指定文件，将文件中所记录的文件根据规则复制到指定的目录中。
*/
var fs = require("fs");
var watch = require("watch");
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

  return [year, month, day].join("") + "-watch.log";
}

var copytotarget = function (fpath, tarpath, fname) {
  if (!fs.existsSync(tarpath)) {
    fs.mkdirSync(tarpath);
  }

  var tarfilepath = path.join(tarpath, fname);

  fs.copyFileSync(fpath, tarfilepath, fs.constants.COPYFILE_FICLONE);
  log(tarfilepath);
};

var createMonitor = function (rootpath, username) {
  var phtotuserpath = path.join(targetphotopath, username);
  var videouserpath = path.join(targetvideopath, username);
  if (!fs.existsSync(phtotuserpath)) {
    fs.mkdirSync(phtotuserpath);
  }

  if (!fs.existsSync(videouserpath)) {
    fs.mkdirSync(videouserpath);
  }

  watch.watchTree(rootpath, function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
    } else if (prev === null) {
      // f is a new file
      checkcopyfile(f, username);
    } else if (curr.nlink === 0) {
      // f was removed
    } else {
      // f was changed
      checkcopyfile(f, username);
    }
  });
};

createMonitor(sourcerootpath, "han");
