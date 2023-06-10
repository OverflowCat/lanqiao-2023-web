const path = require("path");
const fs = require("fs");
const articlesPath = path.resolve(__dirname, "articles");
const imagesPath = path.resolve(__dirname, "images");

const findUnlinkImages = async function () {
  const unlinkImages = []; // 未被任何 md 文件引用的图片的数组
  // TODO: 请通过 Node.js 在此处继续完成代码编写
  let allImages = new Set(await traversalDir(imagesPath));
  const articles = await traversalDir(articlesPath);
  for (const article of articles) {
    const content = fs.readFileSync(articlesPath + '/' + article).toString();
    const photos = searchImage(content);
    photos.forEach(photo => {
      photo = photo.split('/').pop();
      allImages.delete(photo);
    })
  }
  for (const ele of allImages) unlinkImages.push(ele);
  return unlinkImages; // 此处应返回一个数组，如不明白，请仔细阅读题目
};

// 参考方法: 遍历文件列表
function traversalDir(path) {
  return new Promise((resolve) => {
    fs.readdir(path, async function (err, files) {
      if (!err) {
        resolve(files);
      }
    });
  });
}

let useImgs = [];
/**
 * 参考方法: 正则提取文章内的全部图片链接
 * @param {string} md 传入的markdown文本内容
 * @returns 包含所有图片链接的数组
 */
function searchImage(md) {
  const pattern = /!\[(.*?)\]\((.*?)\)/gm;
  let matcher;
  while ((matcher = pattern.exec(md)) !== null) {
    if (matcher[2].indexOf("images") !== -1) {
      // 判断存在图片，matcher[2] 即为包含的链接
      useImgs.push(matcher[2]);
    }
  }
  return useImgs;
}

module.exports = findUnlinkImages; // 请勿删除该行代码,否则影响判题!
